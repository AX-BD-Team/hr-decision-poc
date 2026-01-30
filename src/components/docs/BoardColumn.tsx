import { clsx } from 'clsx';
import type { ProjectItem, BoardStatus } from '../../types';
import { BoardCard } from './BoardCard';
import { useT } from '../../i18n';

const STATUS_STYLE: Record<BoardStatus, { dot: string; text: string }> = {
  todo: { dot: 'bg-textSub', text: 'text-textSub' },
  in_progress: { dot: 'bg-decisionBlue', text: 'text-decisionBlue' },
  done: { dot: 'bg-contextGreen', text: 'text-contextGreen' },
};

const STATUS_KEY: Record<BoardStatus, 'board.todo' | 'board.inProgress' | 'board.done'> = {
  todo: 'board.todo',
  in_progress: 'board.inProgress',
  done: 'board.done',
};

interface BoardColumnProps {
  status: BoardStatus;
  items: ProjectItem[];
}

export function BoardColumn({ status, items }: BoardColumnProps) {
  const t = useT();
  const style = STATUS_STYLE[status];

  return (
    <div className="glass-panel rounded-xl p-3 space-y-3 min-h-[200px]">
      {/* Column header */}
      <div className="flex items-center gap-2">
        <span className={clsx('h-2.5 w-2.5 rounded-full', style.dot)} />
        <span className={clsx('text-sm font-semibold', style.text)}>
          {t(STATUS_KEY[status])}
        </span>
        <span className="ml-auto text-micro text-textSub bg-surface-1 rounded-full px-2 py-0.5 font-medium">
          {items.length} {t('board.items')}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {items.map((item) => (
          <BoardCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <p className="text-xs text-textSub text-center py-6">{t('board.noItems')}</p>
        )}
      </div>
    </div>
  );
}
