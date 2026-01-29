import { Database, Users, FileText, Briefcase } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { DataSource } from '../../types';
import { DataLabelBadge } from '../common/DataLabelBadge';
import { SkeletonZone } from '../common/SkeletonZone';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  hr_master: Users,
  tms: FileText,
  rr: FileText,
  bizforce: Briefcase,
  vrb: FileText,
  opex: Database,
};

export function ZoneDataIngestion() {
  const { data, activeStep, loadingPhase } = useStore();
  const showSkeleton = loadingPhase === 1;

  if (showSkeleton) return <SkeletonZone variant="default" processingLabel="데이터 소스 수집 중..." />;
  const isActive = activeStep === 1;
  const justRevealed = loadingPhase >= 2 && loadingPhase <= 5;

  return (
    <div
      className={clsx(
        'flex flex-1 min-h-0 flex-col rounded-xl border p-4 transition-all',
        justRevealed && 'animate-phase-reveal',
        isActive
          ? 'border-zoneIngest/50 bg-zoneIngest/5 shadow-glow-blue'
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
        <h3 className="text-sm font-semibold text-textMain">Data Ingestion</h3>
        <span className="text-xs text-textSub">데이터 수집</span>
      </div>

      <div className="flex-1 overflow-y-auto grid gap-2">
        {data.dataSources.map((ds: DataSource) => {
          const Icon = iconMap[ds.type] || Database;
          return (
            <div
              key={ds.id}
              className="zone-card flex items-center justify-between rounded-lg bg-surface-1 p-3 hover:bg-surface-3 hover:shadow-elevation-2 transition-all group"
              style={{ '--zone-accent': '#3B82F6', '--zone-accent-rgb': '59,130,246' } as React.CSSProperties}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-zoneIngest" aria-hidden="true" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-textMain">{ds.name}</span>
                    <DataLabelBadge label={ds.label} />
                  </div>
                  <p className="text-xs text-textSub">{ds.description}</p>
                </div>
              </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
