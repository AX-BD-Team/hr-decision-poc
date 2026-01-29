import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { renderWithProviders, resetStore } from '../../../test/utils';
import { useStore } from '../../../store/useStore';

/** Component that throws on render */
function Thrower({ error }: { error?: Error }): React.ReactNode {
  throw error ?? new Error('Test error');
}

// Suppress expected console.error from ErrorBoundary
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  resetStore();
});

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <p>OK Content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('OK Content')).toBeInTheDocument();
  });

  it('renders fallback UI on error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    );
    // Default title (ko locale)
    expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
  });

  it('renders custom i18n title via fallbackTitleKey', () => {
    renderWithProviders(
      <ErrorBoundary fallbackTitleKey="errorBoundary.dataIngestion">
        <Thrower />
      </ErrorBoundary>,
    );
    expect(screen.getByText('데이터 수집 영역 오류')).toBeInTheDocument();
  });

  it('renders the error message', () => {
    renderWithProviders(
      <ErrorBoundary>
        <Thrower error={new Error('specific failure')} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('specific failure')).toBeInTheDocument();
  });

  it('renders retry button in fallback', () => {
    renderWithProviders(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    );
    expect(screen.getByText('다시 시도')).toBeInTheDocument();
  });

  it('uses English translations when locale is en', () => {
    useStore.setState({ locale: 'en' });
    renderWithProviders(
      <ErrorBoundary fallbackTitleKey="errorBoundary.ontologyGraph">
        <Thrower />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Ontology Graph Error')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});
