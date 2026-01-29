import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataLabelBadge } from '../DataLabelBadge';
import type { DataLabel } from '../../../types';

const labels: DataLabel[] = ['REAL', 'MOCK', 'ESTIMATE', 'SYNTH'];

describe('DataLabelBadge', () => {
  it.each(labels)('renders %s label text', (label) => {
    render(<DataLabelBadge label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it.each(labels)('sets aria-label for %s', (label) => {
    render(<DataLabelBadge label={label} />);
    expect(screen.getByText(label)).toHaveAttribute('aria-label');
  });

  it('applies sm size by default', () => {
    render(<DataLabelBadge label="REAL" />);
    const el = screen.getByText('REAL');
    expect(el.className).toContain('text-tiny');
  });

  it('applies md size when specified', () => {
    render(<DataLabelBadge label="REAL" size="md" />);
    const el = screen.getByText('REAL');
    expect(el.className).toContain('text-xs');
  });

  it('applies distinct styles per label', () => {
    const { rerender } = render(<DataLabelBadge label="REAL" />);
    const realClass = screen.getByText('REAL').className;

    rerender(<DataLabelBadge label="MOCK" />);
    const mockClass = screen.getByText('MOCK').className;

    expect(realClass).not.toBe(mockClass);
  });
});
