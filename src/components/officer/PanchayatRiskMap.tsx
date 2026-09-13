import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PANCHAYATS } from '../../data/panchayats';
import { calculateRiskAssessment } from '../../data/mockRisks';
import { MOCK_CURRENT_WEATHER } from '../../data/mockWeather';
import { RiskBadge } from '../common/RiskBadge';
import {
  Layers,
  ExternalLink,
  MapPin
} from 'lucide-react';

export const PanchayatRiskMap: React.FC = () => {
  const { language, activePanchayat, selectPanchayatById, activeCrop } = useApp();
  const { t } = useTranslation(language);

  const [selectedPinGp, setSelectedPinGp] = useState<string | null>(activePanchayat.id);

  // Approximate relative SVG canvas positions for Phanda Block GPs
  const gpCoordinates: Record<string, { cx: number; cy: number }> = {
    acharpura: { cx: 280, cy: 110 },       // North-West
    sukhi_sewaniya: { cx: 480, cy: 150 },  // North-East
    samasgarh: { cx: 160, cy: 300 },       // West (Kerwa hills)
    ratibad: { cx: 260, cy: 360 },         // South-West
    bangrasia: { cx: 520, cy: 340 },       // South-East
  };

  const currentSelectedPin = PANCHAYATS.find((p) => p.id === (selectedPinGp || activePanchayat.id)) || activePanchayat;
  const currentRisk = calculateRiskAssessment(currentSelectedPin.id, activeCrop.id, 'soy_pod_dev');
  const currentWeather = MOCK_CURRENT_WEATHER[currentSelectedPin.id] || MOCK_CURRENT_WEATHER['acharpura'];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={22} className="text-emerald-700 shrink-0" />
            <h2 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
              {language === 'hi' ? 'फंदा ब्लॉक पंचायत जोखिम मानचित्र' : 'Phanda Block Agromet Risk Map'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'वास्तविक समय जोखिम स्कोर एवं एडब्लूएस स्थिति' : 'Real-time spatial risk scores and AWS telemetry'}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 text-xs font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-600">{language === 'hi' ? 'सामान्य' : 'Normal'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-600">{language === 'hi' ? 'सतर्कता' : 'Advisory'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-600">{language === 'hi' ? 'चेतावनी' : 'Warning'}</span>
          </span>
        </div>
      </div>

      {/* Quick Mobile Panchayat Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {PANCHAYATS.map((gp) => {
          const isSelected = gp.id === currentSelectedPin.id;
          const risk = calculateRiskAssessment(gp.id, activeCrop.id, 'soy_pod_dev');
          return (
            <button
              key={gp.id}
              type="button"
              onClick={() => {
                setSelectedPinGp(gp.id);
                selectPanchayatById(gp.id);
              }}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <MapPin size={14} className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{language === 'hi' ? gp.nameHi : gp.nameEn}</span>
              <span className={`w-2 h-2 rounded-full ${
                risk.overallLevel === 'critical' ? 'bg-rose-500' :
                risk.overallLevel === 'warning' ? 'bg-orange-500' :
                risk.overallLevel === 'advisory' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Interactive SVG Map Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 relative overflow-hidden min-h-[300px] sm:min-h-[340px] flex items-center justify-center border border-slate-800">
          
          {/* Map Grid Pattern background */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* SVG representation of Phanda boundary */}
          <svg viewBox="0 0 680 440" className="w-full h-auto max-h-[340px] z-10">
            {/* Phanda Block approximate boundary polygon */}
            <path
              d="M 220 50 Q 380 40, 520 80 Q 640 180, 600 320 Q 560 410, 420 420 Q 200 420, 100 340 Q 60 220, 140 120 Z"
              fill="#064e3b"
              fillOpacity="0.4"
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-all"
            />

            {/* Connecting roads / corridors */}
            <path d="M 280 110 L 480 150 L 520 340 L 260 360 L 160 300 Z" stroke="#334155" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
            <path d="M 280 110 L 260 360" stroke="#334155" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />

            {/* Central Bhopal Urban anchor */}
            <circle cx="370" cy="240" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <text x="370" y="244" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
              Bhopal City
            </text>

            {/* Panchayat Pins */}
            {PANCHAYATS.map((gp) => {
              const coords = gpCoordinates[gp.id] || { cx: 300, cy: 200 };
              const risk = calculateRiskAssessment(gp.id, activeCrop.id, 'soy_pod_dev');
              const isSelected = gp.id === currentSelectedPin.id;

              let pinColor = '#10b981'; // Green
              if (risk.overallLevel === 'advisory') pinColor = '#f59e0b'; // Amber
              if (risk.overallLevel === 'warning') pinColor = '#f97316'; // Orange
              if (risk.overallLevel === 'critical') pinColor = '#ef4444'; // Red

              return (
                <g
                  key={gp.id}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedPinGp(gp.id);
                    selectPanchayatById(gp.id);
                  }}
                >
                  {/* Radar pulse around pin */}
                  <circle
                    cx={coords.cx}
                    cy={coords.cy}
                    r={isSelected ? 22 : 14}
                    fill={pinColor}
                    fillOpacity={isSelected ? 0.35 : 0.2}
                    className="animate-ping"
                    style={{ animationDuration: '3s' }}
                  />

                  {/* Pin Circle */}
                  <circle
                    cx={coords.cx}
                    cy={coords.cy}
                    r={isSelected ? 14 : 10}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all drop-shadow-md group-hover:scale-125"
                  />

                  {/* Pin label */}
                  <rect
                    x={coords.cx - 45}
                    y={coords.cy + 16}
                    width="90"
                    height="20"
                    rx="6"
                    fill="#0f172a"
                    fillOpacity="0.9"
                    stroke={isSelected ? pinColor : '#334155'}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                  <text
                    x={coords.cx}
                    y={coords.cy + 30}
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {language === 'hi' ? gp.nameHi : gp.nameEn}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Compass rose in corner */}
          <div className="absolute top-4 right-4 text-slate-500 text-[10px] flex flex-col items-center">
            <span className="font-bold text-slate-300">N</span>
            <div className="w-0.5 h-6 bg-slate-600 my-0.5" />
            <span className="text-slate-400">Phanda</span>
          </div>
        </div>

        {/* Selected Panchayat Detail Panel */}
        <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'hi' ? 'चयनित ग्राम पंचायत' : 'Selected Panchayat'}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {language === 'hi' ? currentSelectedPin.nameHi : currentSelectedPin.nameEn}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentSelectedPin.weatherStationName}
                </p>
              </div>

              <RiskBadge
                level={currentRisk.overallLevel}
                score={currentRisk.overallScore}
                language={language}
                size="md"
              />
            </div>

            {/* Quick Weather Metrics for selected GP */}
            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">{t.temperature}</span>
                <span className="font-black text-slate-900 text-base">{currentWeather.tempC}°C</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.rainfall24h}</span>
                <span className="font-black text-sky-700 text-base">{currentWeather.rainfallMm24h} mm</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.relativeHumidity}</span>
                <span className="font-black text-slate-900">{currentWeather.relativeHumidityPct}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{t.windSpeed}</span>
                <span className="font-black text-slate-900">{currentWeather.windSpeedKmh} km/h</span>
              </div>
            </div>

            {/* Villages & Soil Type */}
            <div className="text-xs space-y-1.5 text-slate-700 font-medium">
              <div>
                <span className="font-bold text-slate-900">{language === 'hi' ? 'संबद्ध गांव: ' : 'Villages: '}</span>
                <span>{currentSelectedPin.villages.join(', ')}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">{language === 'hi' ? 'मृदा प्रकार: ' : 'Soil Type: '}</span>
                <span>{currentSelectedPin.primarySoilType}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">{language === 'hi' ? 'स्टेशन स्थिति: ' : 'Station Status: '}</span>
                <span className={currentSelectedPin.stationStatus === 'active' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                  {currentSelectedPin.stationStatus === 'active' ? '🟢 Active Online' : '🟠 Fallback Gridded Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => selectPanchayatById(currentSelectedPin.id)}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
            >
              <span>{language === 'hi' ? 'इस पंचायत को सक्रिय करें' : 'Set as Active Workspace'}</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
