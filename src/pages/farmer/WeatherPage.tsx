import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { CurrentWeatherCard } from '../../components/farmer/CurrentWeatherCard';
import { MOCK_CURRENT_WEATHER } from '../../data/mockWeather';
import {
  Sun,
  Wind,
  Gauge,
  Thermometer,
  CloudRain,
  Compass,
  Layers,
  Database,
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { t } = useTranslation(language);

  const weather = MOCK_CURRENT_WEATHER[activePanchayat.id] || MOCK_CURRENT_WEATHER['acharpura'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.navWeather}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi' ? 'स्थानीय प्रत्यक्ष सेंसर एवं माइक्रॉक्लाइमेट चर' : 'Detailed localized agromet variables and microclimate parameters'}
          </p>
        </div>
      </div>

      <CurrentWeatherCard />

      {/* Advanced Agricultural Meteorological Variables Breakdown */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Layers size={18} className="text-emerald-700" />
          <span>{language === 'hi' ? 'उन्नत कृषि मौसम मेट्रिक्स' : 'Advanced Agrometeorological Metrics'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* ET0 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{t.et0Evapo}</span>
              <Gauge size={16} className="text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-slate-900">{weather.et0MmDay} mm/day</div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'दैनिक फसल जल वाष्पीकरण दर (सिंचाई शेड्यूलिंग हेतु)' : 'Daily reference evapotranspiration for irrigation quota.'}
            </p>
          </div>

          {/* Solar Radiation */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{t.solarRadiation}</span>
              <Sun size={16} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold text-slate-900">{weather.solarRadiationWm2} W/m²</div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'प्रकाश संश्लेषण एवं फसल ऊर्जा दक्षता' : 'Incident solar flux driving crop photosynthesis.'}
            </p>
          </div>

          {/* Dew Point */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{t.dewPoint}</span>
              <Thermometer size={16} className="text-cyan-600" />
            </div>
            <div className="text-xl font-bold text-slate-900">{weather.dewPointC}°C</div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'पत्तियों पर ओस जमने का तापमान (फफूंद रोग संकेतक)' : 'Temperature where moisture condenses on crop leaves.'}
            </p>
          </div>

          {/* Rainfall Accumulation */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{t.rainfall24h}</span>
              <CloudRain size={16} className="text-sky-600" />
            </div>
            <div className="text-xl font-bold text-slate-900">{weather.rainfallMm24h} mm</div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'पिछले 24 घंटों की संचित वर्षा' : 'Cumulative 24-hour recorded precipitation.'}
            </p>
          </div>

          {/* Wind Vector */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{t.windSpeed} & {t.windDirection}</span>
              <Wind size={16} className="text-teal-600" />
            </div>
            <div className="text-xl font-bold text-slate-900">{weather.windSpeedKmh} km/h ({weather.windDirectionCompass})</div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'छिड़काव एवं कीट फैलाव आकलन' : 'Critical for agrochemical drift prevention.'}
            </p>
          </div>

          {/* Barometric Pressure */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{t.airPressure}</span>
              <Compass size={16} className="text-purple-600" />
            </div>
            <div className="text-xl font-bold text-slate-900">{weather.pressureHpa} hPa</div>
            <p className="text-[11px] text-slate-500">
              {language === 'hi' ? 'अस्थिरता व आंधी पूर्व चेतावनी संकेतक' : 'Local atmospheric pressure trend.'}
            </p>
          </div>

        </div>
      </div>

      {/* Sensor Fallback & Data Quality Explainer */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
        <Database size={20} className="text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-emerald-950">
            {language === 'hi' ? 'डेटा गुणवत्ता व फॉलबैक प्रोटोकॉल' : 'Data Integrity & Fallback Protocol'}
          </div>
          <p className="text-emerald-900/90 leading-relaxed text-xs">
            {language === 'hi'
              ? 'PanchayatMausam AI त्रिस्तरीय बैकअप आर्किटेक्चर का उपयोग करता है: 1) प्रत्यक्ष स्वचालित मौसम केंद्र सेंसर, 2) 5 किमी ग्रिडेड न्यूमेरिकल मॉडल इंटरपोलेशन, 3) ऐतिहासिक क्षेत्रीय मौसमी औसत। यदि सेंसर संचार बाधित होता है, तो सिस्टम विश्वसनीयता टैग को स्वचालित रूप से समायोजित करता है।'
              : 'PanchayatMausam AI employs a 3-tier fallback architecture: 1) Direct local Automatic Weather Station sensors, 2) 5km gridded numerical model interpolation (NCMRWF/IMD), 3) Historical seasonal climatology. When sensors fail, confidence indicators automatically reflect the fallback state.'}
          </p>
        </div>
      </div>
    </div>
  );
};
