import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { ZoneDecisionPaths } from '../ZoneDecisionPaths';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

describe('ZoneDecisionPaths', () => {
  beforeEach(() => {
    resetStore();
    // Ensure loading is complete so paths render
    useStore.setState({ loadingPhase: 0, activeStep: 4 });
  });

  it('renders decision path cards', () => {
    renderWithProviders(<ZoneDecisionPaths />);
    const paths = useStore.getState().data.decisionPaths;
    paths.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it('selects a path on click', async () => {
    const { user } = renderWithProviders(<ZoneDecisionPaths />);
    const paths = useStore.getState().data.decisionPaths;
    const firstPath = paths[0];

    const btn = screen.getByText(firstPath.name).closest('button')!;
    await user.click(btn);

    expect(useStore.getState().selectedPathId).toBe(firstPath.id);
  });

  it('deselects a path when clicked again', async () => {
    const { user } = renderWithProviders(<ZoneDecisionPaths />);
    const paths = useStore.getState().data.decisionPaths;
    const firstPath = paths[0];

    const btn = screen.getByText(firstPath.name).closest('button')!;
    await user.click(btn);
    expect(useStore.getState().selectedPathId).toBe(firstPath.id);

    await user.click(btn);
    expect(useStore.getState().selectedPathId).toBeNull();
  });

  it('renders dock variant with different header', () => {
    renderWithProviders(<ZoneDecisionPaths variant="dock" />);
    expect(screen.getByText('의사결정 대안 카드')).toBeInTheDocument();
  });

  it('shows risk and effect levels', () => {
    renderWithProviders(<ZoneDecisionPaths />);
    const paths = useStore.getState().data.decisionPaths;
    paths.forEach((p) => {
      expect(screen.getByText(new RegExp(`리스크 ${p.riskLevel.toUpperCase()}`))).toBeInTheDocument();
    });
  });
});
