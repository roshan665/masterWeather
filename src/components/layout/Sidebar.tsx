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
  MessageSquareQuote,
  Settings,
  Map,
  BarChart3,
  Users,
  Database,
  Sliders,
  FileSpreadsheet,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { language, role } = useApp();
  const { t } = useTranslation(language);

  const farmerNavItems = [
    { to: '/', label: t.navHome, icon: Home, end: true },
    { to: '/weather', label: t.navWeather, icon: CloudSun },
    { to: '/forecast', label: t.navForecast, icon: CloudSun },
    { to: '/risks', label: t.navRisks, icon: ShieldAlert },
    { to: '/advisories', label: t.navAdvisories, icon: BookOpen },
    { to: '/alerts', label: t.navAlerts, icon: ShieldAlert },
    { to: '/observations', label: t.navObservations, icon: Eye },
    { to: '/feedback', label: t.navFeedback, icon: MessageSquareQuote },
    { to: '/settings', label: t.navSettings, icon: Settings },
  ];

  const officerNavItems = [
    { to: '/officer', label: t.navOfficerDashboard, icon: Home, end: true },
    { to: '/officer/map', label: t.navOfficerMap, icon: Map },
    { to: '/officer/forecasts', label: t.navOfficerForecasts, icon: CloudSun },
    { to: '/officer/risks', label: t.navOfficerRisks, icon: ShieldAlert },
    { to: '/officer/advisories', label: t.navOfficerAdvisories, icon: BookOpen },
    { to: '/officer/observations', label: t.navOfficerObservations, icon: Eye },
    { to: '/officer/alerts', label: t.navOfficerAlerts, icon: ShieldAlert },
    { to: '/officer/analytics', label: t.navOfficerAnalytics, icon: BarChart3 },
  ];

  const adminNavItems = [
    { to: '/admin', label: 'Admin Dashboard', icon: Home, end: true },
    { to: '/admin/users', label: t.navAdminUsers, icon: Users },
    { to: '/admin/panchayats', label: t.navAdminPanchayats, icon: Layers },
    { to: '/admin/rules', label: t.navAdminRules, icon: Sliders },
    { to: '/admin/data-sources', label: t.navAdminDataSources, icon: Database },
    { to: '/admin/audit-logs', label: t.navAdminAuditLogs, icon: FileSpreadsheet },
  ];

  const researcherNavItems = [
    { to: '/research', label: 'Research Lab', icon: Home, end: true },
    { to: '/research/models', label: t.navResearchModels, icon: Activity },
    { to: '/research/experiments', label: t.navResearchExperiments, icon: Sparkles },
    { to: '/research/feedback', label: t.navResearchFeedback, icon: BarChart3 },
  ];

  let currentNavItems = farmerNavItems;
  let sectionTitle = language === 'hi' ? 'किसान सेवाएं' : 'Farmer Services';
  let badgeColor = 'bg-emerald-100 text-emerald-800';

  if (role === 'officer') {
    currentNavItems = officerNavItems;
    sectionTitle = language === 'hi' ? 'अधिकारी नियंत्रण कक्ष' : 'Officer Command Center';
    badgeColor = 'bg-blue-100 text-blue-800';
  } else if (role === 'admin') {
    currentNavItems = adminNavItems;
    sectionTitle = language === 'hi' ? 'सिस्टम प्रशासन' : 'System Administration';
    badgeColor = 'bg-purple-100 text-purple-800';
  } else if (role === 'researcher') {
    currentNavItems = researcherNavItems;
    sectionTitle = language === 'hi' ? 'अनुसंधान एवं एनालिटिक्स' : 'Research & Analytics';
    badgeColor = 'bg-teal-100 text-teal-800';
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col justify-between py-5 px-3 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {/* Section title */}
        <div className="px-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {sectionTitle}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeColor}`}>
              {role}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="px-3 pt-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
          <div className="font-semibold text-slate-800">
            {language === 'hi' ? 'फंदा विकासखंड, भोपाल' : 'Phanda Block, Bhopal'}
          </div>
          <div className="text-[11px] text-slate-500">
            5 Gram Panchayats • 3 Crops
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold pt-1">
            ICAR-KVK & IMD Aligned
          </div>
        </div>
      </div>
    </aside>
  );
};
