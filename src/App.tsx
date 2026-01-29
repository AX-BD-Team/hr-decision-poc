import { useEffect, useRef, lazy, Suspense } from 'react';
import { Header } from './components/layout/Header';
import { ZoneDataIngestion } from './components/zones/ZoneDataIngestion';
import { ZoneStructuring } from './components/zones/ZoneStructuring';
import { ZoneDecisionPaths } from './components/zones/ZoneDecisionPaths';
import { DecisionRecordSection } from './components/record/DecisionRecordSection';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingZone3Graph } from './components/loading/LoadingZone3Graph';
import { useStore } from './store/useStore';
import { clsx } from 'clsx';
import { scenarioDataById } from './data/scenarios';
import { useT } from './i18n';

const ZoneGraph = lazy(() =>
  import('./components/zones/ZoneGraph').then(m => ({ default: m.ZoneGraph }))
);
const TourOverlay = lazy(() =>
  import('./components/tour/TourOverlay').then(m => ({ default: m.TourOverlay }))
);
const HRContextView = lazy(() =>
  import('./components/context/HRContextView').then(m => ({ default: m.HRContextView }))
);
const DashboardPage = lazy(() =>
  import('./components/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage }))
);
const DocsPage = lazy(() =>
  import('./components/docs/DocsPage').then(m => ({ default: m.DocsPage }))
);

function App() {
  const t = useT();
  const activePage = useStore((s) => s.activePage);
  const isContextSidebarOpen = useStore((s) => s.isContextSidebarOpen);
  const scenarioId = useStore((s) => s.scenarioId);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Announce scenario changes for screen readers
  useEffect(() => {
    const name = scenarioDataById[scenarioId]?.meta.name;
    if (name && announcementRef.current) {
      announcementRef.current.textContent = `${t('common.scenario')} ${scenarioId.toUpperCase()}(${name})`;
    }
  }, [scenarioId]);

  return (
    <div className="min-h-screen bg-appBg cmd-grid-bg text-textMain">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-decisionBlue focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        {t('a11y.skipToContent')}
      </a>
      <div ref={announcementRef} aria-live="polite" className="sr-only" />
      <Header />

      {activePage === 'workflow' && (
        <Suspense fallback={null}>
          <TourOverlay />
        </Suspense>
      )}

      {activePage === 'workflow' && (
        <div className="flex">
          <main
            id="main-content"
            className={clsx(
              'mx-auto w-full px-2 sm:px-4 pb-10 sm:pb-10 transition-all safe-area-bottom',
              isContextSidebarOpen ? 'max-w-[1440px]' : 'max-w-[1440px]'
            )}
            style={{ flex: '1 1 0%', minWidth: 0 }}
          >
            <div className="grid grid-cols-1 gap-2 sm:gap-4 pt-4 lg:grid-cols-[360px_1fr]">
              {/* Row 1 */}
              <section id="section-ingestion" className="min-h-0 overflow-hidden animate-stagger-1 scroll-mt-32">
                <ErrorBoundary fallbackTitleKey="errorBoundary.dataIngestion">
                  <ZoneDataIngestion />
                </ErrorBoundary>
              </section>

              <section id="section-graph" className="min-h-[280px] lg:min-h-0 overflow-hidden animate-stagger-2 scroll-mt-32">
                <ErrorBoundary fallbackTitleKey="errorBoundary.ontologyGraph">
                  <Suspense fallback={<LoadingZone3Graph />}>
                    <ZoneGraph />
                  </Suspense>
                </ErrorBoundary>
              </section>

              {/* Row 2 */}
              <section id="section-structuring" className="min-h-0 overflow-hidden scroll-mt-32 h-full animate-stagger-3">
                <ErrorBoundary fallbackTitleKey="errorBoundary.analysisPattern">
                  <ZoneStructuring />
                </ErrorBoundary>
              </section>
              <section id="section-paths" className="min-h-0 overflow-hidden scroll-mt-32 animate-stagger-4">
                <ErrorBoundary fallbackTitleKey="errorBoundary.decisionPaths">
                  <ZoneDecisionPaths />
                </ErrorBoundary>
              </section>
            </div>

            <section id="section-record" data-tour="decision-record" className="mt-2 sm:mt-4 scroll-mt-32">
              <ErrorBoundary fallbackTitleKey="errorBoundary.decisionRecord">
                <DecisionRecordSection />
              </ErrorBoundary>
            </section>
          </main>

          {/* HR Context Sidebar */}
          <aside
            className={clsx(
              'hidden lg:block sticky top-[72px] h-[calc(100vh-72px)] border-l border-neutralGray/20 bg-panelBg/50 transition-all overflow-y-auto',
              isContextSidebarOpen ? 'w-[340px] min-w-[340px]' : 'w-0 min-w-0 border-l-0 overflow-hidden'
            )}
          >
            {isContextSidebarOpen && (
              <ErrorBoundary fallbackTitleKey="errorBoundary.hrContext">
                <Suspense fallback={<div className="p-4 text-textSub text-sm">Loading...</div>}>
                  <HRContextView variant="panel" />
                </Suspense>
              </ErrorBoundary>
            )}
          </aside>
        </div>
      )}

      {activePage === 'dashboard' && (
        <main id="main-content" className="mx-auto w-full max-w-[1440px] px-2 sm:px-4 pb-10 pt-4 safe-area-bottom">
          <Suspense fallback={<div className="p-8 text-textSub text-sm">Loading...</div>}>
            <DashboardPage />
          </Suspense>
        </main>
      )}

      {activePage === 'docs' && (
        <main id="main-content" className="mx-auto w-full max-w-[1440px] px-2 sm:px-4 pb-10 pt-4 safe-area-bottom">
          <Suspense fallback={<div className="p-8 text-textSub text-sm">Loading...</div>}>
            <DocsPage />
          </Suspense>
        </main>
      )}
    </div>
  );
}

export default App;
