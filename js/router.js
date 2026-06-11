// router.js - Simple hash-based client-side router

import { globalState } from './state.js';

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.container = document.getElementById('page-container');
        this.header = document.getElementById('page-header');
        
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute(); // initial load
    }

    async handleRoute() {
        let hash = window.location.hash || '#/';
        
        // Remove trailing slash for matching unless it's root
        if (hash !== '#/' && hash.endsWith('/')) {
            hash = hash.slice(0, -1);
        }

        globalState.setState({ currentRoute: hash });

        // Find matching route
        let match = null;
        let params = {};

        for (const [path, handler] of Object.entries(this.routes)) {
            // Simple param extraction (e.g. #/sessions/:id)
            const routeParts = path.split('/');
            const hashParts = hash.split('/');

            if (routeParts.length === hashParts.length) {
                let isMatch = true;
                params = {};

                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith(':')) {
                        params[routeParts[i].substring(1)] = hashParts[i];
                    } else if (routeParts[i] !== hashParts[i]) {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch) {
                    match = handler;
                    break;
                }
            }
        }

        this.container.innerHTML = '';
        this.header.innerHTML = '';

        if (match) {
            try {
                await match(this.container, this.header, params);
            } catch (e) {
                console.error("Error rendering route:", e);
                this.container.innerHTML = `<div class="error">Error loading page: ${e.message}</div>`;
            }
        } else {
            this.container.innerHTML = `<h2>404 - Not Found</h2><p>The page ${hash} does not exist.</p>`;
        }
    }
}
