// session-table.js

export function createSessionTable(sessions, limit = null) {
    if (!sessions || sessions.length === 0) {
        return `<div class="text-muted">No sessions found.</div>`;
    }

    const displaySessions = limit ? sessions.slice(0, limit) : sessions;

    const rows = displaySessions.map(session => `
        <tr>
            <td><a href="#/sessions/${session.id}" class="font-mono">${session.id.substring(0, 8)}</a></td>
            <td>${session.ip}</td>
            <td>${new Date(session.startTime).toLocaleString()}</td>
            <td>${session.commands}</td>
            <td>
                ${session.success 
                    ? '<span class="badge badge-danger">Compromised</span>' 
                    : '<span class="badge badge-info">Attempt</span>'}
            </td>
            <td>
                <a href="#/sessions/${session.id}" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View</a>
            </td>
        </tr>
    `).join('');

    return `
        <div class="table-container">
            <table class="wolfie-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Attacker IP</th>
                        <th>Start Time</th>
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
