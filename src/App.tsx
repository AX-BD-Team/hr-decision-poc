import { Header } from './components/layout/Header';
import { ZoneDataIngestion } from './components/zones/ZoneDataIngestion';
import { ZoneGraph } from './components/zones/ZoneGraph';
import { ZoneStructuring } from './components/zones/ZoneStructuring';
import { ZoneDecisionPaths } from './components/zones/ZoneDecisionPaths';
import { DecisionRecordSection } from './components/record/DecisionRecordSection';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { TourOverlay } from './components/tour/TourOverlay';

function App() {
  return (
    <div className="min-h-screen bg-appBg cmd-grid-bg text-textMain">
      <Header />
      <TourOverlay />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-10">
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-[360px_1fr]">
          <section id="section-ingestion" className="min-h-0 overflow-hidden animate-stagger-1 scroll-mt-32">
            <ErrorBoundary fallbackTitle="데이터 수집 영역 오류">
              <ZoneDataIngestion />
            </ErrorBoundary>
          </section>

          <section id="section-graph" className="min-h-0 overflow-hidden animate-stagger-2 scroll-mt-32">
            <ErrorBoundary fallbackTitle="온톨로지 그래프 영역 오류">
              <ZoneGraph />
            </ErrorBoundary>
          </section>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <section id="section-structuring" className="min-h-0 overflow-hidden scroll-mt-32">
            <ErrorBoundary fallbackTitle="분석 패턴 영역 오류">
              <ZoneStructuring />
            </ErrorBoundary>
          </section>
          <section id="section-paths" className="min-h-0 overflow-hidden scroll-mt-32">
            <ErrorBoundary fallbackTitle="의사결정 경로 영역 오류">
              <ZoneDecisionPaths />
            </ErrorBoundary>
          </section>
        </div>

        <section id="section-record" className="mt-4 scroll-mt-32">
          <ErrorBoundary fallbackTitle="의사결정 기록 영역 오류">
            <DecisionRecordSection />
          </ErrorBoundary>
        </section>
      </main>
    </div>
  );
}

export default App;
