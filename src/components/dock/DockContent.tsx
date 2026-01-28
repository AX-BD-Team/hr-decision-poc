import { useStore } from '../../store/useStore';
import { DataLabelBadge } from '../common/DataLabelBadge';
import { clsx } from 'clsx';
import type {
  Assumption,
  Evidence,
  RiskSignal,
  DecisionPath,
} from '../../types';

function AssumptionsTab() {
  const { data, selectedPathId } = useStore();

  const filtered = selectedPathId
    ? data.assumptions.filter((a: Assumption) => a.relatedPaths.includes(selectedPathId))
    : data.assumptions;

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-textSub">
        분석에 사용된 가정 {selectedPathId && `(${selectedPathId} 관련)`}
      </p>
      {filtered.map((asm: Assumption) => (
        <div key={asm.id} className="flex items-start gap-3 rounded-lg bg-appBg/50 p-3">
          <span
            className={clsx(
              'rounded px-1.5 py-0.5 text-[11px] font-medium',
              asm.category === 'data' && 'bg-cyan-500/20 text-cyan-400',
              asm.category === 'logic' && 'bg-purple-500/20 text-purple-400',
              asm.category === 'scope' && 'bg-amber-500/20 text-amber-400'
            )}
          >
            {asm.category.toUpperCase()}
          </span>
          <p className="flex-1 text-sm text-textMain">{asm.text}</p>
        </div>
      ))}
    </div>
  );
}

function EvidenceTab() {
  const { data, selectedPathId } = useStore();

  const filtered = selectedPathId
    ? data.evidence.filter((e: Evidence) => e.relatedPaths.includes(selectedPathId))
    : data.evidence;

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-textSub">
        의사결정 근거 자료 {selectedPathId && `(${selectedPathId} 관련)`}
      </p>
      {filtered.map((evd: Evidence) => (
        <div key={evd.id} className="flex items-start gap-3 rounded-lg bg-appBg/50 p-3">
          <DataLabelBadge label={evd.label} />
          <div className="flex-1">
            <p className="text-sm text-textMain">{evd.text}</p>
            <p className="mt-1 text-xs text-textSub">출처: {evd.source}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RisksTab() {
  const { data, selectedPathId } = useStore();

  const filtered = selectedPathId
    ? data.riskSignals.filter((r: RiskSignal) => r.relatedPaths.includes(selectedPathId))
    : data.riskSignals;

  const severityStyles = {
    high: 'border-alertRed/50 bg-alertRed/10',
    medium: 'border-amber-500/50 bg-amber-500/10',
    low: 'border-emerald-500/50 bg-emerald-500/10',
  };

  const severityTextColors = {
    high: 'text-alertRed',
    medium: 'text-amber-400',
    low: 'text-emerald-400',
  };

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-textSub">
        리스크 신호 {selectedPathId && `(${selectedPathId} 관련)`}
      </p>
      {filtered.map((risk: RiskSignal) => (
        <div
          key={risk.id}
          className={clsx('rounded-lg border p-3', severityStyles[risk.severity])}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={clsx(
                'text-xs font-bold',
                severityTextColors[risk.severity]
              )}
            >
              {risk.severity.toUpperCase()}
            </span>
            <DataLabelBadge label={risk.label} />
          </div>
          <p className="text-sm text-textMain">{risk.text}</p>
        </div>
      ))}
    </div>
  );
}

function AlternativesTab() {
  const { data, selectedPathId, selectPath } = useStore();

  return (
    <div>
      <p className="mb-3 text-xs text-textSub">의사결정 대안 비교</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutralGray/20 text-left text-xs text-textSub">
            <th className="pb-2 pr-4">대안</th>
            <th className="pb-2 pr-4">비용</th>
            <th className="pb-2 pr-4">기간</th>
            <th className="pb-2 pr-4">리스크</th>
            <th className="pb-2">효과</th>
          </tr>
        </thead>
        <tbody>
          {data.decisionPaths.map((path: DecisionPath) => {
            const costMetric = path.keyMetrics.find((m) => m.name === '예상 비용');
            const timeMetric = path.keyMetrics.find((m) => m.name === '소요 기간');

            return (
              <tr
                key={path.id}
                onClick={() => selectPath(selectedPathId === path.id ? null : path.id)}
                className={clsx(
                  'cursor-pointer border-b border-neutralGray/10 transition-all',
                  selectedPathId === path.id
                    ? 'bg-decisionBlue/10'
                    : 'hover:bg-appBg/50'
                )}
              >
                <td className="py-3 pr-4">
                  <div className="font-medium text-textMain">{path.name}</div>
                  <div className="text-xs text-textSub">{path.summary}</div>
                </td>
                <td className="py-3 pr-4 text-textMain">
                  {costMetric?.value || '-'}
                </td>
                <td className="py-3 pr-4 text-textMain">
                  {timeMetric?.value || '-'}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={clsx(
                      'rounded px-1.5 py-0.5 text-xs font-medium',
                      path.riskLevel === 'high' && 'bg-alertRed/20 text-alertRed',
                      path.riskLevel === 'medium' && 'bg-amber-500/20 text-amber-400',
                      path.riskLevel === 'low' && 'bg-emerald-500/20 text-emerald-400'
                    )}
                  >
                    {path.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={clsx(
                      'rounded px-1.5 py-0.5 text-xs font-medium',
                      path.effectLevel === 'high' && 'bg-emerald-500/20 text-emerald-400',
                      path.effectLevel === 'medium' && 'bg-amber-500/20 text-amber-400',
                      path.effectLevel === 'low' && 'bg-neutralGray/20 text-textSub'
                    )}
                  >
                    {path.effectLevel.toUpperCase()}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ReportTab() {
  const { data, selectedPathId } = useStore();
  const selectedPath = data.decisionPaths.find((p: DecisionPath) => p.id === selectedPathId);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-textMain">Decision Record Preview</h4>
        <p className="text-xs text-textSub">선택된 의사결정 경로의 요약 보고서</p>
      </div>

      {selectedPath ? (
        <div className="rounded-lg border border-neutralGray/20 bg-appBg/50 p-4">
          <h5 className="mb-2 text-lg font-bold text-decisionBlue">{selectedPath.name}</h5>
          <p className="mb-4 text-sm text-textMain">{selectedPath.description}</p>

          <div className="mb-4 grid grid-cols-3 gap-4">
            {selectedPath.keyMetrics.map((metric, idx) => (
              <div key={idx} className="rounded bg-panelBg p-2">
                <div className="text-xs text-textSub">{metric.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-textMain">{metric.value}</span>
                  {metric.change && (
                    <span
                      className={clsx(
                        'text-xs',
                        metric.changeIsPositive !== undefined
                          ? metric.changeIsPositive ? 'text-emerald-400' : 'text-alertRed'
                          : metric.change.startsWith('-') ? 'text-emerald-400' : 'text-alertRed'
                      )}
                    >
                      {metric.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h6 className="mb-2 text-xs font-semibold text-textSub">핵심 포인트</h6>
            <ul className="space-y-1">
              {selectedPath.highlights.map((h, idx) => (
                <li key={idx} className="text-sm text-textMain">
                  • {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-neutralGray/30 p-8 text-center">
          <p className="text-sm text-textSub">
            Decision Paths 영역에서 대안을 선택하면 상세 보고서가 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}

export function DockContent() {
  const { dockTab } = useStore();

  switch (dockTab) {
    case 'assumptions':
      return <AssumptionsTab />;
    case 'evidence':
      return <EvidenceTab />;
    case 'risks':
      return <RisksTab />;
    case 'alternatives':
      return <AlternativesTab />;
    case 'report':
      return <ReportTab />;
    default:
      return null;
  }
}
