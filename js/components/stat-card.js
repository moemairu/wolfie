// stat-card.js

export function createStatCard(title, value, description = '') {
    return `
        <div class="card">
            <div class="card-header">
                <div class="card-title">${title}</div>
            </div>
            <div class="stat-value">${value}</div>
            ${description ? `<div class="stat-delta text-muted">${description}</div>` : ''}
        </div>
    `;
}
