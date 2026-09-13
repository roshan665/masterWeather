import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { CurrentWeatherCard } from '../../components/farmer/CurrentWeatherCard';
import { CropStageTracker } from '../../components/farmer/CropStageTracker';
import { ForecastTabs } from '../../components/farmer/ForecastTabs';
import { RiskOverviewCard } from '../../components/farmer/RiskOverviewCard';
import { AdvisoryList } from '../../components/farmer/AdvisoryList';
import { ObservationFormModal } from '../../components/farmer/ObservationFormModal';
import {
  Eye,
  ArrowRight,
  ShieldAlert,
  CloudLightning,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmerHomePage: React.FC = () => {
  const { language, activePanchayat, activeCrop } = useApp();
  const { alerts } = useMockData();

  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);

  const activeAlerts = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Farmer Greeting & Context Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-teal-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>
              {language === 'hi'
                ? 'पंचायत मौसम AI • फंदा ब्लॉक, भोपाल'
                : 'PanchayatMausam AI • Phanda Block, Bhopal'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            {language === 'hi'
              ? `नमस्ते किसान भाई! 🙏`
              : `Welcome, Farmer! 🙏`}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 flex flex-wrap items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 font-bold text-amber-300">
              <MapPin className="w-3.5 h-3.5" />
              {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-200">
              <span className="text-base">{activeCrop.icon}</span>
              {language === 'hi' ? activeCrop.nameHi : activeCrop.nameEn}
            </span>
            <span>•</span>
            <span className="text-slate-300">
              {language === 'hi' ? 'आज का सटीक कृषि-मौसम निर्णय' : "Today's Agromet Decision"}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsObservationModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-950/40 active:scale-95 transition-all cursor-pointer self-start md:self-center shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>{language === 'hi' ? 'खेत रिपोर्ट दर्ज करें' : 'Report Field Observation'}</span>
        </button>
      </div>

      {/* 2. Critical Alert Banner (if active) */}
      {activeAlerts.length > 0 && (
        <div className="bg-amber-500/15 border-2 border-amber-500 rounded-3xl p-4 sm:p-5 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-2xl shadow-xs shrink-0 animate-pulse">
              <CloudLightning size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md inline-block mb-1">
                {language === 'hi' ? 'महत्वपूर्ण चेतावनी' : 'URGENT ALERT'}
              </span>
              <h2 className="font-extrabold text-sm sm:text-base text-amber-950 leading-snug">
                {language === 'hi' ? activeAlerts[0].headlineHi : activeAlerts[0].headlineEn}
              </h2>
              <p className="text-xs sm:text-sm text-amber-900 mt-1 line-clamp-2 font-medium">
                {language === 'hi' ? activeAlerts[0].descriptionHi : activeAlerts[0].descriptionEn}
              </p>
            </div>
          </div>

          <Link
            to="/alerts"
            className="min-h-[44px] flex items-center justify-center px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl whitespace-nowrap self-stretch sm:self-center shadow-xs transition-colors shrink-0 text-center"
          >
            {language === 'hi' ? 'अलर्ट विवरण देखें' : 'View Full Alert'}
          </Link>
        </div>
      )}

      {/* 3. Hero Weather Card */}
      <CurrentWeatherCard />

      {/* 4. Crop Risk Overview */}
      <RiskOverviewCard />

      {/* 5. Approved Agromet Advisories */}
      <AdvisoryList />

      {/* 6. Agricultural Forecast Tabs (Hourly Spray, 1-3d, 4-7d) */}
      <ForecastTabs />

      {/* 7. Crop Stage Tracker */}
      <CropStageTracker />

      {/* 8. Quick Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => setIsObservationModalOpen(true)}
          className="min-h-[48px] p-4 rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl shrink-0">
              <Eye size={20} />
            </div>
            <div>
              <div className="font-extrabold">{language === 'hi' ? 'खेत अवलोकन दर्ज करें' : 'Submit Field Observation'}</div>
              <span className="text-[11px] font-normal text-emerald-100 block">
                {language === 'hi' ? 'वर्षा, कीट या खेत की स्थिति साझा करें' : 'Report local rain, soil, or pest signs'}
              </span>
            </div>
          </div>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform shrink-0 text-white" />
        </button>

        <Link
          to="/risks"
          className="min-h-[48px] p-4 rounded-3xl bg-white border border-slate-200 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs hover:border-emerald-300 active:scale-98 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-700 rounded-2xl shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="text-left">
              <div className="font-extrabold">{language === 'hi' ? 'सम्पूर्ण फसल जोखिम मीटर' : 'Full Crop Risk Matrix'}</div>
              <span className="text-[11px] font-normal text-slate-500 block">
                {language === 'hi' ? 'कीट, तापमान व जलभराव जोखिम जांचें' : 'Check pest, thermal & moisture risks'}
              </span>
            </div>
          </div>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-slate-400 shrink-0" />
        </Link>
      </div>

      {/* Observation Modal */}
      <ObservationFormModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
      />
    </div>
  );
};
