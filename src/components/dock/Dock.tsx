import { ChevronUp, ChevronDown, FileText, Shield, AlertTriangle, GitBranch, ClipboardList } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { DockTab } from '../../types';
import { DockContent } from './DockContent';

const tabs: { id: DockTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'assumptions', label: '가정', icon: FileText },
  { id: 'evidence', label: '근거', icon: Shield },
  { id: 'risks', label: '리스크', icon: AlertTriangle },
  { id: 'alternatives', label: '대안비교', icon: GitBranch },
  { id: 'report', label: 'Report Preview', icon: ClipboardList },
];

export function Dock() {
  const { dockTab, setDockTab, isDockExpanded, toggleDock } = useStore();

  return (
    <div
      className={clsx(
        'border-t border-neutralGray/20 bg-panelBg/80 backdrop-blur-md transition-all',
        isDockExpanded ? 'h-[280px]' : 'h-[48px]'
      )}
      data-tour="dock"
    >
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-neutralGray/20 px-4">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setDockTab(tab.id)}
                className={clsx(
                  'flex items-center gap-1.5 rounded-t-lg px-3 py-3 text-sm transition-all',
                  dockTab === tab.id
                    ? 'border-b-2 border-decisionBlue bg-decisionBlue/10 text-decisionBlue'
                    : 'text-textSub hover:bg-appBg/50 hover:text-textMain'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={toggleDock}
          className="rounded p-1.5 text-textSub transition-all hover:bg-appBg hover:text-textMain"
        >
          {isDockExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Content */}
      {isDockExpanded && (
        <div className="h-[calc(100%-48px)] overflow-y-auto p-4 animate-fade-in">
          <DockContent />
        </div>
      )}
    </div>
  );
}
