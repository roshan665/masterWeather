import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockUsers';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  ChevronDown,
  Shield,
  MapPin,
  Check,
  UserCheck,
  LogIn
} from 'lucide-react';

export const UserProfileMenu: React.FC = () => {
  const { user, role, isAuthenticated, logout, switchDemoUser } = useAuth();
  const { language, setRole } = useApp();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const handleDemoSwitch = (demoUser: typeof DEMO_USERS[0]) => {
    switchDemoUser(demoUser.id);
    setRole(demoUser.role);
    setIsOpen(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
      >
        <LogIn size={14} />
        <span>{language === 'hi' ? 'लॉगिन करें' : 'Sign In'}</span>
      </Link>
    );
  }

  const roleBadgeColors = {
    farmer: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    officer: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    admin: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    researcher: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  };

  const roleEmoji = {
    farmer: '🚜',
    officer: '🏛️',
    admin: '⚙️',
    researcher: '🔬',
  };

  const userInitials = user.nameEn
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="User profile menu"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
          {userInitials}
        </div>

        <div className="text-left hidden md:block">
          <div className="text-xs font-bold text-white truncate max-w-[120px]">
            {language === 'hi' ? user.nameHi : user.nameEn}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold capitalize flex items-center gap-1">
            <span>{roleEmoji[role]}</span>
            <span>{role}</span>
          </div>
        </div>

        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Profile Card */}
          <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleBadgeColors[role]}`}>
                {roleEmoji[role]} {role.toUpperCase()}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                ● Active Session
              </span>
            </div>

            <div>
              <div className="text-sm font-black text-white">
                {language === 'hi' ? user.nameHi : user.nameEn}
              </div>
              <div className="text-xs text-slate-400 font-medium truncate">
                {language === 'hi' ? user.designationHi : user.designationEn}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user.email}
              </div>
            </div>

            {user.panchayatNameEn && (
              <div className="pt-1.5 border-t border-slate-700/80 flex items-center gap-1 text-[11px] text-emerald-300">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate">
                  {language === 'hi' ? user.panchayatNameHi : user.panchayatNameEn}, Phanda
                </span>
              </div>
            )}
          </div>

          {/* Quick Demo Switcher */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1">
              <UserCheck size={12} />
              <span>{language === 'hi' ? 'डेमो खाता बदलें (1-Click Switch)' : 'Switch Demo Account'}</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_USERS.map((demo) => {
                const isCurrent = demo.id === user.id;
                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleDemoSwitch(demo)}
                    className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-xs'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{roleEmoji[demo.role]}</span>
                      {isCurrent && <Check size={12} className="text-emerald-400" />}
                    </div>
                    <span className="font-bold text-[11px] truncate mt-1">
                      {language === 'hi' ? demo.nameHi.split(' ')[0] : demo.nameEn.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 capitalize">
                      {demo.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions summary */}
          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1">
              <Shield size={11} className="text-emerald-400" />
              <span>Granted Permissions:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.permissions.slice(0, 4).map((p) => (
                <span key={p} className="bg-slate-800 px-1.5 py-0.2 rounded text-[9px] text-slate-300">
                  {p.replace(/_/g, ' ')}
                </span>
              ))}
              {user.permissions.length > 4 && (
                <span className="text-[9px] text-emerald-400">+{user.permissions.length - 4} more</span>
              )}
            </div>
          </div>

          {/* Menu Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-300 hover:text-emerald-400 font-semibold px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>{language === 'hi' ? 'लॉगआउट' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
