import React from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PanchayatSelector } from '../components/PanchayatSelector';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { UserProfileMenu } from '../components/auth/UserProfileMenu';

export interface TopBarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const { language, activePanchayat } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-md border-b border-emerald-950/80 px-3 sm:px-4 py-2 pt-safe transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Hamburger + App Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl bg-slate-800/90 text-slate-200 hover:text-white hover:bg-slate-700 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            aria-label={isSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-black text-base sm:text-lg shrink-0">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-none">
                  {language === 'hi' ? 'पंचायत मौसम' : 'PanchayatMausam'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider">
                  AI
                </span>
              </div>
              {/* Mobile Panchayat indicator badge */}
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium sm:hidden mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[120px]">
                  {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn}
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/90 font-medium hidden sm:block">
                {language === 'hi' ? '5 ग्राम पंचायत कृषि मौसम निर्णय समर्थन (फंदा, भोपाल)' : '5-GP Hyperlocal Agromet Support (Phanda, Bhopal)'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop GP Selector */}
        <div className="hidden lg:block w-72">
          <PanchayatSelector />
        </div>

        {/* Right: Language switcher & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <LanguageSwitcher />
          <UserProfileMenu />
        </div>
      </div>

      {/* Mobile GP Quick Selector (Expandable / compact bar) */}
      <div className="lg:hidden mt-2 pt-1.5 border-t border-slate-800/60">
        <PanchayatSelector className="w-full" />
      </div>
    </header>
  );
};
