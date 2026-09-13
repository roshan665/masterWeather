import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { getForecastForPanchayat } from '../../data/mockWeather';
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
} from 'lucide-react';

export const ForecastTabs: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { t } = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'hourly' | '1to3d' | '4to7d'>('hourly');

  const forecastData = getForecastForPanchayat(activePanchayat.id);

  const getSprayBadge = (suitability: 'optimal' | 'marginal' | 'unfavourable', reasonEn: string, reasonHi: string) => {
    switch (suitability) {
      case 'optimal':
        return (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md" title={language === 'hi' ? reasonHi : reasonEn}>
            <CheckCircle2 size={12} className="shrink-0" />
            <span>{t.sprayOptimal.split(' ')[0]}</span>
          </div>
        );
      case 'marginal':
        return (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md" title={language === 'hi' ? reasonHi : reasonEn}>
            <AlertCircle size={12} className="shrink-0" />
            <span>{t.sprayMarginal.split(' ')[0]}</span>
          </div>
        );
      case 'unfavourable':
        return (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md" title={language === 'hi' ? reasonHi : reasonEn}>
            <XCircle size={12} className="shrink-0" />
            <span>{t.sprayUnfavourable.split(' ')[0]}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-emerald-700" />
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            {language === 'hi' ? 'कृषि मौसम पूर्वानुमान' : 'Agricultural Weather Forecasts'}
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hourly'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={14} />
            <span>{t.forecastHourly.split(' ')[0]} 24h</span>
          </button>

          <button
            onClick={() => setActiveTab('1to3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === '1to3d'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={14} />
            <span>1-3 {language === 'hi' ? 'दिन' : 'Days'}</span>
          </button>

          <button
            onClick={() => setActiveTab('4to7d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === '4to7d'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>4-7 {language === 'hi' ? 'दिन' : 'Days'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 0-24h Hourly Forecast */}
      {activeTab === 'hourly' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.forecastHourly}</span>
            <span className="text-emerald-700 font-medium">
              {language === 'hi' ? 'कीटनाशक छिड़काव खिड़की' : 'Agrochemical Spray Windows'}
            </span>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex items-stretch gap-3 overflow-x-auto pb-3 custom-scrollbar">
            {forecastData.hourlyNext24h.map((h, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[155px] max-w-[180px] p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>{h.time}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {idx === 0 ? (language === 'hi' ? 'अब' : 'Now') : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-2">
                    <WeatherIcon condition={h.condition} size={30} />
                    <span className="text-2xl font-black text-slate-900">{h.tempC}°</span>
                  </div>

                  <div className="text-[11px] font-medium text-slate-700 truncate" title={language === 'hi' ? h.conditionTextHi : h.conditionTextEn}>
                    {language === 'hi' ? h.conditionTextHi : h.conditionTextEn}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <CloudRain size={12} className="text-sky-500" />
                      <span>{h.popPct}%</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind size={12} className="text-teal-600" />
                      <span>{h.windSpeedKmh}k</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets size={12} className="text-cyan-600" />
                      <span>{h.relativeHumidityPct}%</span>
                    </span>
                  </div>

                  <div className="pt-1">
                    {getSprayBadge(h.spraySuitability, h.spraySuitabilityReasonEn, h.spraySuitabilityReasonHi)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 1-3 Days Forecast */}
      {activeTab === '1to3d' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {forecastData.daily1to3d.map((d, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-900">
                    {language === 'hi' ? d.dayNameHi : d.dayNameEn}
                  </span>
                  <ConfidenceBadge confidence={d.confidence} language={language} />
                </div>

                <div className="flex items-center gap-3 my-2">
                  <WeatherIcon condition={d.condition} size={36} />
                  <div>
                    <div className="text-xl font-extrabold text-slate-900">
                      {d.tempMaxC}° <span className="text-sm font-normal text-slate-500">/ {d.tempMinC}°C</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {language === 'hi' ? d.conditionTextHi : d.conditionTextEn}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-xs text-slate-700 my-2">
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
          {forecastData.daily4to7d.map((d, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-800">
                    {language === 'hi' ? d.dayNameHi : d.dayNameEn}
                  </span>
                  <span className="text-[10px] text-slate-400">{d.date.slice(5)}</span>
                </div>

                <div className="flex items-center justify-between my-2">
                  <WeatherIcon condition={d.condition} size={28} />
                  <div className="text-right">
                    <span className="font-bold text-base text-slate-900">{d.tempMaxC}°</span>
                    <span className="text-xs text-slate-500 block">Min: {d.tempMinC}°</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                  {language === 'hi' ? d.summaryHi : d.summaryEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-sky-700 font-semibold">{t.popRainChance}: {d.popPct}%</span>
                <ConfidenceBadge confidence={d.confidence} language={language} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
