import {
  Shield,
  FileText,
  AlertTriangle,
  GitBranch,
  ClipboardList,
  RotateCcw,
  Sparkles,
  Download,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../../store/useStore';
import { DockContent } from '../dock/DockContent';
import { useT } from '../../i18n';

const recordTabs = [
  { id: 'evidence' as const, label: 'Evidence', icon: Shield },
  { id: 'assumptions' as const, label: 'Assumptions', icon: FileText },
  { id: 'risks' as const, label: 'Risks', icon: AlertTriangle },
  { id: 'alternatives' as const, label: 'Alternatives', icon: GitBranch },
  { id: 'report' as const, label: 'Record', icon: ClipboardList },
];

export function DecisionRecordSection() {
  const t = useT();
  const { recordTab, setRecordTab, reset, data, selectedPathId, loadingPhase } = useStore();

  if (loadingPhase >= 1 && loadingPhase < 5) return null;

  const handleExportHtml = () => {
    const selectedPath = data.decisionPaths.find((p) => p.id === selectedPathId);
    const relatedEvidence = selectedPathId
      ? data.evidence.filter((e) => e.relatedPaths.includes(selectedPathId))
      : data.evidence;
    const relatedAssumptions = selectedPathId
      ? data.assumptions.filter((a) => a.relatedPaths.includes(selectedPathId))
      : data.assumptions;
    const relatedRisks = selectedPathId
      ? data.riskSignals.filter((r) => r.relatedPaths.includes(selectedPathId))
      : data.riskSignals;

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const severityColor: Record<string, string> = { high: '#FF4D4F', medium: '#FBBF24', low: '#34D399' };
    const effectColor: Record<string, string> = { high: '#34D399', medium: '#FBBF24', low: '#AAB4C5' };

    const pathSummaryHtml = selectedPath
      ? `<section class="card highlight">
          <h2>${esc(selectedPath.name)}</h2>
          <p>${esc(selectedPath.description)}</p>
          <div class="metrics">${selectedPath.keyMetrics.map((m) =>
            `<div class="metric"><span class="metric-label">${esc(m.name)}</span><span class="metric-value">${esc(m.value)}${m.change ? ` <small style="color:${m.changeIsPositive ? '#34D399' : '#FF4D4F'}">${esc(m.change)}</small>` : ''}</span></div>`
          ).join('')}</div>
          <h3>${esc(t('record.keyPoints'))}</h3>
          <ul>${selectedPath.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
        </section>`
      : `<p class="muted">${esc(t('record.noPathSelected'))}</p>`;

    const evidenceHtml = relatedEvidence.length > 0
      ? `<section class="card"><h2>${esc(t('record.relatedEvidence'))} (${relatedEvidence.length})</h2>${relatedEvidence.map((e) =>
          `<div class="item"><span class="badge">${esc(e.label)}</span><p>${esc(e.text)}</p><small>${esc(t('record.source'))}: ${esc(e.source)}</small></div>`
        ).join('')}</section>`
      : '';

    const assumptionsHtml = relatedAssumptions.length > 0
      ? `<section class="card"><h2>${esc(t('record.relatedAssumptions'))} (${relatedAssumptions.length})</h2>${relatedAssumptions.map((a) =>
          `<div class="item"><span class="badge cat-${a.category}">${esc(a.category.toUpperCase())}</span><p>${esc(a.text)}</p></div>`
        ).join('')}</section>`
      : '';

    const risksHtml = relatedRisks.length > 0
      ? `<section class="card"><h2>${esc(t('record.relatedRisks'))} (${relatedRisks.length})</h2>${relatedRisks.map((r) =>
          `<div class="item risk-${r.severity}"><span class="badge" style="color:${severityColor[r.severity]}">${esc(r.severity.toUpperCase())}</span><p>${esc(r.text)}</p></div>`
        ).join('')}</section>`
      : '';

    const comparisonHtml = `<section class="card"><h2>${esc(t('record.alternativesComparison'))}</h2>
      <table><thead><tr><th>${esc(t('record.alternative'))}</th><th>${esc(t('record.cost'))}</th><th>${esc(t('record.duration'))}</th><th>${esc(t('record.risks'))}</th><th>${esc(t('record.effect'))}</th></tr></thead>
      <tbody>${data.decisionPaths.map((p) => {
        const cost = p.keyMetrics.find((m) => m.name === '예상 비용');
        const time = p.keyMetrics.find((m) => m.name === '소요 기간');
        const isCurrent = p.id === selectedPathId;
        return `<tr${isCurrent ? ' class="selected"' : ''}><td>${esc(p.name)}${isCurrent ? ' ✓' : ''}</td><td>${cost?.value || '-'}</td><td>${time?.value || '-'}</td><td style="color:${severityColor[p.riskLevel]}">${p.riskLevel.toUpperCase()}</td><td style="color:${effectColor[p.effectLevel]}">${p.effectLevel.toUpperCase()}</td></tr>`;
      }).join('')}</tbody></table></section>`;

    const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Decision Record — ${esc(data.meta.name)}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#E6EAF2;background:#0B1220;padding:32px;line-height:1.6}
    h1{font-size:20px;margin-bottom:4px;color:#4F8CFF}
    h2{font-size:15px;margin-bottom:12px;color:#E6EAF2;border-bottom:1px solid rgba(170,180,197,0.15);padding-bottom:8px}
    h3{font-size:13px;margin:12px 0 6px;color:#AAB4C5;text-transform:uppercase;letter-spacing:0.05em}
    .subtitle{font-size:12px;color:#AAB4C5;margin-bottom:24px}
    .card{background:#111A2E;border:1px solid rgba(170,180,197,0.1);border-radius:12px;padding:20px;margin-bottom:16px}
    .card.highlight{border-color:rgba(79,140,255,0.3)}
    .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0}
    .metric{background:rgba(11,18,32,0.5);border-radius:8px;padding:10px}
    .metric-label{display:block;font-size:11px;color:#AAB4C5}
    .metric-value{display:block;font-size:14px;font-weight:700;font-family:monospace;color:#E6EAF2}
    ul{padding-left:18px}
    li{font-size:13px;margin:4px 0}
    .item{background:rgba(11,18,32,0.4);border:1px solid rgba(170,180,197,0.08);border-radius:8px;padding:12px;margin-bottom:8px}
    .item p{font-size:13px;margin-top:4px}
    .item small{font-size:11px;color:#AAB4C5}
    .badge{display:inline-block;font-size:10px;font-weight:700;font-family:monospace;text-transform:uppercase;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.06)}
    .cat-data{color:#3B82F6}.cat-logic{color:#8B5CF6}.cat-scope{color:#F59E0B}
    .risk-high{border-color:rgba(255,77,79,0.3)}.risk-medium{border-color:rgba(251,191,36,0.3)}.risk-low{border-color:rgba(52,211,153,0.3)}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#AAB4C5;padding:8px 12px;border-bottom:1px solid rgba(170,180,197,0.15)}
    td{padding:8px 12px;border-bottom:1px solid rgba(170,180,197,0.06);font-family:monospace}
    tr.selected{background:rgba(79,140,255,0.08)}
    .muted{color:#AAB4C5;font-size:13px}
    .footer{margin-top:24px;font-size:11px;color:#AAB4C5;border-top:1px solid rgba(170,180,197,0.1);padding-top:12px}
  </style>
</head>
<body>
  <h1>Decision Record</h1>
  <p class="subtitle">${esc(data.meta.name)} — ${esc(data.meta.keyQuestion)}<br/>Exported: ${new Date().toISOString()}</p>
  ${pathSummaryHtml}
  ${evidenceHtml}
  ${assumptionsHtml}
  ${risksHtml}
  ${comparisonHtml}
  <p class="footer">Generated by O-AOD HR Decision Support PoC</p>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-record-${data.meta.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={clsx('rounded-xl border border-neutralGray/20 bg-panelBg/50 p-4 shadow-elevation-2', loadingPhase === 5 && 'animate-phase-reveal')}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-textMain">Explainability & Decision Record</h3>
          <p className="text-xs text-textSub">{t('record.recordSubtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg glass-panel px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setRecordTab('report')}
            className="flex items-center gap-2 rounded-lg bg-decisionBlue px-3 py-2 text-sm font-medium text-white transition-all hover:bg-decisionBlue/80 hover:shadow-glow-blue"
          >
            <Sparkles className="h-4 w-4" />
            Generate
          </button>
          <button
            onClick={handleExportHtml}
            className="flex items-center gap-2 rounded-lg bg-decisionBlue/15 px-3 py-2 text-sm font-medium text-decisionBlue transition-all hover:bg-decisionBlue/20"
          >
            <Download className="h-4 w-4" />
            Export HTML
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {recordTabs.map((tab) => {
          const Icon = tab.icon;
          const active = recordTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRecordTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all focus-ring',
                active
                  ? 'border-contextGreen/40 bg-contextGreen/10 text-contextGreen'
                  : 'border-neutralGray/20 bg-appBg/30 text-textSub hover:bg-appBg/50 hover:text-textMain'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <DockContent />
      </div>
    </div>
  );
}

