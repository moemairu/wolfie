// api.js - Data fetching abstraction layer
// Supports two modes:
//   - Static: fetches from data/cowrie.json (dev/demo mode)
//   - Relay:  fetches from server.py REST API (production mode)

const API_BASE = window.WOLFIE_API || 'http://localhost:8080';

let cachedEvents = null;

async function fetchEvents() {
    if (cachedEvents) return cachedEvents;
    try {
        const url = API_BASE ? `${API_BASE}/api/events` : 'data/cowrie.json';
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        cachedEvents = await response.json();
        return cachedEvents;
    } catch (err) {
        console.error('Error fetching data:', err);
        return [];
    }
}

/**
 * Invalidates the cached events so the next fetch gets fresh data.
 * Called by SSE when new events arrive.
 */
export function invalidateCache() {
    cachedEvents = null;
}

export const api = {
    async getDashboardStats() {
        const events = await fetchEvents();
        const sessions = new Set();
        const uniqueIPs = new Set();
        let successfulLogins = 0;
        let failedLogins = 0;
        let commands = 0;
        let downloads = 0;

        for (const e of events) {
            sessions.add(e.session);
            if (e.src_ip) uniqueIPs.add(e.src_ip);
            if (e.eventid === 'cowrie.login.success') successfulLogins++;
            if (e.eventid === 'cowrie.login.failed') failedLogins++;
            if (e.eventid === 'cowrie.command.input') commands++;
            if (e.eventid === 'cowrie.session.file_download' || e.eventid === 'cowrie.session.file_upload') downloads++;
        }

        const totalLogins = successfulLogins + failedLogins;
        const successRate = totalLogins > 0 ? ((successfulLogins / totalLogins) * 100).toFixed(1) : '0.0';

        return {
            totalSessions: sessions.size,
            uniqueIPs: uniqueIPs.size,
            successfulLogins,
            failedLogins,
            commands,
            downloads,
            successRate
        };
    },

    async getTopPasswords(limit = 5) {
        const events = await fetchEvents();
        const counts = {};

        for (const e of events) {
            if ((e.eventid === 'cowrie.login.failed' || e.eventid === 'cowrie.login.success') && e.password) {
                counts[e.password] = (counts[e.password] || 0) + 1;
            }
        }

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([password, count]) => ({ password, count }));
    },

    async getTopUsernames(limit = 5) {
        const events = await fetchEvents();
        const counts = {};

        for (const e of events) {
            if ((e.eventid === 'cowrie.login.failed' || e.eventid === 'cowrie.login.success') && e.username) {
                counts[e.username] = (counts[e.username] || 0) + 1;
            }
        }

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([username, count]) => ({ username, count }));
    },

    async getRecentActivity(limit = 10) {
        const events = await fetchEvents();
        // Sort by timestamp descending, return most recent
        return [...events]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    },

    async getSessions() {
        const events = await fetchEvents();
        const sessionsMap = new Map();

        for (const event of events) {
            if (!sessionsMap.has(event.session)) {
                sessionsMap.set(event.session, {
                    id: event.session,
                    ip: event.src_ip,
                    startTime: event.timestamp,
                    endTime: null,
                    duration: null,
                    commands: 0,
                    loginAttempts: 0,
                    success: false,
                    downloads: 0
                });
            }

            const s = sessionsMap.get(event.session);

            // Track earliest start time
            if (new Date(event.timestamp) < new Date(s.startTime)) {
                s.startTime = event.timestamp;
            }

            if (event.eventid === 'cowrie.login.success') s.success = true;
            if (event.eventid === 'cowrie.login.failed' || event.eventid === 'cowrie.login.success') s.loginAttempts++;
            if (event.eventid === 'cowrie.command.input') s.commands++;
            if (event.eventid === 'cowrie.session.file_download' || event.eventid === 'cowrie.session.file_upload') s.downloads++;
            if (event.eventid === 'cowrie.session.closed') {
                s.duration = event.duration;
                s.endTime = event.timestamp;
            }
            if (event.eventid === 'cowrie.log.closed' && event.duration && !s.duration) {
                s.duration = event.duration;
            }
        }

        return Array.from(sessionsMap.values())
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    },

    async getSessionDetails(id) {
        const events = await fetchEvents();
        const sessionEvents = events
            .filter(e => e.session === id)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        if (!sessionEvents.length) return null;

        const firstEvent = sessionEvents[0];
        const lastEvent = sessionEvents[sessionEvents.length - 1];
        const logEvent = sessionEvents.find(e => e.eventid === 'cowrie.log.closed');
        const loginSuccess = sessionEvents.find(e => e.eventid === 'cowrie.login.success');
        const loginAttempts = sessionEvents.filter(e =>
            e.eventid === 'cowrie.login.failed' || e.eventid === 'cowrie.login.success'
        );
        const downloadEvents = sessionEvents.filter(e =>
            e.eventid === 'cowrie.session.file_download' || e.eventid === 'cowrie.session.file_upload'
        );

        return {
            id,
            events: sessionEvents,
            loginAttempts,
            downloads: downloadEvents,
            summary: {
                ip: firstEvent.src_ip,
                startTime: firstEvent.timestamp,
                endTime: lastEvent.timestamp,
                duration: logEvent?.duration || null,
                success: !!loginSuccess,
                username: loginSuccess?.username || loginAttempts[0]?.username || '—',
                commandCount: sessionEvents.filter(e => e.eventid === 'cowrie.command.input').length,
                eventCount: sessionEvents.length
            }
        };
    },

    async getDownloads() {
        const events = await fetchEvents();
        return events
            .filter(e => e.eventid === 'cowrie.session.file_download' || e.eventid === 'cowrie.session.file_upload')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
};
