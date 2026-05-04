'use client';

import { useEffect, useState } from 'react';
import { CountryCount } from '@/lib/types';
import { getTopCountries } from '@/lib/api';
import Card from '@/components/ui/Card';
import { useDashboard } from '@/components/layout/DashboardContext';

export default function GeoTable() {
  const [data, setData] = useState<CountryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const { timeRange } = useDashboard();

  useEffect(() => {
    getTopCountries(10, timeRange).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [timeRange]);

  const maxCount = data.length > 0 ? data[0].count : 1;

  return (
    <Card id="geo-table" className="p-5 h-full flex flex-col overflow-hidden">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4 shrink-0">
        Top Countries
        <span className="text-xs font-normal text-[var(--text-secondary)] ml-2">
          By attack volume
        </span>
      </h2>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 pb-1">
          {data.map((country, i) => (
            <div key={country.country} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {country.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {country.count}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] w-8 text-right">
                    {country.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-1 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(country.count / maxCount) * 100}%`,
                    background: i === 0
                      ? 'linear-gradient(90deg, var(--text-primary), var(--text-secondary))'
                      : i < 3
                      ? 'var(--text-secondary)'
                      : 'var(--border)',
                    opacity: i < 3 ? 1 : 0.6,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
