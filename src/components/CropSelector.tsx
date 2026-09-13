import React from 'react';
import { Sprout } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CROPS } from '../mock';

export interface CropSelectorProps {
  className?: string;
  variant?: 'chips' | 'dropdown';
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  className = '',
  variant = 'chips'
}) => {
  const { activeCrop, setActiveCrop, language } = useApp();

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
        <select
          value={activeCrop.id}
          onChange={(e) => {
            const found = CROPS.find((c) => c.id === e.target.value);
            if (found) setActiveCrop(found);
          }}
          className="w-full pl-9 pr-8 py-2 bg-slate-900/90 text-slate-100 font-medium text-xs sm:text-sm rounded-xl border border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
        >
          {CROPS.map((crop) => (
            <option key={crop.id} value={crop.id} className="bg-slate-900 text-slate-100">
              {language === 'hi' ? crop.nameHi : crop.nameEn} ({language === 'hi' ? crop.seasonNameHi : crop.seasonNameEn})
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none ${className}`}>
      {CROPS.map((crop) => {
        const isSelected = activeCrop.id === crop.id;
        return (
          <button
            key={crop.id}
            type="button"
            onClick={() => setActiveCrop(crop)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 border ${
              isSelected
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/50 scale-[1.02]'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-750 hover:text-white'
            }`}
          >
            <span className="text-base">
              {crop.icon || (crop.id === 'soybean' ? '🌱' : crop.id === 'wheat' ? '🌾' : '🧆')}
            </span>
            <span>{language === 'hi' ? crop.nameHi : crop.nameEn}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
              isSelected ? 'bg-emerald-700/60 text-emerald-100' : 'bg-slate-700 text-slate-400'
            }`}>
              {language === 'hi' ? crop.seasonNameHi : crop.seasonNameEn}
            </span>
          </button>
        );
      })}
    </div>
  );
};
