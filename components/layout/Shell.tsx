'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('wolfie-sidebar-collapsed');
    if (stored === 'true') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('wolfie-sidebar-collapsed', String(newState));
  };

  // Ensure hydration match
  const sidebarWidth = isSidebarCollapsed ? '72px' : '240px';

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: mounted ? sidebarWidth : '240px' }}
      >
        <Header />
        <main className="flex-1 bg-[var(--bg-primary)] rounded-tl-2xl border-t border-l border-[var(--border)] overflow-hidden shadow-sm relative">
          <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
