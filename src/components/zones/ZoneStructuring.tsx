import { GitBranch, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { AnalysisPattern } from '../../types';
import { DataLabelBadge } from '../common/DataLabelBadge';
import { LoadingZone2Structuring } from '../loading/LoadingZone2Structuring';
import { useT } from '../../i18n';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gap_analysis: GitBranch,
  dependency: TrendingUp,
  bottleneck: AlertTriangle,
  cost_impact: DollarSign,
};

export function ZoneStructuring({ variant = 'zone' }: { variant?: 'zone' | 'dock' }) {
  const t = useT();
  const { data, activeStep, loadingPhase } = useStore();
  const showSkeleton = loadingPhase >= 1 && loadingPhase < 3;

  if (showSkeleton) return <LoadingZone2Structuring />;
  const isActive = activeStep === 2;
  const justRevealed = loadingPhase >= 3 && loadingPhase <= 5;

  const inner = (
    <div className="scroll-fade-x relative">
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
        {data.analysisPatterns.map((pattern: AnalysisPattern) => {
          const Icon = iconMap[pattern.type] || GitBranch;
          return (
            <div
              key={pattern.id}
              className="zone-card flex min-w-[180px] flex-col rounded-lg bg-surface-1 p-3 hover:bg-surface-3 hover:shadow-elevation-2 transition-all snap-start"
              style={{ '--zone-accent': '#8B5CF6', '--zone-accent-rgb': '139,92,246' } as React.CSSProperties}
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="h-4 w-4 text-zoneStruct" aria-hidden="true" />
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

  if (variant === 'dock') {
    return (
      <div className="flex min-h-0 flex-col">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-textMain">Structuring & Analysis</h3>
            <span className="text-xs text-textSub">{t('zones.zone2DockSubtitle')}</span>
          </div>
          <span className="data-mono text-micro uppercase tracking-wider text-textSub">Patterns</span>
        </div>
        {inner}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative flex min-h-0 flex-col h-full rounded-xl border p-4 transition-all',
        justRevealed && 'animate-phase-reveal',
        isActive
          ? 'border-zoneStruct/50 bg-zoneStruct/5 shadow-glow-violet'
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      data-tour="zone-2"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl bg-gradient-to-r from-transparent via-zoneStruct/60 to-transparent" />

      <div className="mb-3 flex shrink-0 items-center gap-2">
        <span
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            isActive ? 'bg-zoneStruct text-white' : 'bg-neutralGray/30 text-textSub'
          )}
        >
          2
        </span>
        <h3 className="text-sm font-semibold text-textMain">Structuring & Analysis</h3>
        <span className="text-xs text-textSub">구조화/분석</span>
      </div>

      {inner}
    </div>
  );
}
