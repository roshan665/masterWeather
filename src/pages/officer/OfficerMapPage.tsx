import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { PanchayatRiskMap } from '../../components/officer/PanchayatRiskMap';
import { GPWeatherMatrix } from '../../components/officer/GPWeatherMatrix';

export const OfficerMapPage: React.FC = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {t.navOfficerMap}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'hi'
            ? 'फंदा ब्लॉक की 5 पंचायतों का भू-स्थानिक जोखिम मानचित्र एवं सेंसर स्वास्थ्य'
            : 'Geospatial risk mapping and real-time AWS status for Phanda block Gram Panchayats'}
        </p>
      </div>

      <PanchayatRiskMap />
      <GPWeatherMatrix />
    </div>
  );
};
