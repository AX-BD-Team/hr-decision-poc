import { clsx } from 'clsx';
import type { DataLabel } from '../../types';

interface DataLabelBadgeProps {
  label: DataLabel;
  size?: 'sm' | 'md';
}

const labelStyles: Record<DataLabel, string> = {
  REAL: 'bg-emerald-500/20 text-emerald-400',
  ESTIMATE: 'bg-amber-500/20 text-amber-400',
  MOCK: 'bg-purple-500/20 text-purple-400',
  SYNTH: 'bg-cyan-500/20 text-cyan-400',
};

export function DataLabelBadge({ label, size = 'sm' }: DataLabelBadgeProps) {
  return (
    <span
      className={clsx(
        'rounded font-medium',
        labelStyles[label],
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs'
      )}
    >
      {label}
    </span>
  );
}
