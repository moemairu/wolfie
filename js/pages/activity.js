// activity.js

import { api } from '../api.js';
import { globalState } from '../state.js';
import { renderPageHeader } from '../components/page-header.js';
import { createActivityFeed } from '../components/activity-feed.js';

export async function renderActivity(container, header) {
    renderPageHeader(header, 'Activity Feed');

    const { isConnected } = globalState.getState();
    const liveBadge = isConnected
        ? '<span class="live-badge">LIVE</span>'
        : '<span class="live-badge live-badge--offline">OFFLINE</span>';

    container.innerHTML = `<div class="text-muted">Loading activity...</div>`;

    try {
        const events = await api.getRecentActivity(50);

        container.innerHTML = `
            <div class="activity-header">
                ${liveBadge}
                <span class="text-muted">${events.length} recent events</span>
            </div>
            <div class="card" id="activity-feed-container">
                ${createActivityFeed(events)}
            </div>
        `;

        // Listen for new SSE events and prepend them
        const handleNewEvent = (e) => {
            const feedContainer = document.getElementById('activity-feed-container');
            if (!feedContainer) return;

            const event = e.detail;
            const feedList = feedContainer.querySelector('.feed-list');
            if (feedList) {
                // Re-render with new event prepended
                const updatedEvents = [event, ...events];
                events.unshift(event);
                if (events.length > 100) events.pop();
                feedContainer.innerHTML = createActivityFeed(events);
            }
        };

        globalState.addEventListener('newEvent', handleNewEvent);

        // Update live badge on connection change
        const handleStateChange = () => {
            const badge = container.querySelector('.live-badge');
            const { isConnected: connected } = globalState.getState();
            if (badge) {
                badge.className = connected ? 'live-badge' : 'live-badge live-badge--offline';
                badge.textContent = connected ? 'LIVE' : 'OFFLINE';
            }
        };

        globalState.addEventListener('stateChange', handleStateChange);

    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load activity: ${e.message}</div>`;
    }
}
