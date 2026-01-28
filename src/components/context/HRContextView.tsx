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
      className="flex h-full flex-col rounded-xl border border-neutralGray/20 bg-panelBg"
      data-tour="hr-context"
    >
      {/* 헤더 */}
      <div className="border-b border-neutralGray/20 px-4 py-3">
        <h3 className="text-sm font-semibold text-contextGreen">HR Context Reference</h3>
        <p className="text-xs text-textSub">{contextView.scope}</p>
        <p className="mt-1 text-[10px] text-textSub">※ 평가/보상 목적이 아닌 의사결정 맥락 참조용</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {contextView.kpis.map((kpi: HRKpi) => {
          const Icon = kpiIcons[kpi.name] || Target;
          return (
            <div
              key={kpi.id}
              className="rounded-lg bg-appBg/50 p-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <Icon className="h-4 w-4 text-contextGreen" />
                <DataLabelBadge label={kpi.label} />
              </div>
              <div className="text-lg font-bold text-textMain">
                {kpi.value}
                {kpi.unit && <span className="ml-0.5 text-xs font-normal text-textSub">{kpi.unit}</span>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-textSub">{kpi.name}</span>
                {kpi.change && (
                  <span
                    className={clsx(
                      'text-xs',
                      kpi.change.startsWith('+') ? 'text-emerald-400' : 'text-alertRed'
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
          {/* 축 라벨 */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-textSub">
            Dependency
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-textSub">
            Utilization
          </div>

          {/* 사분면 라인 */}
          <div className="absolute left-1/2 top-2 bottom-6 w-px bg-neutralGray/30" />
          <div className="absolute top-1/2 left-6 right-2 h-px bg-neutralGray/30" />

          {/* 사분면 라벨 */}
          <div className="absolute left-8 top-3 text-[9px] text-textSub">높은 의존도</div>
          <div className="absolute right-3 top-3 text-[9px] text-alertRed">🔴 위험 구간</div>
          <div className="absolute left-8 bottom-8 text-[9px] text-textSub">안정</div>
          <div className="absolute right-3 bottom-8 text-[9px] text-amber-400">주의</div>

          {/* 데이터 포인트 */}
          {contextView.utilizationMap.map((point: UtilizationPoint) => {
            const x = 30 + (point.utilization / 1.5) * 180; // 0~1.5 범위를 픽셀로 변환
            const y = 140 - point.dependency * 120; // 0~1 범위를 픽셀로 변환 (y는 반전)
            const isSelected = selectedEntityId === point.entityId;
            const isDanger = point.utilization > 1 && point.dependency > 0.7;

            return (
              <button
                key={point.id}
                onClick={() => selectEntity(point.entityId || null)}
                className={clsx(
                  'absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold transition-all',
                  isSelected
                    ? 'bg-decisionBlue text-white ring-2 ring-white'
                    : isDanger
                    ? 'bg-alertRed text-white'
                    : 'bg-contextGreen/80 text-white hover:bg-contextGreen'
                )}
                style={{ left: x, top: y }}
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
