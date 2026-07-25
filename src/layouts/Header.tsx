import React from 'react';
import { Typography, Badge } from '@/components';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm text-sm">
          P
        </div>
        <Typography as="h1" variant="h2" className="text-base font-bold tracking-tight text-zinc-100">
          PostKit V2
        </Typography>
      </div>
      <Badge variant="info" className="text-[11px] font-mono">v2.0</Badge>
    </header>
  );
};
