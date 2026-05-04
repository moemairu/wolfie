'use client';

import { useEffect, useState } from 'react';
import { CredentialCount } from '@/lib/types';
import { getTopUsernames, getTopPasswords } from '@/lib/api';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/components/layout/DashboardContext';
import { PanelProps } from './PanelWrapper';

export default function TopCredentials({ colSpan }: PanelProps) {
  const [usernames, setUsernames] = useState<CredentialCount[]>([]);
  const [passwords, setPasswords] = useState<CredentialCount[]>([]);
  const [loading, setLoading] = useState(true);
  const { timeRange } = useDashboard();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTopUsernames(10, timeRange),
      getTopPasswords(10, timeRange)
    ]).then(([users, passes]) => {
      setUsernames(users);
      setPasswords(passes);
      setLoading(false);
    });
  }, [timeRange]);

  const maxUser = usernames.length > 0 ? usernames[0].count : 1;
  const maxPass = passwords.length > 0 ? passwords[0].count : 1;

  const isWide = colSpan >= 6;

  const List = ({ title, data, max }: { title: string, data: CredentialCount[], max: number }) => (
    <div className="flex-1">
      <h3 className="text-xs font-medium text-[var(--text-secondary)] mb-3">{title}</h3>
      <div className="space-y-2">
        {data.slice(0, isWide ? 10 : 5).map((item, i) => (
          <div key={item.value} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-[var(--text-primary)] truncate max-w-[120px]">
                {item.value}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {item.count}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg-primary)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  backgroundColor: i < 3 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  opacity: i < 3 ? 1 : 0.4,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card id="top-credentials" className="p-5 h-full overflow-hidden flex flex-col">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 shrink-0">
        Top Credentials
      </h2>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className={`flex ${isWide ? 'flex-row gap-6' : 'flex-col gap-4'} flex-1 overflow-hidden`}>
          <List title="Usernames" data={usernames} max={maxUser} />
          <List title="Passwords" data={passwords} max={maxPass} />
        </div>
      )}
    </Card>
  );
}
