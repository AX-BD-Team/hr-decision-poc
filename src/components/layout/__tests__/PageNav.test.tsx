import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { PageNav } from '../PageNav';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

describe('PageNav', () => {
  beforeEach(() => {
    resetStore();
  });

  it('renders three page buttons', () => {
    renderWithProviders(<PageNav />);
    expect(screen.getByText('의사결정 워크플로우')).toBeInTheDocument();
    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('문서')).toBeInTheDocument();
  });

  it('marks workflow as current page by default', () => {
    renderWithProviders(<PageNav />);
    const workflowBtn = screen.getByText('의사결정 워크플로우').closest('button');
    expect(workflowBtn).toHaveAttribute('aria-current', 'page');
  });

  it('switches active page on click', async () => {
    const { user } = renderWithProviders(<PageNav />);
    const dashboardBtn = screen.getByText('대시보드').closest('button')!;
    await user.click(dashboardBtn);
    expect(useStore.getState().activePage).toBe('dashboard');
  });

  it('updates aria-current when page changes', async () => {
    const { user } = renderWithProviders(<PageNav />);
    const docsBtn = screen.getByText('문서').closest('button')!;
    await user.click(docsBtn);
    expect(docsBtn).toHaveAttribute('aria-current', 'page');
  });
});
