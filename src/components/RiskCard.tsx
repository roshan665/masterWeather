import { Info } from 'lucide-react';
import type { SubRiskDetail } from '../types';
import { RiskBadge } from './RiskBadge';
import { useTranslation } from '../i18n/useTranslation';

export interface RiskCardProps {
  risk: SubRiskDetail;
  className?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk, className = '' }) => {
  const { language } = useTranslation();

  const title = language === 'hi' ? risk.nameHi : risk.nameEn;
  const trigger = language === 'hi' ? risk.triggerConditionHi : risk.triggerConditionEn;
  const mitigation = language === 'hi' ? risk.mitigationHi : risk.mitigationEn;

  return (
    <div className={`p-4 bg-slate-850/80 rounded-2xl border border-slate-750/70 hover:border-slate-600 transition-all ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <h4 className="text-sm font-semibold text-slate-100">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
            <span>{language === 'hi' ? 'श्रेणी:' : 'Category:'}</span>
            <span className="capitalize">{risk.category.replace('_', ' ')}</span>
          </div>
        </div>
        <RiskBadge severity={risk.level} score={risk.score} showScore size="sm" />
      </div>

      <div className="mb-3 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-slate-300 space-y-1">
        <div className="text-[11px] font-medium text-slate-400">
          {language === 'hi' ? 'ट्रिगर स्थिति:' : 'Trigger Criteria:'}
        </div>
        <div>{trigger}</div>
      </div>

      <div className="text-xs bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-200 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold">{language === 'hi' ? 'सलाह:' : 'Action:'} </span>
          <span>{mitigation}</span>
        </div>
      </div>
    </div>
  );
};
