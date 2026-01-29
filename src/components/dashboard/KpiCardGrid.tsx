import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { DashboardKpi } from '../../types';

interface KpiCardGridProps {
  kpis: DashboardKpi[];
}

const accentColors = [
  'bg-zoneIngest',   // blue
  'bg-zoneStruct',   // purple
  'bg-zoneGraph',    // cyan
  'bg-zonePath',     // amber
];

const staggerAnims = [
  'animate-stagger-1',
  'animate-stagger-2',
  'animate-stagger-3',
  'animate-stagger-4',
];

export function KpiCardGrid({ kpis }: KpiCardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi, idx) => (
        <div
          key={kpi.id}
          className={clsx(
            'relative rounded-xl glass-panel border border-neutralGray/20 p-4 space-y-2 overflow-hidden',
            'hover:translate-y-[-2px] hover:shadow-lg hover:shadow-decisionBlue/10 transition-all duration-200',
            staggerAnims[idx % staggerAnims.length]
          )}
        >
          {/* Top accent bar */}
          <div className={clsx('absolute top-0 left-0 right-0 h-[3px] rounded-t-xl', accentColors[idx % accentColors.length])} />

          <p className="text-xs text-textSub font-medium">{kpi.name}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-textMain">{kpi.value}</span>
            {kpi.unit && <span className="text-xs text-textSub">{kpi.unit}</span>}
          </div>
          {kpi.change && (
            <div className={clsx(
              'inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5',
              kpi.changeIsPositive ? 'text-success bg-success/15' : 'text-alertRed bg-alertRed/15'
            )}>
              {kpi.changeIsPositive
                ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
              }
              {kpi.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
