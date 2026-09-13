import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockUsers';
import type { UserRole } from '../../types';
import {
  LogIn,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemoUser } = useAuth();
  const { language, toggleLanguage, setRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('farmer');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default redirect path based on role or location state
  const fromPath = (location.state as any)?.from?.pathname;

  const getRoleDefaultPath = (targetRole: UserRole): string => {
    if (fromPath) return fromPath;
    switch (targetRole) {
      case 'officer':
        return '/officer';
      case 'admin':
        return '/admin';
      case 'researcher':
        return '/research';
      case 'farmer':
      default:
        return '/';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = await login({ username, password, rememberMe });
    setIsSubmitting(false);

    if (res.success) {
      const matched = DEMO_USERS.find((u) => u.username.toLowerCase() === username.toLowerCase());
      const userRole = matched?.role || 'farmer';
      setRole(userRole);
      navigate(getRoleDefaultPath(userRole), { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  const handleQuickDemoLogin = (demo: typeof DEMO_USERS[0]) => {
    loginAsDemoUser(demo.role);
    setRole(demo.role);
    navigate(getRoleDefaultPath(demo.role), { replace: true });
  };

  const demoRoleDescriptions = {
    farmer: {
      titleHi: 'किसान खाता',
      titleEn: 'Farmer Persona',
      descHi: 'स्थानीय मौसम, 7-दिवसीय वर्षा, फसल जोखिम एवं कृषि सलाह देखें',
      descEn: 'View hyperlocal agromet alerts, spray windows, and crop risk',
      badge: '🚜 Farmer',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    officer: {
      titleHi: 'कृषि अधिकारी खाता',
      titleEn: 'Agricultural Officer',
      descHi: 'सलाह समीक्षा, आपातकालीन अलर्ट प्रसारण एवं 5-GP जोखिम नियंत्रण',
      descEn: 'Review & approve advisories, broadcast emergency alerts, and validate ground data',
      badge: '🏛️ Officer',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    admin: {
      titleHi: 'सिस्टम प्रशासक',
      titleEn: 'System Administrator',
      descHi: 'नियम इंजन कॉन्फ़िगरेशन, AWS स्टेशन स्वास्थ्य एवं ऑडिट लॉग्स',
      descEn: 'Manage rule engine, AWS telemetry node health, and audit trail',
      badge: '⚙️ Admin',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    researcher: {
      titleHi: 'अनुसंधान वैज्ञानिक',
      titleEn: 'Research Scientist',
      descHi: 'FAO-56 ET₀ मॉडल, GDD कैलक्यूलेटर एवं NWP मॉडल सत्यापन',
      descEn: 'Access agromet models, ET0 calibration, and NWP verification benchmarks',
      badge: '🔬 Researcher',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 flex flex-col justify-center items-center">
      {/* Container */}
      <div className="w-full max-w-4xl space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 bg-slate-900 px-4 py-2 rounded-2xl border border-emerald-800/60 shadow-lg mb-2">
            <span className="text-2xl">🌱</span>
            <div className="text-left">
              <span className="font-black text-white text-base tracking-tight block">
                {language === 'hi' ? 'पंचायत मौसम AI' : 'PanchayatMausam AI'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                Phanda Block, Bhopal (Madhya Pradesh)
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'hi' ? 'प्रणाली प्रमाणीकरण एवं भूमिका चयन' : 'System Sign-in & Role Selection'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            {language === 'hi'
              ? 'फंदा ब्लॉक के 5 ग्राम पंचायतों (आचारपुरा, बंगरसिया, रातीबड़, समसगढ़, सूखी सेवनिया) के लिए निर्णय समर्थन प्रणाली।'
              : 'Agricultural decision-support system for 5 Gram Panchayats in Phanda block, Bhopal district.'}
          </p>
        </div>

        {/* 1-Click Fast Demo Accounts Showcase */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm sm:text-base">
              <UserCheck size={18} className="text-emerald-400" />
              <span>{language === 'hi' ? '1-क्लिक त्वरित डेमो लॉगिन (भूमिका चुनें)' : '1-Click Fast Demo Role Login'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
              Instant access without password entry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEMO_USERS.map((demo) => {
              const meta = demoRoleDescriptions[demo.role];
              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demo)}
                  className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/80 transition-all text-left group cursor-pointer flex flex-col justify-between space-y-2 hover:shadow-lg hover:shadow-emerald-950/40"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${meta.badgeColor}`}>
                        {meta.badge}
                      </span>
                      <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>

                    <div className="font-black text-white text-sm pt-1">
                      {language === 'hi' ? demo.nameHi : demo.nameEn}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {language === 'hi' ? meta.descHi : meta.descEn}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Login as {demo.role.toUpperCase()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Username / Password Form (FastAPI / JWT Ready) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 max-w-md mx-auto">
          <div className="text-center pb-2 border-b border-slate-800">
            <h2 className="font-bold text-sm text-white flex items-center justify-center gap-2">
              <Lock size={15} className="text-emerald-400" />
              <span>{language === 'hi' ? 'मानक क्रेडेंशियल लॉगिन' : 'Standard Credential Login'}</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Future FastAPI / JWT authentication endpoint format
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Username / उपयोगकर्ता नाम
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. farmer, officer, admin, researcher"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Password / पासवर्ड
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <span>Remember me</span>
              </label>

              <span className="text-[11px] text-emerald-400 font-mono">
                demo pass: demo123
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              <LogIn size={15} />
              <span>{isSubmitting ? 'Verifying...' : (language === 'hi' ? 'लॉगिन करें' : 'Sign In')}</span>
            </button>
          </form>
        </div>

        {/* Footer info & Language Toggle */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-900 max-w-md mx-auto">
          <button
            type="button"
            onClick={toggleLanguage}
            className="hover:text-slate-300 font-semibold cursor-pointer"
          >
            Language: {language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
          </button>

          <Link to="/" className="hover:text-slate-300 underline font-semibold">
            {language === 'hi' ? 'बिना लॉगिन होम देखें →' : 'Continue as Guest →'}
          </Link>
        </div>
      </div>
    </div>
  );
};
