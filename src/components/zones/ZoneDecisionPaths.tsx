import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { DecisionPath } from '../../types';
import { DataLabelBadge } from '../common/DataLabelBadge';

const riskDotColors = {
  high: 'bg-alertRed',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400',
};

const riskBadgeStyles = {
  high: 'bg-alertRed/20 text-alertRed',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-emerald-500/20 text-emerald-400',
};

const effectBadgeStyles = {
  high: 'bg-emerald-500/20 text-emerald-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-neutralGray/20 text-textSub',
};

export function ZoneDecisionPaths({ variant = 'zone' }: { variant?: 'zone' | 'dock' }) {
  const { data, activeStep, selectedPathId, selectPath } = useStore();
  const isActive = activeStep === 4;

  const inner = (
    <div className="flex-1 overflow-y-auto grid gap-2 md:grid-cols-3">
      {data.decisionPaths.map((path: DecisionPath) => (
        <button
          key={path.id}
          onClick={() => selectPath(selectedPathId === path.id ? null : path.id)}
          className={clsx(
            'relative rounded-lg border p-4 text-left transition-all overflow-hidden focus-ring',
            selectedPathId === path.id
              ? 'border-zonePath bg-zonePath/10 shadow-glow-amber shadow-inner-glow-amber'
              : 'border-neutralGray/20 bg-surface-1 hover:border-neutralGray/40 hover:bg-surface-3 hover:shadow-elevation-2'
          )}
        >
          {selectedPathId === path.id && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-zonePath/40 via-zonePath to-zonePath/40" />
          )}
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-textMain">{path.name}</h4>
            {selectedPathId === path.id && (
              <CheckCircle className="h-4 w-4 text-zonePath" />
            )}
          </div>
          <p className="mb-3 text-xs text-textSub">{path.summary}</p>

          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px]', riskBadgeStyles[path.riskLevel])}>
              <span className={clsx('h-1.5 w-1.5 rounded-full', riskDotColors[path.riskLevel], path.riskLevel === 'high' && 'animate-glow-pulse')} />
              <AlertTriangle className="h-3 w-3" />
              리스크 {path.riskLevel.toUpperCase()}
            </span>
            <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px]', effectBadgeStyles[path.effectLevel])}>
              <TrendingUp className="h-3 w-3" />
              효과 {path.effectLevel.toUpperCase()}
            </span>
          </div>

          <div className="divide-y divide-neutralGray/10">
            {path.keyMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 first:pt-0 last:pb-0">
                <span className="text-textSub">{metric.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-medium text-textMain">{metric.value}</span>
                  {metric.change && (
                    <span
                      className={clsx(
                        'rounded px-1 py-0.5 text-[10px] font-mono font-medium',
                        metric.changeIsPositive !== undefined
                          ? metric.changeIsPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-alertRed/20 text-alertRed'
                          : metric.change.startsWith('-') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-alertRed/20 text-alertRed'
                      )}
                    >
                      {metric.change}
                    </span>
                  )}
                  <DataLabelBadge label={metric.label} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {path.highlights.map((h, idx) => (
              <span
                key={idx}
                className="rounded bg-neutralGray/20 px-1.5 py-0.5 text-[11px] text-textSub"
              >
                {h}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );

  if (variant === 'dock') {
    return (
      <div className="flex min-h-0 flex-col">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-textMain">Decision Paths</h3>
            <span className="text-xs text-textSub">의사결정 대안 카드</span>
          </div>
          <span className="data-mono text-[10px] uppercase tracking-wider text-textSub">A/B/C Compare</span>
        </div>
        {inner}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex flex-1 min-h-0 flex-col rounded-xl border p-4 transition-all',
        isActive
          ? 'border-zonePath/50 bg-zonePath/5 shadow-glow-amber'
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      data-tour="zone-4"
    >
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <span
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            isActive ? 'bg-zonePath text-white' : 'bg-neutralGray/30 text-textSub'
          )}
        >
          4
        </span>
        <h3 className="text-sm font-semibold text-textMain">Decision Paths</h3>
        <span className="text-xs text-textSub">의사결정 대안</span>
      </div>

      {inner}
    </div>
  );
}
