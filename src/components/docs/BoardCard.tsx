import { Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import type { ProjectItem } from '../../types';

const PRIORITY_STYLE: Record<string, string> = {
  P0: 'bg-alertRed/20 text-alertRed',
  P1: 'bg-warning/20 text-warning',
  P2: 'bg-surface-2 text-textSub',
};

const LABEL_STYLE: Record<string, string> = {
  Frontend: 'bg-blue-500/20 text-blue-400',
  Backend: 'bg-emerald-500/20 text-emerald-400',
  Data: 'bg-cyan-500/20 text-cyan-400',
  Algorithm: 'bg-purple-500/20 text-purple-400',
  UX: 'bg-pink-500/20 text-pink-400',
  Security: 'bg-red-500/20 text-red-400',
  Docs: 'bg-amber-500/20 text-amber-400',
  DevOps: 'bg-lime-500/20 text-lime-400',
};

function formatDate(d: string) {
  return d.slice(5).replace('-', '/');
}

interface BoardCardProps {
  item: ProjectItem;
}

export function BoardCard({ item }: BoardCardProps) {
  return (
    <div className="glass-panel rounded-lg p-3 space-y-2 hover:ring-1 hover:ring-decisionBlue/30 transition-all">
      {/* Title */}
      <p className="text-sm font-semibold text-textMain leading-snug">{item.title}</p>

      {/* Badges row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={clsx('px-1.5 py-0.5 rounded text-micro font-bold', PRIORITY_STYLE[item.priority])}>
          {item.priority}
        </span>
        <span className="px-1.5 py-0.5 rounded text-micro bg-surface-1 text-textSub font-medium">
          {item.size}
        </span>
        {item.labels.map((label) => (
          <span
            key={label}
            className={clsx('px-1.5 py-0.5 rounded text-micro font-medium', LABEL_STYLE[label] ?? 'bg-surface-1 text-textSub')}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Bottom row: assignees + dates */}
      <div className="flex items-center justify-between">
        {/* Assignees */}
        <div className="flex -space-x-1.5">
          {item.assignees.map((name) => (
            <span
              key={name}
              title={name}
              className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-decisionBlue/20 text-decisionBlue text-micro font-bold ring-1 ring-panelBg"
            >
              {name[0]}
            </span>
          ))}
        </div>

        {/* Dates */}
        {(item.startDate || item.targetDate) && (
          <span className="flex items-center gap-1 text-micro text-textSub">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {item.startDate ? formatDate(item.startDate) : ''}
            {item.startDate && item.targetDate ? ' → ' : ''}
            {item.targetDate ? formatDate(item.targetDate) : ''}
          </span>
        )}
      </div>
    </div>
  );
}
