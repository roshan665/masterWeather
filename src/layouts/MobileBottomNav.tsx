import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Sun,
  BookOpen,
  Bell,
  User,
  Map,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMockData } from '../context/MockDataContext';

export const MobileBottomNav: React.FC = () => {
  const { role, language, activePanchayat } = useApp();
  const { alerts } = useMockData();

  const activeAlerts = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  );
  const unreadAlertsCount = activeAlerts.length;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#061613]/98 backdrop-blur-xl border-t border-emerald-900/50 px-2 pt-1.5 nav-pb-safe flex justify-around items-center shadow-2xl"
    >
      {role === 'farmer' ? (
        <>
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-950/80 text-emerald-400' : ''}`}>
                  <Home className="w-5 h-5" />
                </div>
                <span className="mt-0.5">{language === 'hi' ? 'Home' : 'Home'}</span>
              </>
            )}
          </NavLink>

          {/* 2. Weather */}
          <NavLink
            to="/weather"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-950/80 text-emerald-400' : ''}`}>
                  <Sun className="w-5 h-5" />
                </div>
                <span className="mt-0.5">{language === 'hi' ? 'Weather' : 'Weather'}</span>
              </>
            )}
          </NavLink>

          {/* 3. Advisories */}
          <NavLink
            to="/advisories"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-950/80 text-emerald-400' : ''}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="mt-0.5">{language === 'hi' ? 'Advisories' : 'Advisories'}</span>
              </>
            )}
          </NavLink>

          {/* 4. Alerts */}
          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all relative ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all relative ${isActive ? 'bg-emerald-950/80 text-emerald-400' : ''}`}>
                  <Bell className="w-5 h-5" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-[#061613]">
                      {unreadAlertsCount}
                    </span>
                  )}
                </div>
                <span className="mt-0.5">{language === 'hi' ? 'Alerts' : 'Alerts'}</span>
              </>
            )}
          </NavLink>

          {/* 5. Profile / Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-950/80 text-emerald-400' : ''}`}>
                  <User className="w-5 h-5" />
                </div>
                <span className="mt-0.5">{language === 'hi' ? 'Profile' : 'Profile'}</span>
              </>
            )}
          </NavLink>
        </>
      ) : (
        /* Officer Bottom Nav */
        <>
          <NavLink
            to="/officer"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Home className="w-5 h-5 mb-0.5 shrink-0" />
            <span>Command</span>
          </NavLink>

          <NavLink
            to="/officer/map"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Map className="w-5 h-5 mb-0.5 shrink-0" />
            <span>Map</span>
          </NavLink>

          <NavLink
            to="/officer/advisories"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <FileCheck className="w-5 h-5 mb-0.5 shrink-0" />
            <span>Approvals</span>
          </NavLink>

          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Bell className="w-5 h-5 mb-0.5 shrink-0" />
            <span>Alerts</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[58px] min-h-[48px] py-1 px-1 rounded-xl text-[11px] font-bold transition-all ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <User className="w-5 h-5 mb-0.5 shrink-0" />
            <span>Profile</span>
          </NavLink>
        </>
      )}
    </nav>
  );
};
