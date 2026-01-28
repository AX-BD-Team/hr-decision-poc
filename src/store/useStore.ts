import { create } from 'zustand';
import type { DemoData, AppMode, DockTab } from '../types';
import demoData from '../data/demo-s1.json';

interface AppState {
  // 데이터
  data: DemoData;

  // UI 상태
  mode: AppMode;
  activeStep: number; // 1-4 (워크플로우 존)
  selectedEntityId: string | null;
  selectedPathId: string | null;
  dockTab: DockTab;
  isDockExpanded: boolean;

  // Guided Tour
  isTourActive: boolean;
  tourStep: number;

  // Actions
  setMode: (mode: AppMode) => void;
  setActiveStep: (step: number) => void;
  selectEntity: (id: string | null) => void;
  selectPath: (id: string | null) => void;
  setDockTab: (tab: DockTab) => void;
  toggleDock: () => void;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  reset: () => void;
}

const initialState = {
  data: demoData as DemoData,
  mode: 'OVERVIEW' as AppMode,
  activeStep: 1,
  selectedEntityId: null,
  selectedPathId: null,
  dockTab: 'evidence' as DockTab,
  isDockExpanded: true,
  isTourActive: false,
  tourStep: 0,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),

  setActiveStep: (step) => set({ activeStep: step }),

  selectEntity: (id) =>
    set((state) => ({
      selectedEntityId: id,
      mode: id ? 'DRILLDOWN' : state.mode === 'DRILLDOWN' ? 'OVERVIEW' : state.mode,
    })),

  selectPath: (id) => set({ selectedPathId: id }),

  setDockTab: (tab) => set({ dockTab: tab }),

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

  reset: () => set(initialState),
}));
