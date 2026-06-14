// command-timeline.js - Displays chronological command sequence from a session

import { escapeHtml, formatTimestampFull, formatDuration } from '../utils.js';

/**
 * Creates a terminal-styled timeline of commands executed during a session.
 * Shows the actual commands from cowrie.command.input events.
 */
export function createCommandTimeline(events) {
    const commands = events.filter(e =>
        e.eventid === 'cowrie.command.input' || e.eventid === 'cowrie.command.failed'
    );

    if (commands.length === 0) {
        return `<div class="text-muted" style="padding: 1rem;">No commands were executed in this session.</div>`;
    }

    const lines = commands.map((cmd, i) => {
        const isFailed = cmd.eventid === 'cowrie.command.failed';
        const input = escapeHtml(cmd.input || cmd.message || '');
        const time = formatTimestampFull(cmd.timestamp);

        // Calculate time delta from previous command
        let delta = '';
        if (i > 0) {
            const prevTime = new Date(commands[i - 1].timestamp);
            const currTime = new Date(cmd.timestamp);
            const diffSec = Math.floor((currTime - prevTime) / 1000);
            if (diffSec > 0) {
                delta = `<span class="cmd-delta">+${formatDuration(diffSec)}</span>`;
            }
        }

        return `
            <div class="cmd-line ${isFailed ? 'cmd-line--failed' : ''}">
                <div class="cmd-prompt">
                    <span class="cmd-user">root@honeypot</span><span class="cmd-separator">:~#</span> <span class="cmd-input">${input}</span>
                </div>
                <div class="cmd-meta">
                    <span class="cmd-time">${time}</span>
                    ${delta}
                    ${isFailed ? '<span class="cmd-badge cmd-badge--failed">not found</span>' : ''}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="command-timeline">
            <div class="cmd-header">
                <span class="cmd-count">${commands.length} command${commands.length !== 1 ? 's' : ''} executed</span>
            </div>
            ${lines}
            <div class="cmd-line cmd-line--end">
                <span class="cmd-user">root@honeypot</span><span class="cmd-separator">:~#</span> <span class="cmd-cursor">▌</span>
            </div>
        </div>
    `;
}
