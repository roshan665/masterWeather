import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import type { DailyForecast } from '../types';
import { useTranslation } from '../i18n/useTranslation';

export interface ForecastChartProps {
  forecast: DailyForecast[];
  className?: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, className = '' }) => {
  const { language } = useTranslation();

  const chartData = forecast.map((f) => ({
    name: language === 'hi' ? f.dayNameHi.split(' ')[0] : f.dayNameEn,
    tempMax: f.tempMaxC,
    tempMin: f.tempMinC,
    rainfall: f.rainfallExpectedMm,
    rainProb: f.popPct
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <div className="font-bold text-white border-b border-slate-800 pb-1">{label}</div>
          <div className="text-amber-400 flex items-center justify-between gap-4">
            <span>{language === 'hi' ? 'अधिकतम तापमान:' : 'Max Temp:'}</span>
            <span className="font-mono font-bold">{payload.find((p: any) => p.dataKey === 'tempMax')?.value}°C</span>
          </div>
          <div className="text-sky-400 flex items-center justify-between gap-4">
            <span>{language === 'hi' ? 'न्यूनतम तापमान:' : 'Min Temp:'}</span>
            <span className="font-mono font-bold">{payload.find((p: any) => p.dataKey === 'tempMin')?.value}°C</span>
          </div>
          <div className="text-blue-400 flex items-center justify-between gap-4">
            <span>{language === 'hi' ? 'वर्षा:' : 'Rainfall:'}</span>
            <span className="font-mono font-bold">{payload.find((p: any) => p.dataKey === 'rainfall')?.value} mm</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`p-4 sm:p-6 bg-slate-900/80 rounded-2xl border border-slate-800 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100">
            {language === 'hi' ? '7-दिवसीय तापमान एवं वर्षा रुझान' : '7-Day Temperature & Rain Trend'}
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'hi' ? 'एनडब्ल्यूपी मॉडल पूर्वानुमान डेटा' : 'High-resolution NWP Model Ensemble'}
          </p>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fontSize: 11 }} unit="°C" domain={['dataMin - 3', 'dataMax + 3']} />
            <YAxis yAxisId="right" orientation="right" stroke="#60a5fa" tick={{ fontSize: 11 }} unit="mm" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar yAxisId="right" dataKey="rainfall" name={language === 'hi' ? 'वर्षा (mm)' : 'Rain (mm)'} fill="#3b82f6" opacity={0.7} radius={[4, 4, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="tempMax" name={language === 'hi' ? 'अधिकतम (°C)' : 'Max Temp (°C)'} stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line yAxisId="left" type="monotone" dataKey="tempMin" name={language === 'hi' ? 'न्यूनतम (°C)' : 'Min Temp (°C)'} stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
