import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { calculateRiskAssessment } from '../../data/mockRisks';
import { RiskBadge } from '../common/RiskBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import {
  ShieldAlert,
  Bug,
  Droplet,
  Flame,
  Wind,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info
} from 'lucide-react';

export const RiskOverviewCard: React.FC = () => {
  const { language, activePanchayat, activeCrop, cropActiveState } = useApp();
  const { t } = useTranslation(language);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const riskData = calculateRiskAssessment(
    activePanchayat.id,
    activeCrop.id,
    cropActiveState.currentStage.stageId
  );

  const getSubRiskIcon = (category: string) => {
    switch (category) {
      case 'pest_disease':
        return <Bug size={18} className="text-purple-600 shrink-0" />;
      case 'excess_water':
      case 'moisture_deficit':
        return <Droplet size={18} className="text-blue-600 shrink-0" />;
      case 'thermal_stress':
        return <Flame size={18} className="text-amber-600 shrink-0" />;
      case 'spray_window':
        return <Wind size={18} className="text-teal-600 shrink-0" />;
      default:
        return <ShieldAlert size={18} className="text-slate-600 shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Card Header: Score, Stage & Risk Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={22} className="text-orange-600 shrink-0" />
            <h2 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">
              {language === 'hi' ? 'फसल जोखिम मीटर' : 'Crop Risk Gauge'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
            {language === 'hi' ? activeCrop.nameHi : activeCrop.nameEn} • {language === 'hi' ? cropActiveState.currentStage.nameHi : cropActiveState.currentStage.nameEn}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <RiskBadge
            level={riskData.overallLevel}
            score={riskData.overallScore}
            language={language}
            size="lg"
          />
          <ConfidenceBadge confidence={riskData.confidence} language={language} />
        </div>
      </div>

      {/* Main Action Recommendation Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-xs sm:text-sm text-amber-950 block">
            {language === 'hi' ? 'सलाह व अनुशंसित सुरक्षा उपाय:' : 'Recommended Protective Action:'}
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {language === 'hi'
              ? (riskData.subRisks[0]?.mitigationHi || 'खेत में नियमित निगरानी रखें और जल निकासी नालियों को अवरोध मुक्त रखें।')
              : (riskData.subRisks[0]?.mitigationEn || 'Ensure routine field monitoring and maintain clean drainage channels.')}
          </p>
        </div>
      </div>

      {/* Numerical Risk Gauge bar */}
      <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-emerald-700">{language === 'hi' ? 'सामान्य' : 'Normal'}</span>
          <span className="text-amber-700">{language === 'hi' ? 'सतर्कता' : 'Advisory'}</span>
          <span className="text-orange-700">{language === 'hi' ? 'चेतावनी' : 'Warning'}</span>
          <span className="text-rose-700">{language === 'hi' ? 'गंभीर' : 'Critical'}</span>
        </div>

        {/* 4 segment scale */}
        <div className="relative w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
          <div className="h-full w-1/4 bg-emerald-500" />
          <div className="h-full w-1/4 bg-amber-400" />
          <div className="h-full w-1/4 bg-orange-500" />
          <div className="h-full w-1/4 bg-rose-500" />
          
          {/* Indicator pin */}
          <div
            className="absolute top-0 bottom-0 w-2 bg-slate-950 shadow-md ring-2 ring-white rounded-full transition-all"
            style={{ left: `${Math.min(98, Math.max(2, riskData.overallScore))}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-600 font-medium pt-0.5">
          <span>0 (न्यूनतम)</span>
          <span className="font-extrabold text-slate-900">
            {language === 'hi' ? 'वर्तमान स्कोर' : 'Score'}: {riskData.overallScore}/100
          </span>
          <span>100 (अत्यधिक)</span>
        </div>
      </div>

      {/* Expandable Sub-risks Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info size={15} className="text-slate-600" />
            <span>
              {isDetailsExpanded
                ? (language === 'hi' ? 'विस्तृत जोखिम विश्लेषण छुपाएं' : 'Hide Risk Factors')
                : (language === 'hi' ? 'विशिष्ट कारक जोखिम देखें (कीट, नमी, तापमान)' : 'View Detailed Risk Breakdown (Pest, Moisture, Temp)')}
            </span>
          </div>
          {isDetailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isDetailsExpanded && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 animate-in slide-in-from-top-2 duration-200">
            {riskData.subRisks.map((sub) => (
              <div
                key={sub.id}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
                    {getSubRiskIcon(sub.category)}
                    <span>{language === 'hi' ? sub.nameHi : sub.nameEn}</span>
                  </div>
                  <RiskBadge level={sub.level} score={sub.score} language={language} size="sm" />
                </div>

                <div className="text-xs text-slate-700 space-y-1.5">
                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                    <span className="font-bold text-amber-900 block text-[10px] uppercase">
                      {t.weatherTrigger}:
                    </span>
                    <span>{language === 'hi' ? sub.triggerConditionHi : sub.triggerConditionEn}</span>
                  </div>

                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-950 block text-[10px] uppercase">
                      {t.recommendedMitigation}:
                    </span>
                    <span className="text-emerald-950 font-medium">
                      {language === 'hi' ? sub.mitigationHi : sub.mitigationEn}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spray Window recommendation footer */}
      <div className="bg-teal-50 border border-teal-200/80 p-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-teal-950 font-medium">
          <CheckCircle size={16} className="text-teal-600 shrink-0" />
          <span>
            {language === 'hi' ? riskData.spraySuitabilityNext48h.summaryHi : riskData.spraySuitabilityNext48h.summaryEn}
          </span>
        </div>
        <div className="text-xs font-bold text-teal-900 shrink-0">
          {language === 'hi' ? riskData.spraySuitabilityNext48h.bestWindowHi : riskData.spraySuitabilityNext48h.bestWindowEn}
        </div>
      </div>
    </div>
  );
};
