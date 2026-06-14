// download-table.js

import { escapeHtml, sanitizeUrl, formatTimestamp } from '../utils.js';

export function createDownloadTable(downloads) {
    if (!downloads || downloads.length === 0) {
        return `<div class="text-muted" style="padding: 1rem;">No downloads recorded.</div>`;
    }

    const rows = downloads.map(dl => {
        const time = formatTimestamp(dl.timestamp);
        const sessionId = escapeHtml(dl.session ? dl.session.substring(0, 8) : '—');
        const type = dl.eventid === 'cowrie.session.file_download' ? 'Download' : 'Upload';
        const hash = escapeHtml(dl.shasum || '—');

        // Sanitize URL to prevent javascript: injection
        let source;
        if (dl.url) {
            const safeUrl = sanitizeUrl(dl.url);
            const displayUrl = escapeHtml(dl.url);
            source = safeUrl !== '#'
                ? `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${displayUrl}</a>`
                : `<span class="text-muted">${displayUrl}</span>`;
        } else {
            source = escapeHtml(dl.filename || 'Unknown');
        }

        return `
            <tr>
                <td>${time}</td>
                <td><span class="font-mono">${sessionId}</span></td>
                <td>${type}</td>
                <td>${source}</td>
                <td><span class="font-mono hash-display">${hash}</span></td>
            </tr>
        `;
    }).join('');

    return `
        <div class="table-container">
            <table class="wolfie-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Session</th>
                        <th>Type</th>
                        <th>Source / Filename</th>
                        <th>SHA256 Hash</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}
