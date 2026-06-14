#!/usr/bin/env python3
"""
Wolfie Relay Server
===================
A lightweight relay between Cowrie honeypot logs and the Wolfie dashboard.
Zero external dependencies — uses only Python stdlib.

Usage:
    python3 server.py                                                   # dev mode (uses data/cowrie.json)
    COWRIE_LOG=/opt/cowrie/var/log/cowrie/cowrie.json python3 server.py  # production

Environment Variables:
    COWRIE_LOG   Path to Cowrie's JSON log file (default: data/cowrie.json)
    WOLFIE_PORT  HTTP server port (default: 8080)
    WOLFIE_HOST  Bind address (default: 0.0.0.0)
"""

import json
import os
import sys
import time
import mimetypes
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path

# ─── Configuration ──────────────────────────────────────────────────────────────

COWRIE_LOG = os.environ.get('COWRIE_LOG', 'data/cowrie.json')
HOST = os.environ.get('WOLFIE_HOST', '0.0.0.0')
PORT = int(os.environ.get('WOLFIE_PORT', '8080'))
BASE_DIR = Path(__file__).resolve().parent

# ─── Log Parser ─────────────────────────────────────────────────────────────────

def parse_cowrie_log(filepath):
    """Parse Cowrie log file. Supports both NDJSON (production) and JSON array (dev)."""
    events = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read().strip()
            if not content:
                return events

            # Detect format: JSON array starts with '[', NDJSON starts with '{'
            if content.startswith('['):
                # JSON array format (dev/demo mode)
                events = json.loads(content)
            else:
                # NDJSON format (production Cowrie output)
                for line in content.split('\n'):
                    line = line.strip()
                    if line:
                        try:
                            events.append(json.loads(line))
                        except json.JSONDecodeError:
                            continue
    except FileNotFoundError:
        print(f"[WARN] Log file not found: {filepath}", file=sys.stderr)
    except Exception as e:
        print(f"[ERROR] Failed to parse log: {e}", file=sys.stderr)

    return events


# ─── Event Cache ────────────────────────────────────────────────────────────────

class EventCache:
    """Thread-safe cache for parsed events with file-change detection."""

    def __init__(self, filepath):
        self.filepath = filepath
        self._events = []
        self._last_mtime = 0
        self._last_size = 0
        self._lock = threading.Lock()

    def get_events(self):
        """Returns cached events, re-parsing if the file has changed."""
        try:
            stat = os.stat(self.filepath)
            mtime = stat.st_mtime
            size = stat.st_size
        except FileNotFoundError:
            return []

        with self._lock:
            if mtime != self._last_mtime or size != self._last_size:
                self._events = parse_cowrie_log(self.filepath)
                self._last_mtime = mtime
                self._last_size = size

        return self._events

    def get_new_events_since(self, count):
        """Returns events added since `count` was last checked."""
        events = self.get_events()
        if len(events) > count:
            return events[count:]
        return []


cache = EventCache(COWRIE_LOG)


# ─── API Helpers ────────────────────────────────────────────────────────────────

def aggregate_sessions(events):
    """Aggregate events into session summaries."""
    sessions = {}
    for e in events:
        sid = e.get('session', 'unknown')
        if sid not in sessions:
            sessions[sid] = {
                'id': sid,
                'ip': e.get('src_ip', ''),
                'startTime': e.get('timestamp', ''),
                'endTime': None,
                'duration': None,
                'commands': 0,
                'loginAttempts': 0,
                'success': False,
                'downloads': 0
            }

        s = sessions[sid]
        eid = e.get('eventid', '')

        # Track earliest timestamp
        if e.get('timestamp', '') and (not s['startTime'] or e['timestamp'] < s['startTime']):
            s['startTime'] = e['timestamp']

        if eid == 'cowrie.login.success':
            s['success'] = True
        if eid in ('cowrie.login.failed', 'cowrie.login.success'):
            s['loginAttempts'] += 1
        if eid == 'cowrie.command.input':
            s['commands'] += 1
        if eid in ('cowrie.session.file_download', 'cowrie.session.file_upload'):
            s['downloads'] += 1
        if eid == 'cowrie.session.closed':
            s['duration'] = e.get('duration')
            s['endTime'] = e.get('timestamp')
        if eid == 'cowrie.log.closed' and e.get('duration') and not s['duration']:
            s['duration'] = e.get('duration')

    return sorted(sessions.values(), key=lambda s: s.get('startTime', ''), reverse=True)


def compute_stats(events):
    """Compute dashboard statistics."""
    sessions = set()
    ips = set()
    success = 0
    failed = 0
    commands = 0
    downloads = 0

    for e in events:
        sessions.add(e.get('session', ''))
        if e.get('src_ip'):
            ips.add(e['src_ip'])
        eid = e.get('eventid', '')
        if eid == 'cowrie.login.success':
            success += 1
        elif eid == 'cowrie.login.failed':
            failed += 1
        elif eid == 'cowrie.command.input':
            commands += 1
        elif eid in ('cowrie.session.file_download', 'cowrie.session.file_upload'):
            downloads += 1

    total_logins = success + failed
    return {
        'totalSessions': len(sessions),
        'uniqueIPs': len(ips),
        'successfulLogins': success,
        'failedLogins': failed,
        'commands': commands,
        'downloads': downloads,
        'successRate': round((success / total_logins * 100), 1) if total_logins > 0 else 0
    }


# ─── HTTP Handler ───────────────────────────────────────────────────────────────

class WolfieHandler(SimpleHTTPRequestHandler):
    """Serves the Wolfie frontend + REST API + SSE stream."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == '/api/events':
            self._handle_events(query)
        elif path == '/api/events/stream':
            self._handle_sse()
        elif path == '/api/sessions':
            self._handle_sessions()
        elif path.startswith('/api/sessions/'):
            session_id = path.split('/api/sessions/')[1]
            self._handle_session_detail(session_id)
        elif path == '/api/stats':
            self._handle_stats()
        elif path == '/api/downloads':
            self._handle_downloads()
        else:
            # Serve static files from project directory
            super().do_GET()

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _handle_events(self, query):
        events = cache.get_events()

        # Optional filtering
        limit = int(query.get('limit', [0])[0]) or None
        since = query.get('since', [None])[0]

        if since:
            events = [e for e in events if e.get('timestamp', '') > since]

        # Sort newest first
        events = sorted(events, key=lambda e: e.get('timestamp', ''), reverse=True)

        if limit:
            events = events[:limit]

        self._send_json(events)

    def _handle_sse(self):
        """Server-Sent Events endpoint: tails cowrie.json for new events."""
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Connection', 'keep-alive')
        self.end_headers()

        # Start from current event count
        known_count = len(cache.get_events())

        try:
            while True:
                new_events = cache.get_new_events_since(known_count)
                for event in new_events:
                    data = json.dumps(event, ensure_ascii=False)
                    self.wfile.write(f"data: {data}\n\n".encode('utf-8'))
                    self.wfile.flush()
                    known_count += 1

                # Poll interval: check for new events every 2 seconds
                time.sleep(2)

                # Send keepalive comment to prevent proxy timeout
                self.wfile.write(b": keepalive\n\n")
                self.wfile.flush()

        except (BrokenPipeError, ConnectionResetError, OSError):
            # Client disconnected
            pass

    def _handle_sessions(self):
        events = cache.get_events()
        sessions = aggregate_sessions(events)
        self._send_json(sessions)

    def _handle_session_detail(self, session_id):
        events = cache.get_events()
        session_events = [e for e in events if e.get('session') == session_id]

        if not session_events:
            self._send_json({'error': 'Session not found'}, 404)
            return

        session_events.sort(key=lambda e: e.get('timestamp', ''))
        self._send_json({
            'id': session_id,
            'events': session_events
        })

    def _handle_stats(self):
        events = cache.get_events()
        stats = compute_stats(events)
        self._send_json(stats)

    def _handle_downloads(self):
        events = cache.get_events()
        downloads = [
            e for e in events
            if e.get('eventid') in ('cowrie.session.file_download', 'cowrie.session.file_upload')
        ]
        downloads.sort(key=lambda e: e.get('timestamp', ''), reverse=True)
        self._send_json(downloads)

    def log_message(self, format, *args):
        """Quieter logging: skip static file requests."""
        path = args[0].split(' ')[1] if args else ''
        if path.startswith('/api/'):
            sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")


# ─── Main ───────────────────────────────────────────────────────────────────────

class ThreadedHTTPServer(HTTPServer):
    """Handle requests in separate threads for SSE support."""
    allow_reuse_address = True

    def process_request(self, request, client_address):
        thread = threading.Thread(target=self.process_request_thread,
                                  args=(request, client_address))
        thread.daemon = True
        thread.start()

    def process_request_thread(self, request, client_address):
        try:
            self.finish_request(request, client_address)
        except Exception:
            self.handle_error(request, client_address)
        finally:
            self.shutdown_request(request)


def main():
    # Validate log file exists (warn only)
    log_path = Path(COWRIE_LOG)
    if not log_path.exists():
        print(f"[WARN] Cowrie log not found at: {COWRIE_LOG}")
        print(f"       API will return empty data until the file is created.")
    else:
        events = cache.get_events()
        print(f"[OK]   Loaded {len(events)} events from {COWRIE_LOG}")

    server = ThreadedHTTPServer((HOST, PORT), WolfieHandler)
    print(f"\n  🐺 Wolfie Relay Server")
    print(f"  ──────────────────────")
    print(f"  Dashboard:  http://{HOST}:{PORT}")
    print(f"  API:        http://{HOST}:{PORT}/api/events")
    print(f"  SSE Stream: http://{HOST}:{PORT}/api/events/stream")
    print(f"  Cowrie Log: {COWRIE_LOG}")
    print(f"\n  Press Ctrl+C to stop.\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Shutting down...")
        server.shutdown()


if __name__ == '__main__':
    main()
