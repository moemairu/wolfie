// websocket.js - Stub for live event stream

import { globalState } from './state.js';

export function initWebSocket() {
    console.log("WebSocket stub initialized. In the future, connect to ws://backend/events");
    
    // Simulate incoming events
    setInterval(() => {
        // Only dispatch if someone is listening to live events
        // In a real app, this would append to local state and update UI
    }, 5000);
}
