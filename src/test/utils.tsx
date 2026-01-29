import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { useStore } from '../store/useStore';

/** Reset Zustand store to initial state before each test */
export function resetStore() {
  useStore.getState().reset();
}

/** Render with providers + return userEvent setup */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return {
    user: userEvent.setup(),
    ...render(ui, options),
  };
}

export { render, userEvent };
