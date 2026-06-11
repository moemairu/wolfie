# Wolfie MVP Roadmap

Based on the Cowrie documentation and event catalog, this roadmap defines the priority of features for the Wolfie frontend MVP. Priorities are based on their value to the target audience (security students, homelab operators) and their direct reliance on Cowrie's core capabilities.

## High Priority (MVP Core)

These features provide the most immediate value for monitoring and understanding honeypot activity.

1. **Dashboard Overview**
   - **Why**: Provides a quick summary of honeypot health and top-level metrics (total attacks, unique IPs, successful logins) to instantly answer "What is happening?".
2. **Live Activity Feed**
   - **Why**: Translates events like `cowrie.session.connect`, `cowrie.login.success`, and `cowrie.command.input` into a readable real-time stream.
3. **Sessions List & Details**
   - **Why**: Grouping events by the shared `session` attribute is how Cowrie tracks an attacker's lifecycle. Exploring a specific session is critical for analysis.
4. **Session Replay**
   - **Why**: Visualizing the `ttylog` from `cowrie.log.closed` is the most effective way to understand attacker behavior, as it shows exactly what the attacker saw and did.
5. **Downloads / Artifacts**
   - **Why**: Tracking `cowrie.session.file_download` and `cowrie.session.file_upload` events. Attackers frequently download malware payloads. Capturing these hashes and URLs is essential for threat analysis.
6. **Settings (Configuration Overview)**
   - **Why**: Viewing (and later editing) the active configuration (`cowrie.cfg` settings like enabled protocols and backends) helps the user ensure their honeypot is configured correctly.

## Medium Priority

These features add depth to analysis but are secondary to the core lifecycle of a session.

1. **Commands Catalog**
   - **Why**: Aggregating all `cowrie.command.input` events to find the most common commands executed across *all* sessions. Useful, but can initially be explored within individual sessions.
2. **Authentication Attempts**
   - **Why**: Aggregating `cowrie.login.failed` to build leaderboards of top brute-forced usernames and passwords.
3. **Client Information**
   - **Why**: Analyzing `cowrie.client.version`, `cowrie.client.kex`, and `hassh` fingerprints. This is advanced analysis useful for tracking specific botnets, but less critical for a basic overview.

## Low Priority (Future Releases)

These features either require third-party integration or are outside the core Cowrie event loop.

1. **GeoIP Mapping**
   - **Why**: Visualizing attacker origin requires a MaxMind or similar database. While visually appealing, it adds complexity that is not strictly necessary for an MVP.
2. **Threat Intelligence Integration**
   - **Why**: While Cowrie supports a VirusTotal output module (`cowrie.virustotal.scanfile`), building complex UI for AV reports is better left for later phases once the core log viewing is stable.
3. **Third-party Integrations**
   - **Why**: Forwarding logs to Discord, Slack, or ELK is handled by Cowrie's backend plugins. The Wolfie frontend doesn't need to manage this directly beyond providing simple configuration toggles.
