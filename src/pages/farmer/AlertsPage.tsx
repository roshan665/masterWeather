import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Zap,
  CloudRain,
  Wind,
  Clock
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'critical' | 'moderate'>('all');

  const mockAlertCards = [
    {
      id: 'alert-1',
      title: 'Yellow Alert',
      severity: 'moderate',
      theme: 'amber',
      headline: 'Moderate to Heavy Thunderstorms Expected',
      description: 'Postpone chemical spraying and open drainage channels in low-lying soybean fields.',
      timeRange: '12 Sep 2026 • 14:00 - 19:00',
      icon: Zap
    },
    {
      id: 'alert-2',
      title: 'Heavy Rainfall Alert',
      severity: 'critical',
      theme: 'orange',
      headline: 'Expected in next 24 hours',
      description: 'Possible waterlogging in low-lying vertisol fields. Inspect field bunds immediately.',
      timeRange: '13 Sep 2026 • 08:00 - 20:00',
      icon: CloudRain
    },
    {
      id: 'alert-3',
      title: 'Wind Alert',
      severity: 'moderate',
      theme: 'emerald',
      headline: 'Strong winds (30-40 km/h)',
      description: 'May affect standing crops and cause foliar spray drift. Avoid spraying operations.',
      timeRange: '14 Sep 2026 • 10:00 - 16:00',
      icon: Wind
    }
  ];

  const filtered = mockAlertCards.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return a.severity === 'critical';
    return a.severity === 'moderate';
  });

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-6 animate-in fade-in duration-200">
      
      {/* Header matching Mockup Screen 7 */}
      <div className="flex items-center gap-3 pb-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-emerald-950/60 transition-all cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Weather Alerts
        </h1>
      </div>

      {/* Filter Pills: All (3), Critical (1), Moderate (2) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
            filter === 'all'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/30'
              : 'bg-[#0a231e] text-slate-400 border-emerald-900/40 hover:text-white'
          }`}
        >
          All ({mockAlertCards.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('critical')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
            filter === 'critical'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/30'
              : 'bg-[#0a231e] text-slate-400 border-emerald-900/40 hover:text-white'
          }`}
        >
          Critical (1)
        </button>

        <button
          type="button"
          onClick={() => setFilter('moderate')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
            filter === 'moderate'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/30'
              : 'bg-[#0a231e] text-slate-400 border-emerald-900/40 hover:text-white'
          }`}
        >
          Moderate (2)
        </button>
      </div>

      {/* Alert Cards Stack */}
      <div className="space-y-3 pt-1">
        {filtered.map((card) => {
          const IconComponent = card.icon;
          const isAmber = card.theme === 'amber';
          const isOrange = card.theme === 'orange';

          return (
            <div
              key={card.id}
              className={`p-4 sm:p-5 rounded-3xl border shadow-xl space-y-2.5 transition-all ${
                isAmber
                  ? 'bg-gradient-to-r from-[#2c1e09] to-[#1d1406] border-amber-500/40 text-amber-100'
                  : isOrange
                  ? 'bg-gradient-to-r from-[#2c1409] to-[#1d0e06] border-orange-500/40 text-orange-100'
                  : 'bg-gradient-to-r from-[#0d2e26] to-[#071f1a] border-emerald-500/35 text-emerald-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-2xl shrink-0 mt-0.5 ${
                  isAmber
                    ? 'bg-amber-500/20 text-amber-400'
                    : isOrange
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <IconComponent size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase tracking-wide ${
                      isAmber ? 'text-amber-400' : isOrange ? 'text-orange-400' : 'text-emerald-400'
                    }`}>
                      {card.title}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5 leading-snug">
                    {card.headline}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {card.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-white/10 font-mono">
                    <Clock size={12} className="text-slate-400" />
                    <span>{card.timeRange}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
