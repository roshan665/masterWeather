import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLiveWeather } from '../../context/LiveWeatherContext';
import { useMockData } from '../../context/MockDataContext';
import { CROPS } from '../../data/crops';
import { ObservationFormModal } from '../../components/farmer/ObservationFormModal';
import { WeatherIcon } from '../../components/common/WeatherIcon';
import {
  MapPin,
  Sparkles,
  Zap,
  Droplets,
  Wind,
  CloudRain,
  ChevronRight,
  Camera,
  Bug,
  Sprout,
  Radio,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FarmerHomePage: React.FC = () => {
  const { language, activePanchayat, activeCrop, setActiveCrop } = useApp();
  const { alerts, advisories } = useMockData();
  const { weather, daily7d, isLive, isRefreshing, refreshWeather } = useLiveWeather();
  const navigate = useNavigate();

  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'forecast' | 'advisories'>('forecast');

  const activeAlerts = alerts.filter(
    (a) => a.isActive && a.panchayatIds.includes(activePanchayat.id)
  );

  const filteredAdvisories = advisories.filter(
    (adv) => adv.approvalStatus === 'approved' && (adv.panchayatId === activePanchayat.id || adv.panchayatId === 'acharpura')
  );

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-6 animate-in fade-in duration-200">
      
      {/* 1. Welcome Farmer Header Banner with Glowing Button */}
      <div className="bg-gradient-to-br from-[#0e352c] to-[#071f1a] rounded-3xl p-4 sm:p-5 border border-emerald-500/25 shadow-xl flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-1.5">
            <span>{language === 'hi' ? 'Welcome, Farmer! 🙏' : 'Welcome, Farmer! 🙏'}</span>
          </h1>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{language === 'hi' ? `${activePanchayat.nameHi}, Phanda Block, Bhopal` : `${activePanchayat.nameEn}, Phanda Block, Bhopal`}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsObservationModalOpen(true)}
          className="px-3.5 py-2.5 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-950/40 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span className="leading-tight text-center">
            {language === 'hi' ? 'Report Field\nObservation' : 'Report Field\nObservation'}
          </span>
        </button>
      </div>

      {/* 2. Yellow Alert Card (Matching Mockup) */}
      <div className="bg-gradient-to-r from-[#2a1d08] to-[#1c1305] border border-amber-500/40 rounded-3xl p-4 text-amber-100 shadow-lg space-y-1.5">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="font-extrabold text-xs sm:text-sm text-amber-300">
              {activeAlerts[0]
                ? (language === 'hi' ? activeAlerts[0].headlineHi : activeAlerts[0].headlineEn)
                : 'Yellow Alert: Moderate to Heavy Thunderstorms Expected'}
            </div>
            <p className="text-[11px] sm:text-xs text-amber-100/85 mt-0.5 leading-relaxed">
              {activeAlerts[0]
                ? (language === 'hi' ? activeAlerts[0].descriptionHi : activeAlerts[0].descriptionEn)
                : 'Postpone chemical spraying and open drainage channels in low-lying soybean fields.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Current Weather Hero Card (Glossy Dark Emerald with Live Status) */}
      <div className="bg-card-emerald-glow rounded-3xl p-4 sm:p-5 border border-emerald-500/30 text-white shadow-2xl relative overflow-hidden space-y-4">
        {/* Subtle glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Title with Live Indicator & Refresh */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Current Weather</span>
          </div>

          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <Radio className="w-2.5 h-2.5 text-emerald-400" />
                <span>Live Open-Meteo</span>
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
                Regional
              </span>
            )}

            <button
              type="button"
              onClick={() => refreshWeather()}
              disabled={isRefreshing}
              className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition cursor-pointer"
              title="Refresh live weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Temperature & Condition */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[#061e18]/80 border border-emerald-500/20 shrink-0">
            <WeatherIcon condition={weather.condition} size={50} />
          </div>
          <div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
              {weather.tempC}°<span className="text-2xl font-bold text-emerald-300">C</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-100 mt-1">
              {language === 'hi' ? weather.conditionTextHi : weather.conditionTextEn}
            </div>
            <div className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
              Feels Like: {weather.feelsLikeC}°C • H: {weather.tempMaxC}°C / L: {weather.tempMinC}°C
            </div>
          </div>
        </div>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Humidity */}
          <div className="bg-[#071d18]/80 border border-emerald-500/20 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-300 mb-0.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Humidity</span>
            </div>
            <div className="text-sm sm:text-base font-black text-white">{weather.relativeHumidityPct}%</div>
          </div>

          {/* Wind Speed */}
          <div className="bg-[#071d18]/80 border border-emerald-500/20 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-300 mb-0.5">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>Wind Speed</span>
            </div>
            <div className="text-sm sm:text-base font-black text-white">{weather.windSpeedKmh} km/h</div>
          </div>

          {/* Rainfall */}
          <div className="bg-[#071d18]/80 border border-emerald-500/20 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 text-[11px] text-slate-300 mb-0.5">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>Rainfall (24h)</span>
            </div>
            <div className="text-sm sm:text-base font-black text-white">{weather.rainfallMm24h} mm</div>
          </div>
        </div>
      </div>

      {/* 4. Quick Crop Access (Matching Mockup) */}
      <div className="space-y-2.5">
        <h2 className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide px-1">
          Quick Crop Access
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {CROPS.map((crop) => {
            const isSelected = activeCrop.id === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => setActiveCrop(crop)}
                className={`py-3 px-2 rounded-2xl text-center font-bold text-xs transition-all cursor-pointer border flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-950/50 scale-[1.02]'
                    : 'bg-[#0a231e] text-slate-300 border-emerald-900/40 hover:bg-[#0f2e28]'
                }`}
              >
                <span className="text-sm font-extrabold">{crop.nameEn}</span>
                <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  ({crop.nameHi})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Crop Details & Forecast/Advisories Container */}
      <div className="bg-[#0a231e]/95 border border-emerald-500/25 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Crop Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Crop Details
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              {activeCrop.nameEn} ({activeCrop.nameHi})
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{activeCrop.seasonNameEn} • 90–110 days</span>
            </p>
          </div>

          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-extrabold uppercase">
            {activeCrop.seasonNameEn}
          </span>
        </div>

        {/* Segmented Control: Weather Forecast vs Advisories */}
        <div className="flex items-center bg-[#061613] p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('forecast')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'forecast'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weather Forecast
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advisories')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'advisories'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Advisories
          </button>
        </div>

        {/* Tab 1: Daily Forecast List (Real-time Live Data) */}
        {activeTab === 'forecast' && (
          <div className="space-y-2">
            {daily7d.slice(0, 5).map((d, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/forecast')}
                className="p-3 rounded-2xl bg-[#061e18]/70 border border-emerald-900/40 flex items-center justify-between hover:border-emerald-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14">
                    <span className="font-extrabold text-xs text-white block">{d.dayNameEn}</span>
                    <span className="text-[10px] text-slate-400">{d.date.slice(5)}</span>
                  </div>
                  <WeatherIcon condition={d.condition} size={24} />
                  <div>
                    <span className="font-black text-xs sm:text-sm text-white">{d.tempMaxC}° / {d.tempMinC}°</span>
                    <span className="text-[10px] text-slate-400 block">{d.conditionTextEn}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                    <CloudRain className="w-3 h-3" />
                    <span>{d.rainfallExpectedMm} mm</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Advisories List (Matching Mockup 4) */}
        {activeTab === 'advisories' && (
          <div className="space-y-2.5">
            {filteredAdvisories.map((adv) => (
              <div
                key={adv.id}
                className="p-3.5 rounded-2xl bg-[#061e18]/80 border border-emerald-900/50 space-y-2"
              >
                <div className="flex items-start gap-3">
                  {/* Category icon circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    adv.type === 'pest_management'
                      ? 'bg-sky-500/20 text-sky-400'
                      : adv.type === 'irrigation'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {adv.type === 'pest_management' ? <Bug size={16} /> : adv.type === 'irrigation' ? <Droplets size={16} /> : <Sprout size={16} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {adv.titleEn}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">Today</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {adv.shortSummaryEn}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-emerald-400 font-semibold">
                      <span>✓ {adv.sourceAuthorityEn}</span>
                      <span>•</span>
                      <span className="text-amber-400">High Priority</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Observation Modal */}
      <ObservationFormModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
      />
    </div>
  );
};
