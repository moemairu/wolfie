'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TimeRange = '1h' | '24h' | '3d' | '7d' | '30d';

export interface PanelState {
  visible: boolean;
  colSpan: number;
  rowSpan: number;
}

export type DashboardLayout = Record<string, PanelState>;

export const DEFAULT_LAYOUT: DashboardLayout = {
  'stat-total': { visible: true, colSpan: 3, rowSpan: 4 },
  'stat-ips': { visible: true, colSpan: 3, rowSpan: 4 },
  'stat-logins': { visible: true, colSpan: 3, rowSpan: 4 },
  'stat-commands': { visible: true, colSpan: 3, rowSpan: 4 },
  'attack-chart': { visible: true, colSpan: 8, rowSpan: 9 },
  'protocol-pie': { visible: true, colSpan: 4, rowSpan: 9 },
  'top-ips': { visible: true, colSpan: 6, rowSpan: 10 },
  'top-credentials': { visible: true, colSpan: 6, rowSpan: 10 },
  'geo-table': { visible: true, colSpan: 4, rowSpan: 12 },
  'attack-feed': { visible: true, colSpan: 8, rowSpan: 12 },
};

interface DashboardContextType {
  timeRange: TimeRange;
  setTimeRange: (tr: TimeRange) => void;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  layout: DashboardLayout;
  updatePanel: (id: string, updates: Partial<PanelState>) => void;
  resetLayout: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayoutState] = useState<DashboardLayout>(DEFAULT_LAYOUT);

  useEffect(() => {
    const saved = localStorage.getItem('wolfie_dashboard_layout_v3');
    if (saved) {
      try {
        setLayoutState(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const updatePanel = (id: string, updates: Partial<PanelState>) => {
    setLayoutState(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...updates } };
      localStorage.setItem('wolfie_dashboard_layout_v3', JSON.stringify(next));
      return next;
    });
  };

  const resetLayout = () => {
    setLayoutState(DEFAULT_LAYOUT);
    localStorage.removeItem('wolfie_dashboard_layout_v3');
  };

  return (
    <DashboardContext.Provider
      value={{
        timeRange,
        setTimeRange,
        isEditMode,
        setIsEditMode,
        layout,
        updatePanel,
        resetLayout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
