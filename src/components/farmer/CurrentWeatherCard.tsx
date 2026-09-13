import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MOCK_CURRENT_WEATHER } from '../../data/mockWeather';
import { WeatherIcon } from '../common/WeatherIcon';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import {
  Droplets,
  Wind,
  Gauge,
  CloudRain,
  Compass,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const CurrentWeatherCard: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { t } = useTranslation(language);

  const weather = MOCK_CURRENT_WEATHER[activePanchayat.id] || MOCK_CURRENT_WEATHER['acharpura'];

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -right-10 -top-10 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-12 w-36 h-36 sm:w-48 sm:h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header: Location, Freshness & Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-emerald-800/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-emerald-100">
              {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn}
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 rounded-full font-bold">
              {activePanchayat.block}, {activePanchayat.district}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-300/80 mt-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {language === 'hi' ? 'मौसम अभी • 10 मिनट पहले अपडेट' : 'Current Weather • Updated 10m ago'}
            </span>
          </div>
        </div>

        {/* Confidence and Fallback Badge */}
        <div className="self-start sm:self-auto">
          <ConfidenceBadge
            confidence={weather.confidence}
            dataSourceLabel={language === 'hi' ? weather.dataSourceLabelHi : weather.dataSourceLabelEn}
            isFallback={weather.isFallback}
            language={language}
          />
        </div>
      </div>

      {/* Fallback Notice if active */}
      {weather.isFallback && (
        <div className="my-3 bg-amber-500/20 border border-amber-500/40 text-amber-200 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          <span>
            {language === 'hi'
              ? 'स्थानीय स्टेशन बैकअप मोड में है। 5 किमी ग्रिडेड न्यूमेरिकल मॉडल अनुमान का उपयोग किया गया है।'
              : 'Local station in fallback mode. Using 5km gridded numerical reanalysis model.'}
          </span>
        </div>
      )}

      {/* Main Temperature & Agromet Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center py-4">
        
        {/* Left: Prominent Hero Temperature */}
        <div className="md:col-span-6 flex items-center gap-4">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner shrink-0">
            <WeatherIcon condition={weather.condition} size={52} />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
                {weather.tempC}°
              </span>
              <span className="text-emerald-300 font-bold text-xl sm:text-2xl">C</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-100 leading-tight">
              {language === 'hi' ? weather.conditionTextHi : weather.conditionTextEn}
            </div>
            <div className="text-xs sm:text-sm text-emerald-300/90 flex flex-wrap items-center gap-1.5 mt-1 font-medium">
              <span>{t.feelsLike}: {weather.feelsLikeC}°C</span>
              <span>•</span>
              <span>अधिकतम: {weather.tempMaxC}°C / न्यूनतम: {weather.tempMinC}°C</span>
            </div>
          </div>
        </div>

        {/* Right: Essential 4-Block Farmer Metrics */}
        <div className="md:col-span-6 grid grid-cols-2 gap-2.5 sm:gap-3">
          
          {/* 1. Rainfall 24h */}
          <div className="bg-emerald-950/80 border border-emerald-800/70 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-sky-400 text-xs mb-1">
              <CloudRain size={16} className="shrink-0" />
              <span className="text-slate-200 text-xs font-semibold">{t.rainfall24h}</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {weather.rainfallMm24h} <span className="text-xs font-normal text-slate-300">mm</span>
            </div>
          </div>

          {/* 2. Humidity */}
          <div className="bg-emerald-950/80 border border-emerald-800/70 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs mb-1">
              <Droplets size={16} className="shrink-0" />
              <span className="text-slate-200 text-xs font-semibold">{t.relativeHumidity}</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {weather.relativeHumidityPct}%
            </div>
          </div>

          {/* 3. Wind Speed */}
          <div className="bg-emerald-950/80 border border-emerald-800/70 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-teal-400 text-xs mb-1">
              <Wind size={16} className="shrink-0" />
              <span className="text-slate-200 text-xs font-semibold">{t.windSpeed}</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {weather.windSpeedKmh} <span className="text-xs font-normal text-slate-300">km/h</span>
            </div>
          </div>

          {/* 4. Daily ET0 / Evaporation */}
          <div className="bg-emerald-950/80 border border-emerald-800/70 p-3 rounded-2xl">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
              <Gauge size={16} className="shrink-0" />
              <span className="text-slate-200 text-xs font-semibold">{t.et0Evapo}</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              {weather.et0MmDay} <span className="text-xs font-normal text-slate-300">mm/दिन</span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Details: Wind Direction & Solar Radiation */}
      <div className="pt-3 border-t border-emerald-800/40 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300/80">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-emerald-400 shrink-0" />
          <span>{t.windDirection}: {weather.windDirectionCompass} ({weather.windDirectionDeg}°)</span>
          <span>•</span>
          <span className="hidden sm:inline">{t.solarRadiation}: {weather.solarRadiationWm2} W/m²</span>
        </div>
        <div className="text-[11px] text-amber-300 font-bold">
          {weather.windSpeedKmh < 12
            ? (language === 'hi' ? '✓ स्प्रे हेतु अनुकूल हवा' : '✓ Favourable spray wind')
            : (language === 'hi' ? '⚠ तेज हवा - स्प्रे से बचें' : '⚠ High wind - avoid spray')}
        </div>
      </div>
    </div>
  );
};
