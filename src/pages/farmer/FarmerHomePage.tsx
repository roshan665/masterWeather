import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
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
  const { t } = useTranslation(language);

  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);

  const activeAlerts = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  );

  return (
    <div className="space-y-5">
      {/* Farmer Greeting Banner in Hindi by default */}
      <div className="bg-gradient-to-r from-emerald-850 via-emerald-900 to-teal-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>
              {language === 'hi'
                ? 'पंचायत मौसम AI - फंदा ब्लॉक, भोपाल'
                : 'PanchayatMausam AI - Phanda Block, Bhopal'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            {language === 'hi'
              ? `नमस्ते किसान भाई! 🙏`
              : `Welcome, Farmer! 🙏`}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-300">
              <MapPin className="w-3.5 h-3.5" />
              {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-200">
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-950/40 transition-all cursor-pointer self-start md:self-center shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>{language === 'hi' ? 'खेत रिपोर्ट दर्ज करें' : 'Report Field Observation'}</span>
        </button>
      </div>

      {/* High-priority Active Alert Banner if any */}
      {activeAlerts.length > 0 && (
        <div className="bg-amber-500/15 border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0 animate-pulse">
              <CloudLightning size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-amber-950">
                  {language === 'hi' ? activeAlerts[0].headlineHi : activeAlerts[0].headlineEn}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/90 mt-1 line-clamp-2">
                {language === 'hi' ? activeAlerts[0].descriptionHi : activeAlerts[0].descriptionEn}
              </p>
            </div>
          </div>

          <Link
            to="/alerts"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl whitespace-nowrap self-end sm:self-center shadow-xs transition-colors shrink-0"
          >
            {language === 'hi' ? 'अलर्ट विवरण देखें' : 'View Full Alert'}
          </Link>
        </div>
      )}

      {/* 1. Hero Weather Card with Live AWS Telemetry */}
      <CurrentWeatherCard />

      {/* Quick Action Navigation Grid for Farmers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setIsObservationModalOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-md hover:shadow-lg transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Eye size={18} />
            </div>
            <div>
              <div>{t.observationTitle}</div>
              <span className="text-[11px] font-normal text-emerald-100 block">
                {language === 'hi' ? 'वर्षा, कीट या खेत की स्थिति साझा करें' : 'Report local rain, soil, or pest signs'}
              </span>
            </div>
          </div>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        <Link
          to="/risks"
          className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-between shadow-xs hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 text-orange-700 rounded-xl">
              <ShieldAlert size={18} />
            </div>
            <div className="text-left">
              <div>{t.compositeRiskScore}</div>
              <span className="text-[11px] font-normal text-slate-500 block">
                {language === 'hi' ? 'कीट, तापमान व जलभराव जोखिम जांचें' : 'Check pest, thermal & moisture risks'}
              </span>
            </div>
          </div>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-slate-400 shrink-0" />
        </Link>
      </div>

      {/* 2. Crop Stage Tracker with Stage Source Selector */}
      <CropStageTracker />

      {/* 3. Crop Risk Overview */}
      <RiskOverviewCard />

      {/* 4. Agricultural Forecast Tabs (Hourly Spray, 1-3d, 4-7d) */}
      <ForecastTabs />

      {/* 5. Approved Agromet Advisories */}
      <AdvisoryList />

      {/* Observation Modal */}
      <ObservationFormModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
      />
    </div>
  );
};
