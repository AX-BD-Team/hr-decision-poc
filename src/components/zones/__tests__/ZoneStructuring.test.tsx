import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { ZoneStructuring } from '../ZoneStructuring';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

describe('ZoneStructuring', () => {
  beforeEach(() => {
    resetStore();
    useStore.setState({ loadingPhase: 0, activeStep: 2 });
  });

  it('renders analysis pattern cards', () => {
    renderWithProviders(<ZoneStructuring />);
    const patterns = useStore.getState().data.analysisPatterns;
    patterns.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it('shows loading skeleton when loadingPhase < 3', () => {
    useStore.setState({ loadingPhase: 2 });
    const { container } = renderWithProviders(<ZoneStructuring />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders dock variant with different header', () => {
    renderWithProviders(<ZoneStructuring variant="dock" />);
    expect(screen.getByText('Structuring & Analysis')).toBeInTheDocument();
  });

  it('renders zone badge number 2', () => {
    renderWithProviders(<ZoneStructuring />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
