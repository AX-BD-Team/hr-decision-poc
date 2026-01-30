import { CheckSquare, Square } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';

export function DecisionCriteriaPanel() {
  const { data, scenarioId, checkedCriteria, toggleCriterion } = useStore();
  const criteria = data.meta.decisionCriteria;
  if (!criteria || criteria.length === 0) return null;

  const checked = checkedCriteria[scenarioId] || [];

  return (
    <div className="rounded-lg border border-decisionBlue/30 bg-decisionBlue/5 p-3">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-decisionBlue">
        Decision Criteria ({checked.length}/{criteria.length})
      </h4>
      <div className="space-y-1.5">
        {criteria.map((c) => {
          const isChecked = checked.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleCriterion(c.id)}
              className={clsx(
                'flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-all',
                isChecked
                  ? 'bg-decisionBlue/10'
                  : 'hover:bg-surface-2'
              )}
            >
              {isChecked ? (
                <CheckSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-decisionBlue" aria-hidden="true" />
              ) : (
                <Square className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-textSub" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx('text-xs font-medium', isChecked ? 'text-textMain' : 'text-textSub')}>
                    {c.text}
                  </span>
                  <span className="rounded bg-decisionBlue/20 px-1 py-0.5 text-micro font-mono text-decisionBlue">
                    {c.evidenceCount}
                  </span>
                </div>
                <p className="text-micro text-textSub truncate" title={c.description}>
                  {c.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
