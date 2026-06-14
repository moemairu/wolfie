// state.js - Simple global state management using EventTarget

class Store extends EventTarget {
    constructor() {
        super();
        this.state = {
            currentRoute: window.location.hash || '#/',
            theme: 'dark',
            isConnected: false,  // SSE connection status
            liveEvents: [],      // Buffer of events received via SSE
        };
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.dispatchEvent(new CustomEvent('stateChange', { detail: this.state }));
    }
}

export const globalState = new Store();
