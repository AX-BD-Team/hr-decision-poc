import { useState, useCallback } from 'react';
import { Database, Users, FileText, Briefcase, ChevronDown, Clock, ClipboardList, GraduationCap, Layers, LayoutGrid } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { DataSource } from '../../types';
import { DataLabelBadge } from '../common/DataLabelBadge';
import { LoadingZone1Ingestion } from '../loading/LoadingZone1Ingestion';
import { useT } from '../../i18n';
import { DecisionCriteriaPanel } from './DecisionCriteriaPanel';
import { DataReadinessPanel } from './DataReadinessPanel';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  hr_master: Users,
  tms: FileText,
  rr: FileText,
  bizforce: Briefcase,
  vrb: FileText,
  opex: Database,
  assignment_history: Clock,
  to_request: ClipboardList,
  training_history: GraduationCap,
  competency_model: Layers,
  work_allocation: LayoutGrid,
};

const readinessColors: Record<string, { bg: string; text: string; label: string }> = {
  available: { bg: 'bg-success/20', text: 'text-success', label: '확보' },
  recommended: { bg: 'bg-warning/20', text: 'text-warning', label: '권장' },
  missing: { bg: 'bg-severity-high/20', text: 'text-severity-high', label: '결측' },
  undefined_rules: { bg: 'bg-severity-high/20', text: 'text-severity-high', label: '미정' },
};

export function ZoneDataIngestion() {
  const t = useT();
  const { data, activeStep, loadingPhase, isTourActive, isDemoRunning } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);
  const showSkeleton = loadingPhase === 1;

  if (showSkeleton) return <LoadingZone1Ingestion />;
  const isActive = activeStep === 1;
  const justRevealed = loadingPhase >= 2 && loadingPhase <= 5;

  return (
    <div
      className={clsx(
        'flex flex-1 min-h-0 flex-col h-full rounded-xl border p-4 transition-all',
        justRevealed && 'animate-phase-reveal',
        isActive
          ? clsx('border-zoneIngest/70 bg-zoneIngest/10 shadow-glow-blue', (isDemoRunning || isTourActive) && 'zone-pulse-blue')
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      style={{ '--zone-accent': '#3B82F6' } as React.CSSProperties}
      data-tour="zone-1"
    >
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <span
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            isActive ? 'bg-zoneIngest text-white' : 'bg-neutralGray/30 text-textSub'
          )}
        >
          1
        </span>
        <h3 className="text-sm font-semibold text-textMain">{t('zones.zone1Subtitle')}</h3>
        <span className="text-xs text-textSub">{t('zones.zone1Title')}</span>
      </div>

      <div className="flex-1 overflow-y-auto grid gap-2">
        <DecisionCriteriaPanel />
        <DataReadinessPanel />
        {data.dataSources.map((ds: DataSource) => {
          const Icon = iconMap[ds.type] || Database;
          const isExpanded = expandedId === ds.id;
          return (
            <div
              key={ds.id}
              className="zone-card rounded-lg bg-surface-1 transition-all group"
              style={{ '--zone-accent': '#3B82F6', '--zone-accent-rgb': '59,130,246' } as React.CSSProperties}
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                className={clsx(
                  'flex items-center justify-between p-3 cursor-pointer rounded-lg transition-all',
                  isExpanded
                    ? 'bg-surface-2 border border-zoneIngest/40'
                    : 'hover:bg-surface-3 hover:shadow-elevation-2'
                )}
                onClick={() => toggleExpand(ds.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(ds.id);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-zoneIngest" aria-hidden="true" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-textMain">{ds.name}</span>
                      <DataLabelBadge label={ds.label} />
                      {ds.readiness && (() => {
                        const r = readinessColors[ds.readiness];
                        return r ? (
                          <span className={clsx('rounded px-1.5 py-0.5 text-micro font-mono font-medium', r.bg, r.text)}>
                            {r.label}
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <p className="text-xs text-textSub">{ds.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-mono font-medium text-textMain">{ds.coverage}%</div>
                    <div className="mt-1 h-1.5 w-16 rounded-full bg-neutralGray/20 overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-all coverage-bar',
                          ds.coverage >= 80 && 'high'
                        )}
                        style={{ width: `${ds.coverage}%` }}
                      />
                    </div>
                  </div>
                  <ChevronDown
                    className={clsx(
                      'h-3.5 w-3.5 text-textSub transition-transform duration-200',
                      isExpanded && 'rotate-180'
                    )}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Expandable detail area */}
              <div
                className={clsx(
                  'overflow-hidden transition-all duration-200 ease-in-out',
                  isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="px-3 pb-3 pt-2 border-t border-neutralGray/10">
                  <p className="text-xs font-medium text-textSub mb-2">
                    {t('zones.fieldsIncluded')} ({ds.fields.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ds.fields.map((field) => (
                      <span
                        key={field}
                        className="inline-block rounded bg-surface-2 px-2 py-0.5 font-mono text-micro text-textSub"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-micro text-textSub">
                    {ds.fields.length} {t('zones.fieldsCount')} · {t('zones.coverage')} {ds.coverage}%
                  </p>
                  {ds.readinessNote && (
                    <p className="mt-1 text-micro text-textSub italic">
                      💡 {ds.readinessNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
