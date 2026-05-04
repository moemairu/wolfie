'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/lib/types';
import { getDashboardStats } from '@/lib/api';
import StatCard from '@/components/ui/StatCard';
import AttackChart from '@/components/dashboard/AttackChart';
import ProtocolPie from '@/components/dashboard/ProtocolPie';
import TopIPs from '@/components/dashboard/TopIPs';
import TopCredentials from '@/components/dashboard/TopCredentials';
import GeoTable from '@/components/dashboard/GeoTable';
import AttackFeed from '@/components/dashboard/AttackFeed';
import { useDashboard } from '@/components/layout/DashboardContext';
import { PanelWrapper } from '@/components/dashboard/PanelWrapper';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { timeRange, layout, updatePanel } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getDashboardStats(timeRange).then(setStats);
  }, [timeRange]);

  const handleResize = (id: string, colSpan: number, rowSpan: number) => {
    updatePanel(id, { colSpan, rowSpan });
  };

  if (!mounted) return null;

  return (
    <div className="p-4 relative min-h-screen">
      <div className="dashboard-grid relative">
        <div className="grid-overlay">
          {Array.from({ length: 360 }).map((_, i) => <div key={i} />)}
        </div>

        {layout['stat-total']?.visible && (
          <PanelWrapper {...layout['stat-total']} panelId="stat-total" onResize={handleResize}>
            <StatCard
              id="stat-total-attacks"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2L2 7l8 5 8-5-8-5z" />
                  <path d="M2 13l8 5 8-5" />
                  <path d="M2 10l8 5 8-5" />
                </svg>
              }
              label="Total Attacks"
              value={stats?.totalAttacks ?? '—'}
              delta={stats?.totalAttacksDelta ?? 0}
            />
          </PanelWrapper>
        )}
        
        {layout['stat-ips']?.visible && (
          <PanelWrapper {...layout['stat-ips']} panelId="stat-ips" onResize={handleResize}>
            <StatCard
              id="stat-unique-ips"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="10" r="8" />
                  <path d="M2 10h16M10 2a12 12 0 0 1 3 8 12 12 0 0 1-3 8M10 2a12 12 0 0 0-3 8 12 12 0 0 0 3 8" />
                </svg>
              }
              label="Unique IPs"
              value={stats?.uniqueIPs ?? '—'}
              delta={stats?.uniqueIPsDelta ?? 0}
            />
          </PanelWrapper>
        )}

        {layout['stat-logins']?.visible && (
          <PanelWrapper {...layout['stat-logins']} panelId="stat-logins" onResize={handleResize}>
            <StatCard
              id="stat-successful-logins"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 11V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v5" />
                  <path d="M2 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                  <circle cx="10" cy="10" r="2" />
                </svg>
              }
              label="Successful Logins"
              value={stats?.successfulLogins ?? '—'}
              delta={stats?.successfulLoginsDelta ?? 0}
              accent="danger"
            />
          </PanelWrapper>
        )}

        {layout['stat-commands']?.visible && (
          <PanelWrapper {...layout['stat-commands']} panelId="stat-commands" onResize={handleResize}>
            <StatCard
              id="stat-commands"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="16" height="14" rx="2" />
                  <path d="M6 9l3 2-3 2M11 13h3" />
                </svg>
              }
              label="Commands Executed"
              value={stats?.commandsExecuted ?? '—'}
              delta={stats?.commandsExecutedDelta ?? 0}
            />
          </PanelWrapper>
        )}

        {layout['attack-chart']?.visible && (
          <PanelWrapper {...layout['attack-chart']} panelId="attack-chart" onResize={handleResize}>
            <AttackChart />
          </PanelWrapper>
        )}

        {layout['protocol-pie']?.visible && (
          <PanelWrapper {...layout['protocol-pie']} panelId="protocol-pie" onResize={handleResize}>
            <ProtocolPie />
          </PanelWrapper>
        )}

        {layout['top-ips']?.visible && (
          <PanelWrapper {...layout['top-ips']} panelId="top-ips" onResize={handleResize}>
            <TopIPs />
          </PanelWrapper>
        )}

        {layout['top-credentials']?.visible && (
          <PanelWrapper {...layout['top-credentials']} panelId="top-credentials" onResize={handleResize}>
            <TopCredentials 
              panelId="top-credentials"
              colSpan={layout['top-credentials'].colSpan}
              rowSpan={layout['top-credentials'].rowSpan}
              onResize={handleResize}
            />
          </PanelWrapper>
        )}

        {layout['geo-table']?.visible && (
          <PanelWrapper {...layout['geo-table']} panelId="geo-table" onResize={handleResize}>
            <GeoTable />
          </PanelWrapper>
        )}

        {layout['attack-feed']?.visible && (
          <PanelWrapper {...layout['attack-feed']} panelId="attack-feed" onResize={handleResize}>
            <AttackFeed />
          </PanelWrapper>
        )}
      </div>
    </div>
  );
}
