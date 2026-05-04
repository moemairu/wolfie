'use client';

import { useEffect, useState, useCallback } from 'react';
import { Attack } from '@/lib/types';
import { getRecentAttacks } from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AttackFeed() {
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const data = await getRecentAttacks(100);
    setAttacks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <Card id="attack-feed" className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Live Attack Feed
        </h2>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse-dot" />
          <span className="text-[10px] text-[var(--text-secondary)]">Auto-refresh 10s</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-5 py-2 text-[var(--text-secondary)] font-medium">Time</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">IP</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Country</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Proto</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium">Event</th>
                <th className="text-left px-3 py-2 text-[var(--text-secondary)] font-medium pr-5">User</th>
              </tr>
            </thead>
            <tbody>
              {attacks.map((attack, index) => (
                <tr
                  key={attack.id}
                  className="border-b border-[var(--border)] border-opacity-50
                    hover:bg-[var(--bg-secondary)]
                    transition-colors duration-100"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <td className="px-5 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">
                    {timeAgo(attack.ts)}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[var(--text-primary)]">
                    {attack.src_ip}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-secondary)] whitespace-nowrap">
                    {attack.country || '—'}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge label={attack.protocol} variant="protocol" />
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge label={attack.event_type} variant="event" />
                  </td>
                  <td className="px-3 py-2.5 pr-5 font-mono text-[var(--text-secondary)]">
                    {attack.username || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
