# Wolfie Roadmap

## Completed

- [x] Basic project scaffolding (HTML/CSS/JS)
- [x] Routing mechanism
- [x] Premium dark theme UI and layouts
- [x] Deep analysis of Cowrie internals
- [x] Lightweight Relay Server (`server.py`)
- [x] Real-time SSE (Server-Sent Events) streaming
- [x] Comprehensive Dashboard statistics (success rates, top credentials)
- [x] Session detail view with chronological Command Timeline
- [x] XSS protection and URL sanitization
- [x] Mobile responsiveness (hamburger menu, collapsed sidebar)

## Future Enhancements (Backlog)

- [ ] **Data Export**: Allow exporting session logs as CSV or PCAP.
- [ ] **Alerting**: Add configurable webhooks (Discord/Slack) for specific events (e.g., successful login, file download).
- [ ] **Geomapping**: Integrate a lightweight offline GeoIP database to map attacker IPs to countries.
- [ ] **Pagination**: Implement true pagination on the REST API for very large `cowrie.json` files.
- [ ] **Authentication**: Add basic auth or a token-based login to the Relay Server to secure the dashboard.
