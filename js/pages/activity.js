// activity.js

import { api } from '../api.js';
import { renderPageHeader } from '../components/page-header.js';
import { createActivityFeed } from '../components/activity-feed.js';

export async function renderActivity(container, header) {
    renderPageHeader(header, 'Live Activity Feed');
    
    container.innerHTML = `<div class="text-muted">Loading activity...</div>`;

    try {
        const events = await api.getRecentActivity(50);

        container.innerHTML = `
            <div class="card">
                ${createActivityFeed(events)}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load activity: ${e.message}</div>`;
    }
}
