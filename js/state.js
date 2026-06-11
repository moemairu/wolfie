// state.js - Simple global state management using EventTarget

class Store extends EventTarget {
    constructor() {
        super();
        this.state = {
            currentRoute: window.location.hash || '#/',
            theme: 'dark',
            timeframe: '24h',
            sessions: [], // Cache for sessions
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
