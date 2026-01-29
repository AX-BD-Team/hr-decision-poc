import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCardGrid } from '../KpiCardGrid';
import type { DashboardKpi } from '../../../types';

const mockKpis: DashboardKpi[] = [
  { id: 'k1', name: '총 인원', value: 120, unit: '명' },
  { id: 'k2', name: '프로젝트 가동률', value: '78%', change: '+3%', changeIsPositive: true },
  { id: 'k3', name: '이직률', value: '5.2%', change: '+1.2%', changeIsPositive: false },
];

describe('KpiCardGrid', () => {
  it('renders all KPI cards', () => {
    render(<KpiCardGrid kpis={mockKpis} />);
    expect(screen.getByText('총 인원')).toBeInTheDocument();
    expect(screen.getByText('프로젝트 가동률')).toBeInTheDocument();
    expect(screen.getByText('이직률')).toBeInTheDocument();
  });

  it('displays values and units', () => {
    render(<KpiCardGrid kpis={mockKpis} />);
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('명')).toBeInTheDocument();
  });

  it('shows change badge when change exists', () => {
    render(<KpiCardGrid kpis={mockKpis} />);
    expect(screen.getByText('+3%')).toBeInTheDocument();
    expect(screen.getByText('+1.2%')).toBeInTheDocument();
  });

  it('does not show change badge when change is absent', () => {
    render(<KpiCardGrid kpis={[{ id: 'k4', name: 'No Change', value: 10 }]} />);
    expect(screen.getByText('No Change')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    // No change elements
    expect(screen.queryByText('+%')).not.toBeInTheDocument();
  });
});
