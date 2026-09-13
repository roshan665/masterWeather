import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Sprout,
  MapPin,
  Bell,
  Globe,
  LifeBuoy,
  Info,
  LogOut,
  ChevronRight,
  Server
} from 'lucide-react';
import { isBackendApiEnabled, setBackendApiEnabled } from '../../config/api';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, activePanchayat, activeCrop } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [useBackend, setUseBackend] = useState<boolean>(isBackendApiEnabled());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleBackend = () => {
    const next = !useBackend;
    setUseBackend(next);
    setBackendApiEnabled(next);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-6 animate-in fade-in duration-200">
      
      {/* Header matching Mockup Screen 9 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-emerald-950/60 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Profile / Settings
          </h1>
        </div>

        <button
          type="button"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-emerald-950/60 transition-all cursor-pointer"
          aria-label="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile Card matching Mockup Screen 9 */}
      <div className="bg-[#0a231e] border border-emerald-500/25 rounded-3xl p-4 sm:p-5 shadow-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-700/40 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
          <User size={30} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-black text-white truncate">
            {user ? (language === 'hi' ? user.nameHi : user.nameEn) : 'Rameshwar Patidar'}
          </h2>
          <p className="text-xs text-emerald-400 font-semibold mt-0.5">
            Farmer • Phanda Block, Bhopal
          </p>
          <p className="text-[11px] text-slate-400">
            Active GP: {activePanchayat.nameEn} ({activePanchayat.nameHi})
          </p>
        </div>
      </div>

      {/* Profile Menu List Items matching Mockup Screen 9 */}
      <div className="bg-[#0a231e] border border-emerald-500/25 rounded-3xl p-2 shadow-xl divide-y divide-emerald-900/30">
        
        {/* My Farms & Crops */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#0f2e28] rounded-2xl transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Sprout size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">My Farms & Crops</div>
              <div className="text-[11px] text-slate-400">2 Farms • 3 Crops ({activeCrop.nameEn})</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </div>

        {/* Location */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#0f2e28] rounded-2xl transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <MapPin size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">Location</div>
              <div className="text-[11px] text-slate-400">{activePanchayat.nameEn}, Phanda Block, Bhopal</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </div>

        {/* Notifications */}
        <div
          onClick={() => navigate('/alerts')}
          className="p-3.5 flex items-center justify-between hover:bg-[#0f2e28] rounded-2xl transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Bell size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">Notifications</div>
              <div className="text-[11px] text-slate-400">Alerts & Weather Updates</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </div>

        {/* Language Switcher */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#0f2e28] rounded-2xl transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Globe size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">Language</div>
              <div className="text-[11px] text-slate-400">Hindi / English</div>
            </div>
          </div>

          <div className="flex items-center bg-[#061613] p-1 rounded-xl border border-emerald-900/40">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'hi'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Backend API Toggle */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#0f2e28] rounded-2xl transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Server size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">Data Mode</div>
              <div className="text-[11px] text-slate-400">
                {useBackend ? 'FastAPI Backend Live' : 'Demo / Mock Storage'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleBackend}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              useBackend
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {useBackend ? 'Live API ✓' : 'Demo Mode'}
          </button>
        </div>

        {/* Help & Support */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#0f2e28] rounded-2xl transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <LifeBuoy size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">Help & Support</div>
              <div className="text-[11px] text-slate-400">Kisan Call Center (1800-180-1551)</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </div>

        {/* About App */}
        <div className="p-3.5 flex items-center justify-between hover:bg-[#0f2e28] rounded-2xl transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-500/20 text-slate-300">
              <Info size={18} />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">About App</div>
              <div className="text-[11px] text-slate-400">PanchayatMausam AI v1.0 • Phanda Block</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </div>

        {/* Logout (Red Text) */}
        <div
          onClick={handleLogout}
          className="p-3.5 flex items-center gap-3 hover:bg-rose-950/30 rounded-2xl transition-all cursor-pointer text-rose-400"
        >
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <LogOut size={18} />
          </div>
          <div className="font-bold text-xs sm:text-sm">Logout</div>
        </div>

      </div>

    </div>
  );
};
