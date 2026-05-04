/* ========================================
   wolfie — API Layer
   All data-fetching functions.
   Currently returns mock data.
   Swap to real REST API calls later.
   ======================================== */

import {
  Attack,
  DashboardStats,
  TimeSeriesBucket,
  TopIP,
  CredentialCount,
  ProtocolCount,
  CountryCount,
} from './types';
import { mockAttacks, COUNTRY_FLAGS } from './mockData';

// ── Helpers ────────────────────────────────────────────

function attacksInWindow(attacks: Attack[], hoursAgo: number): Attack[] {
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return attacks.filter(a => new Date(a.ts) >= cutoff);
}

function parseTimeRange(tr: string): number {
  if (tr === '1h') return 1;
  if (tr === '24h') return 24;
  if (tr === '3d') return 72;
  if (tr === '7d') return 168;
  if (tr === '30d') return 720;
  return 24;
}

// ── API functions ──────────────────────────────────────

/** Fetch the latest attacks (for live feed) */
export async function getRecentAttacks(limit: number = 100): Promise<Attack[]> {
  // TODO: Replace with fetch('/api/attacks?limit=...')
  return mockAttacks.slice(0, limit);
}

/** Fetch dashboard stat cards */
export async function getDashboardStats(timeRange: string = '24h'): Promise<DashboardStats> {
  const hours = parseTimeRange(timeRange);
  const lastWindow = attacksInWindow(mockAttacks, hours);
  const prevWindow = mockAttacks.filter(a => {
    const ts = new Date(a.ts).getTime();
    const now = Date.now();
    return ts >= now - (hours * 2) * 3600000 && ts < now - hours * 3600000;
  });

  const totalAttacks = lastWindow.length;
  const prevTotal = prevWindow.length || 1;
  const totalAttacksDelta = Math.round(((totalAttacks - prevTotal) / prevTotal) * 100);

  const uniqueIPs = new Set(lastWindow.map(a => a.src_ip)).size;
  const prevIPs = new Set(prevWindow.map(a => a.src_ip)).size || 1;
  const uniqueIPsDelta = Math.round(((uniqueIPs - prevIPs) / prevIPs) * 100);

  const successfulLogins = lastWindow.filter(a => a.event_type === 'login.success').length;
  const prevSuccess = prevWindow.filter(a => a.event_type === 'login.success').length || 0;
  const successfulLoginsDelta = prevSuccess === 0 ? (successfulLogins > 0 ? 100 : 0)
    : Math.round(((successfulLogins - prevSuccess) / prevSuccess) * 100);

  const commandsExecuted = lastWindow.filter(a => a.event_type === 'command.input').length;
  const prevCommands = prevWindow.filter(a => a.event_type === 'command.input').length || 1;
  const commandsExecutedDelta = Math.round(((commandsExecuted - prevCommands) / prevCommands) * 100);

  return {
    totalAttacks,
    totalAttacksDelta,
    uniqueIPs,
    uniqueIPsDelta,
    successfulLogins,
    successfulLoginsDelta,
    commandsExecuted,
    commandsExecutedDelta,
  };
}

/** Fetch time-series data for attack volume chart */
export async function getAttackTimeSeries(timeRange: string = '24h'): Promise<TimeSeriesBucket[]> {
  const hours = parseTimeRange(timeRange);
  const lastWindow = attacksInWindow(mockAttacks, hours);
  const now = Date.now();
  
  // Dynamic bucket size based on time range
  let bucketSize = 5 * 60 * 1000; // 5 min default for 24h
  if (hours <= 1) bucketSize = 60 * 1000; // 1 min for 1h
  else if (hours > 24 && hours <= 72) bucketSize = 30 * 60 * 1000; // 30 min for 3d
  else if (hours > 72) bucketSize = 2 * 60 * 60 * 1000; // 2 hours for >3d

  const bucketCount = (hours * 60 * 60 * 1000) / bucketSize;
  const buckets: TimeSeriesBucket[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const bucketEnd = now - i * bucketSize;
    const bucketStart = bucketEnd - bucketSize;
    const count = lastWindow.filter(a => {
      const ts = new Date(a.ts).getTime();
      return ts >= bucketStart && ts < bucketEnd;
    }).length;

    buckets.push({
      time: new Date(bucketStart).toISOString(),
      count,
    });
  }

  return buckets.reverse();
}

/** Fetch top attacker IPs */
export async function getTopIPs(limit: number = 10, timeRange: string = '24h'): Promise<TopIP[]> {
  const hours = parseTimeRange(timeRange);
  const lastWindow = attacksInWindow(mockAttacks, hours);
  const counts = new Map<string, { count: number; country: string | null }>();

  for (const a of lastWindow) {
    const existing = counts.get(a.src_ip);
    if (existing) {
      existing.count++;
    } else {
      counts.set(a.src_ip, { count: 1, country: a.country });
    }
  }

  return Array.from(counts.entries())
    .map(([ip, data]) => ({ ip, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Fetch top usernames */
export async function getTopUsernames(limit: number = 10, timeRange: string = '24h'): Promise<CredentialCount[]> {
  const hours = parseTimeRange(timeRange);
  const lastWindow = attacksInWindow(mockAttacks, hours);
  const counts = new Map<string, number>();

  for (const a of lastWindow) {
    if (a.username) {
      counts.set(a.username, (counts.get(a.username) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Fetch top passwords */
export async function getTopPasswords(limit: number = 10, timeRange: string = '24h'): Promise<CredentialCount[]> {
  const hours = parseTimeRange(timeRange);
  const lastWindow = attacksInWindow(mockAttacks, hours);
  const counts = new Map<string, number>();

  for (const a of lastWindow) {
    if (a.password) {
      counts.set(a.password, (counts.get(a.password) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Fetch protocol distribution */
export async function getProtocolDistribution(timeRange: string = '24h'): Promise<ProtocolCount[]> {
  const hours = parseTimeRange(timeRange);
  const lastWindow = attacksInWindow(mockAttacks, hours);
  const counts = new Map<string, number>();

  for (const a of lastWindow) {
    counts.set(a.protocol, (counts.get(a.protocol) || 0) + 1);
  }

  const total = lastWindow.length || 1;

  return Array.from(counts.entries())
    .map(([protocol, count]) => ({
      protocol: protocol as Attack['protocol'],
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

/** Fetch top countries */
export async function getTopCountries(limit: number = 10, timeRange: string = '24h'): Promise<CountryCount[]> {
  const hours = parseTimeRange(timeRange);
  const lastWindow = attacksInWindow(mockAttacks, hours);
  const counts = new Map<string, number>();

  for (const a of lastWindow) {
    if (a.country) {
      counts.set(a.country, (counts.get(a.country) || 0) + 1);
    }
  }

  const total = lastWindow.length || 1;

  return Array.from(counts.entries())
    .map(([country, count]) => ({
      country,
      count,
      flag: COUNTRY_FLAGS[country] || '🏳️',
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
