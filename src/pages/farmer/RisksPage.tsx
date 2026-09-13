import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RiskOverviewCard } from '../../components/farmer/RiskOverviewCard';
import { CropStageTracker } from '../../components/farmer/CropStageTracker';

export const RisksPage: React.FC = () => {
  const { language, activeCrop, cropActiveState } = useApp();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {t.navRisks}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'hi'
            ? 'फसल विकास अवस्था एवं स्थानीय मौसम से उत्पन्न जोखिमों का व्यापक विश्लेषण'
            : 'Crop-stage-aware risk models, microclimate triggers, and protective measures'}
        </p>
      </div>

      <CropStageTracker />

      <RiskOverviewCard />

      {/* Stage-specific vulnerability matrix */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <h2 className="font-bold text-base text-slate-900">
          {language === 'hi'
            ? `${activeCrop.nameHi} - अवस्थावार मुख्य मौसमी संवेदनशीलता`
            : `${activeCrop.nameEn} - Phenological Sensitivity Profile`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeCrop.stages.map((st) => (
            <div
              key={st.stageId}
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                st.stageId === cropActiveState.currentStage.stageId
                  ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">
                  {language === 'hi' ? st.nameHi : st.nameEn}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 rounded text-slate-700">
                  {st.typicalDurationDays} {language === 'hi' ? 'दिन' : 'days'}
                </span>
              </div>

              <p className="text-slate-600">
                {language === 'hi' ? st.descriptionHi : st.descriptionEn}
              </p>

              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-500">
                  {language === 'hi' ? 'जल संवेदनशीलता: ' : 'Water Sensitivity: '}
                  <strong className="text-slate-800 capitalize">{st.waterSensitivity}</strong>
                </span>
                <span className="text-slate-500">
                  {language === 'hi' ? 'तापमान संवेदनशीलता: ' : 'Thermal Sensitivity: '}
                  <strong className="text-slate-800 capitalize">{st.thermalSensitivity}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
