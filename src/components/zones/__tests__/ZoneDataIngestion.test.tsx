import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { ZoneDataIngestion } from '../ZoneDataIngestion';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

describe('ZoneDataIngestion', () => {
  beforeEach(() => {
    resetStore();
    useStore.setState({ loadingPhase: 0, activeStep: 1 });
  });

  it('renders data source cards', () => {
    renderWithProviders(<ZoneDataIngestion />);
    const sources = useStore.getState().data.dataSources;
    sources.forEach((ds) => {
      expect(screen.getByText(ds.name)).toBeInTheDocument();
    });
  });

  it('shows loading skeleton when loadingPhase is 1', () => {
    useStore.setState({ loadingPhase: 1 });
    const { container } = renderWithProviders(<ZoneDataIngestion />);
    // Loading component has aria-busy
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });

  it('renders coverage percentage for each source', () => {
    renderWithProviders(<ZoneDataIngestion />);
    const sources = useStore.getState().data.dataSources;
    sources.forEach((ds) => {
      expect(screen.getByText(`${ds.coverage}%`)).toBeInTheDocument();
    });
  });

  it('renders DataLabelBadge for each source', () => {
    renderWithProviders(<ZoneDataIngestion />);
    const sources = useStore.getState().data.dataSources;
    // Each source has a label badge — multiple sources may share the same label text
    const uniqueLabels = [...new Set(sources.map((ds) => ds.label))];
    uniqueLabels.forEach((label) => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });
});
