import { createPortal } from 'react-dom';
import { X, Play } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useT } from '../../i18n';
import { clsx } from 'clsx';
import { scenarioMetas } from '../../data/scenarios';

const zoneColors = [
  { bg: 'bg-zoneIngest/20', text: 'text-zoneIngest', badge: 'bg-zoneIngest' },
  { bg: 'bg-zoneStruct/20', text: 'text-zoneStruct', badge: 'bg-zoneStruct' },
  { bg: 'bg-zoneGraph/20', text: 'text-zoneGraph', badge: 'bg-zoneGraph' },
  { bg: 'bg-zonePath/20', text: 'text-zonePath', badge: 'bg-zonePath' },
];

interface DemoIntroModalProps {
  onStart: () => void;
}

export function DemoIntroModal({ onStart }: DemoIntroModalProps) {
  const { data, isDemoIntroOpen, closeDemoIntro, locale, scenarioId, setScenario } = useStore();
  const t = useT();

  if (!isDemoIntroOpen) return null;

  const meta = data.meta;
  const demoSteps = meta.demoSteps ?? [];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={closeDemoIntro}
    >
      <div
        className="relative mx-4 w-full max-w-lg rounded-2xl border border-neutralGray/20 bg-panelBg shadow-2xl animate-[fadeIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeDemoIntro}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-textSub hover:bg-appBg/50 hover:text-textMain transition-colors"
          aria-label={t('common.close')}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Title + Badge */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-textMain">{t('demo.introTitle')}</h2>
            {meta.badge && (
              <span className={clsx(
                'rounded-full px-2.5 py-0.5 text-micro font-mono font-bold uppercase tracking-wider',
                meta.badge === 'Phase-2' ? 'bg-zoneStruct/20 text-zoneStruct'
                  : meta.badge === 'TO' ? 'bg-zoneIngest/20 text-zoneIngest'
                  : meta.badge === 'R&R' ? 'bg-zonePath/20 text-zonePath'
                  : 'bg-contextGreen/20 text-contextGreen'
              )}>
                {meta.badge}
              </span>
            )}
          </div>

          {/* Scenario selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {scenarioMetas.map((m) => (
              <button
                key={m.id}
                onClick={() => setScenario(m.id)}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-sm font-medium border transition-all',
                  m.id === scenarioId
                    ? 'border-decisionBlue bg-decisionBlue/20 text-decisionBlue'
                    : 'border-neutralGray/20 text-textSub hover:border-neutralGray/40 hover:text-textMain'
                )}
              >
                {m.name}
                {m.badge && (
                  <span className="ml-1.5 text-micro opacity-70">[{m.badge}]</span>
                )}
              </button>
            ))}
          </div>

          {/* Scenario name */}
          <p className="text-base font-medium text-decisionBlue mb-2">{meta.name}</p>

          {/* Description */}
          <p className="text-sm text-textSub leading-relaxed mb-4">{meta.description}</p>

          {/* Key Question */}
          <div className="rounded-lg bg-decisionBlue/10 border border-decisionBlue/20 px-3 py-2.5 mb-5">
            <span className="text-micro font-mono uppercase tracking-wider text-decisionBlue/70 block mb-1">
              {t('demo.keyQuestion')}
            </span>
            <p className="text-sm text-textMain font-medium">{meta.keyQuestion}</p>
          </div>

          {/* Demo Steps Preview */}
          {demoSteps.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-medium text-textSub uppercase tracking-wider mb-3">
                {t('demo.whatYouWillSee')}
              </p>
              <div className="space-y-2">
                {demoSteps.map((step, idx) => {
                  const colors = zoneColors[idx];
                  const title = locale === 'ko' ? step.titleKo : step.titleEn;
                  return (
                    <div
                      key={step.step}
                      className={clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2',
                        colors.bg,
                      )}
                    >
                      <span className={clsx(
                        'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                        colors.badge,
                      )}>
                        {step.step}
                      </span>
                      <span className={clsx('text-sm', colors.text)}>{title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-decisionBlue px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-decisionBlue/80 hover:shadow-glow-blue"
          >
            <Play className="h-4 w-4" />
            {t('demo.startButton')}
          </button>

          {/* Hint */}
          <p className="mt-3 text-center text-micro text-textSub/60">
            {t('demo.canStopAnytime')}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
