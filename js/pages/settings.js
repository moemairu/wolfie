// settings.js

import { renderPageHeader } from '../components/page-header.js';

export function renderSettings(container, header) {
    renderPageHeader(header, 'Settings & Configuration');
    
    container.innerHTML = `
        <div class="card" style="max-width: 600px;">
            <div class="card-header">
                <div class="card-title">Cowrie Configuration (Mock)</div>
            </div>
            
            <form id="settings-form" onsubmit="event.preventDefault(); alert('Settings saved (mock)!');">
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Honeypot Backend</label>
                    <select class="form-control" style="width: 100%; padding: 0.5rem; border-radius: 4px; background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="shell" selected>Shell (Emulated)</option>
                        <option value="proxy">Proxy (High Interaction)</option>
                        <option value="llm">LLM (AI Generated)</option>
                    </select>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Enabled Services</label>
                    <div style="display: flex; gap: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" checked> SSH (Port 2222)
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" checked> Telnet (Port 2223)
                        </label>
                    </div>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Output Modules</label>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" checked> JSON
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox"> VirusTotal
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox"> ElasticSearch
                        </label>
                    </div>
                </div>

                <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary">Save Configuration</button>
                </div>
            </form>
        </div>
    `;
}
