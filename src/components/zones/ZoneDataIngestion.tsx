import { Database, Users, FileText, Briefcase } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { DataSource } from '../../types';
import { DataLabelBadge } from '../common/DataLabelBadge';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  hr_master: Users,
  tms: FileText,
  rr: FileText,
  bizforce: Briefcase,
  vrb: FileText,
  opex: Database,
};

export function ZoneDataIngestion() {
  const { data, activeStep } = useStore();
  const isActive = activeStep === 1;

  return (
    <div
      className={clsx(
        'flex flex-1 min-h-0 flex-col rounded-xl border p-4 transition-all',
        isActive
          ? 'border-decisionBlue/50 bg-decisionBlue/5'
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      data-tour="zone-1"
    >
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <span
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            isActive ? 'bg-decisionBlue text-white' : 'bg-neutralGray/30 text-textSub'
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
              className="flex items-center justify-between rounded-lg bg-appBg/50 p-3"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-textSub" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-textMain">{ds.name}</span>
                    <DataLabelBadge label={ds.label} />
                  </div>
                  <p className="text-xs text-textSub">{ds.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-textMain">{ds.coverage}%</div>
                <div className="text-xs text-textSub">커버리지</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
