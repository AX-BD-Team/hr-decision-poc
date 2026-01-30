import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';

const readinessConfig: Record<string, { bg: string; text: string; label: string }> = {
  available: { bg: 'bg-success/20', text: 'text-success', label: 'Available' },
  recommended: { bg: 'bg-warning/20', text: 'text-warning', label: 'Recommended' },
  missing: { bg: 'bg-severity-high/20', text: 'text-severity-high', label: 'Missing' },
  undefined_rules: { bg: 'bg-severity-high/20', text: 'text-severity-high', label: 'Undefined' },
};

export function DataReadinessPanel() {
  const { data } = useStore();
  const sources = data.dataSources;

  const counts = {
    available: sources.filter((s) => s.readiness === 'available').length,
    recommended: sources.filter((s) => s.readiness === 'recommended').length,
    missing: sources.filter((s) => s.readiness === 'missing' || s.readiness === 'undefined_rules').length,
    total: sources.length,
  };

  return (
    <div className="rounded-lg border border-neutralGray/20 bg-surface-1 p-3">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-textSub">
        Data Readiness
      </h4>
      <div className="mb-2 flex gap-2">
        <span className={clsx('rounded px-1.5 py-0.5 text-micro font-mono', readinessConfig.available.bg, readinessConfig.available.text)}>
          {counts.available} Available
        </span>
        <span className={clsx('rounded px-1.5 py-0.5 text-micro font-mono', readinessConfig.recommended.bg, readinessConfig.recommended.text)}>
          {counts.recommended} Recommended
        </span>
        <span className={clsx('rounded px-1.5 py-0.5 text-micro font-mono', readinessConfig.missing.bg, readinessConfig.missing.text)}>
          {counts.missing} Missing
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutralGray/20 overflow-hidden flex">
        {counts.available > 0 && (
          <div
            className="h-full bg-success"
            style={{ width: `${(counts.available / counts.total) * 100}%` }}
          />
        )}
        {counts.recommended > 0 && (
          <div
            className="h-full bg-warning"
            style={{ width: `${(counts.recommended / counts.total) * 100}%` }}
          />
        )}
        {counts.missing > 0 && (
          <div
            className="h-full bg-severity-high"
            style={{ width: `${(counts.missing / counts.total) * 100}%` }}
          />
        )}
      </div>
      {/* Notes for non-available sources */}
      <div className="mt-2 space-y-1">
        {sources
          .filter((s) => s.readiness && s.readiness !== 'available' && s.readinessNote)
          .map((s) => {
            const cfg = readinessConfig[s.readiness!];
            return (
              <div key={s.id} className="flex items-start gap-1.5 text-micro">
                <span className={clsx('rounded px-1 py-0.5 font-mono flex-shrink-0', cfg?.bg, cfg?.text)}>
                  {s.name}
                </span>
                <span className="text-textSub">{s.readinessNote}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
