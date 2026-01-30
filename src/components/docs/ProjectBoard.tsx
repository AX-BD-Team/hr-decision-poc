import { useState } from 'react';
import { clsx } from 'clsx';
import { projectItems } from '../../data/project-board';
import { BoardColumn } from './BoardColumn';
import { useT } from '../../i18n';
import type { BoardPriority, BoardStatus } from '../../types';

const PRIORITIES: (BoardPriority | 'ALL')[] = ['ALL', 'P0', 'P1', 'P2'];
const COLUMNS: BoardStatus[] = ['todo', 'in_progress', 'done'];

const PRIORITY_PILL: Record<string, string> = {
  ALL: '',
  P0: 'bg-alertRed/20 text-alertRed',
  P1: 'bg-warning/20 text-warning',
  P2: 'bg-surface-2 text-textSub',
};

export function ProjectBoard() {
  const t = useT();
  const [priorityFilter, setPriorityFilter] = useState<BoardPriority | 'ALL'>('ALL');

  const filtered = priorityFilter === 'ALL'
    ? projectItems
    : projectItems.filter((i) => i.priority === priorityFilter);

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={clsx(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              priorityFilter === p
                ? p === 'ALL'
                  ? 'bg-decisionBlue text-white'
                  : clsx(PRIORITY_PILL[p], 'ring-1 ring-current')
                : 'glass-panel text-textSub hover:text-textMain hover:bg-appBg/50',
            )}
          >
            {p === 'ALL' ? t('board.allPriority') : p}
          </button>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            items={filtered.filter((i) => i.status === status)}
          />
        ))}
      </div>
    </div>
  );
}
