import React, { useState } from 'react';
import type { AdvisoryRule } from '../../types/knowledgeBase';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  UploadCloud,
  FileText,
  Building2,
  AlertTriangle,
  Flame,
  Calendar,
  Layers,
  Thermometer,
} from 'lucide-react';

interface RuleReviewModalProps {
  rule: AdvisoryRule;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, reviewerName: string, notes: string) => void;
  onReject: (id: string, reviewerName: string, reason: string) => void;
  onPublish: (id: string, publisherName: string, notes?: string) => void;
  currentUser: { name: string; role: string };
  language?: 'en' | 'hi';
}

export const RuleReviewModal: React.FC<RuleReviewModalProps> = ({
  rule,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onPublish,
  currentUser,
  language = 'en',
}) => {
  const [reviewNotes, setReviewNotes] = useState(rule.reviewNotes || '');
  const [activeTab, setActiveTab] = useState<'details' | 'actions'>('details');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isHi = language === 'hi';

  const handleApprove = () => {
    setErrorMsg(null);
    onApprove(rule.id, currentUser.name, reviewNotes || 'Rule verified against agromet standards.');
    onClose();
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      setErrorMsg(isHi ? 'कृपया अस्वीकृति का कारण (टिप्पणी) दर्ज करें।' : 'Please enter rejection remarks / reason.');
      return;
    }
    setErrorMsg(null);
    onReject(rule.id, currentUser.name, reviewNotes);
    onClose();
  };

  const handlePublish = () => {
    setErrorMsg(null);
    onPublish(rule.id, currentUser.name, reviewNotes || 'Published to active agromet decision pipeline.');
    onClose();
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
      case 'severe':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase flex items-center gap-1"><Flame size={11} /> Critical</span>;
      case 'warning':
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase flex items-center gap-1"><AlertTriangle size={11} /> Warning</span>;
      case 'moderate':
      case 'advisory':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">Advisory</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">Normal</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  {isHi ? 'कृषि सलाह नियम समीक्षा' : 'Advisory Rule Technical Review'}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold">
                  {rule.ruleCode}
                </span>
                <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-semibold">
                  {rule.version}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isHi ? rule.cropNameHi : rule.cropNameEn} • {isHi ? rule.stageNameHi : rule.stageNameEn} • Status: <span className="capitalize font-semibold text-slate-700">{rule.approvalStatus.replace('_', ' ')}</span>
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

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 px-6 bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {isHi ? 'नियम विवरण एवं सीमाएं' : 'Rule Specifications & Thresholds'}
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'actions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {isHi ? 'अनुमोदन व प्रकाशन नियंत्रण' : 'Review & Approval Controls'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {activeTab === 'details' ? (
            <div className="space-y-5">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">{isHi ? 'फसल' : 'Crop'}</span>
                  <span className="font-bold text-xs text-slate-800">{isHi ? rule.cropNameHi : rule.cropNameEn}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">{isHi ? 'विकास अवस्था' : 'Stage'}</span>
                  <span className="font-bold text-xs text-slate-800">{isHi ? rule.stageNameHi : rule.stageNameEn}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">{isHi ? 'जोखिम श्रेणी' : 'Risk Category'}</span>
                  <span className="font-bold text-xs text-slate-800 capitalize">{rule.riskCategory.replace('_', ' ')}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">{isHi ? 'तीव्रता' : 'Severity'}</span>
                  <div className="pt-0.5">{getSeverityBadge(rule.severity)}</div>
                </div>
              </div>

              {/* Weather Trigger & Thresholds */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 space-y-2.5">
                <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <Thermometer size={14} className="text-amber-700" />
                  <span>{isHi ? 'मौसम ट्रिगर एवं सीमाएं' : 'Weather Trigger & Parametric Thresholds'}</span>
                </h4>
                <div className="text-xs text-slate-800 space-y-1">
                  <p><span className="font-semibold text-slate-600">EN:</span> {rule.weatherTriggerEn}</p>
                  <p><span className="font-semibold text-slate-600">HI:</span> {rule.weatherTriggerHi}</p>
                </div>
                {rule.thresholds && rule.thresholds.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {rule.thresholds.map((t, idx) => (
                      <span key={idx} className="font-mono text-[11px] font-bold px-2.5 py-1 bg-amber-100/80 text-amber-900 rounded-lg border border-amber-200">
                        {t.parameter.toUpperCase()} {t.operator} {t.value} {t.unit}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Action (Bilingual) */}
              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-3">
                <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                  <FileText size={14} className="text-emerald-700" />
                  <span>{isHi ? 'संस्तुत कृषि कार्य एवं दिशा-निर्देश' : 'Approved Advisory Action Guidelines'}</span>
                </h4>
                
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">English Formulation</span>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                      {rule.recommendedActionEn}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">हिंदी प्रारूप (Hindi)</span>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed font-medium">
                      {rule.recommendedActionHi}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                  <ShieldCheck size={14} className="shrink-0 mt-0.5 text-emerald-700" />
                  <span>
                    <strong>Compliance verified:</strong> Advisory strictly follows ICAR/KVK standard cultural & IPM recommendations. No unverified chemical dosages generated.
                  </span>
                </div>
              </div>

              {/* Institutional Source Organization & Citations */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 size={14} className="text-slate-700" />
                  <span>{isHi ? 'संस्थागत स्रोत एवं संदर्भ' : 'Authoritative Institutional Source & Reference'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-medium block">{isHi ? 'अनुमोदित संस्थान:' : 'Source Institute:'}</span>
                    <span className="font-bold text-slate-800">{rule.sourceOrganizationEn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">{isHi ? 'दस्तावेज़ संदर्भ:' : 'Source Reference Citation:'}</span>
                    <span className="font-mono text-slate-800 font-semibold">{rule.sourceReferenceEn}</span>
                  </div>
                </div>
              </div>

              {/* Dates & Validity */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  <span>{isHi ? 'प्रभावी अवधि:' : 'Effective Window:'} </span>
                  <span className="font-mono font-semibold text-slate-700">{rule.effectiveFrom} to {rule.effectiveUntil}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers size={13} className="text-slate-400" />
                  <span>{isHi ? 'निर्माता:' : 'Created by:'} </span>
                  <span className="font-semibold text-slate-700">{rule.createdBy}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Reviewer Action Form */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3">
                <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-blue-700" />
                  <span>{isHi ? 'समीक्षक टिप्पणी एवं सत्यापन' : 'Officer Review Notes & Decision'}</span>
                </h4>
                <p className="text-xs text-slate-600">
                  {isHi
                    ? 'कृपया इस नियम के मौसम ट्रिगर, फसल चरण उपयुक्तता और आईसीएआर पैकेज ऑफ प्रैक्टिस के संदर्भ की पुष्टि करें।'
                    : 'Validate the meteorological threshold against historical local data and ensure recommendations adhere to official KVK/ICAR guidelines.'}
                </p>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {isHi ? 'समीक्षा टिप्पणी / सुधार निर्देश' : 'Reviewer Remarks / Modification Notes'}
                  </label>
                  <textarea
                    rows={4}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder={
                      isHi
                        ? 'उदा. फंदा विकासखंड के लिए वर्षा सीमा 20 मिमी उपयुक्त है। संदर्भ सत्यापित।'
                        : 'e.g. Threshold verified against Phanda block Vertisol drainage conditions. Approved for live pipeline.'
                    }
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Review History Context */}
              {rule.reviewer && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>{isHi ? 'पिछली समीक्षा:' : 'Last Review by:'} <strong className="text-slate-700">{rule.reviewer}</strong></span>
                    <span className="font-mono text-[11px]">{rule.reviewedAt?.slice(0, 10)}</span>
                  </div>
                  {rule.reviewNotes && (
                    <p className="text-slate-600 italic">"{rule.reviewNotes}"</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            {isHi ? 'रद्द करें' : 'Cancel'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <XCircle size={15} />
              <span>{isHi ? 'अस्वीकार करें' : 'Reject Rule'}</span>
            </button>

            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shadow-blue-600/20"
            >
              <CheckCircle2 size={15} />
              <span>{isHi ? 'अनुमोदित करें' : 'Approve Rule'}</span>
            </button>

            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shadow-emerald-600/20"
            >
              <UploadCloud size={15} />
              <span>{isHi ? 'लाइव प्रकाशित करें' : 'Publish to Live'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
