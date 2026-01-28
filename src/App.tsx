import { Header } from './components/layout/Header';
import { ZoneDataIngestion } from './components/zones/ZoneDataIngestion';
import { ZoneStructuring } from './components/zones/ZoneStructuring';
import { ZoneGraph } from './components/zones/ZoneGraph';
import { ZoneDecisionPaths } from './components/zones/ZoneDecisionPaths';
import { HRContextView } from './components/context/HRContextView';
import { Dock } from './components/dock/Dock';

function App() {
  return (
    <div className="flex h-screen flex-col bg-appBg text-textMain">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-1 gap-4 overflow-hidden p-4">
        {/* Left: Workflow Zones */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <ZoneDataIngestion />
          <ZoneStructuring />
          <ZoneGraph />
          <ZoneDecisionPaths />
        </div>

        {/* Right: HR Context View */}
        <aside className="w-[320px] flex-shrink-0">
          <HRContextView />
        </aside>
      </main>

      {/* Bottom Dock */}
      <Dock />
    </div>
  );
}

export default App;
