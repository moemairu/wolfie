// activity-feed.js

import { escapeHtml, getEventIcon, formatTimestamp, truncate } from '../utils.js';

export function createActivityFeed(events) {
    if (!events || events.length === 0) {
        return `<div class="text-muted" style="padding: 1rem;">No recent activity.</div>`;
    }

    const itemsHtml = events.map(event => {
        const ip = escapeHtml(event.src_ip);
        const msg = escapeHtml(event.message);
        const sessionId = escapeHtml(event.session ? event.session.substring(0, 8) : '—');
        const time = formatTimestamp(event.timestamp);
        const icon = getEventIcon(event.eventid);

        return `
            <div class="feed-item">
                <div class="feed-icon font-mono">${icon}</div>
                <div class="feed-content">
                    <div><strong>${ip}</strong> — ${msg}</div>
                    <div class="feed-time">${time} · ${sessionId}</div>
                </div>
            </div>
        `;
    }).join('');

    return `<div class="feed-list">${itemsHtml}</div>`;
}
