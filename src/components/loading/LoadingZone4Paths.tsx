import { useEffect, useState } from 'react';
import { useT } from '../../i18n';

const CARD_COUNT = 3;
const STAGGER_MS = 700;

export function LoadingZone4Paths() {
  const t = useT();
  const cardLabels = [t('loading.pathLabels.pathA'), t('loading.pathLabels.pathB'), t('loading.pathLabels.pathC')];
  const [progress, setProgress] = useState(0);
  const [landed, setLanded] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);

      // Track how many cards have landed
      const count = Math.min(Math.floor(elapsed / STAGGER_MS) + (elapsed > 0 ? 1 : 0), CARD_COUNT);
      setLanded(count);

      if (pct >= 1) {
        setAllDone(true);
      } else {
        requestAnimationFrame(tick);
      }
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="flex flex-1 min-h-0 flex-col rounded-xl border border-zonePath/30 bg-panelBg/50 p-4"
      aria-busy="true"
      aria-label={t('loading.generatingAria')}
    >
      {/* Amber progress bar */}
      <div className="mb-3 h-[2px] w-full rounded-full bg-neutralGray/20 overflow-hidden">
        <div
          className="loading-progress-fill bg-zonePath"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Zone header with counter */}
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zonePath/30 text-xs font-bold text-zonePath">
            4
          </span>
          <h3 className="text-sm font-semibold text-textMain/50">Decision Paths</h3>
        </div>
        <span className="text-xs font-mono text-zonePath/70">
          {t('loading.generatingProgress')} {Math.min(landed, CARD_COUNT)}/{CARD_COUNT}
        </span>
      </div>

      {/* Cards snapping in */}
      <div className="flex-1 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`path-card-flash rounded-lg border border-neutralGray/20 bg-surface-1 p-4 animate-path-card-snap ${allDone ? 'animate-path-ready-pulse' : ''}`}
            style={{
              animationDelay: allDone ? '0ms' : `${i * STAGGER_MS}ms`,
            }}
          >
            <div className="mb-2 h-4 flex items-center">
              <span className="text-sm font-medium text-textSub/60">{cardLabels[i]}</span>
            </div>
            <div className="mb-3 h-3 w-full rounded bg-neutralGray/8" />
            <div className="mb-3 flex gap-2">
              <div className="h-5 w-16 rounded-full bg-zonePath/10" />
              <div className="h-5 w-16 rounded-full bg-neutralGray/10" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-neutralGray/8" />
              <div className="h-3 w-3/4 rounded bg-neutralGray/8" />
            </div>
          </div>
        ))}
      </div>

      {/* Processing indicator */}
      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zonePath opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-zonePath" />
        </span>
        <span className="text-xs text-textSub animate-pulse">{t('loading.generating')}</span>
      </div>
    </div>
  );
}
