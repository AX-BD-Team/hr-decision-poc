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
          <div className="flex-1 min-h-0 animate-stagger-1">
            <ZoneDataIngestion />
          </div>
          <div className="min-h-0 animate-stagger-2">
            <ZoneStructuring />
          </div>
          <div className="flex-[3] min-h-0 animate-stagger-3">
            <ZoneGraph />
          </div>
          <div className="flex-1 min-h-0 animate-stagger-4">
            <ZoneDecisionPaths />
          </div>
        </div>

        {/* Right: HR Context View */}
        <aside className="w-[320px] flex-shrink-0 animate-slide-in-right">
          <HRContextView />
        </aside>
      </main>

      {/* Bottom Dock */}
      <Dock />
    </div>
  );
}

export default App;
