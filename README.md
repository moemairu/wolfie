<div align="center">
  <img src="https://raw.githubusercontent.com/moemairu/wolfie/master/docs/dashboard-preview.png" width="800" alt="Wolfie Dashboard">
  
  <h1>Wolfie 🐺</h1>

  <p><b>A lightweight, real-time, zero-dependency monitoring dashboard for Cowrie SSH/Telnet honeypots.</b></p>

  <p>
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#previews">Previews</a> •
    <a href="#installation">Installation</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#development">Development</a> •
    <a href="#license">License</a>
  </p>

  <p>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/Language-JavaScript-f7df1e?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"></a>
    <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Language-Python_3-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"></a>
    <a href="https://kernel.org"><img src="https://img.shields.io/badge/Platform-Linux-yellow?style=flat-square&logo=linux&logoColor=white" alt="Linux"></a>
    <a href="#license"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"></a>
  </p>
</div>

---

<h2 id="about">🎯 What is Wolfie?</h2>

Cowrie is a brilliant honeypot, but its native `NDJSON` log output is designed for heavy SIEMs like Splunk or ELK. Setting up an entire data pipeline just to monitor basic attacker activity is often overkill.

**Wolfie** bridges this gap. It provides a pure Vanilla JS frontend coupled with a tiny Python relay server that tails your Cowrie logs in real-time. 

❌ No npm, no Webpack, no React, no databases.  
✅ Just simple, beautiful insights.

<h2 id="features">✨ Features</h2>

- **Zero Build Tools**: 100% Vanilla JS, HTML, and CSS.
- **Zero Dependencies**: The relay server uses only the Python Standard Library.
- **Real-time Streaming**: Uses Server-Sent Events (SSE) to push new attacks to your browser instantly.
- **Fileless DB**: Reads directly from Cowrie's native NDJSON output.
- **Terminal Replay**: Chronological command timelines reconstructed from event logs.
- **Rich Insights**: Tracks success rates, top passwords, active sessions, and downloaded malware.

<h2 id="previews">📸 Previews</h2>

| Dashboard | Real-Time Activity |
| :---: | :---: |
| <img src="docs/dashboard-preview.png" width="400"> | <img src="docs/activity-preview.png" width="400"> |
| **Sessions Overview** | **Malware Downloads** |
| <img src="docs/sessions-preview.png" width="400"> | <img src="docs/download-preview.png" width="400"> |

<h2 id="installation">🚀 Installation</h2>

**1. Clone the repository** (ideally on the same server running Cowrie):
```bash
git clone https://github.com/moemairu/wolfie.git
cd wolfie
```

**2. Start the Relay Server**:

Point `COWRIE_LOG` to the absolute path of your Cowrie JSON log. By default, it will look for `data/cowrie.json`.

```bash
COWRIE_LOG=/opt/cowrie/var/log/cowrie/cowrie.json python3 server.py
```

*Optional Environment Variables:*
- `WOLFIE_PORT`: Change the port (default 8080)
- `WOLFIE_HOST`: Change the bind address (default 0.0.0.0)

**3. Access the Dashboard**:
Open `http://your-server-ip:8080` in your browser.

<h2 id="architecture">🏗️ Architecture</h2>

Wolfie relies on a dual-layer architecture:

1. **The Relay Server (`server.py`)**: A tiny, multi-threaded Python HTTP server that serves static files, provides REST API endpoints, and maintains an SSE stream.
2. **The Frontend (`js/`, `css/`)**: A component-based Vanilla JS application that consumes the REST API for initial state and the SSE stream for live updates.

<h2 id="development">💻 Development</h2>

Simply edit the JS/CSS files and refresh your browser. To run with included demo data:
```bash
python3 server.py
```

<h2 id="license">📄 License</h2>

**MIT License**

Copyright (c) 2026 Wolfie Contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
