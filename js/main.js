// main.js - Application bootstrap

import { Router } from './router.js';
import { globalState } from './state.js';
import { initSSE } from './sse.js';

// Import Pages
import { renderDashboard } from './pages/dashboard.js';
import { renderSessions } from './pages/sessions.js';
import { renderSessionDetail } from './pages/session-detail.js';
import { renderDownloads } from './pages/downloads.js';
import { renderActivity } from './pages/activity.js';

// Import Components
import { renderNavigationBar } from './components/navigation-bar.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Sidebar
    const sidebar = document.getElementById('sidebar');
    renderNavigationBar(sidebar);

    // Initialize Router
    const routes = {
        '#/': (container, header) => { window.location.hash = '#/dashboard'; },
        '#/dashboard': renderDashboard,
        '#/sessions': renderSessions,
        '#/sessions/:id': renderSessionDetail,
        '#/activity': renderActivity,
        '#/downloads': renderDownloads
    };

    new Router(routes);

    // Initialize SSE for live event streaming
    initSSE();

    // Setup global state listeners (e.g. for theme)
    globalState.addEventListener('stateChange', (e) => {
        const state = e.detail;
        if (state.theme === 'dark') {
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
        }
    });
});
