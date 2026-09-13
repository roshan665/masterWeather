import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockData } from '../../context/MockDataContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RiskBadge } from '../common/RiskBadge';
import { AudioReader } from '../common/AudioReader';
import {
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const AdvisoryList: React.FC = () => {
  const { language, activePanchayat } = useApp();
  const { advisories, voteAdvisoryHelpful } = useMockData();
  const { t } = useTranslation(language);

  const [expandedAdvisoryId, setExpandedAdvisoryId] = useState<string | null>(null);
  const [votedMap, setVotedMap] = useState<Record<string, 'helpful' | 'unhelpful'>>({});

  // Filter approved advisories for active panchayat and crop (or general ones)
  const filteredAdvisories = advisories.filter(
    (adv) =>
      adv.approvalStatus === 'approved' &&
      (adv.panchayatId === activePanchayat.id || adv.panchayatId === 'acharpura')
  );

  const handleVote = (id: string, isHelpful: boolean) => {
    if (votedMap[id]) return;
    voteAdvisoryHelpful(id, isHelpful);
    setVotedMap((prev) => ({ ...prev, [id]: isHelpful ? 'helpful' : 'unhelpful' }));
  };

  const toggleExpand = (id: string) => {
    setExpandedAdvisoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-emerald-700" />
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            {t.officialApprovedAdvisory}
          </h2>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {filteredAdvisories.length} {language === 'hi' ? 'सलाह सक्रिय' : 'Active Advisories'}
        </div>
      </div>

      {filteredAdvisories.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <BookOpen size={36} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            {language === 'hi' ? 'इस पंचायत हेतु वर्तमान में कोई विशेष सलाह नहीं है।' : 'No active advisories for this selection.'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi' ? 'सामान्य कृषि दिशा-निर्देशों का पालन करें।' : 'Follow standard seasonal crop management practices.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAdvisories.map((adv) => {
            const isExpanded = expandedAdvisoryId === adv.id;
            const hasVoted = votedMap[adv.id];

            return (
              <div
                key={adv.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
              >
                {/* Advisory Top Meta: Crop Stage & Risk Level */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={adv.riskLevel} language={language} size="sm" showScore={false} />
                    <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                      {language === 'hi' ? adv.stageNameHi : adv.stageNameEn}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      {language === 'hi' ? adv.panchayatNameHi : adv.panchayatNameEn}
                    </span>
                  </div>

                  {/* Audio Reader Button */}
                  <AudioReader
                    textToRead={language === 'hi' ? adv.audioScriptHi : adv.audioScriptEn}
                    language={language}
                  />
                </div>

                {/* Advisory Title & Short Summary */}
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {language === 'hi' ? adv.titleHi : adv.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {language === 'hi' ? adv.shortSummaryHi : adv.shortSummaryEn}
                  </p>
                </div>

                {/* Weather Trigger Info */}
                <div className="bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <span className="font-bold shrink-0">{t.weatherTrigger}:</span>
                  <span>{language === 'hi' ? adv.weatherTriggerHi : adv.weatherTriggerEn}</span>
                </div>

                {/* Expandable Detailed Guidance */}
                {isExpanded && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2 animate-in fade-in duration-150">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-600" />
                      <span>{t.detailedGuidance}</span>
                    </div>
                    <p className="leading-relaxed">
                      {language === 'hi' ? adv.detailedActionHi : adv.detailedActionEn}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1 text-emerald-700">
                        <ShieldCheck size={14} />
                        <span>{language === 'hi' ? adv.sourceAuthorityHi : adv.sourceAuthorityEn}</span>
                      </div>
                      {adv.approvedBy && (
                        <div className="italic">
                          {t.approvedByOfficer}: {adv.approvedBy}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Bar: Read More + Feedback Voting */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => toggleExpand(adv.id)}
                    className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <span>{isExpanded ? (language === 'hi' ? 'कम विवरण' : 'Show Less') : (language === 'hi' ? 'विस्तृत दिशा-निर्देश देखें' : 'View Full Guidance')}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* Feedback rating */}
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-[11px] hidden sm:inline">{t.wasThisHelpful}</span>
                    
                    <button
                      onClick={() => handleVote(adv.id, true)}
                      disabled={Boolean(hasVoted)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all cursor-pointer ${
                        hasVoted === 'helpful'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                      title={t.helpfulYes}
                    >
                      <ThumbsUp size={13} className={hasVoted === 'helpful' ? 'text-emerald-600' : ''} />
                      <span>{adv.helpfulCount}</span>
                    </button>

                    <button
                      onClick={() => handleVote(adv.id, false)}
                      disabled={Boolean(hasVoted)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all cursor-pointer ${
                        hasVoted === 'unhelpful'
                          ? 'bg-rose-100 border-rose-300 text-rose-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                      title={t.helpfulNo}
                    >
                      <ThumbsDown size={13} className={hasVoted === 'unhelpful' ? 'text-rose-600' : ''} />
                      <span>{adv.unhelpfulCount}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
