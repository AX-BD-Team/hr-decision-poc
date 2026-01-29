import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { DocsPage } from '../DocsPage';
import { renderWithProviders, resetStore } from '../../../test/utils';

describe('DocsPage', () => {
  beforeEach(() => {
    resetStore();
  });

  it('renders the docs title', () => {
    renderWithProviders(<DocsPage />);
    expect(screen.getByText('프로젝트 문서')).toBeInTheDocument();
  });

  it('renders category filter buttons including All', () => {
    renderWithProviders(<DocsPage />);
    // "전체" button for the All filter
    const allButtons = screen.getAllByRole('button');
    const allFilterBtn = allButtons.find((b) => b.textContent === '전체');
    expect(allFilterBtn).toBeDefined();
    // "기획" category filter button
    const planBtn = allButtons.find((b) => b.textContent === '기획');
    expect(planBtn).toBeDefined();
  });

  it('renders document cards', () => {
    renderWithProviders(<DocsPage />);
    expect(screen.getByText('프로젝트 헌장')).toBeInTheDocument();
    expect(screen.getByText('데이터 요구사항 명세')).toBeInTheDocument();
  });
});
