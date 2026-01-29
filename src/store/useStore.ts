import { create } from 'zustand';
import type { DemoData, AppMode, DockSection, RecordTab } from '../types';
import { scenarioDataById } from '../data/scenarios';

interface AppState {
  // 데이터
  data: DemoData;
  scenarioId: string;

  // UI 상태
  mode: AppMode;
  activeStep: number; // 1-4 (워크플로우 존)
  selectedEntityId: string | null;
  selectedPathId: string | null;
  dockSection: DockSection;
  recordTab: RecordTab;
  isDockExpanded: boolean;
  dockHeight: number;

  // Guided Tour
  isTourActive: boolean;
  tourStep: number;

  // Actions
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
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  reset: () => void;
}

const initialState = {
  scenarioId: 's1',
  data: scenarioDataById.s1,
  mode: 'OVERVIEW' as AppMode,
  activeStep: 1,
  selectedEntityId: null,
  selectedPathId: null,
  dockSection: 'record' as DockSection,
  recordTab: 'evidence' as RecordTab,
  isDockExpanded: false,
  dockHeight: 300,
  isTourActive: false,
  tourStep: 0,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setScenario: (scenarioId) =>
    set(() => ({
      scenarioId,
      data: scenarioDataById[scenarioId] || scenarioDataById.s1,
      mode: 'OVERVIEW',
      activeStep: 1,
      selectedEntityId: null,
      selectedPathId: null,
      recordTab: 'evidence',
      isDockExpanded: false,
    })),

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

  startTour: () =>
    set({
      isTourActive: true,
      tourStep: 1,
      mode: 'GUIDED_DEMO',
      activeStep: 1,
      selectedEntityId: null,
      selectedPathId: null,
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
    })),
}));
