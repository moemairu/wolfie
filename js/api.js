// api.js - Data fetching abstraction layer

let cachedEvents = null;

async function fetchEvents() {
    if (cachedEvents) return cachedEvents;
    try {
        const response = await fetch('data/cowrie.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        cachedEvents = await response.json();
        return cachedEvents;
    } catch (err) {
        console.error("Error fetching data:", err);
        return [];
    }
}

export const api = {
    async getDashboardStats() {
        const events = await fetchEvents();
        const totalSessions = new Set(events.map(e => e.session)).size;
        const uniqueIPs = new Set(events.map(e => e.src_ip)).size;
        const successfulLogins = events.filter(e => e.eventid === 'cowrie.login.success').length;
        const commands = events.filter(e => e.eventid === 'cowrie.command.input').length;
        
        return {
            totalSessions,
            uniqueIPs,
            successfulLogins,
            commands
        };
    },
    
    async getRecentActivity(limit = 10) {
        const events = await fetchEvents();
        return events.slice(0, limit);
    },
    
    async getSessions() {
        const events = await fetchEvents();
        // Group by session ID to create session objects
        const sessionsMap = new Map();
        
        events.forEach(event => {
            if (!sessionsMap.has(event.session)) {
                sessionsMap.set(event.session, {
                    id: event.session,
                    ip: event.src_ip,
                    startTime: event.timestamp,
                    commands: 0,
                    success: false
                });
            }
            
            const s = sessionsMap.get(event.session);
            if (event.eventid === 'cowrie.login.success') s.success = true;
            if (event.eventid === 'cowrie.command.input') s.commands++;
        });
        
        return Array.from(sessionsMap.values());
    },
    
    async getSessionDetails(id) {
        const events = await fetchEvents();
        const sessionEvents = events.filter(e => e.session === id);
        if (!sessionEvents.length) return null;
        
        return {
            id,
            events: sessionEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
            summary: {
                ip: sessionEvents[0]?.src_ip,
                startTime: sessionEvents[0]?.timestamp,
                endTime: sessionEvents[sessionEvents.length-1]?.timestamp
            }
        };
    },
    
    async getDownloads() {
        const events = await fetchEvents();
        return events.filter(e => e.eventid === 'cowrie.session.file_download' || e.eventid === 'cowrie.session.file_upload');
    }
};
