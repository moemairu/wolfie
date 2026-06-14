// session-table.js

import { escapeHtml, formatTimestamp } from '../utils.js';

export function createSessionTable(sessions, limit = null) {
    if (!sessions || sessions.length === 0) {
        return `<div class="text-muted" style="padding: 1rem;">No sessions found.</div>`;
    }

    const displaySessions = limit ? sessions.slice(0, limit) : sessions;

    const rows = displaySessions.map(session => {
        const id = escapeHtml(session.id);
        const shortId = escapeHtml(session.id.substring(0, 8));
        const ip = escapeHtml(session.ip);
        const time = formatTimestamp(session.startTime);

        return `
            <tr>
                <td><a href="#/sessions/${id}" class="font-mono">${shortId}</a></td>
                <td>${ip}</td>
                <td>${time}</td>
                <td>${session.commands}</td>
                <td>
                    ${session.success
                        ? '<span class="badge badge-danger">Compromised</span>'
                        : '<span class="badge badge-info">Attempt</span>'}
                </td>
                <td>
                    <a href="#/sessions/${id}" class="btn btn-outline btn-sm">View</a>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-container">
            <table class="wolfie-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Attacker IP</th>
                        <th>Time</th>
                        <th>Commands</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}
