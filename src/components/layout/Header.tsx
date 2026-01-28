import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, RotateCcw, Download, HelpCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';

const steps = [
  { num: 1, label: 'Data Ingestion', color: 'zoneIngest' },
  { num: 2, label: 'Structuring', color: 'zoneStruct' },
  { num: 3, label: 'Ontology Graph', color: 'zoneGraph' },
  { num: 4, label: 'Decision Paths', color: 'zonePath' },
];

const stepActiveClasses: Record<string, { bg: string; text: string; badge: string; connector: string }> = {
  zoneIngest: {
    bg: 'bg-zoneIngest/20',
    text: 'text-zoneIngest',
    badge: 'bg-zoneIngest',
    connector: 'bg-zoneIngest/50',
  },
  zoneStruct: {
    bg: 'bg-zoneStruct/20',
    text: 'text-zoneStruct',
    badge: 'bg-zoneStruct',
    connector: 'bg-zoneStruct/50',
  },
  zoneGraph: {
    bg: 'bg-zoneGraph/20',
    text: 'text-zoneGraph',
    badge: 'bg-zoneGraph',
    connector: 'bg-zoneGraph/50',
  },
  zonePath: {
    bg: 'bg-zonePath/20',
    text: 'text-zonePath',
    badge: 'bg-zonePath',
    connector: 'bg-zonePath/50',
  },
};

export function Header() {
  const { data, activeStep, setActiveStep, reset, isTourActive, startTour, endTour, selectPath } = useStore();
  const [demoProgress, setDemoProgress] = useState(0); // 0 = not running, 1-4 = current demo step
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearDemoTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Clean up timers on unmount
  useEffect(() => clearDemoTimers, [clearDemoTimers]);

  const handleStopDemo = useCallback(() => {
    clearDemoTimers();
    setDemoProgress(0);
    endTour();
  }, [clearDemoTimers, endTour]);

  const handleStartDemo = () => {
    if (isTourActive) {
      handleStopDemo();
      return;
    }

    startTour();
    setDemoProgress(1);

    // Step 2 at 2s
    const t1 = setTimeout(() => {
      setActiveStep(2);
      setDemoProgress(2);
    }, 2000);

    // Step 3 at 4s
    const t2 = setTimeout(() => {
      setActiveStep(3);
      setDemoProgress(3);
    }, 4000);

    // Step 4 at 6s — also expand dock & select first path
    const t3 = setTimeout(() => {
      setActiveStep(4);
      setDemoProgress(4);
      // Expand dock if collapsed
      const state = useStore.getState();
      if (!state.isDockExpanded) {
        state.toggleDock();
      }
      selectPath('path-a');
    }, 6000);

    // End demo at 9s
    const t4 = setTimeout(() => {
      setDemoProgress(0);
      endTour();
    }, 9000);

    timersRef.current = [t1, t2, t3, t4];
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
    <header className="glass-panel border-b border-neutralGray/20 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 좌측: 타이틀 + 시나리오 */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold text-textMain">HR 의사결정 지원</h1>
            <p className="text-xs text-textSub font-mono uppercase tracking-wider">Decision Workflow Canvas</p>
          </div>
          <div className="rounded-lg glass-panel px-3 py-1.5">
            <span className="text-xs text-textSub">시나리오: </span>
            <span className="text-sm font-medium text-decisionBlue">{data.meta.name}</span>
          </div>
        </div>

        {/* 중앙: Step Navigator */}
        <nav className="flex items-center gap-1" data-tour="step-navigator">
          {steps.map((step, idx) => {
            const isStepActive = activeStep === step.num;
            const classes = stepActiveClasses[step.color];
            // Steps before activeStep are "completed"
            const isCompleted = step.num < activeStep;
            return (
              <div key={step.num} className="flex items-center">
                <button
                  onClick={() => setActiveStep(step.num)}
                  className={clsx(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                    isStepActive
                      ? `${classes.bg} ${classes.text}`
                      : 'text-textSub hover:bg-appBg hover:text-textMain'
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all',
                      isStepActive
                        ? `${classes.badge} text-white`
                        : isCompleted
                        ? `${classes.badge}/40 text-white`
                        : 'bg-neutralGray/30'
                    )}
                  >
                    {step.num}
                  </span>
                  <span className="hidden lg:inline">{step.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={clsx(
                      'mx-1 h-px w-6 transition-all',
                      isCompleted ? classes.connector : 'bg-neutralGray/30'
                    )}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* 우측: 액션 버튼 */}
        <div className="flex items-center gap-2">
          {isTourActive && (
            <span className="flex items-center gap-1.5 rounded-lg bg-decisionBlue/10 border border-decisionBlue/30 px-3 py-1.5 text-xs font-mono text-decisionBlue animate-glow-pulse">
              데모 진행 중… Step {demoProgress}/4
            </span>
          )}
          <button
            onClick={handleStartDemo}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all',
              isTourActive
                ? 'bg-alertRed hover:bg-alertRed/80'
                : 'bg-decisionBlue hover:bg-decisionBlue/80 hover:shadow-glow-blue'
            )}
            data-tour="start-demo"
          >
            {isTourActive ? (
              <>
                <Square className="h-4 w-4" />
                Stop Demo
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Demo
              </>
            )}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg glass-panel px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg glass-panel px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* 핵심 질문 */}
      {data.meta.keyQuestion && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-decisionBlue/10 border border-decisionBlue/20 px-3 py-2">
          <HelpCircle className="h-4 w-4 flex-shrink-0 text-decisionBlue" />
          <span className="text-sm text-textMain">{data.meta.keyQuestion}</span>
        </div>
      )}

      {/* 데이터 라벨 범례 */}
      <div className="mt-2 flex items-center gap-4 text-xs opacity-60 hover:opacity-100 transition-opacity" data-tour="data-labels">
        <span className="text-textSub font-mono uppercase tracking-wider text-[10px]">Data Labels:</span>
        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-400 font-mono">REAL</span>
        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-400 font-mono">ESTIMATE</span>
        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-purple-400 font-mono">MOCK</span>
        <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-cyan-400 font-mono">SYNTH</span>
        <span className="ml-2 text-textSub">| 이 화면은 평가/인사관리 목적이 아닙니다</span>
      </div>
    </header>
  );
}
