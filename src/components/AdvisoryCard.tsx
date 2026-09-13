import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, UserCheck } from 'lucide-react';
import type { AgrometAdvisory } from '../types';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { AudioReader } from './common/AudioReader';
import { useTranslation } from '../i18n/useTranslation';
import { useMockData } from '../context/MockDataContext';

export interface AdvisoryCardProps {
  advisory: AgrometAdvisory;
  className?: string;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ advisory, className = '' }) => {
  const { language } = useTranslation();
  const { voteAdvisoryFeedback } = useMockData();
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const title = language === 'hi' ? advisory.titleHi : advisory.titleEn;
  const content = language === 'hi' ? advisory.detailedActionHi : advisory.detailedActionEn;
  const audioText = language === 'hi' ? advisory.audioScriptHi : advisory.audioScriptEn;
  const sourceAuth = language === 'hi' ? advisory.sourceAuthorityHi : advisory.sourceAuthorityEn;

  const handleVote = (isHelpful: boolean) => {
    if (!hasVoted) {
      voteAdvisoryFeedback(advisory.id, isHelpful);
      setHasVoted(true);
    }
  };

  return (
    <div className={`p-5 rounded-2xl bg-slate-850/90 border border-slate-750/70 hover:border-emerald-500/40 transition-all space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              advisory.riskLevel === 'warning' || advisory.riskLevel === 'critical'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {advisory.riskLevel}
            </span>
            <ConfidenceIndicator level={advisory.confidence} />
          </div>
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
        </div>

        {/* Audio TTS reader */}
        <AudioReader textToRead={audioText || content} language={language === 'hi' ? 'hi' : 'en'} />
      </div>

      {/* Main Content */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
        {content}
      </p>

      {/* Author & Footer Actions */}
      <div className="pt-2 border-t border-slate-750/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-7 h-7 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-300 border border-emerald-500/30">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">{advisory.approvedBy || sourceAuth}</div>
            <div className="text-[10px] text-slate-400">{sourceAuth}</div>
          </div>
        </div>

        {/* Feedback buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            {language === 'hi' ? 'सलाह उपयोगी लगी?' : 'Helpful?'}
          </span>
          <button
            type="button"
            onClick={() => handleVote(true)}
            disabled={hasVoted}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              hasVoted
                ? 'bg-slate-800 text-slate-500 border-slate-700'
                : 'bg-slate-800/80 hover:bg-emerald-900/40 hover:text-emerald-300 border-slate-700 text-slate-300'
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{advisory.helpfulCount || 0}</span>
          </button>
          <button
            type="button"
            onClick={() => handleVote(false)}
            disabled={hasVoted}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              hasVoted
                ? 'bg-slate-800 text-slate-500 border-slate-700'
                : 'bg-slate-800/80 hover:bg-rose-900/40 hover:text-rose-300 border-slate-700 text-slate-300'
            }`}
          >
            <ThumbsDown className="w-3 h-3" />
            <span>{advisory.unhelpfulCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
