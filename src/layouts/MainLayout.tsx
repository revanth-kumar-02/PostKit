import React from 'react';
import { Header } from './Header';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-600/30">
      <Header />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};
