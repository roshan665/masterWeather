import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PANCHAYATS } from '../../data/panchayats';
import { MOCK_CURRENT_WEATHER } from '../../data/mockWeather';
import { calculateRiskAssessment } from '../../data/mockRisks';
import { RiskBadge } from '../common/RiskBadge';
import { WeatherIcon } from '../common/WeatherIcon';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const GPWeatherMatrix: React.FC = () => {
  const { language, activeCrop, selectPanchayatById } = useApp();
  const { t } = useTranslation(language);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-700" />
            <span>{language === 'hi' ? 'फंदा ब्लॉक - 5 ग्राम पंचायत मौसम व जोखिम तालिका' : 'Phanda Block - 5 Gram Panchayats Agromet Matrix'}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'सक्रिय फसल: ' : 'Active Crop: '}
            <span className="font-semibold text-emerald-800">{language === 'hi' ? activeCrop.nameHi : activeCrop.nameEn}</span>
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {language === 'hi' ? '5 एडब्ल्यूएस नोड संबद्ध' : '5 Linked AWS Nodes'}
        </div>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="md:hidden space-y-3">
        {PANCHAYATS.map((gp) => {
          const weather = MOCK_CURRENT_WEATHER[gp.id] || MOCK_CURRENT_WEATHER['acharpura'];
          const risk = calculateRiskAssessment(gp.id, activeCrop.id, 'soy_pod_dev');

          return (
            <div
              key={gp.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WeatherIcon condition={weather.condition} size={24} />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{language === 'hi' ? gp.nameHi : gp.nameEn}</h3>
                    <span className="text-[11px] text-slate-500">{gp.weatherStationId}</span>
                  </div>
                </div>
                <RiskBadge level={risk.overallLevel} score={risk.overallScore} language={language} size="sm" />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.temperature}</span>
                  <span className="font-black text-slate-900">{weather.tempC}°C</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.rainfall24h}</span>
                  <span className="font-black text-sky-700">{weather.rainfallMm24h} mm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t.relativeHumidity}</span>
                  <span className="font-black text-slate-900">{weather.relativeHumidityPct}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                <span className="text-slate-500 text-[11px]">
                  {language === 'hi' ? 'हवा: ' : 'Wind: '}{weather.windSpeedKmh} km/h • ET₀: {weather.et0MmDay} mm/d
                </span>
                <button
                  type="button"
                  onClick={() => selectPanchayatById(gp.id)}
                  className="px-3 py-1.5 min-h-[38px] bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <span>{language === 'hi' ? 'चुनें' : 'Select'}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Container (>= md) */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="py-3 px-3.5">{language === 'hi' ? 'ग्राम पंचायत' : 'Gram Panchayat'}</th>
              <th className="py-3 px-3">{t.temperature}</th>
              <th className="py-3 px-3">{t.rainfall24h}</th>
              <th className="py-3 px-3">{t.relativeHumidity}</th>
              <th className="py-3 px-3">{t.windSpeed}</th>
              <th className="py-3 px-3">{t.et0Evapo}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'जोखिम स्कोर' : 'Risk Score'}</th>
              <th className="py-3 px-3">{language === 'hi' ? 'सेंसर स्थिति' : 'Sensor Status'}</th>
              <th className="py-3 px-3 text-right">{language === 'hi' ? 'कार्रवाई' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {PANCHAYATS.map((gp) => {
              const weather = MOCK_CURRENT_WEATHER[gp.id] || MOCK_CURRENT_WEATHER['acharpura'];
              const risk = calculateRiskAssessment(gp.id, activeCrop.id, 'soy_pod_dev');

              return (
                <tr key={gp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <WeatherIcon condition={weather.condition} size={18} />
                      <div>
                        <span className="text-xs">{language === 'hi' ? gp.nameHi : gp.nameEn}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{gp.weatherStationId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {weather.tempC}°C
                    <span className="block text-[10px] text-slate-400">({weather.tempMaxC}°/{weather.tempMinC}°)</span>
                  </td>

                  <td className="py-3 px-3 font-bold text-sky-700">
                    {weather.rainfallMm24h} mm
                  </td>

                  <td className="py-3 px-3">
                    {weather.relativeHumidityPct}%
                  </td>

                  <td className="py-3 px-3">
                    {weather.windSpeedKmh} km/h ({weather.windDirectionCompass})
                  </td>

                  <td className="py-3 px-3 font-medium text-emerald-800">
                    {weather.et0MmDay} mm/d
                  </td>

                  <td className="py-3 px-3">
                    <RiskBadge level={risk.overallLevel} score={risk.overallScore} language={language} size="sm" />
                  </td>

                  <td className="py-3 px-3">
                    {gp.stationStatus === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 size={12} />
                        {language === 'hi' ? 'सक्रिय (प्रत्यक्ष)' : 'Online (Direct)'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                        <AlertTriangle size={12} />
                        {language === 'hi' ? 'ग्रिडेड बैकअप' : 'Gridded Backup'}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => selectPanchayatById(gp.id)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Select this Panchayat"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
