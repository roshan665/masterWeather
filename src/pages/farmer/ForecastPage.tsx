import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { ForecastTabs } from '../../components/farmer/ForecastTabs';
import { CropStageTracker } from '../../components/farmer/CropStageTracker';
import { ShieldCheck } from 'lucide-react';

export const ForecastPage: React.FC = () => {
  const { language } = useApp();
  const { t } = useTranslation(language);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          {t.navForecast}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {language === 'hi'
            ? '0-24 घंटे प्रति घंटा, 1-3 दिन एवं 4-7 दिन कृषि मौसम दृष्टिकोण'
            : '0-24h hourly, 1-3 day forecast, and 4-7 day extended agromet outlook'}
        </p>
      </div>

      <CropStageTracker />

      <ForecastTabs />

      {/* Spray Window Safety Protocol Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-700" />
          <span>{language === 'hi' ? 'कीटनाशक व पर्णीय छिड़काव सुरक्षा नियम' : 'Agrochemical Spray Best Practice Rules'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-950 block">1. {language === 'hi' ? 'हवा की गति < 12-15 किमी/घंटा' : 'Wind Speed < 12-15 km/h'}</span>
            <p className="text-emerald-900">
              {language === 'hi' ? 'अधिक हवा से दवा का बहाव (Drift) होता है और पौधे पर समान फैलाव नहीं मिलता।' : 'High winds cause spray drift and uneven canopy coverage.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950 block">2. {language === 'hi' ? 'बारिश रहित खिड़की (कम से कम 3-4 घंटे)' : 'Rain-Free Window (Min 3-4 Hours)'}</span>
            <p className="text-blue-900">
              {language === 'hi' ? 'छिड़काव के बाद कम से कम 3 घंटे वर्षा न होने से दवा पत्तियों में अवशोषित होती है।' : 'Ensures full chemical uptake before potential wash-off.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-950 block">3. {language === 'hi' ? 'तापमान < 32°C व ओस सूखने पर' : 'Temp < 32°C & Dry Foliage'}</span>
            <p className="text-amber-900">
              {language === 'hi' ? 'दोपहर की तेज धूप में वाष्पीकरण बढ़ जाता है। सुबह 7-10:30 बजे सर्वोत्तम समय है।' : 'Midday heat causes droplet vaporization. Early mornings are best.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
