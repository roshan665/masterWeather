import React from 'react';
import type { ConfidenceLevel } from '../../types/common';
import { CheckCircle2, HelpCircle, Info } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  dataSourceLabel?: string;
  isFallback?: boolean;
  language?: 'hi' | 'en';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  dataSourceLabel,
  isFallback = false,
  language = 'hi',
}) => {
  const getConfig = () => {
    switch (confidence) {
      case 'high':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-800',
          labelEn: 'High Confidence',
          labelHi: 'उच्च विश्वसनीयता',
          descEn: 'Direct AWS local sensor observation',
          descHi: 'स्थानीय प्रत्यक्ष एडब्ल्यूएस सेंसर द्वारा सत्यापित',
          icon: CheckCircle2,
        };
      case 'medium':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          labelEn: 'Medium Confidence',
          labelHi: 'मध्यम विश्वसनीयता',
          descEn: 'Gridded NCMRWF/IMD numerical model estimation',
          descHi: 'ग्रिडेड मॉडल एवं उपग्रह डेटा आधारित',
          icon: Info,
        };
      case 'low':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          labelEn: 'Low Confidence (Fallback)',
          labelHi: 'कम विश्वसनीयता (बैकअप)',
          descEn: 'Historical seasonal climatology (Sensor offline)',
          descHi: 'ऐतिहासिक मौसमी औसत (कृपया खेत में जांचें)',
          icon: HelpCircle,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${config.bg} transition-colors`}
      title={isFallback ? 'Sensor Fallback Mode Active' : config.descEn}
    >
      <Icon size={13} className="shrink-0" />
      <span className="font-medium">
        {language === 'hi' ? config.labelHi : config.labelEn}
      </span>
      {isFallback && (
        <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded font-semibold text-[10px]">
          {language === 'hi' ? 'बैकअप' : 'FALLBACK'}
        </span>
      )}
      {dataSourceLabel && (
        <span className="hidden sm:inline-block text-[11px] opacity-75 border-l border-current/20 pl-1.5">
          {dataSourceLabel}
        </span>
      )}
    </div>
  );
};
