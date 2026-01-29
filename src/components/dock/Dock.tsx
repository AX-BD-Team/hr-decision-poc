import {
  ChevronUp,
  FileText,
  Shield,
  AlertTriangle,
  GitBranch,
  ClipboardList,
  Layers3,
  Users,
  GripHorizontal,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import { DOCK_COLLAPSED_HEIGHT, DOCK_MIN_HEIGHT, DOCK_MAX_HEIGHT } from '../../constants/layout';
import { DockContent } from './DockContent';
import { ZoneDecisionPaths } from '../zones/ZoneDecisionPaths';
import { ZoneStructuring } from '../zones/ZoneStructuring';
import { HRContextView } from '../context/HRContextView';

const sections = [
  { id: 'paths' as const, label: '대안 카드', icon: GitBranch },
  { id: 'record' as const, label: '결정 레코드', icon: FileText },
  { id: 'structuring' as const, label: '구조화', icon: Layers3 },
  { id: 'context' as const, label: 'HR 컨텍스트', icon: Users },
];

const recordTabs = [
  { id: 'evidence' as const, label: '근거', icon: Shield },
  { id: 'assumptions' as const, label: '가정', icon: FileText },
  { id: 'risks' as const, label: '리스크', icon: AlertTriangle },
  { id: 'alternatives' as const, label: '대안비교', icon: GitBranch },
  { id: 'report' as const, label: 'Record', icon: ClipboardList },
];

export function Dock() {
  const {
    dockSection,
    setDockSection,
    recordTab,
    setRecordTab,
    isDockExpanded,
    toggleDock,
    dockHeight,
    setDockHeight,
    setDockExpanded,
  } = useStore();

  const clampHeight = (h: number) => Math.max(DOCK_MIN_HEIGHT, Math.min(DOCK_MAX_HEIGHT, h));

  const onStartResize = (e: React.PointerEvent) => {
    if (!isDockExpanded) {
      setDockExpanded(true);
    }

    const startY = e.clientY;
    const startHeight = dockHeight;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      const delta = startY - ev.clientY;
      setDockHeight(clampHeight(startHeight + delta));
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      try {
        target.releasePointerCapture(ev.pointerId);
      } catch (err) {
        void err;
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      className={clsx('border-t border-neutralGray/20 bg-panelBg/80 backdrop-blur-md transition-[height] duration-200 ease-out')}
      style={{ height: isDockExpanded ? dockHeight : DOCK_COLLAPSED_HEIGHT }}
      data-tour="dock"
    >
      <div
        className="flex cursor-row-resize items-center justify-center border-b border-neutralGray/20 py-1 text-textSub/70 hover:text-textSub focus-ring"
        onPointerDown={onStartResize}
        tabIndex={0}
        role="separator"
        aria-orientation="horizontal"
        aria-valuenow={dockHeight}
        aria-valuemin={DOCK_MIN_HEIGHT}
        aria-valuemax={DOCK_MAX_HEIGHT}
        aria-label="독 높이 조절"
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isDockExpanded) setDockExpanded(true);
            setDockHeight(clampHeight(dockHeight + 20));
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setDockHeight(clampHeight(dockHeight - 20));
          }
        }}
      >
        <GripHorizontal className="h-4 w-4" aria-hidden="true" />
      </div>

      <div className="flex items-center justify-between border-b border-neutralGray/20 px-4">
        <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label="독 섹션">
          {sections.map((tab) => {
            const Icon = tab.icon;
            const active = dockSection === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setDockSection(tab.id);
                  if (!isDockExpanded) setDockExpanded(true);
                }}
                className={clsx(
                  'relative flex items-center gap-2 px-3 py-3 text-sm transition-all focus-ring rounded whitespace-nowrap min-h-[44px]',
                  active
                    ? 'text-decisionBlue'
                    : 'text-textSub hover:bg-appBg/30 hover:text-textMain'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium hidden sm:inline">{tab.label}</span>
                {active && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-decisionBlue" />}
              </button>
            );
          })}
        </div>
        <button
          onClick={toggleDock}
          className="rounded p-1.5 text-textSub transition-all hover:bg-appBg hover:text-textMain focus-ring"
          aria-label={isDockExpanded ? 'Collapse dock' : 'Expand dock'}
          aria-expanded={isDockExpanded}
        >
          <ChevronUp
            className={clsx('h-4 w-4 transition-transform duration-200 ease-out', isDockExpanded && 'rotate-180')}
          />
        </button>
      </div>

      {isDockExpanded && (
        <div className="h-[calc(100%-96px)] overflow-hidden">
          {dockSection === 'paths' && (
            <div className="h-full overflow-y-auto p-4 animate-fade-in">
              <ZoneDecisionPaths variant="dock" />
            </div>
          )}

          {dockSection === 'structuring' && (
            <div className="h-full overflow-y-auto p-4 animate-fade-in">
              <ZoneStructuring variant="dock" />
            </div>
          )}

          {dockSection === 'context' && (
            <div className="h-full overflow-y-auto p-4 animate-fade-in">
              <div className="h-[560px] max-h-full">
                <HRContextView variant="dock" />
              </div>
            </div>
          )}

          {dockSection === 'record' && (
            <div className="flex h-full flex-col overflow-hidden animate-fade-in">
              <div className="flex items-center justify-between border-b border-neutralGray/20 px-4">
                <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label="결정 레코드 탭">
                  {recordTabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = recordTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setRecordTab(tab.id)}
                        className={clsx(
                          'relative flex items-center gap-2 px-3 py-3 text-sm transition-all focus-ring rounded whitespace-nowrap min-h-[44px]',
                          active
                            ? 'text-contextGreen'
                            : 'text-textSub hover:bg-appBg/30 hover:text-textMain'
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span className="font-medium hidden sm:inline">{tab.label}</span>
                        {active && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-contextGreen" />}
                      </button>
                    );
                  })}
                </div>
                <span className="data-mono text-micro uppercase tracking-wider text-textSub">
                  Explainability & Decision Record
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <DockContent />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
