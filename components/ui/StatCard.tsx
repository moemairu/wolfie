import { ReactNode } from 'react';

interface StatCardProps {
  id: string;
  icon: ReactNode;
  label: string;
  value: string | number;
  delta: number; // percentage
  deltaLabel?: string;
  accent?: 'default' | 'danger';
}

export default function StatCard({
  id,
  icon,
  label,
  value,
  delta,
  deltaLabel = 'vs prev 24h',
  accent = 'default',
}: StatCardProps) {
  const isPositive = delta >= 0;
  const isDanger = accent === 'danger';

  return (
    <div
      id={id}
      className="
        h-full flex flex-col justify-between
        group relative overflow-hidden
        rounded-xl border border-[var(--border)]
        bg-[var(--bg-card)] p-5
        shadow-[var(--shadow)]
        transition-all duration-300
        hover:shadow-[var(--shadow-lg)]
        hover:border-[var(--accent)]
      "
    >
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <span className="w-5 h-5">{icon}</span>
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span
            className={`text-3xl font-bold tracking-tight ${
              isDanger && Number(value) > 0
                ? 'text-[var(--danger)]'
                : 'text-[var(--text-primary)]'
            }`}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>

          <div className="flex items-center gap-1 text-xs">
            <span
              className={`flex items-center gap-0.5 font-semibold ${
                isPositive ? 'text-[var(--danger)]' : 'text-[var(--success)]'
              }`}
            >
              {isPositive ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2.5L10 7.5H2L6 2.5Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 9.5L2 4.5H10L6 9.5Z" fill="currentColor" />
                </svg>
              )}
              {Math.abs(delta)}%
            </span>
            <span className="text-[var(--text-secondary)]">{deltaLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
