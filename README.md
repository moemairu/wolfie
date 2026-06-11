# Wolfie

Wolfie is a lightweight, self-hosted management and monitoring platform for [Cowrie honeypots](https://github.com/cowrie/cowrie). It provides a simple, dependency-free interface to understand attacker behavior, view live activity, and explore recorded sessions.

## Architecture
This project is built from scratch using pure HTML5, CSS3, and Vanilla JavaScript (ES Modules). It intentionally avoids heavy frameworks (like React or Vue) and build tools (like Webpack or Vite) to remain simple, fast, and easy to understand for security students and homelab operators.

## Features (MVP)
- **Dashboard Overview:** High-level metrics on honeypot activity.
- **Sessions & Details:** Deep dive into individual attacker sessions, including a visual TTY replay.
- **Live Activity:** Stream of raw honeypot events.
- **Downloads:** Tracking of malware payloads and artifacts dropped by attackers.

## Running Locally
Since there is no build step, you can simply serve the directory with any static HTTP server. For example, using Python:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

## Documentation
- [Cowrie Analysis & Mapping](docs/cowrie-analysis.md)
- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
