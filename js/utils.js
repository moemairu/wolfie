// utils.js - Shared utility functions

/**
 * Escapes HTML special characters to prevent XSS when injecting
 * attacker-controlled data into innerHTML.
 */
export function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Validates and sanitizes a URL. Only allows http/https schemes.
 * Returns the sanitized URL or '#' if invalid.
 */
export function sanitizeUrl(url) {
    if (!url) return '#';
    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return escapeHtml(url);
        }
    } catch {
        // invalid URL
    }
    return '#';
}

/**
 * Formats an ISO 8601 timestamp into a readable local string.
 * Returns relative time for recent events, absolute for older.
 */
export function formatTimestamp(iso) {
    if (!iso) return '—';
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
        hour12: false
    });
}

/**
 * Formats an absolute timestamp (always shows full date/time).
 */
export function formatTimestampFull(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });
}

/**
 * Formats a duration in seconds to a human-readable string.
 */
export function formatDuration(seconds) {
    if (seconds == null) return '—';
    const s = Math.floor(seconds);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
}

/**
 * Truncates a string to a maximum length, appending '…' if truncated.
 */
export function truncate(str, len = 32) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '…' : str;
}

/**
 * Returns an icon string for a Cowrie event type.
 */
export function getEventIcon(eventid) {
    if (!eventid) return '<span class="event-icon event-icon--info">[i]</span>';
    if (eventid.includes('login.success')) return '<span class="event-icon event-icon--danger">[+]</span>';
    if (eventid.includes('login.failed')) return '<span class="event-icon event-icon--muted">[-]</span>';
    if (eventid.includes('command.input')) return '<span class="event-icon event-icon--accent">[>]</span>';
    if (eventid.includes('command.failed')) return '<span class="event-icon event-icon--warning">[!]</span>';
    if (eventid.includes('session.connect')) return '<span class="event-icon event-icon--info">[c]</span>';
    if (eventid.includes('session.closed')) return '<span class="event-icon event-icon--muted">[x]</span>';
    if (eventid.includes('file_download')) return '<span class="event-icon event-icon--warning">[↓]</span>';
    if (eventid.includes('file_upload')) return '<span class="event-icon event-icon--warning">[↑]</span>';
    if (eventid.includes('log.closed')) return '<span class="event-icon event-icon--muted">[◼]</span>';
    if (eventid.includes('client.version')) return '<span class="event-icon event-icon--info">[v]</span>';
    if (eventid.includes('client.kex')) return '<span class="event-icon event-icon--info">[k]</span>';
    if (eventid.includes('direct-tcpip')) return '<span class="event-icon event-icon--danger">[⇄]</span>';
    if (eventid.includes('virustotal')) return '<span class="event-icon event-icon--danger">[🛡]</span>';
    return '<span class="event-icon event-icon--muted">[·]</span>';
}

/**
 * Returns a human-readable label for a Cowrie event type.
 */
export function getEventLabel(eventid) {
    if (!eventid) return 'Unknown';
    const labels = {
        'cowrie.session.connect': 'Connection',
        'cowrie.session.closed': 'Disconnected',
        'cowrie.login.success': 'Login Success',
        'cowrie.login.failed': 'Login Failed',
        'cowrie.command.input': 'Command',
        'cowrie.command.failed': 'Command Failed',
        'cowrie.session.file_download': 'File Download',
        'cowrie.session.file_upload': 'File Upload',
        'cowrie.log.closed': 'Session Log',
        'cowrie.client.version': 'SSH Client',
        'cowrie.client.kex': 'Key Exchange',
        'cowrie.client.size': 'Terminal Size',
        'cowrie.client.fingerprint': 'SSH Key Auth',
        'cowrie.direct-tcpip.request': 'Tunnel Request',
        'cowrie.direct-tcpip.data': 'Tunnel Data',
        'cowrie.virustotal.scanfile': 'VT File Scan',
        'cowrie.virustotal.scanurl': 'VT URL Scan',
    };
    return labels[eventid] || eventid.replace('cowrie.', '');
}
