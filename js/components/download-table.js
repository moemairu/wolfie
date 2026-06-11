// download-table.js

export function createDownloadTable(downloads) {
    if (!downloads || downloads.length === 0) {
        return `<div class="text-muted">No downloads recorded.</div>`;
    }

    const rows = downloads.map(dl => `
        <tr>
            <td>${new Date(dl.timestamp).toLocaleString()}</td>
            <td><span class="font-mono">${dl.session.substring(0,8)}</span></td>
            <td>${dl.eventid === 'cowrie.session.file_download' ? 'Download' : 'Upload'}</td>
            <td>
                ${dl.url ? `<a href="${dl.url}" target="_blank">${dl.url}</a>` : dl.filename || 'Unknown'}
            </td>
            <td><span class="font-mono" style="font-size: 0.75rem;">${dl.shasum}</span></td>
        </tr>
    `).join('');

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
