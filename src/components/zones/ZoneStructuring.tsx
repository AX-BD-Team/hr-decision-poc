import { GitBranch, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { AnalysisPattern } from '../../types';
import { DataLabelBadge } from '../common/DataLabelBadge';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gap_analysis: GitBranch,
  dependency: TrendingUp,
  bottleneck: AlertTriangle,
  cost_impact: DollarSign,
};

export function ZoneStructuring() {
  const { data, activeStep } = useStore();
  const isActive = activeStep === 2;

  return (
    <div
      className={clsx(
        'rounded-xl border p-4 transition-all',
        isActive
          ? 'border-decisionBlue/50 bg-decisionBlue/5'
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      data-tour="zone-2"
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            isActive ? 'bg-decisionBlue text-white' : 'bg-neutralGray/30 text-textSub'
          )}
        >
          2
        </span>
        <h3 className="text-sm font-semibold text-textMain">Structuring & Analysis</h3>
        <span className="text-xs text-textSub">구조화/분석</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {data.analysisPatterns.map((pattern: AnalysisPattern) => {
          const Icon = iconMap[pattern.type] || GitBranch;
          return (
            <div
              key={pattern.id}
              className="flex min-w-[180px] flex-col rounded-lg bg-appBg/50 p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4 text-decisionBlue" />
                <DataLabelBadge label={pattern.label} />
              </div>
              <h4 className="text-sm font-medium text-textMain">{pattern.name}</h4>
              <p className="mt-1 text-xs text-textSub">{pattern.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
