import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, RotateCcw, Download, HelpCircle, BookOpen, PanelRightOpen, PanelRightClose, MoreVertical } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n';
import { clsx } from 'clsx';
import { scenarioMetas } from '../../data/scenarios';
import { tourSteps } from '../../data/tourSteps';
import { PageNav } from './PageNav';

/** demoProgress (1–4) → tourSteps index (id 4–7, array index 3–6) */
const demoTourStepIndex: Record<number, number> = { 1: 3, 2: 4, 3: 5, 4: 6 };

const zoneBorderColors: Record<number, string> = {
  1: 'border-zoneIngest',
  2: 'border-zoneStruct',
  3: 'border-zoneGraph',
  4: 'border-zonePath',
};
const zoneBgColors: Record<number, string> = {
  1: 'bg-zoneIngest/10',
  2: 'bg-zoneStruct/10',
  3: 'bg-zoneGraph/10',
  4: 'bg-zonePath/10',
};
const zoneTextColors: Record<number, string> = {
  1: 'text-zoneIngest',
  2: 'text-zoneStruct',
  3: 'text-zoneGraph',
  4: 'text-zonePath',
};

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
    isDemoRunning,
    startDemo,
    stopDemo,
    selectPath,
    setRecordTab,
    isContextSidebarOpen,
    toggleContextSidebar,
    locale,
  } = useStore();
  const t = useT();
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
    stopDemo();
    if (isTourActive) endTour();
  }, [clearDemoTimers, stopDemo, isTourActive, endTour]);

  const handleStartDemo = () => {
    if (isDemoRunning) {
      handleStopDemo();
      return;
    }

    // Trigger skeleton → reveal animation sequence
    setScenario(scenarioId);

    startDemo();              // isDemoRunning=true (no TourOverlay)
    setDemoProgress(1);
    setRecordTab('evidence');
    scrollToId('section-ingestion');

    // Step 2: skeleton 완료(3s) + 여유(2s) = 5s
    const t1 = setTimeout(() => {
      setActiveStep(2);
      setDemoProgress(2);
      scrollToId('section-structuring');
    }, 5000);

    // Step 3: +5s = 10s
    const t2 = setTimeout(() => {
      setActiveStep(3);
      setDemoProgress(3);
      scrollToId('section-graph');
    }, 10000);

    // Step 4: +5s = 15s
    const t3 = setTimeout(() => {
      setActiveStep(4);
      setDemoProgress(4);
      selectPath('path-a');
      scrollToId('section-paths');
    }, 15000);

    // End demo: +6s = 21s
    const t4 = setTimeout(() => {
      setDemoProgress(0);
      stopDemo();
    }, 21000);

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
    <nav className="flex items-center gap-1" data-tour="step-navigator" role="navigation" aria-label={t('a11y.stepNav')}>
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
                'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-all',
                isStepActive
                  ? `${classes.bg} ${classes.text}`
                  : 'text-textSub hover:bg-appBg hover:text-textMain'
              )}
            >
              <span
                className={clsx(
                  'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition-all',
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
    <header className="sticky top-0 z-50 glass-header border-b border-neutralGray/20 px-3 sm:px-6 py-2 sm:py-3">
      {/* 페이지 네비게이션 */}
      <PageNav />

      {/* ===== Desktop layout (sm+): original 3-column row ===== */}
      {isWorkflow && (
      <div className="hidden sm:flex items-center justify-between">
        {/* 좌측: 타이틀 + 시나리오 */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-semibold text-textMain">{t('common.appTitle')}</h1>
            <p className="text-xs text-textSub font-mono uppercase tracking-wider">Decision Workflow Canvas</p>
          </div>
          <div className="rounded-lg glass-panel px-3 py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-textSub">{t('common.scenario')}</span>
              <select
                value={scenarioId}
                onChange={(e) => setScenario(e.target.value)}
                className="rounded bg-appBg/40 px-2 py-1 text-sm font-medium text-decisionBlue outline-none ring-0 focus-ring"
              >
                {scenarioMetas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.badge ? ` [${m.badge}]` : ''}
                  </option>
                ))}
              </select>
              {data.meta.badge && (
                <span className={clsx(
                  'rounded-full px-2 py-0.5 text-micro font-mono font-bold uppercase tracking-wider',
                  data.meta.badge === 'Phase-2' ? 'bg-zoneStruct/20 text-zoneStruct'
                    : data.meta.badge === 'TO' ? 'bg-zoneIngest/20 text-zoneIngest'
                    : data.meta.badge === 'R&R' ? 'bg-zonePath/20 text-zonePath'
                    : 'bg-contextGreen/20 text-contextGreen'
                )}>
                  {data.meta.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 중앙: Step Navigator */}
        {stepNavigator}

        {/* 우측: 액션 버튼 */}
        <div className="flex items-center gap-2">
          {isDemoRunning && (
            <span className="flex items-center gap-1.5 rounded-lg bg-decisionBlue/10 border border-decisionBlue/30 px-3 py-1.5 text-xs font-mono text-decisionBlue animate-glow-pulse">
              {t('common.demoProgress')} Step {demoProgress}/4
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
            disabled={isDemoRunning}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              isDemoRunning
                ? 'opacity-40 cursor-not-allowed glass-panel text-textSub'
                : isTourActive
                  ? 'bg-alertRed text-white hover:bg-alertRed/80'
                  : 'glass-panel text-textSub hover:bg-appBg/50 hover:text-textMain'
            )}
          >
            {isTourActive ? (
              <>
                <Square className="h-4 w-4" aria-hidden="true" />
                {t('common.tourEnd')}
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
              'flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-all',
              isDemoRunning
                ? 'bg-alertRed hover:bg-alertRed/80'
                : 'bg-decisionBlue hover:bg-decisionBlue/80 hover:shadow-glow-blue'
            )}
            data-tour="start-demo"
          >
            {isDemoRunning ? (
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

          {/* Separator */}
          <div className="h-6 w-px bg-neutralGray/20" />

          <button
            onClick={toggleContextSidebar}
            aria-label={t('a11y.hrContextToggle')}
            aria-expanded={isContextSidebarOpen}
            className={clsx(
              'flex items-center gap-2 rounded-lg glass-panel px-2.5 py-1.5 text-sm transition-all',
              isContextSidebarOpen
                ? 'text-contextGreen border border-contextGreen/30 bg-contextGreen/10'
                : 'text-textSub hover:bg-appBg/50 hover:text-textMain'
            )}
          >
            {isContextSidebarOpen ? <PanelRightClose className="h-4 w-4" aria-hidden="true" /> : <PanelRightOpen className="h-4 w-4" aria-hidden="true" />}
            <span className="hidden md:inline">HR Context</span>
          </button>
          <button
            onClick={reset}
            aria-label={t('a11y.resetLabel')}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">Reset</span>
          </button>
          <button
            onClick={handleExport}
            aria-label={t('a11y.exportLabel')}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-textSub transition-all hover:bg-appBg/50 hover:text-textMain"
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
            <h1 className="text-base font-semibold text-textMain truncate">{t('common.appTitle')}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={scenarioId}
              onChange={(e) => setScenario(e.target.value)}
              className="rounded bg-appBg/40 px-2 py-1 text-sm font-medium text-decisionBlue outline-none ring-0 focus-ring max-w-[140px]"
            >
              {scenarioMetas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}{m.badge ? ` [${m.badge}]` : ''}
                </option>
              ))}
            </select>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={t('a11y.moreMenu')}
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
          {isDemoRunning && (
            <span className="flex items-center gap-1.5 rounded-lg bg-decisionBlue/10 border border-decisionBlue/30 px-2 py-1 text-xs font-mono text-decisionBlue animate-glow-pulse">
              Step {demoProgress}/4
            </span>
          )}
          <button
            onClick={handleStartDemo}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-all min-h-[44px]',
              isDemoRunning
                ? 'bg-alertRed hover:bg-alertRed/80'
                : 'bg-decisionBlue hover:bg-decisionBlue/80 hover:shadow-glow-blue'
            )}
            data-tour="start-demo"
          >
            {isDemoRunning ? (
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
            disabled={isDemoRunning}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all min-h-[44px]',
              isDemoRunning
                ? 'opacity-40 cursor-not-allowed glass-panel text-textSub'
                : isTourActive
                  ? 'bg-alertRed text-white hover:bg-alertRed/80'
                  : 'glass-panel text-textSub hover:bg-appBg/50 hover:text-textMain'
            )}
          >
            {isTourActive ? (
              <>
                <Square className="h-4 w-4" aria-hidden="true" />
                {t('common.end')}
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

      {/* Demo 가이드 배너 */}
      {isWorkflow && isDemoRunning && demoProgress >= 1 && (() => {
        const step = tourSteps[demoTourStepIndex[demoProgress]];
        if (!step) return null;
        const title = locale === 'ko' ? step.titleKo : step.titleEn;
        const content = locale === 'ko' ? step.contentKo : step.contentEn;
        return (
          <div
            key={demoProgress}
            className={clsx(
              'mt-1.5 sm:mt-2 rounded-lg border-l-4 px-4 py-2.5 animate-[fadeIn_0.4s_ease-out]',
              zoneBorderColors[demoProgress],
              zoneBgColors[demoProgress],
            )}
          >
            <div className="flex items-center justify-between">
              <span className={clsx('text-sm font-semibold', zoneTextColors[demoProgress])}>
                {title}
              </span>
              <span className="text-xs font-mono text-textSub">
                Step {demoProgress}/4
              </span>
            </div>
            <p className="mt-1 text-xs text-textSub leading-relaxed">{content}</p>
          </div>
        );
      })()}

      {/* 핵심 질문 */}
      {isWorkflow && data.meta.keyQuestion && (
        <div className="mt-1.5 sm:mt-2 flex items-center gap-2 rounded-lg bg-decisionBlue/10 border border-decisionBlue/20 px-3 py-2">
          <HelpCircle className="h-4 w-4 flex-shrink-0 text-decisionBlue" aria-hidden="true" />
          <span className="text-sm text-textMain">{data.meta.keyQuestion}</span>
        </div>
      )}

      {/* 데이터 라벨 범례 */}
      {isWorkflow && (
      <div className={clsx("mt-1.5 items-center gap-4 text-xs opacity-60 hover:opacity-100 transition-opacity", isTourActive ? 'flex' : 'hidden md:flex')} data-tour="data-labels">
        <span className="text-textSub font-mono uppercase tracking-wider text-micro">{t('header.dataLabels')}</span>
        <span className="rounded bg-label-real/20 px-2 py-0.5 text-label-real font-mono">REAL</span>
        <span className="rounded bg-label-estimate/20 px-2 py-0.5 text-label-estimate font-mono">ESTIMATE</span>
        <span className="rounded bg-label-mock/20 px-2 py-0.5 text-label-mock font-mono">MOCK</span>
        <span className="rounded bg-label-synth/20 px-2 py-0.5 text-label-synth font-mono">SYNTH</span>
        <span className="ml-2 text-textSub">{t('header.dataLabelDisclaimer')}</span>
      </div>
      )}
    </header>
  );
}
