import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';
  const variantStyles = {
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    neutral: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
