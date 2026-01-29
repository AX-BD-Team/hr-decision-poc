import { create } from 'zustand';
import type { DemoData, AppMode, DockSection, RecordTab, PageId, Theme } from '../types';
import { scenarioDataById } from '../data/scenarios';

interface AppState {
  // 페이지 라우팅
  activePage: PageId;

  // 데이터
  data: DemoData;
  scenarioId: string;
  loadingPhase: number; // 0=idle, 1~4=zone skeleton, 5=all reveal
  _loadingAbortId: number;

  // UI 상태
  mode: AppMode;
  activeStep: number; // 1-4 (워크플로우 존)
  selectedEntityId: string | null;
  selectedPathId: string | null;
  dockSection: DockSection;
  recordTab: RecordTab;
  isDockExpanded: boolean;
  dockHeight: number;

  // Theme
  theme: Theme;

  // HR Context Sidebar
  isContextSidebarOpen: boolean;

  // Guided Tour
  isTourActive: boolean;
  tourStep: number;

  // Actions
  setActivePage: (page: PageId) => void;
  setScenario: (scenarioId: string) => void;
  setMode: (mode: AppMode) => void;
  setActiveStep: (step: number) => void;
  selectEntity: (id: string | null) => void;
  selectPath: (id: string | null) => void;
  setDockSection: (section: DockSection) => void;
  setRecordTab: (tab: RecordTab) => void;
  setDockExpanded: (expanded: boolean) => void;
  setDockHeight: (height: number) => void;
  toggleDock: () => void;
  toggleContextSidebar: () => void;
  toggleTheme: () => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  reset: () => void;
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

const initialState = {
  activePage: 'workflow' as PageId,
  scenarioId: 's1',
  data: scenarioDataById.s1,
  loadingPhase: 0,
  _loadingAbortId: 0,
  mode: 'OVERVIEW' as AppMode,
  activeStep: 1,
  selectedEntityId: null,
  selectedPathId: null,
  dockSection: 'record' as DockSection,
  recordTab: 'evidence' as RecordTab,
  isDockExpanded: false,
  dockHeight: 300,
  theme: getInitialTheme(),
  isContextSidebarOpen: false,
  isTourActive: false,
  tourStep: 0,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setActivePage: (page) => set({ activePage: page }),

  setScenario: (scenarioId) => {
    const abortId = Date.now();
    set(() => ({
      scenarioId,
      data: scenarioDataById[scenarioId] || scenarioDataById.s1,
      loadingPhase: 1,
      _loadingAbortId: abortId,
      mode: 'OVERVIEW',
      activeStep: 1,
      selectedEntityId: null,
      selectedPathId: null,
      recordTab: 'evidence',
      isDockExpanded: false,
    }));

    const PHASE_DELAY = 600;
    for (let phase = 2; phase <= 5; phase++) {
      setTimeout(() => {
        const state = useStore.getState();
        if (state._loadingAbortId !== abortId) return;
        set({
          loadingPhase: phase,
          activeStep: Math.min(phase, 4),
        });
      }, PHASE_DELAY * (phase - 1));
    }
    // Return to idle after phase 5
    setTimeout(() => {
      const state = useStore.getState();
      if (state._loadingAbortId !== abortId) return;
      set({ loadingPhase: 0 });
    }, PHASE_DELAY * 5);
  },

  setMode: (mode) => set({ mode }),

  setActiveStep: (step) => set({ activeStep: step }),

  selectEntity: (id) =>
    set((state) => ({
      selectedEntityId: id,
      mode: id ? 'DRILLDOWN' : state.mode === 'DRILLDOWN' ? 'OVERVIEW' : state.mode,
    })),

  selectPath: (id) => set({ selectedPathId: id }),

  setDockSection: (section) => set({ dockSection: section }),

  setRecordTab: (tab) => set({ recordTab: tab }),

  setDockExpanded: (expanded) => set({ isDockExpanded: expanded }),

  setDockHeight: (height) => set({ dockHeight: height }),

  toggleDock: () => set((state) => ({ isDockExpanded: !state.isDockExpanded })),

  toggleContextSidebar: () => set((state) => ({ isContextSidebarOpen: !state.isContextSidebarOpen })),

  startTour: () =>
    set({
      isTourActive: true,
      tourStep: 1,
      mode: 'GUIDED_DEMO',
      activeStep: 1,
      selectedEntityId: null,
      selectedPathId: null,
      loadingPhase: 0,
    }),

  nextTourStep: () =>
    set((state) => {
      const maxSteps = 9;
      if (state.tourStep >= maxSteps) {
        return { isTourActive: false, tourStep: 0 };
      }
      return { tourStep: state.tourStep + 1 };
    }),

  prevTourStep: () =>
    set((state) => ({
      tourStep: Math.max(1, state.tourStep - 1),
    })),

  endTour: () =>
    set({
      isTourActive: false,
      tourStep: 0,
      mode: 'OVERVIEW',
    }),

  reset: () =>
    set((state) => ({
      ...initialState,
      scenarioId: state.scenarioId,
      data: scenarioDataById[state.scenarioId] || scenarioDataById.s1,
      loadingPhase: 0,
      _loadingAbortId: Date.now(),
    })),
}));
