// dashboard.js

import { api } from '../api.js';
import { renderPageHeader } from '../components/page-header.js';
import { createStatCard } from '../components/stat-card.js';
import { createActivityFeed } from '../components/activity-feed.js';
import { createSessionTable } from '../components/session-table.js';
import { escapeHtml } from '../utils.js';

export async function renderDashboard(container, header) {
    renderPageHeader(header, 'Dashboard');

    container.innerHTML = `<div class="text-muted">Loading dashboard data...</div>`;

    try {
        const [stats, recentActivity, sessions, topPasswords, topUsernames] = await Promise.all([
            api.getDashboardStats(),
            api.getRecentActivity(5),
            api.getSessions(),
            api.getTopPasswords(5),
            api.getTopUsernames(5)
        ]);

        const passwordRows = topPasswords.map(p =>
            `<tr><td class="font-mono">${escapeHtml(p.password)}</td><td>${p.count}</td></tr>`
        ).join('');

        const usernameRows = topUsernames.map(u =>
            `<tr><td class="font-mono">${escapeHtml(u.username)}</td><td>${u.count}</td></tr>`
        ).join('');

        container.innerHTML = `
            <div class="grid-dashboard">
                <div class="col-span-3">
                    ${createStatCard('Total Sessions', stats.totalSessions, 'All time')}
                </div>
                <div class="col-span-3">
                    ${createStatCard('Unique IPs', stats.uniqueIPs, 'Attack sources')}
                </div>
                <div class="col-span-3">
                    ${createStatCard('Success Rate', stats.successRate + '%', `${stats.successfulLogins} of ${stats.successfulLogins + stats.failedLogins} attempts`)}
                </div>
                <div class="col-span-3">
                    ${createStatCard('Commands', stats.commands, 'Executed by attackers')}
                </div>

                <div class="col-span-8 card card--no-pad">
                    <div class="card-header card-header--padded">
                        <div class="card-title">Recent Sessions</div>
                        <a href="#/sessions" class="btn btn-outline btn-sm">View All</a>
                    </div>
                    ${createSessionTable(sessions, 5)}
                </div>

                <div class="col-span-4 card">
                    <div class="card-header">
                        <div class="card-title">Live Activity</div>
                        <a href="#/activity" class="btn btn-outline btn-sm">View All</a>
                    </div>
                    ${createActivityFeed(recentActivity)}
                </div>

                <div class="col-span-6 card">
                    <div class="card-header">
                        <div class="card-title">Top Passwords</div>
                    </div>
                    <div class="table-container">
                        <table class="wolfie-table">
                            <thead><tr><th>Password</th><th>Attempts</th></tr></thead>
                            <tbody>${passwordRows || '<tr><td colspan="2" class="text-muted">No data</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>

                <div class="col-span-6 card">
                    <div class="card-header">
                        <div class="card-title">Top Usernames</div>
                    </div>
                    <div class="table-container">
                        <table class="wolfie-table">
                            <thead><tr><th>Username</th><th>Attempts</th></tr></thead>
                            <tbody>${usernameRows || '<tr><td colspan="2" class="text-muted">No data</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        // Auto-refresh when new events arrive
        const handleNewEvent = () => {
            // Re-render dashboard to update stats in place
            renderDashboard(container, header);
        };
        
        import('../state.js').then(({ globalState }) => {
            // Remove previous listener to avoid duplicates if re-rendered
            globalState.removeEventListener('newEvent', handleNewEvent);
            globalState.addEventListener('newEvent', handleNewEvent);
        });

    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load dashboard: ${escapeHtml(e.message)}</div>`;
    }
}
