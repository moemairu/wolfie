// sse.js - Server-Sent Events client for real-time Cowrie event streaming

import { globalState } from './state.js';

let eventSource = null;

/**
 * Initializes the SSE connection to the relay server.
 * Gracefully fails if no relay server is available (dev/static mode).
 */
export function initSSE() {
    const apiBase = window.WOLFIE_API || 'http://localhost:8080';

    // In static file mode (no relay server), SSE is not available
    if (!apiBase) {
        console.log('[SSE] No relay server configured (WOLFIE_API not set). Real-time disabled.');
        return;
    }

    const url = `${apiBase}/api/events/stream`;
    console.log(`[SSE] Connecting to ${url}`);

    eventSource = new EventSource(url);

    eventSource.onopen = () => {
        console.log('[SSE] Connected');
        globalState.setState({ isConnected: true });
    };

    eventSource.onmessage = (event) => {
        try {
            const cowrieEvent = JSON.parse(event.data);
            const { liveEvents } = globalState.getState();

            // Keep last 200 live events in memory
            const updated = [cowrieEvent, ...liveEvents].slice(0, 200);
            globalState.setState({ liveEvents: updated });

            // Invalidate the API cache so the next fetch gets fresh data
            import('./api.js').then(module => module.invalidateCache());

            // Dispatch a specific event for components to listen to
            globalState.dispatchEvent(new CustomEvent('newEvent', { detail: cowrieEvent }));
        } catch (err) {
            console.warn('[SSE] Failed to parse event:', err);
        }
    };

    eventSource.onerror = () => {
        // EventSource auto-reconnects; just update status
        globalState.setState({ isConnected: false });
    };
}

/**
 * Closes the SSE connection. Called on cleanup.
 */
export function closeSSE() {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
        globalState.setState({ isConnected: false });
    }
}
