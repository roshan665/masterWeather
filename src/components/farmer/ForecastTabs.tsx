import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLiveWeather } from '../../context/LiveWeatherContext';
import { useTranslation } from '../../i18n/useTranslation';
import { WeatherIcon } from '../common/WeatherIcon';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import {
  Clock,
  Calendar,
  Layers,
  Droplets,
  Wind,
  CheckCircle2,
  AlertCircle,
  XCircle,
  CloudRain,
  ListFilter,
  Radio,
  RefreshCw
} from 'lucide-react';

export const ForecastTabs: React.FC = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);
  const { hourly24h, daily7d, isLive, isRefreshing, refreshWeather } = useLiveWeather();

  const [activeTab, setActiveTab] = useState<'hourly' | '1to3d' | '4to7d'>('hourly');
  const [showTableView, setShowTableView] = useState(false);

  const daily1to3d = daily7d.slice(0, 3);
  const daily4to7d = daily7d.slice(3, 7);

  const getSprayBadge = (suitability: 'optimal' | 'marginal' | 'unfavourable', reasonEn: string, reasonHi: string) => {
    switch (suitability) {
      case 'optimal':
        return (
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-1 rounded-lg" title={language === 'hi' ? reasonHi : reasonEn}>
            <CheckCircle2 size={13} className="shrink-0" />
            <span>{language === 'hi' ? 'अनुकूल' : 'Optimal'}</span>
          </div>
        );
      case 'marginal':
        return (
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/90 px-2 py-1 rounded-lg" title={language === 'hi' ? reasonHi : reasonEn}>
            <AlertCircle size={13} className="shrink-0" />
            <span>{language === 'hi' ? 'मध्यम' : 'Marginal'}</span>
          </div>
        );
      case 'unfavourable':
        return (
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100/90 px-2 py-1 rounded-lg" title={language === 'hi' ? reasonHi : reasonEn}>
            <XCircle size={13} className="shrink-0" />
            <span>{language === 'hi' ? 'असुरक्षित' : 'Unsafe'}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-emerald-700 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
                  {language === 'hi' ? 'मौसम पूर्वानुमान' : 'Weather Forecasts'}
                </h2>
                {isLive && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    <Radio className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Live</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'स्प्रे समय एवं वर्षा संभावना' : 'Spray timing & rain probability'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refreshWeather()}
            disabled={isRefreshing}
            className="sm:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Tab Buttons (Large touch targets for thumbs) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('hourly')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hourly'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={15} />
            <span>{language === 'hi' ? 'अभी 24h' : '24h'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('1to3d')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === '1to3d'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={15} />
            <span>1-3 {language === 'hi' ? 'दिन' : 'Days'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('4to7d')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === '4to7d'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={15} />
            <span>4-7 {language === 'hi' ? 'दिन' : 'Days'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 0-24h Hourly Forecast */}
      {activeTab === 'hourly' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{language === 'hi' ? 'अगले 24 घंटे का प्रति घंटा दृष्टिकोण' : 'Next 24 Hours Overview'}</span>
            <button
              onClick={() => setShowTableView(!showTableView)}
              className="text-emerald-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <ListFilter size={13} />
              <span>{showTableView ? (language === 'hi' ? 'कार्ड दृश्य' : 'Card View') : (language === 'hi' ? 'तालिका दृश्य' : 'Table View')}</span>
            </button>
          </div>

          {!showTableView ? (
            /* Horizontal Scroll Cards */
            <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
              {hourly24h.map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 min-w-[145px] max-w-[165px] p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between shrink-0"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>{h.time}</span>
                      {idx === 0 && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                          {language === 'hi' ? 'अब' : 'Now'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between my-2">
                      <WeatherIcon condition={h.condition} size={28} />
                      <span className="text-xl sm:text-2xl font-black text-slate-900">{h.tempC}°</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-700 truncate" title={language === 'hi' ? h.conditionTextHi : h.conditionTextEn}>
                      {language === 'hi' ? h.conditionTextHi : h.conditionTextEn}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span className="flex items-center gap-0.5">
                        <CloudRain size={12} className="text-sky-600" />
                        <span>{h.popPct}%</span>
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Wind size={12} className="text-teal-600" />
                        <span>{h.windSpeedKmh}k</span>
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Droplets size={12} className="text-cyan-600" />
                        <span>{h.relativeHumidityPct}%</span>
                      </span>
                    </div>

                    <div className="pt-0.5">
                      {getSprayBadge(h.spraySuitability, h.spraySuitabilityReasonEn, h.spraySuitabilityReasonHi)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Simple Fallback Mobile Table */
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">{language === 'hi' ? 'समय' : 'Time'}</th>
                    <th className="p-2.5">{language === 'hi' ? 'तापमान' : 'Temp'}</th>
                    <th className="p-2.5">{language === 'hi' ? 'बारिश' : 'Rain %'}</th>
                    <th className="p-2.5">{language === 'hi' ? 'हवा' : 'Wind'}</th>
                    <th className="p-2.5">{language === 'hi' ? 'स्प्रे सलाह' : 'Spray'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {hourly24h.map((h, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">{h.time}</td>
                      <td className="p-2.5 font-extrabold">{h.tempC}°C</td>
                      <td className="p-2.5 text-sky-700 font-bold">{h.popPct}%</td>
                      <td className="p-2.5">{h.windSpeedKmh} km/h</td>
                      <td className="p-2.5">
                        {getSprayBadge(h.spraySuitability, h.spraySuitabilityReasonEn, h.spraySuitabilityReasonHi)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 1-3 Days Forecast */}
      {activeTab === '1to3d' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {daily1to3d.map((d, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    {language === 'hi' ? d.dayNameHi : d.dayNameEn}
                  </span>
                  <ConfidenceBadge confidence={d.confidence} language={language} />
                </div>

                <div className="flex items-center gap-3 my-2">
                  <WeatherIcon condition={d.condition} size={36} />
                  <div>
                    <div className="text-xl font-black text-slate-900">
                      {d.tempMaxC}° <span className="text-xs font-normal text-slate-500">/ {d.tempMinC}°C</span>
                    </div>
                    <div className="text-xs text-slate-700 font-semibold">
                      {language === 'hi' ? d.conditionTextHi : d.conditionTextEn}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-xs text-slate-700 my-2">
                  <p className="font-medium text-emerald-950">
                    {language === 'hi' ? d.summaryHi : d.summaryEn}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                <div>
                  <span className="block text-[10px] text-slate-400">{t.popRainChance}</span>
                  <span className="font-bold text-sky-700">{d.popPct}%</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">{t.expectedRainfall}</span>
                  <span className="font-bold text-slate-800">{d.rainfallExpectedMm} mm</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">{t.windSpeed}</span>
                  <span className="font-bold text-slate-800">{d.windSpeedMaxKmh} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: 4-7 Days Outlook */}
      {activeTab === '4to7d' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {daily4to7d.map((d, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-800">
                    {language === 'hi' ? d.dayNameHi : d.dayNameEn}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{d.date.slice(5)}</span>
                </div>

                <div className="flex items-center justify-between my-2">
                  <WeatherIcon condition={d.condition} size={28} />
                  <div className="text-right">
                    <span className="font-black text-base text-slate-900">{d.tempMaxC}°</span>
                    <span className="text-xs text-slate-500 block">न्यूनतम: {d.tempMinC}°</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                  {language === 'hi' ? d.summaryHi : d.summaryEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-sky-700 font-bold">{t.popRainChance}: {d.popPct}%</span>
                <ConfidenceBadge confidence={d.confidence} language={language} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
