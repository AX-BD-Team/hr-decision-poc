import { Play, RotateCcw, Download } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';

const steps = [
  { num: 1, label: 'Data Ingestion' },
  { num: 2, label: 'Structuring' },
  { num: 3, label: 'Ontology Graph' },
  { num: 4, label: 'Decision Paths' },
];

export function Header() {
  const { data, activeStep, setActiveStep, startTour, reset, isTourActive } = useStore();

  const handleExport = () => {
    const reportData = {
      scenario: data.meta,
      assumptions: data.assumptions,
      evidence: data.evidence,
      risks: data.riskSignals,
      paths: data.decisionPaths,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decision-record-${data.meta.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="border-b border-neutralGray/20 bg-panelBg px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 좌측: 타이틀 + 시나리오 */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold text-textMain">HR 의사결정 지원</h1>
            <p className="text-xs text-textSub">Decision Workflow Canvas</p>
          </div>
          <div className="rounded bg-appBg px-3 py-1.5">
            <span className="text-xs text-textSub">시나리오: </span>
            <span className="text-sm font-medium text-decisionBlue">{data.meta.name}</span>
          </div>
        </div>

        {/* 중앙: Step Navigator */}
        <nav className="flex items-center gap-1" data-tour="step-navigator">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <button
                onClick={() => setActiveStep(step.num)}
                className={clsx(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                  activeStep === step.num
                    ? 'bg-decisionBlue/20 text-decisionBlue'
                    : 'text-textSub hover:bg-appBg hover:text-textMain'
                )}
              >
                <span
                  className={clsx(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                    activeStep === step.num ? 'bg-decisionBlue text-white' : 'bg-neutralGray/30'
                  )}
                >
                  {step.num}
                </span>
                <span className="hidden lg:inline">{step.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className="mx-1 h-px w-4 bg-neutralGray/30" />
              )}
            </div>
          ))}
        </nav>

        {/* 우측: 액션 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={startTour}
            disabled={isTourActive}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              isTourActive
                ? 'cursor-not-allowed bg-neutralGray/20 text-neutralGray'
                : 'bg-decisionBlue text-white hover:bg-decisionBlue/80'
            )}
            data-tour="start-demo"
          >
            <Play className="h-4 w-4" />
            Start Demo
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg border border-neutralGray/30 px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg hover:text-textMain"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-neutralGray/30 px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg hover:text-textMain"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* 데이터 라벨 범례 */}
      <div className="mt-3 flex items-center gap-4 text-xs" data-tour="data-labels">
        <span className="text-textSub">데이터 라벨:</span>
        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400">REAL</span>
        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-400">ESTIMATE</span>
        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-purple-400">MOCK</span>
        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-cyan-400">SYNTH</span>
        <span className="ml-2 text-textSub">| 이 화면은 평가/인사관리 목적이 아닙니다</span>
      </div>
    </header>
  );
}
