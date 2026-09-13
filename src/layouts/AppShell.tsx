import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { useApp } from '../context/AppContext';
import { CropSelector } from '../components/CropSelector';
import { ShieldAlert } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';

export const AppShell: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role, activePanchayat, language } = useApp();
  const { alerts } = useAlerts(activePanchayat?.id);

  const activeWarning = alerts.find((a) => a.level === 'warning' || (a as any).severity === 'warning');

  const headline = activeWarning
    ? (language === 'hi' ? activeWarning.headlineHi || (activeWarning as any).titleHi : activeWarning.headlineEn || (activeWarning as any).title)
    : '';

  const actionReq = activeWarning
    ? (language === 'hi' ? activeWarning.recommendedActionHi || (activeWarning as any).actionRequiredHi : activeWarning.recommendedActionEn || (activeWarning as any).actionRequired)
    : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar for Desktop & Collapsible Drawer for Mobile */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        {/* Top Sticky Header */}
        <TopBar
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Global Warning Banner if any active warning exists */}
        {activeWarning && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs flex items-center justify-between gap-2 text-amber-200">
            <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span className="font-semibold">{headline}:</span>
              <span className="truncate opacity-90 hidden sm:inline">{actionReq}</span>
            </div>
          </div>
        )}

        {/* Farmer Crop Selector Ribbon */}
        {role === 'farmer' && (
          <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-400 shrink-0 hidden sm:block">
                {language === 'hi' ? 'सक्रिय फसल:' : 'Select Crop:'}
              </div>
              <CropSelector className="w-full sm:w-auto" />
            </div>
          </div>
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
