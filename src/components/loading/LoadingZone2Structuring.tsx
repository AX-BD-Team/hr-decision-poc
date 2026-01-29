import { useT } from '../../i18n';

const CARD_COUNT = 4;
const STAGGER_MS = 250;

export function LoadingZone2Structuring() {
  const t = useT();
  const cardLabels = [t('loading.cardLabels.gapAnalysis'), t('loading.cardLabels.dependency'), t('loading.cardLabels.bottleneck'), t('loading.cardLabels.costImpact')];
  return (
    <div
      className="relative flex min-h-0 flex-col rounded-xl border border-zoneStruct/30 bg-panelBg/50 p-4 overflow-hidden"
      aria-busy="true"
      aria-label={t('loading.analyzingAria')}
    >
      {/* Sweeping analysis beam */}
      <div className="struct-beam-line animate-struct-beam" />

      {/* Zone header */}
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zoneStruct/30 text-xs font-bold text-zoneStruct">
          2
        </span>
        <h3 className="text-sm font-semibold text-textMain/50">Structuring & Analysis</h3>
      </div>

      {/* Cards blur→sharp */}
      <div className="scroll-fade-x relative">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: CARD_COUNT }).map((_, i) => (
            <div
              key={i}
              className="min-w-[180px] flex-col rounded-lg bg-surface-1 p-3 border border-transparent animate-struct-analyze"
              style={{
                animationDelay: `${i * STAGGER_MS}ms`,
                animationDuration: '0.5s',
              }}
            >
              {/* Glow border on appear */}
              <div
                className="animate-struct-glow rounded-lg"
                style={{ animationDelay: `${i * STAGGER_MS + 200}ms` }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-zoneStruct/20" />
                  <div className="h-4 w-12 rounded bg-zoneStruct/10" />
                </div>
                <div className="h-4 mb-1 flex items-center">
                  <span className="text-sm text-textSub/60">{cardLabels[i]}</span>
                </div>
                <div className="h-3 w-full rounded bg-neutralGray/8" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing indicator */}
      <div className="mt-3 flex items-center gap-2 px-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zoneStruct opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-zoneStruct" />
        </span>
        <span className="text-xs text-textSub animate-pulse">{t('loading.analyzing')}</span>
      </div>
    </div>
  );
}
