import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { AdvisoryList } from '../../components/farmer/AdvisoryList';
import { CropStageTracker } from '../../components/farmer/CropStageTracker';
import { ShieldCheck } from 'lucide-react';

export const AdvisoriesPage: React.FC = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {t.navAdvisories}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'hi'
            ? 'कृषि विज्ञान केंद्र एवं कृषि मौसम वैज्ञानिकों द्वारा अनुमोदित अधिकृत सलाह'
            : 'Officially approved agromet advisories with officer validation stamps and voice narration'}
        </p>
      </div>

      <CropStageTracker />

      <AdvisoryList />

      {/* Advisory Safety Guarantee */}
      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck size={20} className="text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">
            {language === 'hi' ? 'कृषि सलाह सुरक्षा एवं विश्वसनीयता मानक' : 'Agromet Advisory Safety Guarantee'}
          </span>
          <p className="leading-relaxed">
            {language === 'hi'
              ? 'PanchayatMausam AI अनधिकृत या अप्रमाणित रासायनिक उपचार कभी नहीं सुझाता है। सभी सलाह राज्य कृषि विभाग, आईसीएआर-केवीके भोपाल एवं मौसम विभाग के सत्यापित वैज्ञानिकों द्वारा समीक्षा उपरांत ही जारी की जाती हैं।'
              : 'PanchayatMausam AI strictly adheres to safety standards and never generates hallucinated agrochemical recipes. All advice undergoes agronomist approval before broadcasting.'}
          </p>
        </div>
      </div>
    </div>
  );
};
