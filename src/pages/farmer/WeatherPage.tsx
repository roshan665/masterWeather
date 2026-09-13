import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_CURRENT_WEATHER, getForecastForPanchayat } from '../../data/mockWeather';
import { WeatherIcon } from '../../components/common/WeatherIcon';
import {
  Sun,
  Search,
  MapPin,
  Droplets,
  Wind,
  CloudRain,
  Gauge,
  Thermometer
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const [horizonTab, setHorizonTab] = useState<'today' | '7days' | '15days'>('today');

  const weather = MOCK_CURRENT_WEATHER[activePanchayat.id] || MOCK_CURRENT_WEATHER['acharpura'];
  const forecastData = getForecastForPanchayat(activePanchayat.id);

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-6 animate-in fade-in duration-200">
      
      {/* Top Header matching Mockup Screen 5 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Weather
          </h1>
        </div>

        <button
          type="button"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-emerald-950/60 transition-all cursor-pointer"
          aria-label="Search location"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Location line */}
      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold -mt-2">
        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{language === 'hi' ? `${activePanchayat.nameHi}, Phanda Block` : `${activePanchayat.nameEn}, Phanda Block`}</span>
      </div>

      {/* Horizon Tabs (Today, 7 Days, 15 Days) */}
      <div className="flex items-center bg-[#0a231e] p-1 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setHorizonTab('today')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            horizonTab === 'today'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => setHorizonTab('7days')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            horizonTab === '7days'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          7 Days
        </button>
        <button
          type="button"
          onClick={() => setHorizonTab('15days')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            horizonTab === '15days'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          15 Days
        </button>
      </div>

      {/* Big Hero Weather Card */}
      <div className="bg-card-emerald-glow rounded-3xl p-5 border border-emerald-500/30 text-white shadow-2xl relative overflow-hidden space-y-3">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#061e18]/80 border border-emerald-500/20 shrink-0">
            <WeatherIcon condition={weather.condition} size={56} />
          </div>
          <div>
            <div className="text-5xl font-black tracking-tight text-white leading-none">
              {weather.tempC}°<span className="text-2xl font-bold text-emerald-300">C</span>
            </div>
            <div className="text-base font-bold text-emerald-100 mt-1">
              {language === 'hi' ? weather.conditionTextHi : weather.conditionTextEn}
            </div>
            <div className="text-xs text-emerald-400/90 font-medium mt-0.5">
              Feels Like: {weather.feelsLikeC}°C
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-emerald-900/40 text-xs text-emerald-300 font-medium flex items-center justify-between">
          <span>↑ H: {weather.tempMaxC}°C</span>
          <span>↓ L: {weather.tempMinC}°C</span>
          <span>Station: {activePanchayat.weatherStationName}</span>
        </div>
      </div>

      {/* 2x3 Grid of Metrics matching Mockup Screen 5 */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Humidity */}
        <div className="bg-[#0a231e] border border-emerald-500/20 p-3 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <span>Humidity</span>
          </div>
          <div className="text-lg font-black text-white">{weather.relativeHumidityPct}%</div>
        </div>

        {/* Wind Speed */}
        <div className="bg-[#0a231e] border border-emerald-500/20 p-3 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Wind className="w-4 h-4 text-teal-400" />
            <span>Wind Speed</span>
          </div>
          <div className="text-lg font-black text-white">{weather.windSpeedKmh} km/h</div>
        </div>

        {/* Rainfall 24h */}
        <div className="bg-[#0a231e] border border-emerald-500/20 p-3 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span>Rainfall (24h)</span>
          </div>
          <div className="text-lg font-black text-white">{weather.rainfallMm24h} mm</div>
        </div>

        {/* Solar Radiation */}
        <div className="bg-[#0a231e] border border-emerald-500/20 p-3 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Solar Radiation</span>
          </div>
          <div className="text-lg font-black text-white">{weather.solarRadiationWm2} W/m²</div>
        </div>

        {/* Evapotranspiration */}
        <div className="bg-[#0a231e] border border-emerald-500/20 p-3 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>Evapotranspiration</span>
          </div>
          <div className="text-lg font-black text-white">{weather.et0MmDay} mm/d</div>
        </div>

        {/* Dew Point */}
        <div className="bg-[#0a231e] border border-emerald-500/20 p-3 rounded-2xl space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Thermometer className="w-4 h-4 text-indigo-400" />
            <span>Dew Point</span>
          </div>
          <div className="text-lg font-black text-white">{weather.dewPointC}°C</div>
        </div>

      </div>

      {/* Hourly Forecast Section matching Mockup Screen 5 */}
      <div className="space-y-2.5 pt-1">
        <h2 className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide">
          Hourly Forecast
        </h2>

        <div className="grid grid-cols-4 gap-2">
          {forecastData.hourlyNext24h.slice(0, 4).map((h, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between ${
                idx === 0
                  ? 'bg-[#0f382f] border-emerald-400 shadow-md shadow-emerald-950/40'
                  : 'bg-[#0a231e] border-emerald-900/40'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-300">
                {idx === 0 ? 'Now' : h.time}
              </span>
              <div className="my-1.5">
                <WeatherIcon condition={h.condition} size={24} />
              </div>
              <span className="text-base font-black text-white">{h.tempC}°</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
