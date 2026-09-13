import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, AlertTriangle, BookOpen, Camera, Map } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { role, language } = useApp();

  if (role === 'farmer') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex justify-around items-center shadow-lg">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Home className="w-4 h-4" />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </NavLink>

        <NavLink
          to="/forecast"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <CalendarDays className="w-4 h-4" />
          <span>{language === 'hi' ? 'स्प्रे' : 'Spray'}</span>
        </NavLink>

        <NavLink
          to="/risks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{language === 'hi' ? 'जोखिम' : 'Risks'}</span>
        </NavLink>

        <NavLink
          to="/advisories"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'hi' ? 'सलाह' : 'Advisories'}</span>
        </NavLink>

        <NavLink
          to="/observations"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Camera className="w-4 h-4" />
          <span>{language === 'hi' ? 'रिपोर्ट' : 'Report'}</span>
        </NavLink>
      </nav>
    );
  }

  // Officer bottom nav
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex justify-around items-center shadow-lg">
      <NavLink
        to="/officer"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold ${
            isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Home className="w-4 h-4" />
        <span>{language === 'hi' ? 'कंट्रोल' : 'Command'}</span>
      </NavLink>

      <NavLink
        to="/officer/map"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold ${
            isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <Map className="w-4 h-4" />
        <span>{language === 'hi' ? 'मानचित्र' : 'Map'}</span>
      </NavLink>

      <NavLink
        to="/officer/advisories"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold ${
            isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`
        }
      >
        <BookOpen className="w-4 h-4" />
        <span>{language === 'hi' ? 'अनुमोदन' : 'Approvals'}</span>
      </NavLink>
    </nav>
  );
};
