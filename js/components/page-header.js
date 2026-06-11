// page-header.js

export function renderPageHeader(container, title, breadcrumb = null) {
    container.innerHTML = `
        <h1 class="page-title">${title}</h1>
        ${breadcrumb ? `<div class="breadcrumb">${breadcrumb}</div>` : ''}
    `;
}
