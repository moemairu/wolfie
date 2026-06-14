// session-detail.js

import { api } from '../api.js';
import { renderPageHeader } from '../components/page-header.js';
import { createCommandTimeline } from '../components/command-timeline.js';
import { createActivityFeed } from '../components/activity-feed.js';
import { escapeHtml, formatTimestampFull, formatDuration } from '../utils.js';

export async function renderSessionDetail(container, header, params) {
    const sessionId = params.id;
    const shortId = escapeHtml(sessionId.substring(0, 8));
    renderPageHeader(header, `Session: ${shortId}`, `<a href="#/sessions">Sessions</a> > ${shortId}`);

    container.innerHTML = `<div class="text-muted">Loading session details...</div>`;

    try {
        const detail = await api.getSessionDetails(sessionId);

        if (!detail || detail.events.length === 0) {
            container.innerHTML = `<div class="text-muted">Session not found.</div>`;
            return;
        }

        const s = detail.summary;

        // Auth attempts section
        const authHtml = detail.loginAttempts.length > 0
            ? detail.loginAttempts.map(a => {
                const isSuccess = a.eventid === 'cowrie.login.success';
                return `
                    <div class="auth-attempt ${isSuccess ? 'auth-attempt--success' : 'auth-attempt--failed'}">
                        <span class="auth-icon">${isSuccess ? '✓' : '✗'}</span>
                        <span class="font-mono">${escapeHtml(a.username)}</span>
                        <span class="text-muted">:</span>
                        <span class="font-mono">${escapeHtml(a.password)}</span>
                    </div>
                `;
            }).join('')
            : '<div class="text-muted">No login attempts</div>';

        // Downloads section
        let downloadsHtml = '';
        if (detail.downloads.length > 0) {
            const dlRows = detail.downloads.map(dl => `
                <div class="download-item">
                    <span class="event-icon event-icon--warning">[↓]</span>
                    <span class="font-mono">${escapeHtml(dl.url || dl.filename || 'Unknown')}</span>
                    <span class="text-muted hash-display">${escapeHtml(dl.shasum || '')}</span>
                </div>
            `).join('');

            downloadsHtml = `
                <div class="col-span-12 card">
                    <div class="card-header">
                        <div class="card-title">Downloaded Files</div>
                    </div>
                    ${dlRows}
                </div>
            `;
        }

        container.innerHTML = `
            <div class="grid-dashboard">
                <div class="col-span-12 card">
                    <div class="session-summary">
                        <div class="summary-item">
                            <div class="summary-label">Attacker IP</div>
                            <div class="font-mono summary-value">${escapeHtml(s.ip)}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Start Time</div>
                            <div class="summary-value">${formatTimestampFull(s.startTime)}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Duration</div>
                            <div class="summary-value">${s.duration ? formatDuration(s.duration) : 'Ongoing'}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Status</div>
                            <div class="summary-value">
                                ${s.success
                                    ? '<span class="badge badge-danger">Compromised</span>'
                                    : '<span class="badge badge-info">Attempt</span>'}
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Commands</div>
                            <div class="summary-value">${s.commandCount}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Events</div>
                            <div class="summary-value">${s.eventCount}</div>
                        </div>
                    </div>
                </div>

                <div class="col-span-4 card">
                    <div class="card-header">
                        <div class="card-title">Auth Attempts</div>
                        <span class="text-muted">${detail.loginAttempts.length}</span>
                    </div>
                    <div class="auth-list">
                        ${authHtml}
                    </div>
                </div>

                <div class="col-span-8 card">
                    <div class="card-header">
                        <div class="card-title">Commands</div>
                    </div>
                    ${createCommandTimeline(detail.events)}
                </div>

                ${downloadsHtml}

                <div class="col-span-12 card">
                    <div class="card-header">
                        <div class="card-title">All Events</div>
                        <span class="text-muted">${detail.events.length} events</span>
                    </div>
                    <div class="events-scroll">
                        ${createActivityFeed(detail.events)}
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load session: ${escapeHtml(e.message)}</div>`;
    }
}
