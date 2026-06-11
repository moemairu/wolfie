// activity-feed.js

export function createActivityFeed(events) {
    if (!events || events.length === 0) {
        return `<div class="text-muted">No recent activity.</div>`;
    }

    const getIcon = (eventId) => {
        if (eventId.includes('login.success')) return '<span style="color: var(--status-success)">[+]</span>';
        if (eventId.includes('login.failed')) return '<span style="color: var(--status-danger)">[-]</span>';
        if (eventId.includes('command')) return '<span style="color: var(--accent-primary)">[>]</span>';
        if (eventId.includes('connect')) return '<span style="color: var(--status-info)">[c]</span>';
        if (eventId.includes('download')) return '<span style="color: var(--status-warning)">[d]</span>';
        return '<span class="text-muted">[i]</span>';
    };

    const itemsHtml = events.map(event => `
        <div class="feed-item">
            <div class="feed-icon font-mono">${getIcon(event.eventid)}</div>
            <div class="feed-content">
                <div><strong>${event.src_ip}</strong> - ${event.message}</div>
                <div class="feed-time">${new Date(event.timestamp).toLocaleString()} | Session: ${event.session.substring(0,8)}</div>
            </div>
        </div>
    `).join('');

    return `<div class="feed-list">${itemsHtml}</div>`;
}
