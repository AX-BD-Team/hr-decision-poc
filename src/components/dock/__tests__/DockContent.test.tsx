import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { DockContent } from '../DockContent';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

describe('DockContent', () => {
  beforeEach(() => {
    resetStore();
    useStore.setState({ loadingPhase: 0 });
  });

  it('renders evidence tab content by default', () => {
    useStore.setState({ recordTab: 'evidence' });
    renderWithProviders(<DockContent />);
    // evidence tab shows evidence description
    expect(screen.getByText(/의사결정 근거 자료/)).toBeInTheDocument();
  });

  it('renders assumptions tab content', () => {
    useStore.setState({ recordTab: 'assumptions' });
    renderWithProviders(<DockContent />);
    expect(screen.getByText(/분석에 사용된 가정/)).toBeInTheDocument();
  });

  it('renders risks tab content', () => {
    useStore.setState({ recordTab: 'risks' });
    renderWithProviders(<DockContent />);
    expect(screen.getByText(/리스크 신호/)).toBeInTheDocument();
  });

  it('renders alternatives tab with comparison table', () => {
    useStore.setState({ recordTab: 'alternatives' });
    renderWithProviders(<DockContent />);
    expect(screen.getByText(/의사결정 대안 비교/)).toBeInTheDocument();
  });
});
