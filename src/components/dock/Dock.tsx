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
import { useT } from '../../i18n';
import { DockContent } from './DockContent';
import { ZoneDecisionPaths } from '../zones/ZoneDecisionPaths';
import { ZoneStructuring } from '../zones/ZoneStructuring';
import { HRContextView } from '../context/HRContextView';

const sectionDefs = [
  { id: 'paths' as const, tKey: 'dock.paths', icon: GitBranch },
  { id: 'record' as const, tKey: 'dock.record', icon: FileText },
  { id: 'structuring' as const, tKey: 'dock.structuring', icon: Layers3 },
  { id: 'context' as const, tKey: 'dock.context', icon: Users },
];

const recordTabDefs = [
  { id: 'evidence' as const, tKey: 'record.evidence', icon: Shield },
  { id: 'assumptions' as const, tKey: 'record.assumptions', icon: FileText },
  { id: 'risks' as const, tKey: 'record.risks', icon: AlertTriangle },
  { id: 'alternatives' as const, tKey: 'record.alternatives', icon: GitBranch },
  { id: 'report' as const, tKey: 'record.report', icon: ClipboardList },
];

export function Dock() {
  const t = useT();
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
        aria-label={t('a11y.dockResizeAria')}
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
        <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label={t('a11y.dockSectionAria')}>
          {sectionDefs.map((tab) => {
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
                <span className="font-medium hidden sm:inline">{t(tab.tKey)}</span>
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
                <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label={t('a11y.recordTabAria')}>
                  {recordTabDefs.map((tab) => {
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
                        <span className="font-medium hidden sm:inline">{t(tab.tKey)}</span>
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
