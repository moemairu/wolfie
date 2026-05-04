interface BadgeProps {
  label: string;
  variant?: 'protocol' | 'event' | 'soon';
}

const PROTOCOL_COLORS: Record<string, { bg: string; text: string }> = {
  ssh: { bg: 'var(--border)', text: 'var(--text-primary)' },
  telnet: { bg: 'var(--bg-primary)', text: 'var(--text-secondary)' },
  http: { bg: 'var(--bg-primary)', text: 'var(--text-primary)' },
  ftp: { bg: 'var(--border)', text: 'var(--text-secondary)' },
};

const EVENT_COLORS: Record<string, { bg: string; text: string }> = {
  'login.failed': { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--danger)' },
  'login.success': { bg: 'rgba(34, 197, 94, 0.1)', text: 'var(--success)' },
  'command.input': { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning)' },
  'session.closed': { bg: 'var(--border)', text: 'var(--text-secondary)' },
};

export default function Badge({ label, variant = 'protocol' }: BadgeProps) {
  let colors: { bg: string; text: string };

  if (variant === 'soon') {
    colors = { bg: 'rgba(136, 136, 170, 0.1)', text: 'var(--text-secondary)' };
  } else if (variant === 'event') {
    colors = EVENT_COLORS[label] || { bg: 'rgba(136, 136, 170, 0.1)', text: 'var(--text-secondary)' };
  } else {
    colors = PROTOCOL_COLORS[label] || { bg: 'rgba(136, 136, 170, 0.1)', text: 'var(--text-secondary)' };
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {label}
    </span>
  );
}
