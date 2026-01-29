import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { DocCard } from '../DocCard';
import { renderWithProviders, resetStore } from '../../../test/utils';
import type { DocMeta } from '../../../types';

const mockDoc: DocMeta = {
  id: 'doc-test',
  filename: 'test.docx',
  title: '테스트 문서',
  description: '테스트 설명입니다.',
  category: '기획',
  lastUpdated: '2025-01-15',
  fileSize: '100 KB',
};

describe('DocCard', () => {
  beforeEach(() => {
    resetStore();
  });

  it('renders document title', () => {
    renderWithProviders(<DocCard doc={mockDoc} />);
    expect(screen.getByText('테스트 문서')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    renderWithProviders(<DocCard doc={mockDoc} />);
    expect(screen.getByText('기획')).toBeInTheDocument();
  });

  it('renders download link', () => {
    renderWithProviders(<DocCard doc={mockDoc} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/docs/test.docx');
    expect(link).toHaveAttribute('download');
  });
});
