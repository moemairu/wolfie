'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1" />
        <rect x="10.5" y="1.5" width="6" height="6" rx="1" />
        <rect x="1.5" y="10.5" width="6" height="6" rx="1" />
        <rect x="10.5" y="10.5" width="6" height="6" rx="1" />
      </svg>
    ),
    enabled: true,
  },
  {
    label: 'Attack Log',
    href: '/attacks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4h14M2 9h14M2 14h10" />
      </svg>
    ),
    enabled: true,
  },
  {
    label: 'Credentials',
    href: '/credentials',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="14" height="9" rx="2" />
        <path d="M5 7V5a4 4 0 0 1 8 0v2" />
        <circle cx="9" cy="12" r="1.5" />
      </svg>
    ),
    enabled: false,
  },
  {
    label: 'Geo Intelligence',
    href: '/geo',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="7.5" />
        <path d="M1.5 9h15M9 1.5a11.5 11.5 0 0 1 3 7.5 11.5 11.5 0 0 1-3 7.5M9 1.5a11.5 11.5 0 0 0-3 7.5 11.5 11.5 0 0 0 3 7.5" />
      </svg>
    ),
    enabled: false,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="2.5" />
        <path d="M14.7 11.1a1.2 1.2 0 0 0 .24 1.32l.04.04a1.44 1.44 0 1 1-2.04 2.04l-.04-.04a1.2 1.2 0 0 0-1.32-.24 1.2 1.2 0 0 0-.72 1.08v.12a1.44 1.44 0 1 1-2.88 0v-.06a1.2 1.2 0 0 0-.78-1.08 1.2 1.2 0 0 0-1.32.24l-.04.04a1.44 1.44 0 1 1-2.04-2.04l.04-.04a1.2 1.2 0 0 0 .24-1.32 1.2 1.2 0 0 0-1.08-.72h-.12a1.44 1.44 0 0 1 0-2.88h.06a1.2 1.2 0 0 0 1.08-.78 1.2 1.2 0 0 0-.24-1.32l-.04-.04a1.44 1.44 0 1 1 2.04-2.04l.04.04a1.2 1.2 0 0 0 1.32.24h.06a1.2 1.2 0 0 0 .72-1.08v-.12a1.44 1.44 0 0 1 2.88 0v.06a1.2 1.2 0 0 0 .72 1.08 1.2 1.2 0 0 0 1.32-.24l.04-.04a1.44 1.44 0 1 1 2.04 2.04l-.04.04a1.2 1.2 0 0 0-.24 1.32v.06a1.2 1.2 0 0 0 1.08.72h.12a1.44 1.44 0 0 1 0 2.88h-.06a1.2 1.2 0 0 0-1.08.72z" />
      </svg>
    ),
    enabled: false,
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="sidebar"
      className="
        fixed left-0 top-0 bottom-0 z-40
        flex flex-col
        bg-[var(--bg-secondary)]
        transition-all duration-300 ease-in-out
      "
      style={{ width: isCollapsed ? '72px' : '240px' }}
    >
      {/* Logo */}
      <Link href="/dashboard" className={`flex items-center px-5 py-6 hover:opacity-80 transition-opacity ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        {!isCollapsed ? (
          <span className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight whitespace-nowrap">
            wolfie
          </span>
        ) : (
          <span className="text-[22px] font-bold text-[var(--text-primary)] tracking-tight">
            w
          </span>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isDisabled = !item.enabled;

            return (
              <li key={item.href}>
                {isDisabled ? (
                  <div
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg
                      text-[var(--text-secondary)] opacity-50 cursor-not-allowed select-none`}
                    title={isCollapsed ? `${item.label} (soon)` : undefined}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                    </div>
                    {!isCollapsed && <Badge label="soon" variant="soon" />}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`
                      flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg
                      text-sm font-medium transition-all duration-150
                      ${isActive
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]'
                      }
                    `}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer & Toggle */}
      <div className="px-3 py-4 border-t border-[var(--border)] flex flex-col gap-4">
        {!isCollapsed && (
          <div className="px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse-dot" />
              <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">Honeypot active</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1 opacity-60 whitespace-nowrap">
              v0.1.0 — self-hosted
            </p>
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] rounded-md transition-colors`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
