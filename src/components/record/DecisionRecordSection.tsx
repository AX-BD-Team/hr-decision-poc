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

const recordTabs = [
  { id: 'evidence' as const, label: 'Evidence', icon: Shield },
  { id: 'assumptions' as const, label: 'Assumptions', icon: FileText },
  { id: 'risks' as const, label: 'Risks', icon: AlertTriangle },
  { id: 'alternatives' as const, label: 'Alternatives', icon: GitBranch },
  { id: 'report' as const, label: 'Record', icon: ClipboardList },
];

export function DecisionRecordSection() {
  const { recordTab, setRecordTab, reset, data, selectedPathId } = useStore();

  const handleExportHtml = () => {
    const payload = {
      scenario: data.meta,
      selectedPathId,
      exportedAt: new Date().toISOString(),
    };

    const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Decision Record</title>
    <style>
      body{margin:0;padding:24px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#E6EAF2;background:#0B1220;}
      h1{margin:0 0 12px 0;font-size:18px;}
      pre{background:rgba(17,26,46,0.8);border:1px solid rgba(255,255,255,0.08);padding:16px;border-radius:12px;overflow:auto;}
    </style>
  </head>
  <body>
    <h1>Explainability & Decision Record</h1>
    <pre>${JSON.stringify(payload, null, 2)}</pre>
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
    <div className="rounded-xl border border-neutralGray/20 bg-panelBg/50 p-4 shadow-elevation-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-textMain">Explainability & Decision Record</h3>
          <p className="text-xs text-textSub">의사결정 기록 / 가정 검증 / 참고자료</p>
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

