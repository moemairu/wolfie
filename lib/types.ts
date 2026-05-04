/* ========================================
   wolfie — Type Definitions
   Matches the PostgreSQL attacks table schema
   ======================================== */

export interface Attack {
  id: number;
  ts: string; // ISO 8601 timestamp
  src_ip: string;
  src_port: number | null;
  dst_port: number | null;
  protocol: Protocol;
  event_type: EventType;
  username: string | null;
  password: string | null;
  command: string | null;
  country: string | null;
  city: string | null;
  asn: string | null;
  session_id: string | null;
}

export type Protocol = 'ssh' | 'telnet' | 'http' | 'ftp';

export type EventType =
  | 'login.failed'
  | 'login.success'
  | 'command.input'
  | 'session.closed';

/** Row 1 stat cards */
export interface DashboardStats {
  totalAttacks: number;
  totalAttacksDelta: number; // percentage change vs previous period
  uniqueIPs: number;
  uniqueIPsDelta: number;
  successfulLogins: number;
  successfulLoginsDelta: number;
  commandsExecuted: number;
  commandsExecutedDelta: number;
}

/** Time-series bucket for attack volume chart */
export interface TimeSeriesBucket {
  time: string; // ISO 8601
  count: number;
}

/** Aggregated IP stats */
export interface TopIP {
  ip: string;
  count: number;
  country: string | null;
}

/** Credential frequency */
export interface CredentialCount {
  value: string;
  count: number;
}

/** Protocol distribution */
export interface ProtocolCount {
  protocol: Protocol;
  count: number;
  percentage: number;
}

/** Country stats */
export interface CountryCount {
  country: string;
  count: number;
  flag: string; // emoji flag
  percentage: number;
}
