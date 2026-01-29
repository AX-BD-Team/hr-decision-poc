import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { LoadingZone1Ingestion } from '../LoadingZone1Ingestion';
import { LoadingZone2Structuring } from '../LoadingZone2Structuring';
import { LoadingZone3Graph } from '../LoadingZone3Graph';
import { LoadingZone4Paths } from '../LoadingZone4Paths';

describe('Loading Components', () => {
  beforeEach(() => {
    resetStore();
  });

  it('renders LoadingZone1Ingestion with aria-busy', () => {
    const { container } = renderWithProviders(<LoadingZone1Ingestion />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders LoadingZone2Structuring with aria-busy', () => {
    const { container } = renderWithProviders(<LoadingZone2Structuring />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders LoadingZone3Graph with aria-busy', () => {
    const { container } = renderWithProviders(<LoadingZone3Graph />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders LoadingZone4Paths with aria-busy', () => {
    const { container } = renderWithProviders(<LoadingZone4Paths />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });
});
