import React from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useMockData } from '../context/MockDataContext';
import { PanchayatSelector } from '../components/PanchayatSelector';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export interface TopBarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const { language, activePanchayat } = useApp();
  const { alerts } = useMockData();

  const activeAlerts = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  );

  return (
    <header className="sticky top-0 z-40 bg-[#061613]/95 backdrop-blur-md border-b border-emerald-900/40 px-3.5 sm:px-5 py-2.5 pt-safe transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Hamburger + App Title matching Mockup */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="p-2 min-w-[40px] min-h-[40px] rounded-xl text-slate-200 hover:text-white hover:bg-emerald-950/60 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X className="w-6 h-6 text-emerald-400" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Green Sprout App Icon */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-black text-lg shrink-0">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base sm:text-lg tracking-tight leading-none">
                  {language === 'hi' ? 'PanchayatMausam' : 'PanchayatMausam'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold tracking-wide">
                {language === 'hi' ? 'Phanda Block, Bhopal' : 'Phanda Block, Bhopal'}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop GP Selector */}
        <div className="hidden lg:block w-72">
          <PanchayatSelector />
        </div>

        {/* Right: Language switcher & Notification Bell */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Link
            to="/alerts"
            className="relative p-2 min-w-[40px] min-h-[40px] rounded-xl text-slate-200 hover:text-white hover:bg-emerald-950/60 active:scale-95 flex items-center justify-center transition-all"
            aria-label="View notifications and alerts"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                {activeAlerts.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile GP Quick Selector sub-row */}
      <div className="lg:hidden mt-2 pt-1.5 border-t border-emerald-900/30">
        <PanchayatSelector className="w-full" />
      </div>
    </header>
  );
};
