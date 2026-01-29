import { useEffect, useState } from 'react';
import { useT } from '../../i18n';

const ROW_COUNT = 4;
const STAGGER_MS = 100;

export function LoadingZone1Ingestion() {
  const t = useT();
  const rowLabels = [t('loading.rowLabels.hrMaster'), t('loading.rowLabels.tms'), t('loading.rowLabels.evaluation'), t('loading.rowLabels.costData')];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 600;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);
      if (pct < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="flex flex-1 min-h-0 flex-col h-full rounded-xl border border-zoneIngest/30 bg-panelBg/50 p-4"
      aria-busy="true"
      aria-label={t('loading.scanningAria')}
    >
      {/* Progress bar */}
      <div className="mb-3 h-[2px] w-full rounded-full bg-neutralGray/20 overflow-hidden">
        <div
          className="loading-progress-fill bg-zoneIngest"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Zone header */}
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zoneIngest/30 text-xs font-bold text-zoneIngest">
          1
        </span>
        <h3 className="text-sm font-semibold text-textMain/50">Data Ingestion</h3>
      </div>

      {/* Staggered rows */}
      <div className="flex-1 grid gap-2">
        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <div
            key={i}
            className="ingest-row-scan flex items-center gap-3 rounded-lg bg-surface-1 p-3 animate-ingest-item"
            style={{ animationDelay: `${i * STAGGER_MS}ms` }}
          >
            <div className="h-4 w-4 rounded bg-zoneIngest/20" />
            <div className="flex-1">
              <div className="h-4 w-24 rounded bg-neutralGray/10 mb-1 flex items-center">
                <span className="text-xs text-textSub/60 px-1">{rowLabels[i]}</span>
              </div>
              <div className="h-3 w-40 rounded bg-neutralGray/8" />
            </div>
            <div className="h-4 w-10 rounded bg-zoneIngest/10" />
          </div>
        ))}
      </div>

      {/* Processing indicator */}
      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zoneIngest opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-zoneIngest" />
        </span>
        <span className="text-xs text-textSub animate-pulse">{t('loading.scanning')}</span>
      </div>
    </div>
  );
}
