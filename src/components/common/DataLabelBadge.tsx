import { clsx } from 'clsx';
import type { DataLabel } from '../../types';
import { useT } from '../../i18n';

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

export function DataLabelBadge({ label, size = 'sm' }: DataLabelBadgeProps) {
  const t = useT();
  return (
    <span
      aria-label={t(`dataLabel.${label}`)}
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
