'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { TopIP } from '@/lib/types';
import { getTopIPs } from '@/lib/api';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/components/layout/DashboardContext';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: TopIP }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-lg border border-[var(--border)] shadow-lg"
      style={{ backgroundColor: 'var(--bg-card)' }}
    >
      <p className="text-xs font-mono text-[var(--text-primary)]">{d.ip}</p>
      <p className="text-[11px] text-[var(--text-secondary)]">
        {d.country} · {d.count} attacks
      </p>
    </div>
  );
}

const BAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--border)',
  'var(--border)',
  'var(--border)',
  'var(--border)',
  'var(--border)',
];

export default function TopIPs() {
  const [data, setData] = useState<TopIP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopIPs(10).then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return (
    <Card id="top-ips" className="p-5 h-full">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Top Attacker IPs
        <span className="text-xs font-normal text-[var(--text-secondary)] ml-2">
          Last 24h
        </span>
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
          >
            <XAxis
              type="number"
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="ip"
              tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={BAR_COLORS[index] || BAR_COLORS[BAR_COLORS.length - 1]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
