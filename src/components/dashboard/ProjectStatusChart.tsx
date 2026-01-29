import { useState } from 'react';
import type { ProjectStatusItem } from '../../types';
import { CHART_COLORS } from '../../constants/tokens';
import { useT } from '../../i18n';

interface ProjectStatusChartProps {
  data: ProjectStatusItem[];
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const t = useT();
  const total = data.reduce((sum, d) => sum + d.count, 0);

  // Stroke-based donut params
  const cx = 60;
  const cy = 60;
  const r = 44;
  const circumference = 2 * Math.PI * r;

  // Compute stroke segments
  let cumPct = 0;
  const segments = data.map((item, idx) => {
    const pct = item.count / total;
    const dashLen = pct * circumference;
    const gapLen = circumference - dashLen;
    const offset = -cumPct * circumference + circumference * 0.25; // rotate -90deg start
    cumPct += pct;
    return { item, idx, dashLen, gapLen, offset };
  });

  const hoveredItem = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-textMain">{t('dashboard.projectStatusTitle')}</h3>

      <div className="flex items-center gap-6">
        <svg viewBox="0 0 120 120" className="w-28 h-28 flex-shrink-0" aria-label={t('dashboard.projectStatusTitle')}>
          {segments.map((seg) => {
            const dimmed = hoveredIdx !== null && hoveredIdx !== seg.idx;
            return (
              <circle
                key={seg.item.status}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.item.color}
                strokeWidth={hoveredIdx === seg.idx ? 16 : 14}
                strokeDasharray={`${seg.dashLen} ${seg.gapLen}`}
                strokeDashoffset={seg.offset}
                opacity={dimmed ? 0.3 : 0.9}
                className="transition-all duration-300"
                onMouseEnter={() => setHoveredIdx(seg.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}

          {/* Center text */}
          <text x={cx} y={hoveredItem ? cy - 2 : cy - 3} textAnchor="middle" fill={CHART_COLORS.textMain} fontSize={hoveredItem ? 14 : 18} fontWeight="bold" className="transition-all">
            {hoveredItem ? hoveredItem.count : total}
          </text>
          <text x={cx} y={hoveredItem ? cy + 12 : cy + 12} textAnchor="middle" fill={CHART_COLORS.textSub} fontSize={8}>
            {hoveredItem ? hoveredItem.status : t('dashboard.totalProjects')}
          </text>
        </svg>

        <div className="space-y-2 flex-1">
          {data.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={item.status}
                className="flex items-center justify-between cursor-pointer rounded px-1 py-0.5 transition-colors hover:bg-white/5"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0 transition-transform"
                    style={{
                      backgroundColor: item.color,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <span className="text-xs text-textSub">{item.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-textMain">{item.count}</span>
                  <span className="text-micro text-textSub">
                    ({((item.count / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
