import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { TalentTable } from '../TalentTable';
import { renderWithProviders } from '../../../test/utils';
import type { TalentRow } from '../../../types';

const mockData: TalentRow[] = [
  { id: '1', name: '김철수', rank: '과장', role: '백엔드', skillLevel: 'L5_Expert', evalGrade: 'S', department: '개발팀' },
  { id: '2', name: '이영희', rank: '대리', role: '프론트엔드', skillLevel: 'L4_High', evalGrade: 'A', department: 'UX팀' },
  { id: '3', name: '박민수', rank: '사원', role: 'QA', skillLevel: 'L3_Mid', evalGrade: 'B+', department: '개발팀' },
];

describe('TalentTable', () => {
  it('renders all rows', () => {
    renderWithProviders(<TalentTable data={mockData} />);
    expect(screen.getByText('김철수')).toBeInTheDocument();
    expect(screen.getByText('이영희')).toBeInTheDocument();
    expect(screen.getByText('박민수')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    renderWithProviders(<TalentTable data={mockData} />);
    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByText('직급')).toBeInTheDocument();
    expect(screen.getByText('역할')).toBeInTheDocument();
    expect(screen.getByText('역량수준')).toBeInTheDocument();
    expect(screen.getByText('평가등급')).toBeInTheDocument();
    expect(screen.getByText('부서')).toBeInTheDocument();
  });

  it('toggles sort direction on column click', async () => {
    const { user } = renderWithProviders(<TalentTable data={mockData} />);
    const nameHeader = screen.getByText('이름');

    // Default sort: asc by name → 김철수, 박민수, 이영희
    const tbody = screen.getAllByRole('row').slice(1); // skip header
    expect(within(tbody[0]).getByText('김철수')).toBeInTheDocument();

    // Click name again → desc
    await user.click(nameHeader);
    const rowsDesc = screen.getAllByRole('row').slice(1);
    expect(within(rowsDesc[0]).getByText('이영희')).toBeInTheDocument();
  });

  it('filters by department', async () => {
    const { user } = renderWithProviders(<TalentTable data={mockData} />);
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'UX팀');

    expect(screen.getByText('이영희')).toBeInTheDocument();
    expect(screen.queryByText('김철수')).not.toBeInTheDocument();
    expect(screen.queryByText('박민수')).not.toBeInTheDocument();
  });

  it('shows empty message when no data matches', async () => {
    renderWithProviders(<TalentTable data={[]} />);
    expect(screen.getByText('해당 부서의 인재 데이터가 없습니다.')).toBeInTheDocument();
  });
});
