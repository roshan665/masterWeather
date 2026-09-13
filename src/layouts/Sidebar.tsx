import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Home,
  CloudSun,
  CalendarDays,
  AlertTriangle,
  BookOpen,
  Bell,
  Camera,
  Map,
  ClipboardList,
  Sliders,
  FlaskConical,
  FileCheck,
  LogOut,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  labelEn: string;
  icon: LucideIcon;
  end?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const { role, user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const farmerNav: NavItem[] = [
    { to: '/', label: 'होम (Dashboard)', labelEn: 'Dashboard', icon: Home, end: true },
    { to: '/weather', label: 'वर्तमान मौसम', labelEn: 'Current Weather', icon: CloudSun },
    { to: '/forecast', label: 'पूर्वानुमान एवं स्प्रे', labelEn: 'Forecast & Spray', icon: CalendarDays },
    { to: '/risks', label: 'फसल जोखिम मीटर', labelEn: 'Crop Risk Gauge', icon: AlertTriangle },
    { to: '/advisories', label: 'कृषि सलाह', labelEn: 'Agromet Advisories', icon: BookOpen },
    { to: '/alerts', label: 'मौसम चेतावनियां', labelEn: 'Weather Alerts', icon: Bell },
    { to: '/observations', label: 'मेरी फील्ड रिपोर्ट', labelEn: 'Ground Observations', icon: Camera }
  ];

  const officerNav: NavItem[] = [
    { to: '/officer', label: 'अधिकारी नियंत्रण कक्ष', labelEn: 'Officer Command', icon: Home, end: true },
    { to: '/officer/map', label: 'फंदा ब्लॉक जोखिम मानचित्र', labelEn: 'Phanda Risk Map', icon: Map },
    { to: '/officer/forecasts', label: 'पूर्वानुमान एवं मैट्रिक्स', labelEn: 'Forecasts & Matrix', icon: CloudSun },
    { to: '/officer/risks', label: 'बहुआयामी जोखिम', labelEn: 'Crop Risk Analytics', icon: AlertTriangle },
    { to: '/officer/advisories', label: 'सलाह समीक्षा एवं अनुमोदन', labelEn: 'Advisory Approvals', icon: FileCheck },
    { to: '/officer/observations', label: 'किसान रिपोर्ट सत्यापन', labelEn: 'Observation Queue', icon: ClipboardList },
    { to: '/officer/alerts', label: 'आपातकालीन अलर्ट प्रसारण', labelEn: 'Alert Broadcaster', icon: Bell },
    { to: '/officer/analytics', label: 'डेटा गुणवत्ता एवं विश्लेषण', labelEn: 'Data Quality & KPIs', icon: Sliders }
  ];

  const adminNav: NavItem[] = [
    { to: '/admin', label: 'प्रशासन डैशबोर्ड', labelEn: 'Admin Dashboard', icon: Home, end: true },
    { to: '/admin/rules', label: 'सलाह नियम इंजन', labelEn: 'Advisory Rules Engine', icon: Sliders },
    { to: '/admin/telemetry', label: 'AWS स्टेशन स्वास्थ्य', labelEn: 'AWS Telemetry Health', icon: CloudSun },
    { to: '/admin/audit', label: 'सिस्टम ऑडिट लॉग', labelEn: 'System Audit Logs', icon: ClipboardList }
  ];

  const researcherNav: NavItem[] = [
    { to: '/research', label: 'अनुसंधान सैंडबॉक्स', labelEn: 'Research Sandbox', icon: FlaskConical, end: true },
    { to: '/research/calculators', label: 'FAO-56 ET₀ / GDD कैलकुलेटर', labelEn: 'Agromet Calculators', icon: Sliders },
    { to: '/research/benchmarks', label: 'NWP मॉडल बेंचमार्क', labelEn: 'NWP Model Benchmarks', icon: CloudSun }
  ];

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'officer':
        return officerNav;
      case 'admin':
        return adminNav;
      case 'researcher':
        return researcherNav;
      case 'farmer':
      default:
        return farmerNav;
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-emerald-950/80 p-4 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          {/* Logo in drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <Link to="/" onClick={onClose} className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <div>
                <span className="font-black text-white text-base tracking-tight block">
                  {language === 'hi' ? 'पंचायत मौसम AI' : 'PanchayatMausam'}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  Phanda Block, Bhopal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 scrollbar-thin">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
              <span>{role.toUpperCase()} PORTAL</span>
              <span className="text-[9px] text-emerald-400 font-medium">5 GPs</span>
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {language === 'hi' ? item.label : item.labelEn}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User profile footer in sidebar */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          {isAuthenticated && user ? (
            <div className="bg-slate-850 p-2.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center text-xs">
                    {user.nameEn.charAt(0)}
                  </div>
                  <div className="truncate max-w-[120px]">
                    <span className="font-bold text-white text-xs block truncate">
                      {language === 'hi' ? user.nameHi : user.nameEn}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize block">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <LogIn size={14} />
              <span>{language === 'hi' ? 'लॉगिन करें' : 'Sign In'}</span>
            </Link>
          )}

          <div className="text-[10px] text-slate-500 text-center">
            PanchayatMausam AI v1.0 • NIC & KVK Bhopal
          </div>
        </div>
      </aside>
    </>
  );
};

