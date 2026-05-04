'use client';

import ThemeToggle from '@/components/ui/ThemeToggle';
import { useDashboard, TimeRange } from '@/components/layout/DashboardContext';

const WIDGET_TITLES: Record<string, string> = {
  'stat-total': 'Total Attacks Stat',
  'stat-ips': 'Unique IPs Stat',
  'stat-logins': 'Successful Logins Stat',
  'stat-commands': 'Commands Executed Stat',
  'attack-chart': 'Attack Volume Chart',
  'protocol-pie': 'Protocol Distribution Pie',
  'top-ips': 'Top Attacker IPs',
  'top-credentials': 'Top Credentials',
  'geo-table': 'Geo Intelligence',
  'attack-feed': 'Live Attack Feed',
};

export default function Header() {
  const { timeRange, setTimeRange, isEditMode, setIsEditMode, layout, updatePanel, resetLayout } = useDashboard();

  return (
    <div className="flex flex-col z-30 sticky top-0">
      <header
        id="header"
        className="
          flex items-center justify-between
          h-14 px-6
          bg-[var(--bg-secondary)]
        "
      >
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold text-[var(--text-primary)]">
            Dashboard
          </h1>
          
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="bg-transparent text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer outline-none border-none appearance-none transition-colors"
          >
            <option value="1h" className="bg-[var(--bg-card)]">Last 1 hour</option>
            <option value="24h" className="bg-[var(--bg-card)]">Last 24 hours</option>
            <option value="3d" className="bg-[var(--bg-card)]">Last 3 days</option>
            <option value="7d" className="bg-[var(--bg-card)]">Last 7 days</option>
            <option value="30d" className="bg-[var(--bg-card)]">Last 30 days</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* Customize Mode Toggle */}
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-3 py-1 text-[13px] font-medium rounded transition-colors ${
              isEditMode 
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                : 'bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)]'
            }`}
          >
            {isEditMode ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Done
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
                Customize
              </>
            )}
          </button>

          {/* Live pulse indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] hidden sm:flex">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[var(--success)] animate-ping opacity-75" />
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Live</span>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Customization Drawer */}
      {isEditMode && (
        <div className="w-full bg-[var(--bg-secondary)] border-b border-[var(--border)] px-[14px] py-[10px] animate-fade-in shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Toggle widgets to show/hide on dashboard</span>
            <button 
              onClick={resetLayout}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline decoration-[var(--border)] underline-offset-2 transition-colors"
            >
              Reset to default
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(WIDGET_TITLES).map(([id, title]) => {
              const isVisible = layout[id]?.visible ?? true;
              return (
                <button
                  key={id}
                  onClick={() => updatePanel(id, { visible: !isVisible })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex items-center gap-1.5 ${
                    isVisible 
                      ? 'bg-[var(--accent)] text-[var(--bg-primary)] border-[var(--accent)] shadow-sm'
                      : 'bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  {isVisible && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                  {title}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
