// navigation-bar.js

import { globalState } from '../state.js';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>', path: '#/dashboard' },
    { id: 'sessions', label: 'Sessions', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>', path: '#/sessions' },
    { id: 'activity', label: 'Live Activity', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>', path: '#/activity' },
    { id: 'downloads', label: 'Downloads', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>', path: '#/downloads' }
];

export function renderNavigationBar(container) {
    const render = () => {
        const { currentRoute, isConnected } = globalState.getState();

        container.innerHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">🐺 Wolfie</div>
                <span class="connection-indicator ${isConnected ? 'connection-indicator--connected' : ''}" title="${isConnected ? 'Live: connected to Cowrie' : 'Offline: no relay server'}"></span>
            </div>
            <ul class="sidebar-nav">
                ${NAV_ITEMS.map(item => `
                    <li class="nav-item ${currentRoute.startsWith(item.path) ? 'active' : ''}">
                        <a href="${item.path}" style="display:flex; align-items:center; width:100%; color:inherit;">
                            <span style="margin-right: 12px; font-size: 1.2rem;">${item.icon}</span>
                            ${item.label}
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
    };

    render();

    // Re-render when route or connection status changes
    globalState.addEventListener('stateChange', () => {
        render();
    });
}
