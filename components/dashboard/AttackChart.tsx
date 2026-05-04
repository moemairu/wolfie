'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TimeSeriesBucket } from '@/lib/types';
import { getAttackTimeSeries } from '@/lib/api';
import Card from '@/components/ui/Card';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg border border-[var(--border)] shadow-lg"
      style={{ backgroundColor: 'var(--bg-card)' }}
    >
      <p className="text-[11px] text-[var(--text-secondary)] mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-[var(--text-primary)]">
        {payload[0].value} attacks
      </p>
    </div>
  );
}

import { useDashboard } from '@/components/layout/DashboardContext';

export default function AttackChart() {
  const [data, setData] = useState<TimeSeriesBucket[]>([]);
  const [loading, setLoading] = useState(true);
  const { timeRange } = useDashboard();

  useEffect(() => {
    setLoading(true);
    getAttackTimeSeries(timeRange).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [timeRange]);

  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <Card id="attack-chart" className="p-5 h-full">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Attack Volume
        <span className="text-xs font-normal text-[var(--text-secondary)] ml-2">
          Last {timeRange}
        </span>
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-[280px]">
          <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(formatted.length / 6)}
            />
            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#attackGradient)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
