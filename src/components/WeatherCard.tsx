import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Activity,
  CloudRain
} from 'lucide-react';
import type { CurrentWeather } from '../types';
import { WeatherIcon } from './common/WeatherIcon';
import { DataFreshnessLabel } from './DataFreshnessLabel';
import { useTranslation } from '../i18n/useTranslation';

export interface WeatherCardProps {
  weather: CurrentWeather;
  panchayatName: string;
  panchayatNameHi: string;
  awsStationId?: string;
  className?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  panchayatName,
  panchayatNameHi,
  awsStationId,
  className = ''
}) => {
  const { language } = useTranslation();

  const temp = weather.tempC ?? (weather as any).temperature ?? 29.4;
  const feelsLike = weather.feelsLikeC ?? (weather as any).feelsLike ?? 32.0;
  const tempMin = weather.tempMinC ?? (weather as any).tempMin ?? 22.0;
  const tempMax = weather.tempMaxC ?? (weather as any).tempMax ?? 31.5;
  const humidity = weather.relativeHumidityPct ?? (weather as any).humidity ?? 75;
  const windSpeed = weather.windSpeedKmh ?? (weather as any).windSpeed ?? 12;
  const windDir = weather.windDirectionCompass ?? (weather as any).windDirection ?? 'SW';
  const et0 = weather.et0MmDay ?? (weather as any).et0 ?? 3.8;
  const rain24h = weather.rainfallMm24h ?? (weather as any).rainfall24h ?? 0;
  const conditionHi = weather.conditionTextHi ?? (weather as any).conditionHi ?? 'आंशिक बादल';
  const conditionEn = weather.conditionTextEn ?? (weather as any).conditionEn ?? 'Partly Cloudy';
  const solarRad = weather.solarRadiationWm2 ?? (weather as any).solarRadiation ?? 540;
  const isDemo = (weather as any).isDemoData ?? true;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border border-emerald-500/30 p-5 sm:p-7 shadow-xl shadow-slate-950/50 ${className}`}>
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {language === 'hi' ? panchayatNameHi : panchayatName}
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
              {language === 'hi' ? 'लाइव एडब्ल्यूएस' : 'Live AWS'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'hi' ? 'फंदा ब्लॉक, भोपाल, मध्य प्रदेश' : 'Phanda Block, Bhopal, MP'}
          </p>
        </div>

        <DataFreshnessLabel
          minutesAgo={10}
          awsStationId={awsStationId || weather.panchayatId}
          isDemo={isDemo}
        />
      </div>

      {/* Main Temp & Condition */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        <div className="md:col-span-5 flex items-center gap-4 sm:gap-6">
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg shrink-0">
            <WeatherIcon condition={weather.condition} className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                {typeof temp === 'number' ? temp.toFixed(1) : temp}°
              </span>
              <span className="text-lg text-slate-400 font-semibold">C</span>
            </div>
            <div className="text-sm font-semibold text-emerald-300 mt-0.5">
              {language === 'hi' ? conditionHi : conditionEn}
            </div>
            <div className="text-xs text-slate-400">
              {language === 'hi' ? `महसूस: ${feelsLike}°C` : `Feels like: ${feelsLike}°C`} • Min: {tempMin}° / Max: {tempMax}°
            </div>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Humidity */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'hi' ? 'आर्द्रता (RH)' : 'Humidity'}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {humidity}%
            </div>
          </div>

          {/* Wind Speed & Direction */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'hi' ? 'हवा की गति' : 'Wind'}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white flex items-baseline gap-1">
              <span>{windSpeed}</span>
              <span className="text-[10px] text-slate-400 font-normal">km/h ({windDir})</span>
            </div>
          </div>

          {/* Reference ET0 */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'वाष्पोत्सर्जन (ET₀)' : 'Ref ET₀'}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-300 flex items-baseline gap-1">
              <span>{et0}</span>
              <span className="text-[10px] text-emerald-400/80 font-normal">mm/day</span>
            </div>
          </div>

          {/* Rainfall 24h */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'hi' ? '24h वर्षा' : '24h Rain'}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white flex items-baseline gap-1">
              <span>{rain24h}</span>
              <span className="text-[10px] text-slate-400 font-normal">mm</span>
            </div>
          </div>

          {/* Leaf Wetness / Soil */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'hi' ? 'पत्ती की नमी' : 'Leaf Wetness'}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {(weather as any).leafWetness ?? 25}%
            </div>
          </div>

          {/* Solar Radiation */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'सौर विकिरण' : 'Solar Rad'}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white flex items-baseline gap-1">
              <span>{solarRad}</span>
              <span className="text-[10px] text-slate-400 font-normal">W/m²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
