import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { DecisionPath } from '../../types';
import { DataLabelBadge } from '../common/DataLabelBadge';

const riskColors = {
  high: 'text-alertRed',
  medium: 'text-amber-400',
  low: 'text-emerald-400',
};

const effectColors = {
  high: 'text-emerald-400',
  medium: 'text-amber-400',
  low: 'text-textSub',
};

export function ZoneDecisionPaths() {
  const { data, activeStep, selectedPathId, selectPath } = useStore();
  const isActive = activeStep === 4;

  return (
    <div
      className={clsx(
        'flex flex-1 min-h-0 flex-col rounded-xl border p-4 transition-all',
        isActive
          ? 'border-decisionBlue/50 bg-decisionBlue/5'
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      data-tour="zone-4"
    >
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <span
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            isActive ? 'bg-decisionBlue text-white' : 'bg-neutralGray/30 text-textSub'
          )}
        >
          4
        </span>
        <h3 className="text-sm font-semibold text-textMain">Decision Paths</h3>
        <span className="text-xs text-textSub">의사결정 대안</span>
      </div>

      <div className="flex-1 overflow-y-auto grid gap-2 md:grid-cols-3">
        {data.decisionPaths.map((path: DecisionPath) => (
          <button
            key={path.id}
            onClick={() => selectPath(selectedPathId === path.id ? null : path.id)}
            className={clsx(
              'rounded-lg border p-4 text-left transition-all',
              selectedPathId === path.id
                ? 'border-decisionBlue bg-decisionBlue/10'
                : 'border-neutralGray/20 bg-appBg/50 hover:border-neutralGray/40'
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-textMain">{path.name}</h4>
              {selectedPathId === path.id && (
                <CheckCircle className="h-4 w-4 text-decisionBlue" />
              )}
            </div>
            <p className="mb-3 text-xs text-textSub">{path.summary}</p>

            {/* 리스크/효과 표시 */}
            <div className="mb-3 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <AlertTriangle className={clsx('h-3 w-3', riskColors[path.riskLevel])} />
                <span className={riskColors[path.riskLevel]}>
                  리스크 {path.riskLevel.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className={clsx('h-3 w-3', effectColors[path.effectLevel])} />
                <span className={effectColors[path.effectLevel]}>
                  효과 {path.effectLevel.toUpperCase()}
                </span>
              </div>
            </div>

            {/* 핵심 지표 */}
            <div className="space-y-1.5">
              {path.keyMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-textSub">{metric.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-textMain">{metric.value}</span>
                    {metric.change && (
                      <span
                        className={clsx(
                          'text-[11px]',
                          metric.changeIsPositive !== undefined
                            ? metric.changeIsPositive ? 'text-emerald-400' : 'text-alertRed'
                            : metric.change.startsWith('-') ? 'text-emerald-400' : 'text-alertRed'
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

            {/* 하이라이트 */}
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
    </div>
  );
}
