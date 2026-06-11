// downloads.js

import { api } from '../api.js';
import { renderPageHeader } from '../components/page-header.js';
import { createDownloadTable } from '../components/download-table.js';

export async function renderDownloads(container, header) {
    renderPageHeader(header, 'Downloads & Artifacts');
    
    container.innerHTML = `<div class="text-muted">Loading downloads...</div>`;

    try {
        const downloads = await api.getDownloads();

        container.innerHTML = `
            <div class="card" style="padding: 0; overflow: hidden;">
                ${createDownloadTable(downloads)}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="text-danger">Failed to load downloads: ${e.message}</div>`;
    }
}
