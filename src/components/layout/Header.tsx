import { useState, useEffect } from 'react';
import { Play, RotateCcw, Download, HelpCircle, Info } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';

const steps = [
  { num: 1, label: 'Data Ingestion' },
  { num: 2, label: 'Structuring' },
  { num: 3, label: 'Ontology Graph' },
  { num: 4, label: 'Decision Paths' },
];

export function Header() {
  const { data, activeStep, setActiveStep, reset } = useStore();
  const [showTourNotice, setShowTourNotice] = useState(false);

  useEffect(() => {
    if (showTourNotice) {
      const timer = setTimeout(() => setShowTourNotice(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTourNotice]);

  const handleStartDemo = () => {
    setShowTourNotice(true);
  };

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
          <div className="relative">
            <button
              onClick={handleStartDemo}
              className="flex items-center gap-2 rounded-lg bg-decisionBlue px-4 py-2 text-sm font-medium text-white transition-all hover:bg-decisionBlue/80"
              data-tour="start-demo"
            >
              <Play className="h-4 w-4" />
              Start Demo
            </button>
            {showTourNotice && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-neutralGray/30 bg-panelBg p-3 shadow-lg">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-decisionBlue" />
                  <p className="text-xs text-textSub">
                    Guided Tour는 준비 중입니다. Step Navigator를 사용하여 각 단계를 탐색해 주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
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

      {/* 핵심 질문 */}
      {data.meta.keyQuestion && (
        <div className="mt-3 flex items-center gap-2 rounded bg-decisionBlue/10 px-3 py-2">
          <HelpCircle className="h-4 w-4 flex-shrink-0 text-decisionBlue" />
          <span className="text-sm text-textMain">{data.meta.keyQuestion}</span>
        </div>
      )}

      {/* 데이터 라벨 범례 */}
      <div className="mt-2 flex items-center gap-4 text-xs" data-tour="data-labels">
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
