import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { tourSteps } from '../../data/tourSteps';
import { clsx } from 'clsx';
import type { RecordTab } from '../../types';
import { useT } from '../../i18n';

interface TooltipPos {
  top: number;
  left: number;
  placement: 'bottom' | 'top' | 'right';
}

function getTooltipPosition(rect: DOMRect): TooltipPos {
  const gap = 12;
  const tooltipW = 360;
  const tooltipH = 220;

  // Prefer bottom placement
  if (rect.bottom + gap + tooltipH < window.innerHeight) {
    return {
      top: rect.bottom + gap,
      left: Math.min(Math.max(rect.left, 8), window.innerWidth - tooltipW - 8),
      placement: 'bottom',
    };
  }
  // Try top
  if (rect.top - gap - tooltipH > 0) {
    return {
      top: rect.top - gap - tooltipH,
      left: Math.min(Math.max(rect.left, 8), window.innerWidth - tooltipW - 8),
      placement: 'top',
    };
  }
  // Fallback right
  return {
    top: Math.max(rect.top, 8),
    left: Math.min(rect.right + gap, window.innerWidth - tooltipW - 8),
    placement: 'right',
  };
}

export function TourOverlay() {
  const t = useT();
  const locale = useStore((s) => s.locale);
  const {
    isTourActive,
    tourStep,
    nextTourStep,
    prevTourStep,
    endTour,
    setActiveStep,
    selectPath,
    setDockSection,
    setRecordTab,
  } = useStore();
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = tourSteps.find((s) => s.id === tourStep);

  const measureTarget = useCallback(() => {
    if (!currentStep) {
      setPos(null);
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${currentStep.target}"]`);
    if (!el) {
      setPos(null);
      setTargetRect(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setTargetRect(rect);
    setPos(getTooltipPosition(rect));
  }, [currentStep]);

  // Execute step actions
  useEffect(() => {
    if (!isTourActive || !currentStep) return;

    if (currentStep.action === 'HIGHLIGHT_ZONE' && typeof currentStep.actionPayload === 'number') {
      setActiveStep(currentStep.actionPayload);
    }
    if (currentStep.action === 'SELECT_PATH' && typeof currentStep.actionPayload === 'string') {
      setActiveStep(4);
      selectPath(currentStep.actionPayload);
    }
    if (currentStep.action === 'OPEN_DOCK_TAB' && typeof currentStep.actionPayload === 'string') {
      setDockSection(currentStep.actionPayload as 'paths' | 'record' | 'structuring' | 'context');
    }
    if (currentStep.action === 'SHOW_REPORT' && typeof currentStep.actionPayload === 'string') {
      setRecordTab(currentStep.actionPayload as RecordTab);
    }
  }, [isTourActive, currentStep, setActiveStep, selectPath, setDockSection, setRecordTab]);

  // Scroll into view + delayed position measurement
  useEffect(() => {
    if (!isTourActive || !currentStep) return;

    const el = document.querySelector(`[data-tour="${currentStep.target}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Wait for scroll to settle before measuring
    const timer = setTimeout(measureTarget, 400);
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [isTourActive, tourStep, currentStep, measureTarget]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTourActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        endTour();
      } else if (e.key === 'ArrowRight') {
        nextTourStep();
      } else if (e.key === 'ArrowLeft') {
        prevTourStep();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isTourActive, endTour, nextTourStep, prevTourStep]);

  if (!isTourActive || !currentStep) return null;

  const isFirst = tourStep === 1;
  const isLast = tourStep === tourSteps.length;
  const pad = 6;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop with spotlight cutout */}
      <svg className="absolute inset-0 h-full w-full pointer-events-auto" onClick={endTour}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - pad}
                y={targetRect.top - pad}
                width={targetRect.width + pad * 2}
                height={targetRect.height + pad * 2}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Spotlight border ring */}
      {targetRect && (
        <div
          className="absolute rounded-xl border-2 border-decisionBlue/60 shadow-glow-blue pointer-events-none animate-pulse"
          style={{
            top: targetRect.top - pad,
            left: targetRect.left - pad,
            width: targetRect.width + pad * 2,
            height: targetRect.height + pad * 2,
          }}
        />
      )}

      {/* Tooltip */}
      {pos && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
          className="absolute w-[360px] rounded-xl border border-decisionBlue/30 bg-panelBg shadow-lg pointer-events-auto"
          style={{ top: pos.top, left: pos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutralGray/20 px-4 py-3">
            <div>
              <h3 id="tour-title" className="text-sm font-semibold text-textMain">{locale === 'ko' ? currentStep.titleKo : currentStep.titleEn}</h3>
              <span className="text-micro font-mono uppercase tracking-wider text-textSub">{locale === 'ko' ? currentStep.titleEn : currentStep.titleKo}</span>
            </div>
            <button
              onClick={endTour}
              aria-label={t('tour.closeTour')}
              className="rounded-lg p-1 text-textSub transition-colors hover:bg-appBg hover:text-textMain"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-3">
            <p className="text-sm text-textSub leading-relaxed">{locale === 'ko' ? currentStep.contentKo : (currentStep.contentEn ?? currentStep.contentKo)}</p>
          </div>

          {/* Footer: nav + progress */}
          <div className="flex items-center justify-between border-t border-neutralGray/20 px-4 py-3">
            <span className="text-xs font-mono text-textSub">
              {tourStep} / {tourSteps.length}
            </span>

            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {tourSteps.map((s) => (
                <span
                  key={s.id}
                  className={clsx(
                    'h-1.5 rounded-full transition-all',
                    s.id === tourStep ? 'bg-decisionBlue w-4' : s.id < tourStep ? 'bg-decisionBlue/40 w-1.5' : 'bg-neutralGray/30 w-1.5'
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevTourStep}
                disabled={isFirst}
                aria-label={t('tour.prevStep')}
                className={clsx(
                  'rounded-lg p-1.5 transition-colors',
                  isFirst ? 'text-neutralGray/30' : 'text-textSub hover:bg-appBg hover:text-textMain'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={isLast ? endTour : nextTourStep}
                className="rounded-lg bg-decisionBlue px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-decisionBlue/80"
              >
                {isLast ? t('tour.done') : t('tour.next')}
              </button>
              <button
                onClick={nextTourStep}
                disabled={isLast}
                aria-label={t('tour.nextStep')}
                className={clsx(
                  'rounded-lg p-1.5 transition-colors',
                  isLast ? 'text-neutralGray/30' : 'text-textSub hover:bg-appBg hover:text-textMain'
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
