import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PANCHAYATS } from '../mock';

export interface PanchayatSelectorProps {
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
}

export const PanchayatSelector: React.FC<PanchayatSelectorProps> = ({
  className = ''
}) => {
  const { activePanchayat, setActivePanchayat, language, autoDetectLocation, isLocating } = useApp();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <label htmlFor="panchayat-select" className="sr-only">
          {language === 'hi' ? 'ग्राम पंचायत चुनें' : 'Select Gram Panchayat'}
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
          <select
            id="panchayat-select"
            value={activePanchayat.id}
            onChange={(e) => {
              const found = PANCHAYATS.find((p) => p.id === e.target.value);
              if (found) setActivePanchayat(found);
            }}
            className="w-full pl-9 pr-8 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-xs sm:text-sm rounded-xl border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner appearance-none cursor-pointer transition-all"
          >
            {PANCHAYATS.map((gp) => (
              <option key={gp.id} value={gp.id} className="bg-slate-900 text-slate-100 py-1">
                {language === 'hi' ? gp.nameHi : gp.nameEn} ({language === 'hi' ? 'फंदा' : 'Phanda'})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={autoDetectLocation}
        disabled={isLocating}
        title={language === 'hi' ? 'जीपीएस द्वारा निकटतम पंचायत खोजें' : 'Auto-detect nearest GP'}
        className="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
      >
        <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
        <span className="hidden md:inline">
          {isLocating
            ? (language === 'hi' ? 'खोज रहे हैं...' : 'Detecting...')
            : (language === 'hi' ? 'GPS से खोजें' : 'Detect GPS')}
        </span>
      </button>
    </div>
  );
};
