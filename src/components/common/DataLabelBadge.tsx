import { clsx } from 'clsx';
import type { DataLabel } from '../../types';

interface DataLabelBadgeProps {
  label: DataLabel;
  size?: 'sm' | 'md';
}

const labelStyles: Record<DataLabel, string> = {
  REAL: 'bg-emerald-500/20 text-emerald-400 hover:shadow-[0_0_8px_rgba(16,185,129,0.3)]',
  ESTIMATE: 'bg-amber-500/20 text-amber-400 hover:shadow-[0_0_8px_rgba(245,158,11,0.3)]',
  MOCK: 'bg-purple-500/20 text-purple-400 hover:shadow-[0_0_8px_rgba(139,92,246,0.3)]',
  SYNTH: 'bg-cyan-500/20 text-cyan-400 hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]',
};

export function DataLabelBadge({ label, size = 'sm' }: DataLabelBadgeProps) {
  return (
    <span
      className={clsx(
        'rounded font-mono font-medium uppercase transition-all',
        labelStyles[label],
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs'
      )}
    >
      {label}
    </span>
  );
}
