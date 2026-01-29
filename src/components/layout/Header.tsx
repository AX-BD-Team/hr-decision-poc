import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, RotateCcw, Download, HelpCircle, BookOpen, PanelRightOpen, PanelRightClose, MoreVertical, Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import { scenarioMetas } from '../../data/scenarios';
import { PageNav } from './PageNav';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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
  const {
    activePage,
    data,
    scenarioId,
    setScenario,
    activeStep,
    setActiveStep,
    reset,
    isTourActive,
    startTour,
    endTour,
    selectPath,
    setRecordTab,
    isContextSidebarOpen,
    toggleContextSidebar,
    theme,
    toggleTheme,
  } = useStore();
  const isWorkflow = activePage === 'workflow';
  const [demoProgress, setDemoProgress] = useState(0); // 0 = not running, 1-4 = current demo step
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const clearDemoTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Clean up timers on unmount
  useEffect(() => clearDemoTimers, [clearDemoTimers]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMobileMenuOpen]);

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
    setRecordTab('evidence');
    scrollToId('section-ingestion');

    // Step 2 at 2s
    const t1 = setTimeout(() => {
      setActiveStep(2);
      setDemoProgress(2);
      scrollToId('section-structuring');
    }, 2000);

    // Step 3 at 4s
    const t2 = setTimeout(() => {
      setActiveStep(3);
      setDemoProgress(3);
      scrollToId('section-graph');
    }, 4000);

    // Step 4 at 6s — also expand dock & select first path
    const t3 = setTimeout(() => {
      setActiveStep(4);
      setDemoProgress(4);
      selectPath('path-a');
      scrollToId('section-paths');
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

  const stepNavigator = (
    <nav className="flex items-center gap-1" data-tour="step-navigator" role="navigation" aria-label="워크플로우 단계 네비게이터">
      {steps.map((step, idx) => {
        const isStepActive = activeStep === step.num;
        const classes = stepActiveClasses[step.color];
        const isCompleted = step.num < activeStep;
        return (
          <div key={step.num} className="flex items-center">
            <button
              aria-label={`Step ${step.num}: ${step.label}`}
              aria-current={isStepActive ? 'step' : undefined}
              onClick={() => {
                setActiveStep(step.num);
                if (step.num === 2) scrollToId('section-structuring');
                if (step.num === 4) scrollToId('section-paths');
                if (step.num === 1) {
                  setRecordTab('evidence');
                  scrollToId('section-ingestion');
                }
                if (step.num === 3) scrollToId('section-graph');
              }}
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
  );

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-neutralGray/20 px-3 sm:px-6 py-3 sm:py-4">
      {/* 페이지 네비게이션 */}
      <PageNav />

      {/* ===== Desktop layout (sm+): original 3-column row ===== */}
      {isWorkflow && (
      <div className="hidden sm:flex items-center justify-between">
        {/* 좌측: 타이틀 + 시나리오 */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold text-textMain">HR 의사결정 지원</h1>
            <p className="text-xs text-textSub font-mono uppercase tracking-wider">Decision Workflow Canvas</p>
          </div>
          <div className="rounded-lg glass-panel px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-textSub">시나리오</span>
              <select
                value={scenarioId}
                onChange={(e) => setScenario(e.target.value)}
                className="rounded bg-appBg/40 px-2 py-1 text-sm font-medium text-decisionBlue outline-none ring-0 focus-ring"
              >
                {scenarioMetas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 중앙: Step Navigator */}
        {stepNavigator}

        {/* 우측: 액션 버튼 */}
        <div className="flex items-center gap-2">
          {isTourActive && (
            <span className="flex items-center gap-1.5 rounded-lg bg-decisionBlue/10 border border-decisionBlue/30 px-3 py-1.5 text-xs font-mono text-decisionBlue animate-glow-pulse">
              데모 진행 중… Step {demoProgress}/4
            </span>
          )}
          <button
            onClick={() => {
              if (isTourActive) {
                handleStopDemo();
              } else {
                startTour();
              }
            }}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              isTourActive
                ? 'bg-alertRed text-white hover:bg-alertRed/80'
                : 'glass-panel text-textSub hover:bg-appBg/50 hover:text-textMain'
            )}
          >
            {isTourActive ? (
              <>
                <Square className="h-4 w-4" aria-hidden="true" />
                투어 종료
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Guide
              </>
            )}
          </button>
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
                <Square className="h-4 w-4" aria-hidden="true" />
                Stop Demo
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                Start Demo
              </>
            )}
          </button>
          <button
            onClick={toggleContextSidebar}
            aria-label="HR Context 패널 토글"
            aria-expanded={isContextSidebarOpen}
            className={clsx(
              'flex items-center gap-2 rounded-lg glass-panel px-3 py-2 text-sm transition-all',
              isContextSidebarOpen
                ? 'text-contextGreen border border-contextGreen/30 bg-contextGreen/10'
                : 'text-textSub hover:bg-appBg/50 hover:text-textMain'
            )}
          >
            {isContextSidebarOpen ? <PanelRightClose className="h-4 w-4" aria-hidden="true" /> : <PanelRightOpen className="h-4 w-4" aria-hidden="true" />}
            <span className="hidden md:inline">HR Context</span>
          </button>
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="flex items-center gap-2 rounded-lg glass-panel px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button
            onClick={reset}
            aria-label="초기화"
            className="flex items-center gap-2 rounded-lg glass-panel px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Reset</span>
          </button>
          <button
            onClick={handleExport}
            aria-label="보고서 내보내기"
            className="flex items-center gap-2 rounded-lg glass-panel px-3 py-2 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>
      )}

      {/* ===== Mobile layout (< sm): multi-row ===== */}
      {isWorkflow && (
      <div className="sm:hidden space-y-2">
        {/* Row 1: 타이틀 + 시나리오 셀렉터 + 오버플로 메뉴(⋮) */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-textMain truncate">HR 의사결정 지원</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={scenarioId}
              onChange={(e) => setScenario(e.target.value)}
              className="rounded bg-appBg/40 px-2 py-1 text-sm font-medium text-decisionBlue outline-none ring-0 focus-ring max-w-[140px]"
            >
              {scenarioMetas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="더보기 메뉴"
                aria-expanded={isMobileMenuOpen}
                className="rounded-lg glass-panel p-2 text-textSub hover:bg-appBg/50 hover:text-textMain min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </button>
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg glass-panel border border-neutralGray/20 py-1 shadow-lg">
                  <button
                    onClick={() => { handleExport(); setIsMobileMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-textSub hover:bg-appBg/50 hover:text-textMain min-h-[44px]"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Export
                  </button>
                  <button
                    onClick={() => { reset(); setIsMobileMenuOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-textSub hover:bg-appBg/50 hover:text-textMain min-h-[44px]"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Reset
                  </button>
                  <button
                    onClick={() => { toggleContextSidebar(); setIsMobileMenuOpen(false); }}
                    className={clsx(
                      'flex w-full items-center gap-2 px-3 py-2.5 text-sm min-h-[44px]',
                      isContextSidebarOpen
                        ? 'text-contextGreen'
                        : 'text-textSub hover:bg-appBg/50 hover:text-textMain'
                    )}
                  >
                    {isContextSidebarOpen ? <PanelRightClose className="h-4 w-4" aria-hidden="true" /> : <PanelRightOpen className="h-4 w-4" aria-hidden="true" />}
                    HR Context
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Step Navigator (horizontal scroll) */}
        <div className="overflow-x-auto -mx-3 px-3">
          {stepNavigator}
        </div>

        {/* Row 3: Start Demo + Guide */}
        <div className="flex items-center gap-2">
          {isTourActive && (
            <span className="flex items-center gap-1.5 rounded-lg bg-decisionBlue/10 border border-decisionBlue/30 px-2 py-1 text-xs font-mono text-decisionBlue animate-glow-pulse">
              Step {demoProgress}/4
            </span>
          )}
          <button
            onClick={handleStartDemo}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all min-h-[44px]',
              isTourActive
                ? 'bg-alertRed hover:bg-alertRed/80'
                : 'bg-decisionBlue hover:bg-decisionBlue/80 hover:shadow-glow-blue'
            )}
            data-tour="start-demo"
          >
            {isTourActive ? (
              <>
                <Square className="h-4 w-4" aria-hidden="true" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                Demo
              </>
            )}
          </button>
          <button
            onClick={() => {
              if (isTourActive) handleStopDemo();
              else startTour();
            }}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all min-h-[44px]',
              isTourActive
                ? 'bg-alertRed text-white hover:bg-alertRed/80'
                : 'glass-panel text-textSub hover:bg-appBg/50 hover:text-textMain'
            )}
          >
            {isTourActive ? (
              <>
                <Square className="h-4 w-4" aria-hidden="true" />
                종료
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Guide
              </>
            )}
          </button>
        </div>
      </div>
      )}

      {/* 핵심 질문 */}
      {isWorkflow && data.meta.keyQuestion && (
        <div className="mt-2 sm:mt-3 flex items-center gap-2 rounded-lg bg-decisionBlue/10 border border-decisionBlue/20 px-3 py-2">
          <HelpCircle className="h-4 w-4 flex-shrink-0 text-decisionBlue" aria-hidden="true" />
          <span className="text-sm text-textMain">{data.meta.keyQuestion}</span>
        </div>
      )}

      {/* 데이터 라벨 범례 */}
      {isWorkflow && (
      <div className="mt-2 hidden md:flex items-center gap-4 text-xs opacity-60 hover:opacity-100 transition-opacity" data-tour="data-labels">
        <span className="text-textSub font-mono uppercase tracking-wider text-micro">Data Labels:</span>
        <span className="rounded bg-label-real/20 px-2 py-0.5 text-label-real font-mono">REAL</span>
        <span className="rounded bg-label-estimate/20 px-2 py-0.5 text-label-estimate font-mono">ESTIMATE</span>
        <span className="rounded bg-label-mock/20 px-2 py-0.5 text-label-mock font-mono">MOCK</span>
        <span className="rounded bg-label-synth/20 px-2 py-0.5 text-label-synth font-mono">SYNTH</span>
        <span className="ml-2 text-textSub">| 이 화면은 평가/인사관리 목적이 아닙니다</span>
      </div>
      )}
    </header>
  );
}
