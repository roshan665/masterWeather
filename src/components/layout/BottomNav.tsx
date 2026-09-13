import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import {
  Home,
  CloudSun,
  ShieldAlert,
  BookOpen,
  Eye,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { language, role } = useApp();
  const { t } = useTranslation(language);

  // If in officer, admin, or researcher role on mobile, show role-specific quick tabs
  if (role === 'officer') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
        <div className="grid grid-cols-5 gap-1">
          <NavLink
            to="/officer"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
              }`
            }
          >
            <Home size={18} />
            <span className="truncate max-w-[54px]">{t.navOfficerDashboard}</span>
          </NavLink>
          <NavLink
            to="/officer/map"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
              }`
            }
          >
            <CloudSun size={18} />
            <span className="truncate max-w-[54px]">{t.navOfficerMap}</span>
          </NavLink>
          <NavLink
            to="/officer/advisories"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
              }`
            }
          >
            <BookOpen size={18} />
            <span className="truncate max-w-[54px]">{t.navOfficerAdvisories}</span>
          </NavLink>
          <NavLink
            to="/officer/observations"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
              }`
            }
          >
            <Eye size={18} />
            <span className="truncate max-w-[54px]">{t.navOfficerObservations}</span>
          </NavLink>
          <NavLink
            to="/officer/alerts"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-500'
              }`
            }
          >
            <ShieldAlert size={18} />
            <span className="truncate max-w-[54px]">{t.navOfficerAlerts}</span>
          </NavLink>
        </div>
      </nav>
    );
  }

  // Farmer Mobile Bottom Nav
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
            }`
          }
        >
          <Home size={19} />
          <span className="truncate max-w-[54px]">{t.navHome}</span>
        </NavLink>

        <NavLink
          to="/forecast"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
            }`
          }
        >
          <CloudSun size={19} />
          <span className="truncate max-w-[54px]">{t.navForecast}</span>
        </NavLink>

        <NavLink
          to="/risks"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
            }`
          }
        >
          <ShieldAlert size={19} />
          <span className="truncate max-w-[54px]">{t.navRisks}</span>
        </NavLink>

        <NavLink
          to="/advisories"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
            }`
          }
        >
          <BookOpen size={19} />
          <span className="truncate max-w-[54px]">{t.navAdvisories}</span>
        </NavLink>

        <NavLink
          to="/observations"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'
            }`
          }
        >
          <Eye size={19} />
          <span className="truncate max-w-[54px]">{t.navObservations}</span>
        </NavLink>
      </div>
    </nav>
  );
};
