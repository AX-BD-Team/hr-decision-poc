import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Header } from '../Header';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

describe('Header', () => {
  beforeEach(() => {
    resetStore();
    useStore.setState({ activePage: 'workflow', loadingPhase: 0 });
  });

  it('renders the app title', () => {
    renderWithProviders(<Header />);
    // Korean default
    expect(screen.getAllByText('HR 의사결정 지원').length).toBeGreaterThan(0);
  });

  it('renders step navigator with 4 steps', () => {
    renderWithProviders(<Header />);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
  });

  it('renders scenario selector', () => {
    renderWithProviders(<Header />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('renders demo button', () => {
    renderWithProviders(<Header />);
    expect(screen.getAllByText('Start Demo').length).toBeGreaterThan(0);
  });

  it('renders locale toggle with KO and EN', () => {
    renderWithProviders(<Header />);
    expect(screen.getAllByText('KO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('EN').length).toBeGreaterThan(0);
  });
});
