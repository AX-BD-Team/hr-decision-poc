import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { DashboardKpi } from '../../types';

interface KpiCardGridProps {
  kpis: DashboardKpi[];
}

export function KpiCardGrid({ kpis }: KpiCardGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="rounded-xl glass-panel border border-neutralGray/20 p-4 space-y-2"
        >
          <p className="text-xs text-textSub font-medium">{kpi.name}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-textMain">{kpi.value}</span>
            {kpi.unit && <span className="text-xs text-textSub">{kpi.unit}</span>}
          </div>
          {kpi.change && (
            <div className={clsx(
              'flex items-center gap-1 text-xs font-medium',
              kpi.changeIsPositive ? 'text-success' : 'text-alertRed'
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
