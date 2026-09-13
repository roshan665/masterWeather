import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { ShieldAlert, ArrowRight, UserCheck, Home, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, role, loginAsDemoUser } = useAuth();
  const { language } = useApp();
  const location = useLocation();

  // If not logged in, redirect to login page with return state
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is not allowed, show role-switch banner & restricted access screen
  if (allowedRoles && !allowedRoles.includes(role)) {

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={32} />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block mb-2">
              {language === 'hi' ? 'भूमिका प्रतिबंध (Access Restricted)' : 'Role Restricted View'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'hi' ? 'इस पृष्ठ हेतु अधिकृत भूमिका आवश्यक है' : 'Authorized Role Required'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
              {language === 'hi'
                ? `वर्तमान में आप "${user.nameHi}" (${role.toUpperCase()}) के रूप में लॉगिन हैं। यह अनुभाग केवल ${allowedRoles.map(r => r.toUpperCase()).join(' या ')} उपयोगकर्ताओं के लिए उपलब्ध है।`
                : `You are currently logged in as "${user.nameEn}" (${role.toUpperCase()}). This portal section is restricted to [${allowedRoles.map(r => r.toUpperCase()).join(', ')}] roles.`}
            </p>
          </div>

          {/* 1-Click Fast Switch for Demo Convenience */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UserCheck size={16} className="text-emerald-700" />
              <span>{language === 'hi' ? 'डेमो त्वरित भूमिका स्विच:' : 'Demo Quick Role Switch:'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allowedRoles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => loginAsDemoUser(r)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer"
                >
                  <span className="capitalize">Switch to {r} Demo Role</span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              <Home size={14} />
              <span>{language === 'hi' ? 'किसान डैशबोर्ड पर लौटें' : 'Return to Home'}</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              <LogIn size={14} />
              <span>{language === 'hi' ? 'अन्य खाते से लॉगिन करें' : 'Login as Different User'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
