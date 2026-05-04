'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ProtocolCount } from '@/lib/types';
import { getProtocolDistribution } from '@/lib/api';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/components/layout/DashboardContext';

const PROTOCOL_COLORS: Record<string, string> = {
  ssh: 'var(--chart-1)',
  telnet: 'var(--chart-2)',
  http: 'var(--chart-3)',
  ftp: 'var(--chart-4)',
};

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ProtocolCount }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="px-3 py-2 rounded-lg border border-[var(--border)] shadow-lg"
      style={{ backgroundColor: 'var(--bg-card)' }}
    >
      <p className="text-xs font-semibold text-[var(--text-primary)] uppercase">
        {d.protocol}
      </p>
      <p className="text-[11px] text-[var(--text-secondary)]">
        {d.count} attacks · {d.percentage}%
      </p>
    </div>
  );
}

export default function ProtocolPie() {
  const [data, setData] = useState<ProtocolCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProtocolDistribution().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return (
    <Card id="protocol-pie" className="p-5 h-full">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Protocol Distribution
      </h2>

      {loading ? (
        <div className="flex items-center justify-center h-[280px]">
          <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
                animationDuration={1000}
                animationEasing="ease-out"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.protocol}
                    fill={PROTOCOL_COLORS[entry.protocol] || '#888'}
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
            {data.map((entry) => (
              <div key={entry.protocol} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: PROTOCOL_COLORS[entry.protocol] }}
                />
                <span className="text-xs text-[var(--text-secondary)] uppercase font-medium">
                  {entry.protocol}
                </span>
                <span className="text-xs text-[var(--text-primary)] font-semibold">
                  {entry.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
