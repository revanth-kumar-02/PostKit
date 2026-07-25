import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h2 className="text-lg font-bold tracking-tight text-zinc-100">{title}</h2>
      {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
    </div>
  );
};
