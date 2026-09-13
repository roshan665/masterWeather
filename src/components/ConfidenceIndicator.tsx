import React from 'react';
import type { ConfidenceLevel } from '../types';

export interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  score?: number;
  showPercent?: boolean;
  className?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  level,
  score,
  showPercent = true,
  className = ''
}) => {
  const getStyle = () => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          labelHi: 'उच्च सटीकता',
          labelEn: 'High Confidence'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          labelHi: 'मध्यम सटीकता',
          labelEn: 'Medium Confidence'
        };
      case 'low':
      default:
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400',
          labelHi: 'सावधानी बरतें',
          labelEn: 'Low Confidence'
        };
    }
  };

  const style = getStyle();
  const percentDisplay = score ? `${Math.round(score > 1 ? score : score * 100)}%` : null;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{style.labelEn}</span>
      {showPercent && percentDisplay && (
        <span className="opacity-75 font-mono text-[11px]">({percentDisplay})</span>
      )}
    </div>
  );
};
