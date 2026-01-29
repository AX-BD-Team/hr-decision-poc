import { Users, TrendingUp, Clock, Target, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DataLabelBadge } from '../common/DataLabelBadge';
import { UtilizationScatterChart } from './UtilizationScatterChart';
import { clsx } from 'clsx';
import type { HRKpi, ContextInsight } from '../../types';
import { useT } from '../../i18n';

const kpiIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Headcount: Users,
  '평균 가동률': TrendingUp,
  '평균 근속': Clock,
  '역할 충족률': Target,
};

const severityIcons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityColors = {
  critical: 'border-severity-critical/50 bg-severity-critical/10 text-severity-critical',
  warning: 'border-severity-medium/50 bg-severity-medium/10 text-warning',
  info: 'border-severity-info/50 bg-severity-info/10 text-severity-info',
};

export function HRContextView({ variant = 'panel' }: { variant?: 'panel' | 'dock' }) {
  const t = useT();
  const { data, selectedEntityId, selectEntity } = useStore();
  const contextView = data.hrContextViews[0]; // 현재는 기본 뷰만 사용

  return (
    <div
      className={clsx(
        'glass-panel flex flex-col rounded-xl',
        variant === 'dock' ? 'h-full' : 'h-full'
      )}
      data-tour="hr-context"
    >
      {/* 헤더 */}
      <div className="border-b border-neutralGray/20 px-4 py-3">
        <h3 className="text-sm font-semibold text-contextGreen">HR Context Reference</h3>
        <p className="text-xs text-textSub">{contextView.scope}</p>
        <p className="mt-1 text-tiny text-textSub">{t('context.disclaimer')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {contextView.kpis.map((kpi: HRKpi) => {
          const Icon = kpiIcons[kpi.name] || Target;
          return (
            <div
              key={kpi.id}
              className="rounded-lg bg-appBg/50 p-3 hover:bg-appBg/80 transition-all cursor-default"
            >
              <div className="mb-1 flex items-center justify-between">
                <Icon className="h-4 w-4 text-contextGreen" aria-hidden="true" />
                <DataLabelBadge label={kpi.label} />
              </div>
              <div className="text-lg font-bold font-mono text-textMain">
                {kpi.value}
                {kpi.unit && <span className="ml-0.5 text-xs font-normal font-sans text-textSub">{kpi.unit}</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-textSub">{kpi.name}</span>
                {kpi.change && (
                  <span
                    className={clsx(
                      'text-xs font-mono',
                      (() => {
                        const isPositiveChange = kpi.change.startsWith('+');
                        const isGood = kpi.higherIsBetter !== undefined
                          ? kpi.higherIsBetter ? isPositiveChange : !isPositiveChange
                          : isPositiveChange;
                        return isGood ? 'text-success' : 'text-severity-high';
                      })()
                    )}
                  >
                    {kpi.change}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Utilization Map */}
      <div className="border-t border-neutralGray/20 p-3">
        <h4 className="mb-2 text-xs font-semibold text-textMain">
          Talent Utilization Map
          <span className="ml-1 font-normal text-textSub">(Dependency × Utilization)</span>
        </h4>
        <div className="h-[120px] sm:h-[200px] rounded-lg bg-appBg/50">
          <UtilizationScatterChart
            data={contextView.utilizationMap}
            selectedEntityId={selectedEntityId}
            onSelectEntity={selectEntity}
          />
        </div>
      </div>

      {/* Context Insights */}
      <div className="flex-1 overflow-y-auto border-t border-neutralGray/20 p-3">
        <h4 className="mb-2 text-xs font-semibold text-textMain">Context Insights</h4>
        <div className="space-y-2">
          {contextView.insights.map((insight: ContextInsight) => {
            const Icon = severityIcons[insight.severity];
            return (
              <div
                key={insight.id}
                role={insight.severity === 'critical' ? 'alert' : undefined}
                className={clsx(
                  'flex items-start gap-2 rounded-lg border p-2',
                  severityColors[insight.severity]
                )}
              >
                <Icon className="mt-0.5 h-3 w-3 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs">{insight.text}</p>
                  <DataLabelBadge label={insight.label} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
