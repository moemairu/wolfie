// dashboard.js

import { api } from '../api.js';
import { renderPageHeader } from '../components/page-header.js';
import { createStatCard } from '../components/stat-card.js';
import { createActivityFeed } from '../components/activity-feed.js';
import { createSessionTable } from '../components/session-table.js';

export async function renderDashboard(container, header) {
    renderPageHeader(header, 'Dashboard Overview');
    
    // Loading state
    container.innerHTML = `<div class="text-muted">Loading dashboard data...</div>`;

    try {
        const stats = await api.getDashboardStats();
        const recentActivity = await api.getRecentActivity(5);
        const sessions = await api.getSessions();

        container.innerHTML = `
            <div class="grid-dashboard">
                <div class="col-span-3">
                    ${createStatCard('Total Sessions', stats.totalSessions, 'All time')}
                </div>
                <div class="col-span-3">
                    ${createStatCard('Unique IPs', stats.uniqueIPs, 'Attack sources')}
                </div>
                <div class="col-span-3">
                    ${createStatCard('Successful Logins', stats.successfulLogins, 'Compromised')}
                </div>
                <div class="col-span-3">
                    ${createStatCard('Commands Executed', stats.commands, 'Total commands')}
                </div>
                
                <div class="col-span-8 card" style="padding: 0; overflow: hidden;">
                    <div class="card-header" style="padding: 1.5rem 1.5rem 0 1.5rem;">
                        <div class="card-title">Recent Sessions</div>
                    </div>
                    ${createSessionTable(sessions, 5)}
                </div>
                
                <div class="col-span-4 card">
                    <div class="card-header">
                        <div class="card-title">Live Activity</div>
                        <a href="#/activity" class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View All</a>
                    </div>
                    ${createActivityFeed(recentActivity)}
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load dashboard: ${e.message}</div>`;
    }
}
