import { Header } from './components/layout/Header';
import { ZoneDataIngestion } from './components/zones/ZoneDataIngestion';
import { ZoneGraph } from './components/zones/ZoneGraph';
import { ZoneStructuring } from './components/zones/ZoneStructuring';
import { ZoneDecisionPaths } from './components/zones/ZoneDecisionPaths';
import { DecisionRecordSection } from './components/record/DecisionRecordSection';

function App() {
  return (
    <div className="min-h-screen bg-appBg cmd-grid-bg text-textMain">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-10">
        <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-[360px_1fr]">
          <section id="section-ingestion" className="min-h-0 overflow-hidden animate-stagger-1 scroll-mt-32">
            <ZoneDataIngestion />
          </section>

          <section id="section-graph" className="min-h-0 overflow-hidden animate-stagger-2 scroll-mt-32">
            <ZoneGraph />
          </section>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <section id="section-structuring" className="min-h-0 overflow-hidden scroll-mt-32">
            <ZoneStructuring />
          </section>
          <section id="section-paths" className="min-h-0 overflow-hidden scroll-mt-32">
            <ZoneDecisionPaths />
          </section>
        </div>

        <section id="section-record" className="mt-4 scroll-mt-32">
          <DecisionRecordSection />
        </section>
      </main>
    </div>
  );
}

export default App;
