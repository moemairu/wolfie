# Wolfie Information Architecture

## Navigation Structure

A simple, persistent sidebar navigation to move between core views.

- **Dashboard** (Overview metrics and recent activity)
- **Sessions** (List of all attacker sessions)
- **Activity** (Live stream of raw events)
- **Downloads** (Captured malware and artifacts)
- **Settings** (Cowrie configuration and UI preferences)

## Page Hierarchy

- `/` -> Redirects to Dashboard
- `/dashboard` -> `DashboardPage`
- `/sessions` -> `SessionsPage`
  - `/sessions/:id` -> `SessionDetailPage` (Contains Replay, Commands, Auth attempts for this session)
- `/activity` -> `ActivityPage`
- `/downloads` -> `DownloadsPage`
- `/settings` -> `SettingsPage`

## Component Hierarchy

The application will use Vanilla JS Web Components or simple module functions to build reusable UI elements without a framework.

```
App
 ├── NavigationBar (Sidebar)
 ├── PageHeader (Title & Breadcrumbs)
 ├── MainContentArea
      ├── DashboardView
      │    ├── StatCard (Total attacks, Unique IPs, etc.)
      │    ├── ActivityFeed (Recent events snippet)
      │    └── SessionTable (Recent sessions snippet)
      ├── SessionsView
      │    └── SessionTable (Full pagination/filtering)
      ├── SessionDetailView
      │    ├── ReplayViewer (Parses and plays TTY logs)
      │    └── EventTimeline (Chronological list of session events)
      ├── DownloadsView
      │    └── DownloadTable (Hashes, URLs, filenames)
      └── SettingsView
           └── ConfigForm (Toggle protocols, backends)
```

## Data Flow

Since this is a frontend-only MVP, data flows from mock data modules into state, and then into components.

1. **Initialization**: `main.js` bootstraps the application and initializes `router.js` and `state.js`.
2. **Data Fetching**: `api.js` is called by pages to fetch data. In MVP, `api.js` resolves promises instantly using data from `mock-data.js`.
3. **Mock Data Design**: `mock-data.js` generates realistic Cowrie JSON event structures based on the documentation (e.g., `cowrie.session.connect`, `cowrie.command.input`).
4. **Rendering**: Pages fetch data, build DOM elements using Vanilla JS (`document.createElement`, `innerHTML` for safe text), and append them to the DOM.

## State Flow

State management will be minimal and localized where possible, with a simple global state for shared data.

- **Global State (`state.js`)**:
  - Current View/Route
  - Theme preference (Dark/Light)
  - Selected timeframe (e.g., Last 24h)
- **Local State**:
  - Maintained within page modules or component classes.
  - Examples: Table sorting columns, replay playback position, active tabs in session details.
- **Events**:
  - Changes in global state (like timeframe) will dispatch custom DOM events (`CustomEvent`) that active pages listen to in order to re-fetch and re-render data.

## Architectural Decisions

1. **Vanilla JavaScript**: We strictly avoid frameworks (React, Vue) and build tools (Webpack, Vite) to ensure the platform remains incredibly lightweight, directly loadable in the browser, and easy for students to understand.
2. **Mock Data Abstraction**: By centralizing data fetching in `api.js` and isolating the `mock-data.js`, we ensure that swapping to a real REST API or WebSocket backend in the future only requires changing `api.js`. The components will not know the difference.
3. **CSS Architecture**: We use standard CSS3 with a clean structure (`base.css` for variables and resets, `layout.css` for grid/flexbox shells, `components.css` for specific widget styling). Heavy use of CSS Variables will allow for easy theming (Dark mode by default, suitable for security tools).
4. **Routing**: A simple hash-based (`#`) or History API router will intercept navigation, clean the DOM, and mount the relevant page module.
