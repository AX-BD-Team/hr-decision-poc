import { useStore } from '../../store/useStore';
import { DataLabelBadge } from '../common/DataLabelBadge';
import { clsx } from 'clsx';
import type {
  Assumption,
  Evidence,
  RiskSignal,
  DecisionPath,
} from '../../types';
import { useT } from '../../i18n';

function AssumptionsTab() {
  const t = useT();
  const { data, selectedPathId } = useStore();

  const filtered = selectedPathId
    ? data.assumptions.filter((a: Assumption) => a.relatedPaths.includes(selectedPathId))
    : data.assumptions;

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-textSub">
        {t('record.assumptionsDesc')} {selectedPathId && `(${selectedPathId} ${t('record.related')})`}
      </p>
      {filtered.map((asm: Assumption) => (
        <div key={asm.id} className="flex items-start gap-3 rounded-lg border border-neutralGray/10 bg-appBg/50 p-3">
          <span
            className={clsx(
              'rounded px-1.5 py-0.5 text-tiny font-medium font-mono uppercase',
              asm.category === 'data' && 'bg-assumption-data/20 text-assumption-data',
              asm.category === 'logic' && 'bg-assumption-logic/20 text-assumption-logic',
              asm.category === 'scope' && 'bg-assumption-scope/20 text-assumption-scope'
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
  const t = useT();
  const { data, selectedPathId } = useStore();

  const filtered = selectedPathId
    ? data.evidence.filter((e: Evidence) => e.relatedPaths.includes(selectedPathId))
    : data.evidence;

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-textSub">
        {t('record.evidenceDesc')} {selectedPathId && `(${selectedPathId} ${t('record.related')})`}
      </p>
      {filtered.map((evd: Evidence) => (
        <div key={evd.id} className="flex items-start gap-3 rounded-lg border border-neutralGray/10 bg-appBg/50 p-3">
          <DataLabelBadge label={evd.label} />
          <div className="flex-1">
            <p className="text-sm text-textMain">{evd.text}</p>
            <p className="mt-1 text-xs text-textSub">{t('record.source')}: {evd.source}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RisksTab() {
  const t = useT();
  const { data, selectedPathId } = useStore();

  const filtered = selectedPathId
    ? data.riskSignals.filter((r: RiskSignal) => r.relatedPaths.includes(selectedPathId))
    : data.riskSignals;

  const severityStyles = {
    high: 'border-severity-high/50 bg-severity-high/10',
    medium: 'border-severity-medium/50 bg-severity-medium/10',
    low: 'border-severity-low/50 bg-severity-low/10',
  };

  const severityTextColors = {
    high: 'text-severity-high',
    medium: 'text-warning',
    low: 'text-success',
  };

  return (
    <div className="space-y-2">
      <p className="mb-3 text-xs text-textSub">
        {t('record.risksDesc')} {selectedPathId && `(${selectedPathId} ${t('record.related')})`}
      </p>
      {filtered.map((risk: RiskSignal) => (
        <div
          key={risk.id}
          className={clsx('rounded-lg border p-3', severityStyles[risk.severity])}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={clsx(
                'text-xs font-bold font-mono',
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
  const t = useT();
  const { data, selectedPathId, selectPath } = useStore();

  return (
    <div>
      <p className="mb-3 text-xs text-textSub">{t('record.alternativesDesc')}</p>
      <div className="rounded-lg border border-neutralGray/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-1 text-left text-tiny text-textSub">
              <th className="px-4 py-2.5 font-mono font-semibold uppercase tracking-wider">{t('record.alternative')}</th>
              <th className="px-4 py-2.5 font-mono font-semibold uppercase tracking-wider">{t('record.cost')}</th>
              <th className="px-4 py-2.5 font-mono font-semibold uppercase tracking-wider">{t('record.duration')}</th>
              <th className="px-4 py-2.5 font-mono font-semibold uppercase tracking-wider">{t('record.risks')}</th>
              <th className="px-4 py-2.5 font-mono font-semibold uppercase tracking-wider">{t('record.effect')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutralGray/10">
            {data.decisionPaths.map((path: DecisionPath) => {
              const costMetric = path.keyMetrics.find((m) => m.name === '예상 비용');
              const timeMetric = path.keyMetrics.find((m) => m.name === '소요 기간');

              return (
                <tr
                  key={path.id}
                  onClick={() => selectPath(selectedPathId === path.id ? null : path.id)}
                  className={clsx(
                    'cursor-pointer transition-all',
                    selectedPathId === path.id
                      ? 'bg-decisionBlue/10'
                      : 'hover:bg-surface-3'
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-textMain">{path.name}</div>
                    <div className="text-xs text-textSub">{path.summary}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-textMain">
                    {costMetric?.value || '-'}
                  </td>
                  <td className="px-4 py-3 font-mono text-textMain">
                    {timeMetric?.value || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        'rounded px-1.5 py-0.5 text-xs font-medium font-mono',
                        path.riskLevel === 'high' && 'bg-severity-high/20 text-severity-high',
                        path.riskLevel === 'medium' && 'bg-severity-medium/20 text-warning',
                        path.riskLevel === 'low' && 'bg-severity-low/20 text-success'
                      )}
                    >
                      {path.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        'rounded px-1.5 py-0.5 text-xs font-medium font-mono',
                        path.effectLevel === 'high' && 'bg-success/20 text-success',
                        path.effectLevel === 'medium' && 'bg-warning/20 text-warning',
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
    </div>
  );
}

function ReportTab() {
  const t = useT();
  const { data, selectedPathId } = useStore();
  const selectedPath = data.decisionPaths.find((p: DecisionPath) => p.id === selectedPathId);

  const relatedEvidence = selectedPathId
    ? data.evidence.filter((e: Evidence) => e.relatedPaths.includes(selectedPathId))
    : [];
  const relatedAssumptions = selectedPathId
    ? data.assumptions.filter((a: Assumption) => a.relatedPaths.includes(selectedPathId))
    : [];
  const relatedRisks = selectedPathId
    ? data.riskSignals.filter((r: RiskSignal) => r.relatedPaths.includes(selectedPathId))
    : [];

  const severityStyles = {
    high: 'border-severity-high/50 bg-severity-high/10 text-severity-high',
    medium: 'border-severity-medium/50 bg-severity-medium/10 text-warning',
    low: 'border-severity-low/50 bg-severity-low/10 text-success',
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-textMain">Decision Record Preview</h4>
        <p className="text-xs text-textSub">{t('record.reportSummary')}</p>
      </div>

      {selectedPath ? (
        <div className="space-y-4">
          {/* Path Summary */}
          <div className="relative rounded-lg border border-decisionBlue/30 bg-appBg/50 p-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-decisionBlue/60 to-transparent" />
            <h5 className="mb-2 text-lg font-bold text-decisionBlue">{selectedPath.name}</h5>
            <p className="mb-4 text-sm text-textMain">{selectedPath.description}</p>

            <div className="mb-4 grid grid-cols-3 gap-4">
              {selectedPath.keyMetrics.map((metric, idx) => (
                <div key={idx} className="rounded bg-panelBg p-2">
                  <div className="text-xs text-textSub">{metric.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-textMain">{metric.value}</span>
                    {metric.change && (
                      <span
                        className={clsx(
                          'text-xs font-mono',
                          metric.changeIsPositive !== undefined
                            ? metric.changeIsPositive ? 'text-success' : 'text-severity-high'
                            : metric.change.startsWith('-') ? 'text-success' : 'text-severity-high'
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
              <h6 className="mb-2 text-xs font-semibold text-textSub font-mono uppercase tracking-wider">{t('record.keyPoints')}</h6>
              <ul className="space-y-1">
                {selectedPath.highlights.map((h, idx) => (
                  <li key={idx} className="text-sm text-textMain">• {h}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Related Evidence */}
          {relatedEvidence.length > 0 && (
            <div className="rounded-lg border border-neutralGray/20 bg-appBg/30 p-4">
              <h6 className="mb-3 text-xs font-semibold text-textSub font-mono uppercase tracking-wider">{t('record.relatedEvidence')} ({relatedEvidence.length})</h6>
              <div className="space-y-2">
                {relatedEvidence.map((evd: Evidence) => (
                  <div key={evd.id} className="flex items-start gap-3 rounded-lg border border-neutralGray/10 bg-appBg/50 p-3">
                    <DataLabelBadge label={evd.label} />
                    <div className="flex-1">
                      <p className="text-sm text-textMain">{evd.text}</p>
                      <p className="mt-1 text-xs text-textSub">{t('record.source')}: {evd.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Assumptions */}
          {relatedAssumptions.length > 0 && (
            <div className="rounded-lg border border-neutralGray/20 bg-appBg/30 p-4">
              <h6 className="mb-3 text-xs font-semibold text-textSub font-mono uppercase tracking-wider">{t('record.relatedAssumptions')} ({relatedAssumptions.length})</h6>
              <div className="space-y-2">
                {relatedAssumptions.map((asm: Assumption) => (
                  <div key={asm.id} className="flex items-start gap-3 rounded-lg border border-neutralGray/10 bg-appBg/50 p-3">
                    <span
                      className={clsx(
                        'rounded px-1.5 py-0.5 text-tiny font-medium font-mono uppercase',
                        asm.category === 'data' && 'bg-assumption-data/20 text-assumption-data',
                        asm.category === 'logic' && 'bg-assumption-logic/20 text-assumption-logic',
                        asm.category === 'scope' && 'bg-assumption-scope/20 text-assumption-scope'
                      )}
                    >
                      {asm.category.toUpperCase()}
                    </span>
                    <p className="flex-1 text-sm text-textMain">{asm.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Risks */}
          {relatedRisks.length > 0 && (
            <div className="rounded-lg border border-neutralGray/20 bg-appBg/30 p-4">
              <h6 className="mb-3 text-xs font-semibold text-textSub font-mono uppercase tracking-wider">{t('record.relatedRisks')} ({relatedRisks.length})</h6>
              <div className="space-y-2">
                {relatedRisks.map((risk: RiskSignal) => (
                  <div key={risk.id} className={clsx('rounded-lg border p-3', severityStyles[risk.severity])}>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-bold font-mono">{risk.severity.toUpperCase()}</span>
                      <DataLabelBadge label={risk.label} />
                    </div>
                    <p className="text-sm text-textMain">{risk.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternatives Comparison Table */}
          <div className="rounded-lg border border-neutralGray/20 bg-appBg/30 p-4">
            <h6 className="mb-3 text-xs font-semibold text-textSub font-mono uppercase tracking-wider">{t('record.alternativesComparison')}</h6>
            <div className="rounded-lg border border-neutralGray/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-1 text-left text-tiny text-textSub">
                    <th className="px-3 py-2 font-mono font-semibold uppercase tracking-wider">{t('record.alternative')}</th>
                    <th className="px-3 py-2 font-mono font-semibold uppercase tracking-wider">{t('record.cost')}</th>
                    <th className="px-3 py-2 font-mono font-semibold uppercase tracking-wider">{t('record.duration')}</th>
                    <th className="px-3 py-2 font-mono font-semibold uppercase tracking-wider">{t('record.risks')}</th>
                    <th className="px-3 py-2 font-mono font-semibold uppercase tracking-wider">{t('record.effect')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutralGray/10">
                  {data.decisionPaths.map((path: DecisionPath) => {
                    const costMetric = path.keyMetrics.find((m) => m.name === '예상 비용');
                    const timeMetric = path.keyMetrics.find((m) => m.name === '소요 기간');
                    const isCurrent = path.id === selectedPathId;
                    return (
                      <tr key={path.id} className={clsx(isCurrent ? 'bg-decisionBlue/10' : '')}>
                        <td className="px-3 py-2">
                          <span className={clsx('font-medium', isCurrent ? 'text-decisionBlue' : 'text-textMain')}>
                            {path.name}
                            {isCurrent && <span className="ml-1 text-tiny text-decisionBlue/70">({t('record.selected')})</span>}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono text-textMain">{costMetric?.value || '-'}</td>
                        <td className="px-3 py-2 font-mono text-textMain">{timeMetric?.value || '-'}</td>
                        <td className="px-3 py-2">
                          <span className={clsx(
                            'rounded px-1.5 py-0.5 text-xs font-medium font-mono',
                            path.riskLevel === 'high' && 'bg-severity-high/20 text-severity-high',
                            path.riskLevel === 'medium' && 'bg-severity-medium/20 text-warning',
                            path.riskLevel === 'low' && 'bg-severity-low/20 text-success'
                          )}>
                            {path.riskLevel.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={clsx(
                            'rounded px-1.5 py-0.5 text-xs font-medium font-mono',
                            path.effectLevel === 'high' && 'bg-success/20 text-success',
                            path.effectLevel === 'medium' && 'bg-warning/20 text-warning',
                            path.effectLevel === 'low' && 'bg-neutralGray/20 text-textSub'
                          )}>
                            {path.effectLevel.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-neutralGray/30 p-8 text-center">
          <p className="text-sm text-textSub">
            {t('record.selectPathPrompt')}
          </p>
        </div>
      )}
    </div>
  );
}

export function DockContent() {
  const { recordTab } = useStore();

  switch (recordTab) {
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
