import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

// Mock UtilizationScatterChart since it's an SVG chart
vi.mock('../../context/UtilizationScatterChart', () => ({
  UtilizationScatterChart: () => <div data-testid="scatter-chart" />,
}));

// Import after mock
const { HRContextView } = await import('../HRContextView');

describe('HRContextView', () => {
  beforeEach(() => {
    resetStore();
    useStore.setState({ loadingPhase: 0 });
  });

  it('renders header with HR Context Reference', () => {
    renderWithProviders(<HRContextView />);
    expect(screen.getByText('HR Context Reference')).toBeInTheDocument();
  });

  it('renders KPI cards', () => {
    renderWithProviders(<HRContextView />);
    const kpis = useStore.getState().data.hrContextViews[0].kpis;
    kpis.forEach((kpi) => {
      expect(screen.getByText(kpi.name)).toBeInTheDocument();
    });
  });

  it('renders Context Insights section', () => {
    renderWithProviders(<HRContextView />);
    expect(screen.getByText('Context Insights')).toBeInTheDocument();
  });
});
