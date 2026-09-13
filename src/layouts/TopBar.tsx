import React from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PanchayatSelector } from '../components/PanchayatSelector';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { UserProfileMenu } from '../components/auth/UserProfileMenu';

export interface TopBarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const { language } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-950/80 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/30 font-black text-lg">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                  {language === 'hi' ? 'पंचायत मौसम AI' : 'PanchayatMausam AI'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider">
                  Phanda
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/90 font-medium hidden sm:block">
                {language === 'hi' ? '5 ग्राम पंचायत कृषि मौसम निर्णय समर्थन' : '5-GP Hyperlocal Agromet Decision Support'}
              </p>
            </div>
          </div>
        </div>

        {/* Center / GP Selector for Farmer */}
        <div className="hidden lg:block w-72">
          <PanchayatSelector />
        </div>

        {/* Right tools (Language, Profile & Role Controls) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <UserProfileMenu />
        </div>
      </div>

      {/* Mobile Panchayat selector sub-row */}
      <div className="lg:hidden mt-2 pt-2 border-t border-slate-800/80">
        <PanchayatSelector />
      </div>
    </header>
  );
};
