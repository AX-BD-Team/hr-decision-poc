import { Users, TrendingUp, Clock, Target, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DataLabelBadge } from '../common/DataLabelBadge';
import { clsx } from 'clsx';
import type { HRKpi, UtilizationPoint, ContextInsight } from '../../types';

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
  critical: 'border-alertRed/50 bg-alertRed/10 text-alertRed',
  warning: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
  info: 'border-decisionBlue/50 bg-decisionBlue/10 text-decisionBlue',
};

export function HRContextView() {
  const { data, selectedEntityId, selectEntity } = useStore();
  const contextView = data.hrContextViews[0]; // 현재는 기본 뷰만 사용

  return (
    <div
      className="glass-panel flex h-full flex-col rounded-xl"
      data-tour="hr-context"
    >
      {/* 헤더 */}
      <div className="border-b border-neutralGray/20 px-4 py-3">
        <h3 className="text-sm font-semibold text-contextGreen">HR Context Reference</h3>
        <p className="text-xs text-textSub">{contextView.scope}</p>
        <p className="mt-1 text-[11px] text-textSub">※ 평가/보상 목적이 아닌 의사결정 맥락 참조용</p>
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
                <Icon className="h-4 w-4 text-contextGreen" />
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
                        return isGood ? 'text-emerald-400' : 'text-alertRed';
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
        <div className="relative h-[160px] rounded-lg bg-appBg/50 p-2">
          {/* 위험 구간 tint (top-right quadrant) */}
          <div className="absolute right-2 top-2 w-[45%] h-[45%] rounded bg-alertRed/5" />

          {/* 축 라벨 */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] text-textSub font-mono">
            Dependency
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[11px] text-textSub font-mono">
            Utilization
          </div>

          {/* 사분면 라인 */}
          <div className="absolute left-1/2 top-2 bottom-6 w-px bg-neutralGray/30" />
          <div className="absolute top-1/2 left-6 right-2 h-px bg-neutralGray/30" />

          {/* 사분면 라벨 */}
          <div className="absolute left-8 top-3 text-[9px] text-textSub">높은 의존도</div>
          <div className="absolute right-3 top-3 flex items-center gap-1 text-[9px] text-alertRed">
            <span className="inline-block h-2 w-2 rounded-full bg-alertRed animate-glow-pulse" />
            위험 구간
          </div>
          <div className="absolute left-8 bottom-8 text-[9px] text-textSub">안정</div>
          <div className="absolute right-3 bottom-8 text-[9px] text-amber-400">주의</div>

          {/* 데이터 포인트 */}
          {contextView.utilizationMap.map((point: UtilizationPoint) => {
            // 퍼센트 기반 포지셔닝 (축 라벨 영역 고려: left 15%~95%, top 5%~80%)
            const xPct = 15 + (point.utilization / 1.5) * 80; // 0~1.5 → 15%~95%
            const yPct = 80 - point.dependency * 75; // 0~1 → 80%~5% (y 반전)
            const isSelected = selectedEntityId === point.entityId;
            const isDanger = point.utilization > 1 && point.dependency > 0.7;

            return (
              <button
                key={point.id}
                onClick={() => selectEntity(point.entityId || null)}
                className={clsx(
                  'absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-bold transition-all hover:scale-125',
                  isSelected
                    ? 'bg-decisionBlue text-white ring-2 ring-white'
                    : isDanger
                    ? 'bg-alertRed text-white'
                    : 'bg-contextGreen/80 text-white hover:bg-contextGreen'
                )}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                title={`${point.name}: 의존도 ${(point.dependency * 100).toFixed(0)}%, 가동률 ${(point.utilization * 100).toFixed(0)}%`}
              >
                {point.name.charAt(0)}
              </button>
            );
          })}
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
                className={clsx(
                  'flex items-start gap-2 rounded-lg border p-2',
                  severityColors[insight.severity]
                )}
              >
                <Icon className="mt-0.5 h-3 w-3 flex-shrink-0" />
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
