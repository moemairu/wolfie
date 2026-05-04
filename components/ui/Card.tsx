import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Card({ children, className = '', id }: CardProps) {
  return (
    <div
      id={id}
      className={`
        rounded-xl border border-[var(--border)]
        bg-[var(--bg-card)]
        shadow-[var(--shadow)]
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
