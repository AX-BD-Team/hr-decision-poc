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

const severityAccent: Record<string, { color: string; rgb: string }> = {
  critical: { color: '#DC2626', rgb: '220,38,38' },
  high:     { color: '#FF4D4F', rgb: '255,77,79' },
  medium:   { color: '#FBBF24', rgb: '251,191,36' },
  low:      { color: '#34D399', rgb: '52,211,153' },
};

const severityDot: Record<string, string> = {
  critical: 'bg-severity-critical',
  high: 'bg-severity-high',
  medium: 'bg-severity-medium',
  low: 'bg-severity-low',
};

function PatternCard({ pattern, variant }: { pattern: AnalysisPattern; variant: 'zone' | 'dock' }) {
  const t = useT();
  const Icon = iconMap[pattern.type] || GitBranch;
  const accent = severityAccent[pattern.severity] || severityAccent.medium;
  const severityKey = pattern.severity as 'critical' | 'high' | 'medium' | 'low';
  const severityLabel = t(`zones.severity.${severityKey}`);

  return (
    <div
      className={clsx(
        'zone-card flex flex-col rounded-lg bg-surface-1 hover:bg-surface-3 hover:shadow-elevation-2 transition-all',
        variant === 'dock' ? 'min-w-[220px] p-3 snap-start' : 'p-3',
      )}
      style={{
        '--zone-accent': accent.color,
        '--zone-accent-rgb': accent.rgb,
        borderLeft: `3px solid ${accent.color}`,
      } as React.CSSProperties}
    >
      {/* Header: Icon + TypeBadge + DataLabel */}
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-zoneStruct" aria-hidden="true" />
        <span className="text-micro font-medium text-textSub uppercase tracking-wider">
          {t(`zones.patternType.${pattern.type}`)}
        </span>
        <span className="ml-auto"><DataLabelBadge label={pattern.label} /></span>
      </div>

      {/* Metric */}
      <div className="mb-1.5 flex items-baseline gap-2">
        <span className="text-lg font-bold text-textMain leading-tight">{pattern.metric.value}</span>
        <DataLabelBadge label={pattern.metric.label} />
      </div>
      <p className="text-micro text-textSub mb-2">{pattern.metric.name}</p>

      {/* Title */}
      <h4 className="text-sm font-medium text-textMain mb-1.5">{pattern.name}</h4>

      {/* Findings */}
      {pattern.findings.length > 0 && (
        <ul className="mb-2 space-y-0.5">
          {pattern.findings.slice(0, 2).map((f, i) => (
            <li key={i} className="text-tiny text-textSub truncate" title={f}>
              · {f}
            </li>
          ))}
        </ul>
      )}

      {/* Footer: scope + severity */}
      <div className="mt-auto flex items-center justify-between pt-1 border-t border-neutralGray/10">
        <span className="text-micro text-textSub">
          {pattern.affectedScope.count} {pattern.affectedScope.unit}
        </span>
        <span className="flex items-center gap-1">
          <span className={clsx('inline-block h-2 w-2 rounded-full', severityDot[pattern.severity])} />
          <span className="text-micro font-medium text-textSub uppercase">{severityLabel}</span>
        </span>
      </div>
    </div>
  );
}

export function ZoneStructuring({ variant = 'zone' }: { variant?: 'zone' | 'dock' }) {
  const t = useT();
  const { data, activeStep, loadingPhase, isTourActive } = useStore();
  const showSkeleton = loadingPhase >= 1 && loadingPhase < 3;

  if (showSkeleton) return <LoadingZone2Structuring />;
  const isActive = activeStep === 2;
  const justRevealed = loadingPhase >= 3 && loadingPhase <= 5;

  const inner = variant === 'dock' ? (
    <div className="scroll-fade-x relative">
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
        {data.analysisPatterns.map((pattern: AnalysisPattern) => (
          <PatternCard key={pattern.id} pattern={pattern} variant="dock" />
        ))}
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-2 min-h-0 overflow-y-auto">
      {data.analysisPatterns.map((pattern: AnalysisPattern) => (
        <PatternCard key={pattern.id} pattern={pattern} variant="zone" />
      ))}
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
          ? clsx('border-zoneStruct/70 bg-zoneStruct/10 shadow-glow-violet', isTourActive && 'zone-pulse-violet')
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
        <span className="text-xs text-textSub">{t('zones.zone2Title')}</span>
      </div>

      {inner}
    </div>
  );
}
