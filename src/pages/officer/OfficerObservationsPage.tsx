import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ObservationReviewQueue } from '../../components/officer/ObservationReviewQueue';
import { ShieldCheck } from 'lucide-react';

export const OfficerObservationsPage: React.FC = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {t.navOfficerObservations}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'hi'
            ? 'किसानों द्वारा प्रेषित खेत रिपोर्ट, वर्षा मापन एवं कीट लक्षणों का सत्यापन'
            : 'Validate ground-truth rainfall observations, soil moisture, and crop stress from farmers'}
        </p>
      </div>

      <ObservationReviewQueue />

      {/* Field Extension Visit Guidelines */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2 text-xs">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-700" />
          <span>{language === 'hi' ? 'खेत दौरा सत्यापन प्रोटोकॉल' : 'Field Extension Verification Protocol'}</span>
        </h3>
        <p className="text-slate-600 leading-relaxed">
          {language === 'hi'
            ? 'जब किसी ग्राम पंचायत (उदा. खामखेड़ा या मेंडोरी) से 3 या अधिक किसानों द्वारा गंभीर कीट प्रकोप अथवा जलभराव की रिपोर्ट दर्ज की जाती है, तो सिस्टम स्वचालित रूप से क्षेत्रीय कृषि विस्तार अधिकारी (RAEO) को स्थल निरीक्षण का सुझाव देता है।'
            : 'When ≥3 cluster observations report high pest pressure or anomalous standing water, the system triggers a prioritized ground inspection task for the designated Rural Agricultural Extension Officer (RAEO).'}
        </p>
      </div>
    </div>
  );
};
