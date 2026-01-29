import { useState } from 'react';
import type { SkillTreemapItem } from '../../types';

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

    // Greedily add items to current row
    const row: SkillTreemapItem[] = [];
    let rowArea = 0;
    let bestAspect = Infinity;

    while (i < sorted.length) {
      const candidate = sorted[i];
      const newArea = rowArea + candidate.value * areaScale;
      const rowLen = newArea / sideLen;

      // Check worst aspect ratio
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

    // Position row items
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

export function SkillTreemap({ data, title = '스킬 분포' }: SkillTreemapProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 600;
  const height = 300;
  const rects = layoutTreemap(data, width, height);
  const total = data.reduce((s, i) => s + i.value, 0);

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-textMain">{title}</h3>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`${title} 트리맵`}
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
                className="transition-opacity"
              />
              {showLabel && (
                <>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 - 6}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={r.w > 80 ? 11 : 9}
                    fontWeight="600"
                  >
                    {r.item.name}
                  </text>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 10}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize={r.w > 80 ? 10 : 8}
                  >
                    {r.item.value}명 ({pct}%)
                  </text>
                </>
              )}
              {isHovered && !showLabel && (
                <title>{`${r.item.name}: ${r.item.value}명 (${pct}%)`}</title>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
