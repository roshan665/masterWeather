import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  Home,
  CloudSun,
  AlertTriangle,
  BookOpen,
  MoreHorizontal,
  Bell,
  Camera,
  MessageSquareQuote,
  Settings,
  HelpCircle,
  X,
  Map,
  ClipboardList,
  Sliders,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMockData } from '../context/MockDataContext';

export const MobileBottomNav: React.FC = () => {
  const { role, language, activePanchayat } = useApp();
  const { alerts } = useMockData();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Unread alerts count for active panchayat
  const activeAlerts = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  );
  const unreadAlertsCount = activeAlerts.length;

  const isMoreActive = ['/alerts', '/observations', '/feedback', '/settings', '/officer/alerts', '/officer/observations', '/officer/analytics', '/admin'].some(
    (path) => location.pathname.startsWith(path)
  );

  return (
    <>
      {/* "More / अधिक" Bottom Sheet Modal for Mobile */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            onClick={() => setIsMoreOpen(false)}
            aria-label="Close menu"
          />

          {/* Bottom Sheet Card */}
          <div className="relative bg-slate-900 border-t border-emerald-900/80 rounded-t-3xl p-5 pb-safe z-10 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h3 className="font-bold text-base text-white">
                  {language === 'hi' ? 'अतिरिक्त विकल्प व सेवाएं' : 'More Features & Services'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-2 min-w-[40px] min-h-[40px] rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Farmer Extra Links */}
            {role === 'farmer' ? (
              <div className="grid grid-cols-2 gap-2.5">
                {/* Weather Alerts */}
                <Link
                  to="/alerts"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 active:scale-98 transition-all relative group"
                >
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      <span>{language === 'hi' ? 'मौसम अलर्ट' : 'Alerts'}</span>
                      {unreadAlertsCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                          {unreadAlertsCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {language === 'hi' ? 'आपातकालीन सूचना' : 'Emergency alerts'}
                    </p>
                  </div>
                </Link>

                {/* Field Observation / Report */}
                <Link
                  to="/observations"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 active:scale-98 transition-all group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-white">
                      {language === 'hi' ? 'खेत रिपोर्ट' : 'Field Report'}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {language === 'hi' ? 'कीट व वर्षा दर्ज करें' : 'Ground observations'}
                    </p>
                  </div>
                </Link>

                {/* Feedback */}
                <Link
                  to="/feedback"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 active:scale-98 transition-all group"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-white">
                      {language === 'hi' ? 'फीडबैक' : 'Feedback'}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {language === 'hi' ? 'सलाह रेटिंग दें' : 'Rate advisories'}
                    </p>
                  </div>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 active:scale-98 transition-all group"
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm text-white">
                      {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {language === 'hi' ? 'भाषा व पंचायत' : 'Language & preferences'}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              /* Officer Extra Links */
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/officer/alerts"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60"
                >
                  <Radio className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      {language === 'hi' ? 'अलर्ट ब्रॉडकास्ट' : 'Alert Broadcast'}
                    </div>
                    <p className="text-[10px] text-slate-400">Emergency dispatch</p>
                  </div>
                </Link>

                <Link
                  to="/officer/observations"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60"
                >
                  <ClipboardList className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      {language === 'hi' ? 'रिपोर्ट सत्यापन' : 'Review Queue'}
                    </div>
                    <p className="text-[10px] text-slate-400">Verify field observations</p>
                  </div>
                </Link>

                <Link
                  to="/officer/analytics"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60"
                >
                  <Sliders className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      {language === 'hi' ? 'डेटा विश्लेषण' : 'Analytics & QA'}
                    </div>
                    <p className="text-[10px] text-slate-400">KPIs & Sensor health</p>
                  </div>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60"
                >
                  <Settings className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">
                      {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
                    </div>
                    <p className="text-[10px] text-slate-400">System config</p>
                  </div>
                </Link>
              </div>
            )}

            {/* Quick Emergency Help banner in bottom sheet */}
            <div className="p-3 bg-emerald-950/70 border border-emerald-800/60 rounded-2xl flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'hi' ? 'किसान कॉल सेंटर: 1800-180-1551 (टोल फ्री)' : 'Kisan Call Center: 1800-180-1551'}
                </span>
              </div>
              <a
                href="tel:18001801551"
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[11px] shrink-0"
              >
                {language === 'hi' ? 'कॉल करें' : 'Call'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar for Mobile */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/98 backdrop-blur-lg border-t border-emerald-950/80 px-1 py-1 pb-safe flex justify-around items-center shadow-2xl"
      >
        {role === 'farmer' ? (
          <>
            {/* 1. Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/50 scale-105'
                    : 'text-slate-400 hover:text-slate-200 active:scale-95'
                }`
              }
            >
              <Home className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'होम' : 'Home'}</span>
            </NavLink>

            {/* 2. Weather */}
            <NavLink
              to="/weather"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/50 scale-105'
                    : 'text-slate-400 hover:text-slate-200 active:scale-95'
                }`
              }
            >
              <CloudSun className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'मौसम' : 'Weather'}</span>
            </NavLink>

            {/* 3. Crop Risks */}
            <NavLink
              to="/risks"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/50 scale-105'
                    : 'text-slate-400 hover:text-slate-200 active:scale-95'
                }`
              }
            >
              <AlertTriangle className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'जोखिम' : 'Risks'}</span>
            </NavLink>

            {/* 4. Advisories */}
            <NavLink
              to="/advisories"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-950/50 scale-105'
                    : 'text-slate-400 hover:text-slate-200 active:scale-95'
                }`
              }
            >
              <BookOpen className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'सलाह' : 'Advisories'}</span>
            </NavLink>

            {/* 5. More */}
            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer relative ${
                isMoreOpen || isMoreActive
                  ? 'text-amber-400 bg-amber-950/40 scale-105'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
              aria-label="More navigation items"
            >
              <div className="relative">
                <MoreHorizontal className="w-5 h-5 mb-0.5 shrink-0" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
                )}
              </div>
              <span>{language === 'hi' ? 'अधिक' : 'More'}</span>
            </button>
          </>
        ) : (
          /* Officer Bottom Nav */
          <>
            <NavLink
              to="/officer"
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Home className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
            </NavLink>

            <NavLink
              to="/officer/map"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Map className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'मानचित्र' : 'Map'}</span>
            </NavLink>

            <NavLink
              to="/officer/risks"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <AlertTriangle className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'जोखिम' : 'Risks'}</span>
            </NavLink>

            <NavLink
              to="/officer/advisories"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isActive ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <BookOpen className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'अनुमोदन' : 'Approvals'}</span>
            </NavLink>

            <button
              type="button"
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                isMoreOpen || isMoreActive ? 'text-amber-400 bg-amber-950/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MoreHorizontal className="w-5 h-5 mb-0.5 shrink-0" />
              <span>{language === 'hi' ? 'अधिक' : 'More'}</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
