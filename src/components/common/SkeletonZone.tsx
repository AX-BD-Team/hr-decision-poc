import { clsx } from 'clsx';

interface SkeletonZoneProps {
  variant?: 'default' | 'graph' | 'paths';
}

function ShimmerBlock({ className }: { className?: string }) {
  return <div className={clsx('shimmer-bg rounded', className)} />;
}

export function SkeletonZone({ variant = 'default' }: SkeletonZoneProps) {
  if (variant === 'graph') {
    return (
      <div className="flex h-full min-h-[300px] flex-col rounded-xl border border-neutralGray/20 bg-panelBg/50" aria-busy="true" aria-label="그래프 로딩 중">
        <div className="flex items-center gap-2 border-b border-neutralGray/20 px-4 py-3">
          <ShimmerBlock className="h-6 w-6 rounded-full" />
          <ShimmerBlock className="h-4 w-32" />
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            {/* Fake node cluster */}
            <div className="flex gap-6">
              <ShimmerBlock className="h-8 w-20 rounded-lg" />
              <ShimmerBlock className="h-8 w-24 rounded-lg" />
            </div>
            <ShimmerBlock className="h-px w-16" />
            <div className="flex gap-8">
              <ShimmerBlock className="h-8 w-16 rounded-lg" />
              <ShimmerBlock className="h-8 w-20 rounded-lg" />
              <ShimmerBlock className="h-8 w-18 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'paths') {
    return (
      <div className="flex flex-col rounded-xl border border-neutralGray/20 bg-panelBg/50 p-4" aria-busy="true" aria-label="의사결정 경로 로딩 중">
        <div className="mb-3 flex items-center gap-2">
          <ShimmerBlock className="h-6 w-6 rounded-full" />
          <ShimmerBlock className="h-4 w-28" />
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-neutralGray/20 bg-surface-1 p-4">
              <ShimmerBlock className="mb-2 h-4 w-24" />
              <ShimmerBlock className="mb-3 h-3 w-full" />
              <div className="mb-3 flex gap-2">
                <ShimmerBlock className="h-5 w-16 rounded-full" />
                <ShimmerBlock className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-2">
                <ShimmerBlock className="h-3 w-full" />
                <ShimmerBlock className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // default variant
  return (
    <div className="flex flex-col rounded-xl border border-neutralGray/20 bg-panelBg/50 p-4" aria-busy="true" aria-label="데이터 로딩 중">
      <div className="mb-3 flex items-center gap-2">
        <ShimmerBlock className="h-6 w-6 rounded-full" />
        <ShimmerBlock className="h-4 w-24" />
      </div>
      <div className="grid gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-surface-1 p-3">
            <div className="flex items-center gap-3">
              <ShimmerBlock className="h-4 w-4" />
              <div>
                <ShimmerBlock className="mb-1 h-4 w-28" />
                <ShimmerBlock className="h-3 w-40" />
              </div>
            </div>
            <ShimmerBlock className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
