import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { DecisionRecordSection } from '../DecisionRecordSection';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

describe('DecisionRecordSection', () => {
  beforeEach(() => {
    resetStore();
    useStore.setState({ loadingPhase: 0 });
  });

  it('returns null during loading phases 1-4', () => {
    useStore.setState({ loadingPhase: 3 });
    const { container } = renderWithProviders(<DecisionRecordSection />);
    expect(container.firstChild).toBeNull();
  });

  it('renders record tabs', () => {
    renderWithProviders(<DecisionRecordSection />);
    expect(screen.getByText('Evidence')).toBeInTheDocument();
    expect(screen.getByText('Assumptions')).toBeInTheDocument();
    expect(screen.getByText('Risks')).toBeInTheDocument();
    expect(screen.getByText('Alternatives')).toBeInTheDocument();
    expect(screen.getByText('Record')).toBeInTheDocument();
  });

  it('switches tabs on click', async () => {
    const { user } = renderWithProviders(<DecisionRecordSection />);
    const risksTab = screen.getByText('Risks');
    await user.click(risksTab);
    expect(useStore.getState().recordTab).toBe('risks');
  });

  it('renders Generate and Export HTML buttons', () => {
    renderWithProviders(<DecisionRecordSection />);
    expect(screen.getByText('Generate')).toBeInTheDocument();
    expect(screen.getByText('Export HTML')).toBeInTheDocument();
  });
});
