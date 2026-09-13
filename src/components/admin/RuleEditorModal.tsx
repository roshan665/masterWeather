import React, { useState } from 'react';
import type { AdvisoryRule, RuleThreshold, RuleApprovalStatus } from '../../types/knowledgeBase';
import type { RiskCategory } from '../../types/risk';
import type { RiskLevel } from '../../types/common';
import type { CropId } from '../../types/crop';
import { CROPS } from '../../data/crops';
import {
  X,
  Plus,
  Trash2,
  Sliders,
  ShieldCheck,
  AlertCircle,
  Save,
  Info,
} from 'lucide-react';

interface RuleEditorModalProps {
  rule?: AdvisoryRule | null; // if null, creating new rule
  isOpen: boolean;
  onClose: () => void;
  onSave: (ruleData: any, changeSummary: string) => void;
  currentUser: { name: string; role: string };
  language?: 'en' | 'hi';
}

const PARAMETER_OPTIONS = [
  { id: 'rainfall', labelEn: 'Rainfall (Precipitation)', labelHi: 'वर्षा (Rainfall)', unit: 'mm' },
  { id: 'temp_max', labelEn: 'Maximum Temperature', labelHi: 'अधिकतम तापमान', unit: '°C' },
  { id: 'temp_min', labelEn: 'Minimum Temperature', labelHi: 'न्यूनतम तापमान', unit: '°C' },
  { id: 'rh', labelEn: 'Relative Humidity', labelHi: 'सापेक्ष आर्द्रता', unit: '%' },
  { id: 'wind_speed', labelEn: 'Wind Speed', labelHi: 'हवा की गति', unit: 'km/h' },
  { id: 'soil_moisture', labelEn: 'Soil Moisture', labelHi: 'मृदा नमी', unit: '%' },
  { id: 'leaf_wetness', labelEn: 'Leaf Wetness Duration', labelHi: 'पत्ती आर्द्रता अवधि', unit: 'hours' },
];

const OPERATORS = ['>', '<', '>=', '<=', 'between'] as const;

const RISK_CATEGORIES: { id: RiskCategory; labelEn: string; labelHi: string }[] = [
  { id: 'pest_disease', labelEn: 'Pest & Disease Infestation', labelHi: 'कीट एवं रोग प्रकोप' },
  { id: 'excess_water', labelEn: 'Excess Water / Waterlogging', labelHi: 'अतिवृष्टि / जलभराव' },
  { id: 'moisture_deficit', labelEn: 'Moisture Stress / Drought', labelHi: 'नमी की कमी / सूखा' },
  { id: 'thermal_stress', labelEn: 'Thermal Stress (Heat / Cold)', labelHi: 'तापमान तनाव (गर्मी/सर्दी)' },
  { id: 'spray_window', labelEn: 'Spray Window Unfavorable', labelHi: 'छिड़काव प्रतिकूल मौसम' },
  { id: 'harvest_disruption', labelEn: 'Harvest Disruption & Rain Risk', labelHi: 'कटाई व्यवधान एवं वर्षा जोखिम' },
];

const SEVERITIES: { id: RiskLevel; labelEn: string }[] = [
  { id: 'advisory', labelEn: 'Advisory (Moderate)' },
  { id: 'warning', labelEn: 'Warning (High Risk)' },
  { id: 'critical', labelEn: 'Critical (Severe Danger)' },
  { id: 'normal', labelEn: 'Normal (Informational)' },
];

const SOURCE_ORGS = [
  {
    en: 'ICAR - Indian Institute of Soybean Research (IISR), Indore',
    hi: 'भाकृअनुप - भारतीय सोयाबीन अनुसंधान संस्थान (IISR), इंदौर',
  },
  {
    en: 'Krishi Vigyan Kendra (KVK), CIAE Bhopal',
    hi: 'कृषि विज्ञान केंद्र (KVK), सीआईएई भोपाल',
  },
  {
    en: 'Jawaharlal Nehru Krishi Vishwa Vidyalaya (JNKVV), Jabalpur',
    hi: 'जवाहरलाल नेहरू कृषि विश्वविद्यालय (JNKVV), जबलपुर',
  },
  {
    en: 'ICAR - Indian Institute of Wheat and Barley Research (IIWBR)',
    hi: 'भाकृअनुप - भारतीय गेहूं एवं जौ अनुसंधान संस्थान (IIWBR)',
  },
  {
    en: 'Directorate of Farmer Welfare & Agriculture Development, Madhya Pradesh',
    hi: 'किसान कल्याण एवं कृषि विकास संचालनालय, मध्य प्रदेश',
  },
];

export const RuleEditorModal: React.FC<RuleEditorModalProps> = ({
  rule,
  isOpen,
  onClose,
  onSave,
  currentUser,
  language = 'en',
}) => {
  const isEditing = !!rule;
  const isHi = language === 'hi';

  const [cropId, setCropId] = useState<CropId>(rule ? rule.cropId : 'soybean');
  const selectedCrop = CROPS.find((c) => c.id === cropId) || CROPS[0];

  const [stageId, setStageId] = useState<string>(rule ? rule.stageId : selectedCrop.stages[0]?.stageId || '');
  const [ruleCode, setRuleCode] = useState<string>(
    rule ? rule.ruleCode : `RULE-${cropId.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-3)}`
  );
  const [riskCategory, setRiskCategory] = useState<RiskCategory>(rule ? rule.riskCategory : 'pest_disease');
  const [severity, setSeverity] = useState<RiskLevel>(rule ? rule.severity : 'warning');
  const [approvalStatus, setApprovalStatus] = useState<RuleApprovalStatus>(
    rule ? rule.approvalStatus : 'draft'
  );

  const [weatherTriggerEn, setWeatherTriggerEn] = useState<string>(rule ? rule.weatherTriggerEn : '');
  const [weatherTriggerHi, setWeatherTriggerHi] = useState<string>(rule ? rule.weatherTriggerHi : '');

  const [thresholds, setThresholds] = useState<RuleThreshold[]>(
    rule && rule.thresholds?.length > 0
      ? rule.thresholds
      : [{ parameter: 'rh', operator: '>=', value: 75, unit: '%' }]
  );

  const [shortSummaryEn, setShortSummaryEn] = useState<string>(rule ? rule.shortSummaryEn : '');
  const [shortSummaryHi, setShortSummaryHi] = useState<string>(rule ? rule.shortSummaryHi : '');

  const [recommendedActionEn, setRecommendedActionEn] = useState<string>(
    rule ? rule.recommendedActionEn : '1. Inspect crop canopy for pest eggs/larvae.\n2. Install pheromone/bird perches @ 40/ha.\n3. Follow approved KVK non-chemical cultural practices.'
  );
  const [recommendedActionHi, setRecommendedActionHi] = useState<string>(
    rule ? rule.recommendedActionHi : '1. फसल की पत्तियों की जांच कर कीट प्रकोप देखें।\n2. खेत में 40-50 टी-आकार की पक्षी खूंटियां लगाएं।\n3. केवीके द्वारा संस्तुत जैविक एवं यांत्रिक उपाय अपनाएं।'
  );

  const [sourceOrgEn, setSourceOrgEn] = useState<string>(
    rule ? rule.sourceOrganizationEn : SOURCE_ORGS[0].en
  );
  const [sourceOrgHi, setSourceOrgHi] = useState<string>(
    rule ? rule.sourceOrganizationHi : SOURCE_ORGS[0].hi
  );
  const [sourceRefEn, setSourceRefEn] = useState<string>(
    rule ? rule.sourceReferenceEn : 'ICAR-IISR Agromet Advisory Guidelines 2026 (Section 3.1)'
  );
  const [sourceRefHi, setSourceRefHi] = useState<string>(
    rule ? rule.sourceReferenceHi : 'भाकृअनुप कृषि मौसम बुलेटिन 2026 (खंड 3.1)'
  );

  const [effectiveFrom, setEffectiveFrom] = useState<string>(
    rule ? rule.effectiveFrom : new Date().toISOString().slice(0, 10)
  );
  const [effectiveUntil, setEffectiveUntil] = useState<string>(
    rule ? rule.effectiveUntil : new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)
  );

  const [changeSummary, setChangeSummary] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCropChange = (newCropId: CropId) => {
    setCropId(newCropId);
    const newCropObj = CROPS.find((c) => c.id === newCropId) || CROPS[0];
    if (newCropObj.stages[0]) {
      setStageId(newCropObj.stages[0].stageId);
    }
  };

  const handleAddThreshold = () => {
    setThresholds((prev) => [...prev, { parameter: 'temp_max', operator: '>=', value: 30, unit: '°C' }]);
  };

  const handleRemoveThreshold = (index: number) => {
    setThresholds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateThreshold = (index: number, field: keyof RuleThreshold, val: any) => {
    setThresholds((prev) =>
      prev.map((t, i) => {
        if (i === index) {
          const updated = { ...t, [field]: val };
          if (field === 'parameter') {
            const opt = PARAMETER_OPTIONS.find((p) => p.id === val);
            if (opt) updated.unit = opt.unit;
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleSelectSourceOrg = (orgEn: string) => {
    const found = SOURCE_ORGS.find((s) => s.en === orgEn);
    if (found) {
      setSourceOrgEn(found.en);
      setSourceOrgHi(found.hi);
    } else {
      setSourceOrgEn(orgEn);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!ruleCode.trim()) {
      setValidationError(isHi ? 'कृपया नियम कोड दर्ज करें।' : 'Rule code is required.');
      return;
    }
    if (!weatherTriggerEn.trim()) {
      setValidationError(isHi ? 'मौसम ट्रिगर विवरण अनिवार्य है।' : 'Weather trigger description is required.');
      return;
    }
    if (isEditing && !changeSummary.trim()) {
      setValidationError(isHi ? 'कृपया किए गए परिवर्तनों का सारांश दर्ज करें।' : 'Please provide a change summary for version tracking.');
      return;
    }

    const currentCropObj = CROPS.find((c) => c.id === cropId) || CROPS[0];
    const currentStageObj = currentCropObj.stages.find((s) => s.stageId === stageId) || currentCropObj.stages[0];

    const rulePayload = {
      ruleCode: ruleCode.trim(),
      cropId,
      cropNameEn: currentCropObj.nameEn.split('(')[0].trim(),
      cropNameHi: currentCropObj.nameHi.split('(')[0].trim(),
      stageId: currentStageObj?.stageId || stageId,
      stageNameEn: currentStageObj?.nameEn || 'General Stage',
      stageNameHi: currentStageObj?.nameHi || 'सामान्य अवस्था',
      weatherTriggerEn: weatherTriggerEn.trim(),
      weatherTriggerHi: weatherTriggerHi.trim() || weatherTriggerEn.trim(),
      thresholds,
      thresholdDescriptionEn: thresholds.map((t) => `${t.parameter.toUpperCase()} ${t.operator} ${t.value} ${t.unit}`).join(', '),
      thresholdDescriptionHi: thresholds.map((t) => `${t.parameter.toUpperCase()} ${t.operator} ${t.value} ${t.unit}`).join(', '),
      riskCategory,
      severity,
      shortSummaryEn: shortSummaryEn.trim() || weatherTriggerEn.trim().slice(0, 80),
      shortSummaryHi: shortSummaryHi.trim() || weatherTriggerHi.trim().slice(0, 80),
      recommendedActionEn: recommendedActionEn.trim(),
      recommendedActionHi: recommendedActionHi.trim(),
      sourceOrganizationEn: sourceOrgEn,
      sourceOrganizationHi: sourceOrgHi,
      sourceReferenceEn: sourceRefEn,
      sourceReferenceHi: sourceRefHi,
      approvalStatus,
      effectiveFrom,
      effectiveUntil,
      createdBy: rule ? rule.createdBy : currentUser.name,
    };

    onSave(rulePayload, changeSummary || 'Initial rule created');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sliders size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isEditing
                  ? isHi
                    ? `नियम संपादित करें [${rule.ruleCode}] (${rule.version})`
                    : `Edit Advisory Rule [${rule.ruleCode}] (${rule.version})`
                  : isHi
                  ? 'नया कृषि सलाह नियम बनाएं'
                  : 'Create New Advisory Rule'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'मौसम ट्रिगर, फसल अवस्था एवं आईसीएआर पैकेज ऑफ प्रैक्टिस के अनुसार नियम परिभाषित करें।'
                  : 'Define parametric agromet risk thresholds and approved ICAR/KVK action guidance.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers & Scope */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Rule Classification & Target Crop Stage</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Rule Code */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Rule Code / ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={ruleCode}
                  onChange={(e) => setRuleCode(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="e.g. RULE-SOY-POD-001"
                  required
                />
              </div>

              {/* Crop Select */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Target Crop <span className="text-rose-500">*</span>
                </label>
                <select
                  value={cropId}
                  onChange={(e) => handleCropChange(e.target.value as CropId)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold"
                >
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Growth Stage */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Growth Stage <span className="text-rose-500">*</span>
                </label>
                <select
                  value={stageId}
                  onChange={(e) => setStageId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {selectedCrop.stages.map((st) => (
                    <option key={st.stageId} value={st.stageId}>
                      {st.nameEn} ({st.nameHi})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Risk Category */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Risk Category
                </label>
                <select
                  value={riskCategory}
                  onChange={(e) => setRiskCategory(e.target.value as RiskCategory)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {RISK_CATEGORIES.map((rc) => (
                    <option key={rc.id} value={rc.id}>
                      {rc.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Trigger Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {SEVERITIES.map((sev) => (
                    <option key={sev.id} value={sev.id}>
                      {sev.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Approval Status
                </label>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value as RuleApprovalStatus)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold"
                >
                  <option value="draft">Draft (प्रारूप)</option>
                  <option value="pending_review">Pending Review (समीक्षाधीन)</option>
                  <option value="approved">Approved (अनुमोदित)</option>
                  <option value="published">Published (लाइव प्रकाशित)</option>
                  <option value="rejected">Rejected (अस्वीकृत)</option>
                  <option value="archived">Archived (संग्रहीत)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Weather Triggers & Parametric Threshold Builder */}
          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                2. Weather Trigger & Parametric Thresholds
              </h4>
              <button
                type="button"
                onClick={handleAddThreshold}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
              >
                <Plus size={13} />
                <span>Add Threshold</span>
              </button>
            </div>

            {/* Threshold rows */}
            <div className="space-y-2">
              {thresholds.map((t, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-200">
                  <div className="flex-1 min-w-[150px]">
                    <select
                      value={t.parameter}
                      onChange={(e) => handleUpdateThreshold(idx, 'parameter', e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      {PARAMETER_OPTIONS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.labelEn} ({p.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <select
                      value={t.operator}
                      onChange={(e) => handleUpdateThreshold(idx, 'operator', e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                    >
                      {OPERATORS.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <input
                      type="text"
                      value={t.value}
                      onChange={(e) => handleUpdateThreshold(idx, 'value', e.target.value)}
                      placeholder="e.g. 75 or 28-32"
                      className="w-full text-xs font-mono p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="w-16 text-center text-xs font-mono text-slate-500 font-semibold">
                    {t.unit}
                  </div>

                  {thresholds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveThreshold(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Bilingual Weather Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Weather Trigger Narrative (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={weatherTriggerEn}
                  onChange={(e) => setWeatherTriggerEn(e.target.value)}
                  placeholder="e.g. Continuous RH > 75% for 48h with temp 28-32°C."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  मौसम ट्रिगर विवरण (हिंदी)
                </label>
                <input
                  type="text"
                  value={weatherTriggerHi}
                  onChange={(e) => setWeatherTriggerHi(e.target.value)}
                  placeholder="उदा. लगातार 48 घंटे 75% से अधिक आर्द्रता और 28-32°C तापमान।"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Recommended Action & Advisory Formulation */}
          <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                3. Recommended Action Guidelines (Bilingual)
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md font-semibold">
                <ShieldCheck size={13} />
                <span>ICAR/KVK Compliant</span>
              </div>
            </div>

            <div className="bg-emerald-100/40 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
              <Info size={14} className="shrink-0 text-emerald-700" />
              <span>
                <strong>System Safety Rule:</strong> Do not generate independent chemical dosages. Recommend physical/IPM traps, drainage, timing, and direct farmers to authorized KVK/RAEO consultations.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Recommended Actions (English) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={recommendedActionEn}
                  onChange={(e) => setRecommendedActionEn(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-sans"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  संस्तुत कृषि कार्य (हिंदी) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={recommendedActionHi}
                  onChange={(e) => setRecommendedActionHi(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-sans"
                  required
                />
              </div>
            </div>

            {/* Short summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Short Risk Summary (English)
                </label>
                <input
                  type="text"
                  value={shortSummaryEn}
                  onChange={(e) => setShortSummaryEn(e.target.value)}
                  placeholder="e.g. High risk of Semilooper larval surge."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  संक्षिप्त जोखिम सारांश (हिंदी)
                </label>
                <input
                  type="text"
                  value={shortSummaryHi}
                  onChange={(e) => setShortSummaryHi(e.target.value)}
                  placeholder="उदा. सेमीलूपर इल्ली प्रकोप की उच्च संभावना।"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Source Organization & Reference Citation */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Institutional Source & Validity Window
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Source Organization Preset
                </label>
                <select
                  value={sourceOrgEn}
                  onChange={(e) => handleSelectSourceOrg(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {SOURCE_ORGS.map((org, i) => (
                    <option key={i} value={org.en}>
                      {org.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Source Reference (English)
                </label>
                <input
                  type="text"
                  value={sourceRefEn}
                  onChange={(e) => setSourceRefEn(e.target.value)}
                  placeholder="e.g. ICAR-IISR Bulletin #42 (Section 3.2)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  स्रोत संदर्भ (हिंदी)
                </label>
                <input
                  type="text"
                  value={sourceRefHi}
                  onChange={(e) => setSourceRefHi(e.target.value)}
                  placeholder="उदा. भाकृअनुप बुलेटिन #42 (खंड 3.2)"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Effective From (प्रारंभ तिथि)
                </label>
                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) => setEffectiveFrom(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Effective Until (समाप्ति तिथि)
                </label>
                <input
                  type="date"
                  value={effectiveUntil}
                  onChange={(e) => setEffectiveUntil(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Change summary for versioning */}
            {isEditing && (
              <div className="pt-2 border-t border-slate-200">
                <label className="text-[11px] font-bold text-purple-900 block mb-1">
                  Change Summary for Version History <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={changeSummary}
                  onChange={(e) => setChangeSummary(e.target.value)}
                  placeholder="e.g. Adjusted RH trigger threshold from 70% to 75% based on ICAR update."
                  className="w-full text-xs p-2.5 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50/30"
                  required={isEditing}
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            {isHi ? 'रद्द करें' : 'Cancel'}
          </button>

          <button
            onClick={handleSubmit}
            type="button"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Save size={15} />
            <span>{isEditing ? (isHi ? 'परिवर्तन सहेजें' : 'Save Changes') : (isHi ? 'नियम बनाएं' : 'Create Rule')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
