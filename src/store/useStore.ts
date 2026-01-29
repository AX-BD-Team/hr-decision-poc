import { create } from 'zustand';
import type { DemoData, AppMode, DockSection, RecordTab, PageId, Theme, Locale } from '../types';
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

  // Locale
  locale: Locale;

  // HR Context Sidebar
  isContextSidebarOpen: boolean;

  // Guided Tour
  isTourActive: boolean;
  tourStep: number;

  // Demo (auto-play, no TourOverlay)
  isDemoRunning: boolean;

  // Decision Criteria
  checkedCriteria: Record<string, string[]>;

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
  toggleLocale: () => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  startDemo: () => void;
  stopDemo: () => void;
  toggleCriterion: (criterionId: string) => void;
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
  locale: (typeof window !== 'undefined' && localStorage.getItem('locale') === 'en' ? 'en' : 'ko') as Locale,
  isContextSidebarOpen: false,
  isTourActive: false,
  tourStep: 0,
  isDemoRunning: false,
  checkedCriteria: {} as Record<string, string[]>,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setActivePage: (page) => set({ activePage: page }),

  setScenario: (scenarioId) => {
    const abortId = Date.now();
    const scenarioData = scenarioDataById[scenarioId] || scenarioDataById.s1;
    set((state) => ({
      scenarioId,
      data: scenarioData,
      loadingPhase: 1,
      _loadingAbortId: abortId,
      mode: 'OVERVIEW',
      activeStep: 1,
      selectedEntityId: null,
      selectedPathId: null,
      recordTab: 'evidence',
      isDockExpanded: false,
      checkedCriteria: {
        ...state.checkedCriteria,
        [scenarioId]: state.checkedCriteria[scenarioId] || (scenarioData.meta.decisionCriteria ?? []).map((c) => c.id),
      },
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

  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return { theme: next };
    }),

  toggleLocale: () =>
    set((state) => {
      const next: Locale = state.locale === 'ko' ? 'en' : 'ko';
      localStorage.setItem('locale', next);
      return { locale: next };
    }),

  startTour: () =>
    set({
      isTourActive: true,
      tourStep: 1,
      mode: 'GUIDED_DEMO',
      activeStep: 1,
      selectedEntityId: null,
      selectedPathId: null,
      loadingPhase: 0,
      isContextSidebarOpen: true,
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

  startDemo: () =>
    set({
      isDemoRunning: true,
      mode: 'GUIDED_DEMO',
      activeStep: 1,
      selectedEntityId: null,
      selectedPathId: null,
    }),

  stopDemo: () =>
    set({
      isDemoRunning: false,
      mode: 'OVERVIEW',
    }),

  toggleCriterion: (criterionId) =>
    set((state) => {
      const sid = state.scenarioId;
      const current = state.checkedCriteria[sid] || [];
      const next = current.includes(criterionId)
        ? current.filter((id) => id !== criterionId)
        : [...current, criterionId];
      return { checkedCriteria: { ...state.checkedCriteria, [sid]: next } };
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
