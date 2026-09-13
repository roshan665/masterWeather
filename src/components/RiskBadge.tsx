import React from 'react';
import type { RiskSeverity } from '../types';
import { useTranslation } from '../i18n/useTranslation';

export interface RiskBadgeProps {
  severity: RiskSeverity;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  severity,
  score,
  showScore = false,
  size = 'md',
  className = ''
}) => {
  const { language } = useTranslation();

  const getBadgeConfig = () => {
    switch (severity) {
      case 'severe':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30',
          dot: 'bg-rose-500 animate-ping',
          labelHi: 'अति गंभीर',
          labelEn: 'Severe Risk'
        };
      case 'high':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          labelHi: 'उच्च जोखिम',
          labelEn: 'High Risk'
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
          dot: 'bg-yellow-400',
          labelHi: 'मध्यम जोखिम',
          labelEn: 'Moderate Risk'
        };
      case 'low':
        return {
          bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          dot: 'bg-sky-400',
          labelHi: 'कम जोखिम',
          labelEn: 'Low Risk'
        };
      case 'normal':
      default:
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          labelHi: 'सामान्य',
          labelEn: 'Normal / Favorable'
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium transition-colors ${config.bg} ${sizeClasses[size]} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot.split(' ')[0]}`} />
      </span>
      <span>{language === 'hi' ? config.labelHi : config.labelEn}</span>
      {showScore && score !== undefined && (
        <span className="font-mono opacity-80 pl-0.5 font-bold">({score})</span>
      )}
    </span>
  );
};
