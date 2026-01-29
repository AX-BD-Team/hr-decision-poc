import { clsx } from 'clsx';
import type { DataLabel } from '../../types';

interface DataLabelBadgeProps {
  label: DataLabel;
  size?: 'sm' | 'md';
}

const labelStyles: Record<DataLabel, string> = {
  REAL: 'bg-label-real/20 text-label-real hover:shadow-[0_0_8px_rgba(16,185,129,0.3)]',
  ESTIMATE: 'bg-label-estimate/20 text-label-estimate hover:shadow-[0_0_8px_rgba(245,158,11,0.3)]',
  MOCK: 'bg-label-mock/20 text-label-mock hover:shadow-[0_0_8px_rgba(139,92,246,0.3)]',
  SYNTH: 'bg-label-synth/20 text-label-synth hover:shadow-[0_0_8px_rgba(6,182,212,0.3)]',
};

const labelAriaMap: Record<DataLabel, string> = {
  REAL: '실제 데이터',
  ESTIMATE: '추정 데이터',
  MOCK: '모의 데이터',
  SYNTH: '합성 데이터',
};

export function DataLabelBadge({ label, size = 'sm' }: DataLabelBadgeProps) {
  return (
    <span
      aria-label={labelAriaMap[label]}
      className={clsx(
        'rounded font-mono font-medium uppercase transition-all',
        labelStyles[label],
        size === 'sm' ? 'px-1.5 py-0.5 text-tiny' : 'px-2 py-1 text-xs'
      )}
    >
      {label}
    </span>
  );
}
