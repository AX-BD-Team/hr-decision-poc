import { Header } from './components/layout/Header';
import { ZoneDataIngestion } from './components/zones/ZoneDataIngestion';
import { ZoneStructuring } from './components/zones/ZoneStructuring';
import { ZoneGraph } from './components/zones/ZoneGraph';
import { ZoneDecisionPaths } from './components/zones/ZoneDecisionPaths';
import { HRContextView } from './components/context/HRContextView';
import { Dock } from './components/dock/Dock';

function App() {
  return (
    <div className="flex h-screen flex-col bg-appBg cmd-grid-bg text-textMain">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Left: Workflow Zones */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden">
          <div className="flex-[0.8] min-h-0 animate-stagger-1">
            <ZoneDataIngestion />
          </div>
          <div className="h-[120px] shrink-0 min-h-0 animate-stagger-2">
            <ZoneStructuring />
          </div>
          <div className="flex-[3.5] min-h-0 animate-stagger-3">
            <ZoneGraph />
          </div>
          <div className="flex-[1.2] min-h-0 animate-stagger-4">
            <ZoneDecisionPaths />
          </div>
        </div>

        {/* Right: HR Context View */}
        <aside className="w-[280px] lg:w-[320px] xl:w-[360px] flex-shrink-0 animate-slide-in-right">
          <HRContextView />
        </aside>
      </main>

      {/* Bottom Dock */}
      <Dock />
    </div>
  );
}

export default App;
