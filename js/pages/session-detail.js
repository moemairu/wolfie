// session-detail.js

import { api } from '../api.js';
import { renderPageHeader } from '../components/page-header.js';
import { createReplayViewer } from '../components/replay-viewer.js';
import { createActivityFeed } from '../components/activity-feed.js';

export async function renderSessionDetail(container, header, params) {
    const sessionId = params.id;
    renderPageHeader(header, `Session: ${sessionId.substring(0, 8)}`, `<a href="#/sessions">Sessions</a> > ${sessionId.substring(0, 8)}`);
    
    container.innerHTML = `<div class="text-muted">Loading session details...</div>`;

    try {
        const detail = await api.getSessionDetails(sessionId);
        
        if (!detail || detail.events.length === 0) {
            container.innerHTML = `<div class="text-muted">Session not found.</div>`;
            return;
        }

        // Find the ttylog event if it exists
        const logEvent = detail.events.find(e => e.eventid === 'cowrie.log.closed');
        const ttylogPath = logEvent ? logEvent.ttylog : null;

        container.innerHTML = `
            <div class="grid-dashboard">
                <div class="col-span-12 card">
                    <div style="display:flex; gap: 2rem; margin-bottom: 1rem;">
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Attacker IP</div>
                            <div class="font-mono" style="font-size: 1.125rem;">${detail.summary.ip}</div>
                        </div>
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Start Time</div>
                            <div style="font-size: 1.125rem;">${new Date(detail.summary.startTime).toLocaleString()}</div>
                        </div>
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Duration</div>
                            <div style="font-size: 1.125rem;">${logEvent ? logEvent.duration + 's' : 'Ongoing'}</div>
                        </div>
                    </div>
                </div>

                <div class="col-span-8 card">
                    <div class="card-header">
                        <div class="card-title">Terminal Replay</div>
                    </div>
                    ${createReplayViewer(ttylogPath)}
                </div>

                <div class="col-span-4 card">
                    <div class="card-header">
                        <div class="card-title">Session Events</div>
                    </div>
                    <div style="max-height: 400px; overflow-y: auto; padding-right: 0.5rem;">
                        ${createActivityFeed(detail.events)}
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load session details: ${e.message}</div>`;
    }
}
