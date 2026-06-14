# Contributing to Wolfie 🐺

First off, thank you for considering contributing to Wolfie! It's people like you that make open-source software great.

## 🧠 Our Philosophy: Zero-Dependency

Before you write any code, it is critical to understand the core philosophy of this project: **Wolfie is a zero-dependency, lightweight monitoring tool.**

We strictly enforce the following rules:
- **No Build Tools**: Do NOT add `npm`, `yarn`, `webpack`, `vite`, `gulp`, or any other Node.js build pipelines.
- **No Frontend Frameworks**: The frontend must remain 100% Vanilla JS, HTML, and CSS. Do not introduce React, Vue, Svelte, Tailwind, or Bootstrap.
- **No Python Dependencies**: The relay server (`server.py`) must only use the Python Standard Library. Do not add `requirements.txt` or `pip install` dependencies (e.g., no Flask, no FastAPI, no requests).

We want anyone to be able to clone this repository and run it instantly without running `npm install` or setting up a virtual environment.

## 💻 Local Development Setup

Because there are no build tools, setting up the development environment is extremely simple:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/moemairu/wolfie.git
   cd wolfie
   ```

2. **Start the Relay Server (Development Mode):**
   Run the Python server without setting the `COWRIE_LOG` environment variable. It will automatically fallback to reading `data/cowrie.json` (the demo data included in the repository).
   ```bash
   python3 server.py
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8080`.

4. **Edit and Refresh:**
   Modify the `.js`, `.css`, or `.html` files in your editor, then simply refresh your browser to see the changes. No hot-reloading pipeline is needed.

## 🏗️ Code Structure

- `server.py`: The Python HTTP server, REST API, and SSE streamer.
- `index.html`: The main entry point.
- `css/`: Pure CSS stylesheets (using CSS variables for themes).
- `js/main.js`: Application bootstrap and SSE initialization.
- `js/router.js`: Custom hash-based router.
- `js/api.js`: Data fetching and cache management.
- `js/utils.js`: Shared utility functions (especially `escapeHtml` for XSS protection).
- `js/components/`: Reusable UI elements (functions returning HTML strings).
- `js/pages/`: Main views tied to routes.

## 🛡️ Security Requirement (XSS)

Since this dashboard displays raw input from malicious actors (honeypot attackers), **you must sanitize all data** before rendering it into the DOM.
- Always use the `escapeHtml(str)` function from `js/utils.js` when interpolating attacker data (IPs, usernames, passwords, commands, filenames) into HTML strings.
- Always use `sanitizeUrl(url)` for any anchor `href` tags derived from attacker data to prevent `javascript:` injection.

## 📝 Pull Request Process

1. Fork the repository and create your branch from `master`.
2. Ensure your code adheres to the zero-dependency philosophy.
3. Test your changes locally using the demo data.
4. Update the `docs/DOCUMENTATION.md` file if your change introduces new architecture or features.
5. Submit your Pull Request with a clear description of the problem and your solution.

Thank you for contributing!
