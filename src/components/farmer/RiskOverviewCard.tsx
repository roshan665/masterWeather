import React from 'react';
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
} from 'lucide-react';

export const RiskOverviewCard: React.FC = () => {
  const { language, activePanchayat, activeCrop, cropActiveState } = useApp();
  const { t } = useTranslation(language);

  const riskData = calculateRiskAssessment(
    activePanchayat.id,
    activeCrop.id,
    cropActiveState.currentStage.stageId
  );

  const getSubRiskIcon = (category: string) => {
    switch (category) {
      case 'pest_disease':
        return <Bug size={17} className="text-purple-600 shrink-0" />;
      case 'excess_water':
      case 'moisture_deficit':
        return <Droplet size={17} className="text-blue-600 shrink-0" />;
      case 'thermal_stress':
        return <Flame size={17} className="text-amber-600 shrink-0" />;
      case 'spray_window':
        return <Wind size={17} className="text-teal-600 shrink-0" />;
      default:
        return <ShieldAlert size={17} className="text-slate-600 shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Card Header: Score, Stage & Risk Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-orange-600" />
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              {t.compositeRiskScore}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? activeCrop.nameHi : activeCrop.nameEn} • {language === 'hi' ? cropActiveState.currentStage.nameHi : cropActiveState.currentStage.nameEn}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge
            level={riskData.overallLevel}
            score={riskData.overallScore}
            language={language}
            size="lg"
          />
          <ConfidenceBadge confidence={riskData.confidence} language={language} />
        </div>
      </div>

      {/* Numerical Risk Gauge bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-emerald-700">{t.riskLevelNormal}</span>
          <span className="text-amber-700">{t.riskLevelAdvisory}</span>
          <span className="text-orange-700">{t.riskLevelWarning}</span>
          <span className="text-rose-700">{t.riskLevelCritical}</span>
        </div>

        {/* 4 segment scale */}
        <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
          <div className="h-full w-1/4 bg-emerald-400" />
          <div className="h-full w-1/4 bg-amber-400" />
          <div className="h-full w-1/4 bg-orange-500" />
          <div className="h-full w-1/4 bg-rose-500" />
          
          {/* Indicator pin */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-slate-950 shadow-md ring-2 ring-white"
            style={{ left: `${Math.min(99, Math.max(1, riskData.overallScore))}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500">
          <span>0 (न्यूनतम / Low)</span>
          <span className="font-bold text-slate-800">
            {language === 'hi' ? 'वर्तमान स्तर' : 'Current Score'}: {riskData.overallScore}/100
          </span>
          <span>100 (अत्यधिक / Max)</span>
        </div>
      </div>

      {/* Sub-risks breakdown */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {language === 'hi' ? 'विशिष्ट कारक जोखिम विश्लेषण' : 'Categorized Agromet Vulnerabilities'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {riskData.subRisks.map((sub) => (
            <div
              key={sub.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    {getSubRiskIcon(sub.category)}
                    <span className="truncate">{language === 'hi' ? sub.nameHi : sub.nameEn}</span>
                  </div>
                  <RiskBadge level={sub.level} score={sub.score} language={language} size="sm" />
                </div>

                <div className="text-[11px] text-slate-600 space-y-1">
                  <div className="bg-white/80 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 block text-[10px] uppercase text-amber-900">
                      {t.weatherTrigger}:
                    </span>
                    <span>{language === 'hi' ? sub.triggerConditionHi : sub.triggerConditionEn}</span>
                  </div>

                  <div className="bg-emerald-50/80 p-2 rounded-lg border border-emerald-100">
                    <span className="font-semibold text-emerald-900 block text-[10px] uppercase">
                      {t.recommendedMitigation}:
                    </span>
                    <span className="text-emerald-950 font-medium">
                      {language === 'hi' ? sub.mitigationHi : sub.mitigationEn}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spray Window recommendation footer */}
      <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-teal-900 font-medium">
          <CheckCircle size={16} className="text-teal-600 shrink-0" />
          <span>
            {language === 'hi' ? riskData.spraySuitabilityNext48h.summaryHi : riskData.spraySuitabilityNext48h.summaryEn}
          </span>
        </div>
        <div className="text-xs font-bold text-teal-800 shrink-0">
          {language === 'hi' ? riskData.spraySuitabilityNext48h.bestWindowHi : riskData.spraySuitabilityNext48h.bestWindowEn}
        </div>
      </div>
    </div>
  );
};
