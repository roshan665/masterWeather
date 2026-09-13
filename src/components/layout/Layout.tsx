import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      <Header />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-x-hidden">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
