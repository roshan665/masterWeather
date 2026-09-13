import React from 'react';
import { Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  showIcon = true
}) => {
  const { language, setLanguage } = useApp();

  return (
    <div className={`inline-flex items-center rounded-xl bg-emerald-900/60 p-1 border border-emerald-500/30 ${className}`}>
      {showIcon && <Languages className="w-3.5 h-3.5 text-emerald-300 ml-1 mr-1" />}
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
          language === 'hi'
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
            : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/40'
        }`}
        title="हिन्दी (Hindi)"
      >
        हिन्दी
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
          language === 'en'
            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
            : 'text-emerald-100/70 hover:text-white hover:bg-emerald-800/40'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
};
