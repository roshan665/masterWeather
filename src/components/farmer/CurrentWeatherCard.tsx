import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { MOCK_CURRENT_WEATHER } from '../../data/mockWeather';
import { WeatherIcon } from '../common/WeatherIcon';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import {
  Droplets,
  Wind,
  Sun,
  Gauge,
  Thermometer,
  CloudRain,
  Compass,
  AlertTriangle,
} from 'lucide-react';

export const CurrentWeatherCard: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { t } = useTranslation(language);

  const weather = MOCK_CURRENT_WEATHER[activePanchayat.id] || MOCK_CURRENT_WEATHER['acharpura'];

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
      {/* Decorative background ambient glow */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -bottom-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Location Name, Timestamp, & Data Source status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-800/50">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-100">
              {language === 'hi' ? activePanchayat.nameHi : activePanchayat.nameEn}
            </h1>
            <span className="text-xs px-2 py-0.5 bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 rounded-full font-medium">
              {activePanchayat.block}, {activePanchayat.district}
            </span>
          </div>
          <p className="text-xs text-emerald-300/80 mt-0.5">
            {t.lastUpdated}: 12 Sep 2026, 02:30 PM • {activePanchayat.weatherStationName}
          </p>
        </div>

        {/* Confidence and Fallback Badge */}
        <div>
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
        <div className="my-3 bg-amber-500/20 border border-amber-500/40 text-amber-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <span>
            {language === 'hi'
              ? 'स्थानीय स्टेशन बैकअप मोड में है। 5 किमी ग्रिडेड न्यूमेरिकल मॉडल अनुमान का उपयोग किया गया है।'
              : 'Local station in fallback mode. Using 5km gridded numerical reanalysis model.'}
          </span>
        </div>
      )}

      {/* Hero Temperature & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4 sm:py-6">
        
        {/* Main Temp & Condition */}
        <div className="md:col-span-6 flex items-center gap-4 sm:gap-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner shrink-0">
            <WeatherIcon condition={weather.condition} size={54} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white">
                {weather.tempC}°
              </span>
              <span className="text-emerald-300 font-semibold text-lg">C</span>
            </div>
            <div className="text-base sm:text-lg font-semibold text-emerald-100">
              {language === 'hi' ? weather.conditionTextHi : weather.conditionTextEn}
            </div>
            <div className="text-xs text-emerald-300/90 flex items-center gap-2 mt-0.5">
              <span>{t.feelsLike}: {weather.feelsLikeC}°C</span>
              <span>•</span>
              <span>H: {weather.tempMaxC}°C / L: {weather.tempMinC}°C</span>
            </div>
          </div>
        </div>

        {/* Quick Agromet Metric Badges Grid */}
        <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          
          {/* Rainfall 24h */}
          <div className="bg-emerald-950/70 border border-emerald-800/60 p-2.5 sm:p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-sky-400 text-xs mb-1">
              <CloudRain size={15} />
              <span className="text-slate-300 text-[11px] truncate">{t.rainfall24h}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {weather.rainfallMm24h} <span className="text-xs font-normal text-slate-300">mm</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-emerald-950/70 border border-emerald-800/60 p-2.5 sm:p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs mb-1">
              <Droplets size={15} />
              <span className="text-slate-300 text-[11px] truncate">{t.relativeHumidity}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {weather.relativeHumidityPct}%
            </div>
          </div>

          {/* Wind Speed */}
          <div className="bg-emerald-950/70 border border-emerald-800/60 p-2.5 sm:p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-teal-400 text-xs mb-1">
              <Wind size={15} />
              <span className="text-slate-300 text-[11px] truncate">{t.windSpeed}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {weather.windSpeedKmh} <span className="text-xs font-normal text-slate-300">km/h</span>
            </div>
          </div>

          {/* Solar Radiation */}
          <div className="bg-emerald-950/70 border border-emerald-800/60 p-2.5 sm:p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1">
              <Sun size={15} />
              <span className="text-slate-300 text-[11px] truncate">{t.solarRadiation}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {weather.solarRadiationWm2} <span className="text-xs font-normal text-slate-300">W/m²</span>
            </div>
          </div>

          {/* Reference ET0 */}
          <div className="bg-emerald-950/70 border border-emerald-800/60 p-2.5 sm:p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
              <Gauge size={15} />
              <span className="text-slate-300 text-[11px] truncate">{t.et0Evapo}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {weather.et0MmDay} <span className="text-xs font-normal text-slate-300">mm/d</span>
            </div>
          </div>

          {/* Dew Point */}
          <div className="bg-emerald-950/70 border border-emerald-800/60 p-2.5 sm:p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs mb-1">
              <Thermometer size={15} />
              <span className="text-slate-300 text-[11px] truncate">{t.dewPoint}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {weather.dewPointC}°C
            </div>
          </div>

        </div>

      </div>

      {/* Footer info note */}
      <div className="pt-3 border-t border-emerald-800/40 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300/75">
        <div className="flex items-center gap-2">
          <Compass size={14} className="text-emerald-400" />
          <span>{t.windDirection}: {weather.windDirectionCompass} ({weather.windDirectionDeg}°)</span>
          <span>•</span>
          <span>{t.airPressure}: {weather.pressureHpa} hPa</span>
        </div>
        <div className="text-[11px] text-emerald-400/90 font-medium">
          {language === 'hi' ? 'फसल जल मांग एवं छिड़काव समय हेतु अनुकूलित' : 'Optimized for Crop Water Budget & Spray Timing'}
        </div>
      </div>
    </div>
  );
};
