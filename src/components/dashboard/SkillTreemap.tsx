import { useState, useRef } from 'react';
import type { SkillTreemapItem } from '../../types';
import { CHART_COLORS } from '../../constants/tokens';
import { useT } from '../../i18n';

interface SkillTreemapProps {
  data: SkillTreemapItem[];
  title?: string;
}

// Squarified treemap layout
function layoutTreemap(items: SkillTreemapItem[], width: number, height: number) {
  const sorted = [...items].sort((a, b) => b.value - a.value);

  const rects: { item: SkillTreemapItem; x: number; y: number; w: number; h: number }[] = [];
  let x = 0, y = 0, remainW = width, remainH = height;

  let i = 0;
  while (i < sorted.length) {
    const isHorizontal = remainW >= remainH;
    const sideLen = isHorizontal ? remainH : remainW;
    const remainTotal = sorted.slice(i).reduce((s, it) => s + it.value, 0);
    const areaScale = (remainW * remainH) / remainTotal;

    const row: SkillTreemapItem[] = [];
    let rowArea = 0;
    let bestAspect = Infinity;

    while (i < sorted.length) {
      const candidate = sorted[i];
      const newArea = rowArea + candidate.value * areaScale;
      const rowLen = newArea / sideLen;

      let worstAspect = 0;
      const tempRow = [...row, candidate];
      for (const r of tempRow) {
        const rArea = r.value * areaScale;
        const rLen = rArea / rowLen;
        const aspect = Math.max(rowLen / rLen, rLen / rowLen);
        worstAspect = Math.max(worstAspect, aspect);
      }

      if (row.length > 0 && worstAspect > bestAspect) break;

      row.push(candidate);
      rowArea = newArea;
      bestAspect = worstAspect;
      i++;
    }

    const rowLen = rowArea / sideLen;
    let offset = 0;

    for (const item of row) {
      const itemArea = item.value * areaScale;
      const itemLen = itemArea / rowLen;

      if (isHorizontal) {
        rects.push({ item, x: x + offset, y, w: itemLen, h: rowLen });
        offset += itemLen;
      } else {
        rects.push({ item, x, y: y + offset, w: rowLen, h: itemLen });
        offset += itemLen;
      }
    }

    if (isHorizontal) {
      y += rowLen;
      remainH -= rowLen;
    } else {
      x += rowLen;
      remainW -= rowLen;
    }
  }

  return rects;
}

export function SkillTreemap({ data, title }: SkillTreemapProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const t = useT();

  const resolvedTitle = title ?? t('dashboard.skillTreemapDefault');

  const width = 600;
  const height = 300;
  const rects = layoutTreemap(data, width, height);
  const total = data.reduce((s, i) => s + i.value, 0);
  const unit = t('dashboard.personUnit');

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = width / rect.width;
    const sy = height / rect.height;
    setMousePos({
      x: (e.clientX - rect.left) * sx,
      y: (e.clientY - rect.top) * sy,
    });
  }

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-textMain">{resolvedTitle}</h3>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`${resolvedTitle} ${t('dashboard.treemapAriaLabel')}`}
        onMouseMove={handleMouseMove}
      >
        {rects.map((r, idx) => {
          const isHovered = hoveredIdx === idx;
          const pct = ((r.item.value / total) * 100).toFixed(1);
          const showLabel = r.w > 50 && r.h > 30;

          return (
            <g
              key={r.item.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <rect
                x={r.x + 1}
                y={r.y + 1}
                width={Math.max(0, r.w - 2)}
                height={Math.max(0, r.h - 2)}
                rx={4}
                fill={r.item.color}
                opacity={isHovered ? 1 : 0.75}
                stroke={isHovered ? CHART_COLORS.white : 'none'}
                strokeWidth={isHovered ? 2 : 0}
                className="transition-all duration-200"
              />
              {showLabel && (
                <>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 - 6}
                    textAnchor="middle"
                    fill={CHART_COLORS.white}
                    fontSize={r.w > 80 ? 11 : 9}
                    fontWeight="600"
                  >
                    {r.item.name}
                  </text>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 10}
                    textAnchor="middle"
                    fill={CHART_COLORS.whiteAlpha70}
                    fontSize={r.w > 80 ? 10 : 8}
                  >
                    {r.item.value}{unit} ({pct}%)
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Floating tooltip */}
        {hoveredIdx !== null && (() => {
          const r = rects[hoveredIdx];
          const pct = ((r.item.value / total) * 100).toFixed(1);
          const tw = 130;
          const th = 44;
          let tx = mousePos.x + 14;
          let ty = mousePos.y - th - 8;
          if (tx + tw > width) tx = mousePos.x - tw - 10;
          if (ty < 0) ty = mousePos.y + 14;

          return (
            <g>
              <rect x={tx} y={ty} width={tw} height={th} rx={8} fill={CHART_COLORS.tooltipBg} stroke={CHART_COLORS.tooltipBorder} strokeWidth={1} />
              <text x={tx + 10} y={ty + 17} fill={CHART_COLORS.textMain} fontSize={11} fontWeight="600">{r.item.name}</text>
              <text x={tx + 10} y={ty + 34} fill={CHART_COLORS.textSub} fontSize={10}>{r.item.value}{unit} · {pct}%</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
