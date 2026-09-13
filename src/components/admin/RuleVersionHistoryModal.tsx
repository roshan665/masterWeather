import React from 'react';
import type { AdvisoryRule } from '../../types/knowledgeBase';
import { X, GitCommit, User, Calendar, ShieldCheck, Tag } from 'lucide-react';

interface RuleVersionHistoryModalProps {
  rule: AdvisoryRule;
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

export const RuleVersionHistoryModal: React.FC<RuleVersionHistoryModalProps> = ({
  rule,
  isOpen,
  onClose,
  language = 'en',
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">Published</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">Approved</span>;
      case 'pending_review':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Pending Review</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">Rejected</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">Archived</span>;
      case 'draft':
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800">Draft</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <GitCommit size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span>{isHi ? 'नियम संस्करण इतिहास' : 'Rule Version History'}</span>
                <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-semibold">
                  {rule.ruleCode}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? rule.cropNameHi : rule.cropNameEn} • {isHi ? rule.stageNameHi : rule.stageNameEn}
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

        {/* Modal Body - Timeline */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Active Version summary */}
          <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-purple-700" />
              <span className="text-slate-600">{isHi ? 'वर्तमान सक्रिय संस्करण:' : 'Current Active Version:'}</span>
              <span className="font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                {rule.version}
              </span>
            </div>
            <div>
              {getStatusBadge(rule.approvalStatus)}
            </div>
          </div>

          {/* Timeline List */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {(rule.versionHistory && rule.versionHistory.length > 0
              ? rule.versionHistory
              : [
                  {
                    version: rule.version,
                    modifiedBy: rule.createdBy,
                    modifiedAt: rule.createdAt,
                    changeSummary: 'Initial creation',
                    status: rule.approvalStatus,
                  },
                ]
            ).map((ver, idx) => (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                  idx === 0 ? 'bg-purple-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Timeline Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-colors space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded">
                        {ver.version}
                      </span>
                      {getStatusBadge(ver.status)}
                      {idx === 0 && (
                        <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-100/80 px-1.5 py-0.5 rounded">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Calendar size={13} className="text-slate-400" />
                      <span>{ver.modifiedAt ? ver.modifiedAt.slice(0, 19).replace('T', ' ') : 'N/A'}</span>
                    </div>
                  </div>

                  {/* Change Summary */}
                  <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                    {ver.changeSummary || (isHi ? 'कोई परिवर्तन विवरण नहीं।' : 'No change notes provided.')}
                  </p>

                  {/* Author / Reviewer footer */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" />
                      <span>{isHi ? 'संशोधनकर्ता:' : 'Author:'} </span>
                      <span className="font-semibold text-slate-700">{ver.modifiedBy}</span>
                    </div>
                    {ver.reviewedBy && (
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <ShieldCheck size={13} />
                        <span>{isHi ? 'सत्यापित:' : 'Reviewed by:'} {ver.reviewedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
