import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { GPWeatherMatrix } from '../../components/officer/GPWeatherMatrix';
import { RiskOverviewCard } from '../../components/farmer/RiskOverviewCard';
import { CropStageTracker } from '../../components/farmer/CropStageTracker';
import { CROPS } from '../../data/crops';
import { PANCHAYATS } from '../../data/panchayats';
import { calculateRiskAssessment } from '../../data/mockRisks';
import {
  BarChart2,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  Legend
} from 'recharts';

export const OfficerRisksPage: React.FC = () => {
  const { language, activeCrop, activePanchayat } = useApp();
  const { t } = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'panchayat' | 'crop' | 'stage'>('panchayat');

  // 1. Cross-Panchayat Risk Data for current crop
  const gpRiskData = PANCHAYATS.map((gp) => {
    const assessment = calculateRiskAssessment(gp.id, activeCrop.id, activeCrop.stages[2]?.stageId || activeCrop.stages[0].stageId);
    return {
      gpId: gp.id,
      name: language === 'hi' ? gp.nameHi : gp.nameEn,
      score: assessment.overallScore,
      level: assessment.overallLevel,
      subRisks: assessment.subRisks
    };
  });

  // 2. Cross-Crop Comparative Data across 3 crops for active Panchayat
  const cropComparisonData = CROPS.map((crop) => {
    const defaultStage = crop.stages[1]?.stageId || crop.stages[0]?.stageId;
    const assessment = calculateRiskAssessment(activePanchayat.id, crop.id, defaultStage);
    const pest = assessment.subRisks.find((r) => r.category === 'pest_disease')?.score || 55;
    const moisture = assessment.subRisks.find((r) => r.category === 'excess_water' || r.category === 'moisture_deficit')?.score || 48;
    const thermal = assessment.subRisks.find((r) => r.category === 'thermal_stress')?.score || 35;
    return {
      cropId: crop.id,
      name: language === 'hi' ? crop.nameHi : crop.nameEn,
      overallScore: assessment.overallScore,
      pestRisk: pest,
      moistureRisk: moisture,
      thermalRisk: thermal,
    };
  });

  // 3. Risk by Growth Stage for active Crop
  const stageRiskData = activeCrop.stages.map((stage) => {
    const assessment = calculateRiskAssessment(activePanchayat.id, activeCrop.id, stage.stageId);
    return {
      stageId: stage.stageId,
      name: language === 'hi' ? stage.nameHi : stage.nameEn,
      durationDays: stage.typicalDurationDays,
      score: assessment.overallScore,
      level: assessment.overallLevel,
    };
  });

  // 4. Severity Distribution Summary
  const severityDistribution = [
    { name: language === 'hi' ? 'सामान्य (Normal)' : 'Normal', count: 1, color: '#10b981' },
    { name: language === 'hi' ? 'कम जोखिम (Low)' : 'Low', count: 1, color: '#38bdf8' },
    { name: language === 'hi' ? 'मध्यम जोखिम (Moderate)' : 'Moderate', count: 2, color: '#f59e0b' },
    { name: language === 'hi' ? 'उच्च/गंभीर (High/Critical)' : 'High/Critical', count: 1, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {t.navOfficerRisks}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi'
              ? 'फंदा ब्लॉक में फसल, ग्राम पंचायत एवं विकास अवस्थावार बहुआयामी जोखिम विश्लेषण'
              : 'Multi-dimensional crop, phenological stage, and cross-panchayat risk matrix'}
          </p>
        </div>

        {/* Dimension View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('panchayat')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'panchayat' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'पंचायतवार' : 'By Panchayat'}
          </button>
          <button
            onClick={() => setActiveTab('crop')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'crop' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'फसलवार' : 'By Crop'}
          </button>
          <button
            onClick={() => setActiveTab('stage')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'stage' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'विकास अवस्थावार' : 'By Growth Stage'}
          </button>
        </div>
      </div>

      {/* Crop & Stage Pipeline Controller */}
      <CropStageTracker />

      {/* Main Multi-dimensional Risk Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-700" />
              <span>
                {activeTab === 'panchayat' && (language === 'hi' ? `${activeCrop.nameHi} - 5 ग्राम पंचायतों में समग्र जोखिम स्कोर (0-100)` : `${activeCrop.nameEn} - Risk Score Across 5 Panchayats`)}
                {activeTab === 'crop' && (language === 'hi' ? `${activePanchayat.nameHi} - 3 प्रमुख फसलों का बहुआयामी तुलनात्मक जोखिम` : `${activePanchayat.nameEn} - Comparative Risk Across 3 Crops`)}
                {activeTab === 'stage' && (language === 'hi' ? `${activeCrop.nameHi} - विकास अवस्थावार संवेदनशीलता विश्लेषण` : `${activeCrop.nameEn} - Risk Sensitivity Across Phenological Stages`)}
              </span>
            </h2>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'panchayat' ? (
                <BarChart data={gpRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" name={language === 'hi' ? 'जोखिम स्कोर' : 'Risk Score'} radius={[6, 6, 0, 0]}>
                    {gpRiskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.score >= 70
                            ? '#f43f5e'
                            : entry.score >= 50
                            ? '#f59e0b'
                            : entry.score >= 30
                            ? '#38bdf8'
                            : '#10b981'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : activeTab === 'crop' ? (
                <BarChart data={cropComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="pestRisk" name="Pest / Disease" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="moistureRisk" name="Soil Moisture" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="thermalRisk" name="Heat / Thermal" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="overallScore" name="Overall Index" fill="#047857" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={stageRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="score" name={language === 'hi' ? 'चरण जोखिम' : 'Stage Vulnerability'} radius={[6, 6, 0, 0]}>
                    {stageRiskData.map((entry, index) => (
                      <Cell
                        key={`cell-stage-${index}`}
                        fill={
                          entry.score >= 70
                            ? '#f43f5e'
                            : entry.score >= 50
                            ? '#f59e0b'
                            : entry.score >= 30
                            ? '#38bdf8'
                            : '#10b981'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution & Node Alert */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-purple-600" />
              <span>{language === 'hi' ? 'ब्लॉक स्तर पर जोखिम गंभीरता वितरण' : 'Risk Severity Distribution'}</span>
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {severityDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.count} GP ({item.count * 20}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.count * 20}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 mt-3">
            <span className="font-bold block mb-0.5">⚠️ {language === 'hi' ? 'उच्चतम सतर्कता क्षेत्र:' : 'Highest Vulnerability Node:'}</span>
            <span>{language === 'hi' ? 'समसगढ़ एवं रातीबड़ में उच्च आर्द्रता के कारण पीला मोज़ेक एवं फफूंद धब्बा जोखिम अधिकतम है।' : 'Samasgarh & Ratibad exhibit peak fungal and vector proliferation.'}</span>
          </div>
        </div>
      </div>

      {/* Detailed Risk Breakdown Card for Active GP */}
      <RiskOverviewCard />

      {/* Cross GP Weather Matrix */}
      <GPWeatherMatrix />
    </div>
  );
};

