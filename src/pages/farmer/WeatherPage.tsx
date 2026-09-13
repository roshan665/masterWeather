import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLiveWeather } from '../../context/LiveWeatherContext';
import { WeatherIcon } from '../../components/common/WeatherIcon';
import {
  Sun,
  MapPin,
  Droplets,
  Wind,
  CloudRain,
  Gauge,
  Thermometer,
  RefreshCw,
  Radio,
  Clock,
  Calendar
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { weather, hourly24h, daily7d, daily15d, isLive, isRefreshing, lastUpdated, refreshWeather } = useLiveWeather();
  const [horizonTab, setHorizonTab] = useState<'today' | '7days' | '15days'>('today');

  const formattedTime = lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-6 animate-in fade-in duration-200">
      
      {/* Top Header matching Mockup Screen 5 */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {language === 'hi' ? 'मौसम पूर्वानुमान' : 'Weather Forecast'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Live Open-Meteo</span>
            </span>
          ) : (
            <span className="text-[11px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              Regional
            </span>
          )}

          <button
            type="button"
            onClick={() => refreshWeather()}
            disabled={isRefreshing}
            className="p-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 transition cursor-pointer disabled:opacity-50"
            title="Refresh realtime weather"
            aria-label="Refresh realtime weather"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Location line */}
      <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold -mt-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{language === 'hi' ? `${activePanchayat.nameHi}, फंदा ब्लॉक` : `${activePanchayat.nameEn}, Phanda Block`}</span>
        </div>
        <span className="text-slate-400 text-[11px] flex items-center gap-1 font-normal">
          <Clock className="w-3 h-3 text-slate-400" />
          {language === 'hi' ? `अपडेट: ${formattedTime}` : `Updated: ${formattedTime}`}
        </span>
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
          {language === 'hi' ? 'आज का मौसम' : 'Today'}
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
          {language === 'hi' ? '7 दिन का अनुमान' : '7 Days'}
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
          {language === 'hi' ? '15 दिन (विस्तारित)' : '15 Days'}
        </button>
      </div>

      {/* TODAY TAB */}
      {horizonTab === 'today' && (
        <div className="space-y-4">
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
                  Feels Like: {weather.feelsLikeC}°C • {weather.windDirectionCompass} ({weather.windDirectionDeg}°)
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-900/40 text-xs text-emerald-300 font-medium flex items-center justify-between">
              <span>↑ H: {weather.tempMaxC}°C</span>
              <span>↓ L: {weather.tempMinC}°C</span>
              <span>Pressure: {weather.pressureHpa} hPa</span>
            </div>
          </div>

          {/* 2x3 Grid of Agromet Metrics */}
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
                <span>UV Index</span>
              </div>
              <div className="text-lg font-black text-white">{weather.uvIndex || 6.2}</div>
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

          {/* 24-Hour Hourly Scrollable Forecast */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide">
                24-Hour Hourly Forecast
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold">Scroll ➔</span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-2">
              {hourly24h.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between shrink-0 min-w-[76px] ${
                    idx === 0
                      ? 'bg-[#0f382f] border-emerald-400 shadow-md shadow-emerald-950/40'
                      : 'bg-[#0a231e] border-emerald-900/40 hover:border-emerald-700/50'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-300">
                    {idx === 0 ? 'Now' : h.time}
                  </span>
                  <div className="my-1.5">
                    <WeatherIcon condition={h.condition} size={24} />
                  </div>
                  <span className="text-sm font-black text-white">{h.tempC}°</span>
                  <div className="text-[10px] text-sky-400 font-semibold mt-1 flex items-center gap-0.5">
                    <CloudRain className="w-2.5 h-2.5" />
                    <span>{h.popPct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7 DAYS TAB */}
      {horizonTab === '7days' && (
        <div className="space-y-2.5">
          {daily7d.map((d, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#0a231e] border border-emerald-500/20 hover:border-emerald-500/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <span className="font-extrabold text-xs sm:text-sm text-white block">
                      {language === 'hi' ? d.dayNameHi : d.dayNameEn}
                    </span>
                    <span className="text-[11px] text-slate-400">{d.date}</span>
                  </div>
                  <WeatherIcon condition={d.condition} size={28} />
                  <div>
                    <span className="font-black text-sm sm:text-base text-white">
                      {d.tempMaxC}° <span className="text-slate-400 font-medium text-xs">/ {d.tempMinC}°C</span>
                    </span>
                    <span className="text-[11px] text-emerald-300/90 block">
                      {language === 'hi' ? d.conditionTextHi : d.conditionTextEn}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-sky-400 flex items-center justify-end gap-1">
                    <CloudRain className="w-3.5 h-3.5" />
                    <span>{d.rainfallExpectedMm} mm</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Rain Prob: {d.popPct}%
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-900/40 text-[11px] text-slate-300 leading-relaxed">
                {language === 'hi' ? d.summaryHi : d.summaryEn}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 15 DAYS TAB */}
      {horizonTab === '15days' && (
        <div className="space-y-2.5">
          <div className="bg-emerald-950/70 border border-emerald-500/30 p-3 rounded-2xl text-xs text-emerald-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {language === 'hi'
                ? '15-दिवसीय विस्तारित पूर्वानुमान मध्यम अवधि कृषि योजना व सिंचाई प्रबंधन हेतु तैयार किया गया है।'
                : '15-day extended agro-meteorological guidance for medium-range irrigation and harvest planning.'}
            </span>
          </div>

          {daily15d.map((d, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#0a231e] border border-emerald-900/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-20">
                  <span className="font-extrabold text-xs text-white block">
                    {language === 'hi' ? d.dayNameHi : d.dayNameEn}
                  </span>
                  <span className="text-[10px] text-slate-400">{d.date.slice(5)}</span>
                </div>
                <WeatherIcon condition={d.condition} size={22} />
                <div>
                  <span className="font-black text-xs sm:text-sm text-white">
                    {d.tempMaxC}° / {d.tempMinC}°
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {language === 'hi' ? d.conditionTextHi : d.conditionTextEn}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-sky-400 flex items-center justify-end gap-1">
                  <CloudRain className="w-3 h-3" />
                  <span>{d.rainfallExpectedMm} mm</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Wind: {d.windSpeedMaxKmh} km/h
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
