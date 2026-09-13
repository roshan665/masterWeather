import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { useApp } from '../context/AppContext';
import { CropSelector } from '../components/CropSelector';
import { ShieldAlert, WifiOff, RefreshCw } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';

export const AppShell: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { role, activePanchayat, language } = useApp();
  const { alerts } = useAlerts(activePanchayat?.id);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const activeWarning = alerts.find((a) => a.level === 'warning' || a.level === 'critical' || (a as any).severity === 'warning');

  const headline = activeWarning
    ? (language === 'hi' ? activeWarning.headlineHi || (activeWarning as any).titleHi : activeWarning.headlineEn || (activeWarning as any).title)
    : '';

  const actionReq = activeWarning
    ? (language === 'hi' ? activeWarning.recommendedActionHi || (activeWarning as any).actionRequiredHi : activeWarning.recommendedActionEn || (activeWarning as any).actionRequired)
    : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop & Collapsible Drawer for Mobile */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-safe md:pb-6">
        {/* Top Sticky Header */}
        <TopBar
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Network Offline Indicator Banner */}
        {!isOnline && (
          <div className="bg-rose-950/90 border-b border-rose-600/40 px-4 py-2 text-xs flex items-center justify-between gap-2 text-rose-200 animate-in slide-in-from-top">
            <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
              <span className="font-bold">
                {language === 'hi'
                  ? 'ऑफ़लाइन मोड: नेटवर्क अनुपलब्ध है। अंतिम सहेजा गया डेटा दिखाया जा रहा है।'
                  : 'Offline Mode: Network unavailable. Displaying cached weather snapshot.'}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'पुनः प्रयास' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* Global Warning Banner if any active critical/warning exists */}
        {activeWarning && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 sm:px-4 py-2 text-xs flex items-center justify-between gap-2 text-amber-200">
            <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span className="font-bold truncate text-[11px] sm:text-xs">{headline}</span>
              <span className="text-amber-300/80 truncate hidden md:inline">• {actionReq}</span>
            </div>
          </div>
        )}

        {/* Farmer Crop Selector Ribbon */}
        {role === 'farmer' && (
          <div className="bg-slate-900/80 border-b border-slate-800/80 px-3 sm:px-4 py-1.5 sticky top-[57px] z-30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="text-[11px] font-bold text-slate-400 shrink-0 hidden sm:block">
                {language === 'hi' ? 'सक्रिय फसल:' : 'Select Crop:'}
              </div>
              <CropSelector className="w-full sm:w-auto" />
            </div>
          </div>
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
