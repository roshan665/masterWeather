import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PANCHAYATS } from '../../data/panchayats';
import type { UserRole } from '../../types/common';
import {
  MapPin,
  Compass,
  Languages,
  UserCheck,
  Bell,
  Sprout,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    role,
    setRole,
    activePanchayat,
    selectPanchayatById,
    detectGpsLocation,
    isGpsLocating,
  } = useApp();
  const { alerts } = useMockData();
  const { t } = useTranslation(language);
  const navigate = useNavigate();

  const [isGpDropdownOpen, setIsGpDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);

  const activeAlertsCount = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  ).length;

  const handleGpsClick = () => {
    const result = detectGpsLocation();
    const msg = language === 'hi' ? result.messageHi : result.messageEn;
    setGpsNotification(msg);
    setTimeout(() => {
      setGpsNotification(null);
    }, 4000);
  };

  const rolesList: { role: UserRole; labelEn: string; labelHi: string; icon: string; path: string }[] = [
    { role: 'farmer', labelEn: 'Farmer (किसान)', labelHi: 'किसान (Farmer)', icon: '👨‍🌾', path: '/' },
    { role: 'officer', labelEn: 'Agri Officer (कृषि अधिकारी)', labelHi: 'कृषि अधिकारी (Officer)', icon: '🏢', path: '/officer' },
    { role: 'admin', labelEn: 'Administrator (प्रशासक)', labelHi: 'प्रशासक (Admin)', icon: '⚙️', path: '/admin' },
    { role: 'researcher', labelEn: 'Researcher (शोधकर्ता)', labelHi: 'शोधकर्ता (Researcher)', icon: '🔬', path: '/research' },
  ];

  const handleRoleChange = (newRole: UserRole, targetPath: string) => {
    setRole(newRole);
    setIsRoleDropdownOpen(false);
    navigate(targetPath);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-1 text-[11px] sm:text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t.pilotBanner}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-emerald-200">
          <span>{t.blockName}</span>
          <span>•</span>
          <span className="text-emerald-100 font-semibold">{t.demoNotice}</span>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <Link to={role === 'farmer' ? '/' : `/${role}`} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout size={24} className="text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl text-emerald-950 tracking-tight">
                  {t.appTitle}
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                  MP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block leading-tight">
                {t.appSubtitle}
              </p>
            </div>
          </Link>

          {/* Center: Panchayat Selector & GPS button */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGpDropdownOpen(!isGpDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
                aria-label="Select Panchayat"
              >
                <MapPin size={16} className="text-emerald-600 shrink-0" />
                <span className="font-semibold truncate max-w-[100px] sm:max-w-[150px]">
                  {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn}
                </span>
                <ChevronDown size={14} className="text-emerald-700 shrink-0 opacity-70" />
              </button>

              {/* Panchayat Dropdown Menu */}
              {isGpDropdownOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>{t.selectPanchayat}</span>
                    <span className="text-emerald-700 font-bold">Phanda (Bhopal)</span>
                  </div>
                  {PANCHAYATS.map((gp) => (
                    <button
                      key={gp.id}
                      onClick={() => {
                        selectPanchayatById(gp.id);
                        setIsGpDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer ${
                        gp.id === activePanchayat.id
                          ? 'bg-emerald-50/80 text-emerald-900 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">
                          {language === 'hi' ? gp.nameHi : gp.nameEn}
                          <span className="ml-1 text-[11px] text-slate-500 font-normal">
                            ({language === 'hi' ? gp.nameEn : gp.nameHi})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {gp.weatherStationId} • {gp.stationStatus === 'active' ? '🟢 Online' : '🟠 Backup Model'}
                        </div>
                      </div>
                      {gp.id === activePanchayat.id && (
                        <Check size={16} className="text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Locate Button */}
            <button
              onClick={handleGpsClick}
              disabled={isGpsLocating}
              title={t.useGpsLocation}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer shrink-0 shadow-xs"
              aria-label="Detect GPS"
            >
              <Compass size={17} className={isGpsLocating ? 'animate-spin text-emerald-600' : ''} />
            </button>
          </div>

          {/* Right Controls: Role, Language, Alert Bell */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Alert Bell Button */}
            <Link
              to={role === 'farmer' ? '/alerts' : '/officer/alerts'}
              className="relative p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-600 transition-colors cursor-pointer shadow-xs"
              aria-label="Alerts"
            >
              <Bell size={18} />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white animate-bounce">
                  {activeAlertsCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              aria-label="Switch Language"
            >
              <Languages size={15} className="text-emerald-600 shrink-0" />
              <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
                aria-label="Switch User Role"
              >
                <UserCheck size={15} className="text-emerald-400 shrink-0" />
                <span className="hidden sm:inline capitalize">
                  {role === 'farmer' ? t.roleFarmer : role === 'officer' ? t.roleOfficer : role === 'admin' ? t.roleAdmin : t.roleResearcher}
                </span>
                <ChevronDown size={13} className="opacity-75 shrink-0" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>{t.switchRole}</span>
                  </div>
                  {rolesList.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => handleRoleChange(item.role, item.path)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        item.role === role
                          ? 'bg-emerald-50/70 text-emerald-900 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                      </div>
                      {item.role === role && (
                        <Check size={15} className="text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* GPS Notification Toast */}
      {gpsNotification && (
        <div className="bg-emerald-700 text-white px-4 py-2 text-xs sm:text-sm flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <Compass size={16} className="shrink-0 animate-spin" />
            <span className="font-medium">{gpsNotification}</span>
          </div>
        </div>
      )}
    </header>
  );
};
