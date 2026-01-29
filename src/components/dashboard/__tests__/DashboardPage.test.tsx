import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { DashboardPage } from '../DashboardPage';
import { renderWithProviders } from '../../../test/utils';

describe('DashboardPage', () => {
  it('renders dashboard header', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('HR 대시보드')).toBeInTheDocument();
  });

  it('renders three tab buttons', () => {
    renderWithProviders(<DashboardPage />);
    expect(screen.getByText('자원 배분')).toBeInTheDocument();
    expect(screen.getByText('인재 정보')).toBeInTheDocument();
    expect(screen.getByText('인력 예측')).toBeInTheDocument();
  });

  it('shows resource allocation tab by default', () => {
    renderWithProviders(<DashboardPage />);
    // Resource allocation tab shows KPI cards and project status
    const tab = screen.getByText('자원 배분').closest('button')!;
    expect(tab.className).toContain('border-decisionBlue');
  });

  it('switches to talent info tab', async () => {
    const { user } = renderWithProviders(<DashboardPage />);
    await user.click(screen.getByText('인재 정보'));

    // Talent tab should now be active
    const talentTab = screen.getByText('인재 정보').closest('button')!;
    expect(talentTab.className).toContain('border-decisionBlue');

    // Talent table heading should appear
    expect(screen.getByText('핵심 인재 목록')).toBeInTheDocument();
  });

  it('switches to workforce forecast tab', async () => {
    const { user } = renderWithProviders(<DashboardPage />);
    await user.click(screen.getByText('인력 예측'));

    const forecastTab = screen.getByText('인력 예측').closest('button')!;
    expect(forecastTab.className).toContain('border-decisionBlue');
  });
});
