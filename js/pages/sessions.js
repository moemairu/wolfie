// sessions.js

import { api } from '../api.js';
import { renderPageHeader } from '../components/page-header.js';
import { createSessionTable } from '../components/session-table.js';

export async function renderSessions(container, header) {
    renderPageHeader(header, 'Sessions');

    container.innerHTML = `<div class="text-muted">Loading sessions...</div>`;

    try {
        const sessions = await api.getSessions();

        container.innerHTML = `
            <div class="activity-header">
                <span class="text-muted">${sessions.length} sessions recorded</span>
            </div>
            <div class="card card--no-pad">
                ${createSessionTable(sessions)}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load sessions: ${e.message}</div>`;
    }
}
