import { useMemo, useState } from 'react';
import type { UtilizationPoint } from '../../types';

interface UtilizationScatterChartProps {
  data: UtilizationPoint[];
  selectedEntityId: string | null;
  onSelectEntity: (entityId: string | null) => void;
}

// SVG viewBox coordinate system
const VB_W = 400;
const VB_H = 260;
const MARGIN = { top: 20, right: 20, bottom: 36, left: 48 };
const PLOT_W = VB_W - MARGIN.left - MARGIN.right;
const PLOT_H = VB_H - MARGIN.top - MARGIN.bottom;

// Axis domains
const X_MAX = 150; // utilization %
const Y_MAX = 100; // dependency %

// Thresholds
const OVERLOAD_X = 100;
const HIGH_DEP_Y = 70;

function scaleX(pct: number) {
  return MARGIN.left + (pct / X_MAX) * PLOT_W;
}
function scaleY(pct: number) {
  return MARGIN.top + PLOT_H - (pct / Y_MAX) * PLOT_H;
}

const X_TICKS = [0, 25, 50, 75, 100, 125, 150];
const Y_TICKS = [0, 25, 50, 75, 100];

export function UtilizationScatterChart({ data, selectedEntityId, onSelectEntity }: UtilizationScatterChartProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const points = useMemo(
    () =>
      data.map((p) => ({
        ...p,
        cx: scaleX(p.utilization * 100),
        cy: scaleY(p.dependency * 100),
      })),
    [data]
  );

  const hoveredPoint = points.find((p) => p.id === hoveredId);

  // Risk zone: upper-right (utilization > 100% AND dependency > 70%)
  const riskX = scaleX(OVERLOAD_X);
  const riskY = scaleY(Y_MAX);
  const riskW = scaleX(X_MAX) - riskX;
  const riskH = scaleY(HIGH_DEP_Y) - riskY;

  return (
    <div role="img" aria-label="인력 가동률 및 의존도 산점도" className="h-full w-full">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* Risk zone highlight */}
        <rect x={riskX} y={riskY} width={riskW} height={riskH} fill="#FF4D4F" opacity={0.06} rx={4} />

        {/* Grid lines */}
        {X_TICKS.map((t) => (
          <line
            key={`gx-${t}`}
            x1={scaleX(t)}
            y1={MARGIN.top}
            x2={scaleX(t)}
            y2={MARGIN.top + PLOT_H}
            stroke="rgba(170,180,197,0.08)"
            strokeDasharray="3 3"
          />
        ))}
        {Y_TICKS.map((t) => (
          <line
            key={`gy-${t}`}
            x1={MARGIN.left}
            y1={scaleY(t)}
            x2={MARGIN.left + PLOT_W}
            y2={scaleY(t)}
            stroke="rgba(170,180,197,0.08)"
            strokeDasharray="3 3"
          />
        ))}

        {/* Threshold lines */}
        <line
          x1={scaleX(OVERLOAD_X)} y1={MARGIN.top}
          x2={scaleX(OVERLOAD_X)} y2={MARGIN.top + PLOT_H}
          stroke="#FF4D4F" strokeDasharray="4 3" strokeWidth={1}
        />
        <text x={scaleX(OVERLOAD_X) + 3} y={MARGIN.top + 10} fill="#FF4D4F" fontSize={8} fontFamily="monospace">
          과부하
        </text>
        <line
          x1={MARGIN.left} y1={scaleY(HIGH_DEP_Y)}
          x2={MARGIN.left + PLOT_W} y2={scaleY(HIGH_DEP_Y)}
          stroke="#FBBF24" strokeDasharray="4 3" strokeWidth={1}
        />
        <text x={MARGIN.left + PLOT_W - 28} y={scaleY(HIGH_DEP_Y) - 4} fill="#FBBF24" fontSize={8} fontFamily="monospace">
          고의존
        </text>

        {/* Axes */}
        <line x1={MARGIN.left} y1={MARGIN.top + PLOT_H} x2={MARGIN.left + PLOT_W} y2={MARGIN.top + PLOT_H} stroke="rgba(170,180,197,0.2)" />
        <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={MARGIN.top + PLOT_H} stroke="rgba(170,180,197,0.2)" />

        {/* X-axis ticks + labels */}
        {X_TICKS.map((t) => (
          <g key={`xt-${t}`}>
            <line x1={scaleX(t)} y1={MARGIN.top + PLOT_H} x2={scaleX(t)} y2={MARGIN.top + PLOT_H + 4} stroke="rgba(170,180,197,0.3)" />
            <text x={scaleX(t)} y={MARGIN.top + PLOT_H + 14} fill="#AAB4C5" fontSize={8} textAnchor="middle" fontFamily="monospace">
              {t}%
            </text>
          </g>
        ))}
        {/* X-axis label */}
        <text x={MARGIN.left + PLOT_W / 2} y={VB_H - 4} fill="#AAB4C5" fontSize={9} textAnchor="middle" fontFamily="monospace">
          Utilization
        </text>

        {/* Y-axis ticks + labels */}
        {Y_TICKS.map((t) => (
          <g key={`yt-${t}`}>
            <line x1={MARGIN.left - 4} y1={scaleY(t)} x2={MARGIN.left} y2={scaleY(t)} stroke="rgba(170,180,197,0.3)" />
            <text x={MARGIN.left - 7} y={scaleY(t) + 3} fill="#AAB4C5" fontSize={8} textAnchor="end" fontFamily="monospace">
              {t}%
            </text>
          </g>
        ))}
        {/* Y-axis label */}
        <text
          x={10}
          y={MARGIN.top + PLOT_H / 2}
          fill="#AAB4C5"
          fontSize={9}
          textAnchor="middle"
          fontFamily="monospace"
          transform={`rotate(-90, 10, ${MARGIN.top + PLOT_H / 2})`}
        >
          Dependency
        </text>

        {/* Data points */}
        {points.map((pt) => {
          const isSelected = selectedEntityId === pt.entityId;
          const isDanger = pt.utilization > 1 && pt.dependency > 0.7;
          const fill = isSelected ? '#4F8CFF' : isDanger ? '#FF4D4F' : '#10B981';
          const r = isSelected ? 7 : 5;
          return (
            <circle
              key={pt.id}
              cx={pt.cx}
              cy={pt.cy}
              r={r}
              fill={fill}
              stroke={isSelected ? '#fff' : 'none'}
              strokeWidth={isSelected ? 1.5 : 0}
              style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
              onMouseEnter={() => setHoveredId(pt.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                if (pt.entityId) {
                  onSelectEntity(selectedEntityId === pt.entityId ? null : pt.entityId);
                }
              }}
            />
          );
        })}

        {/* Tooltip */}
        {hoveredPoint && (() => {
          const tw = 120;
          const th = 48;
          let tx = hoveredPoint.cx + 10;
          let ty = hoveredPoint.cy - th - 6;
          if (tx + tw > VB_W - 4) tx = hoveredPoint.cx - tw - 10;
          if (ty < 4) ty = hoveredPoint.cy + 10;
          return (
            <g>
              <rect x={tx} y={ty} width={tw} height={th} rx={6} fill="#111A2E" stroke="rgba(170,180,197,0.2)" strokeWidth={1} />
              <text x={tx + 8} y={ty + 14} fill="#E6EAF2" fontSize={9} fontWeight="600">
                {hoveredPoint.name}
              </text>
              <text x={tx + 8} y={ty + 27} fill="#AAB4C5" fontSize={8} fontFamily="monospace">
                가동률: {(hoveredPoint.utilization * 100).toFixed(0)}%
              </text>
              <text x={tx + 8} y={ty + 39} fill="#AAB4C5" fontSize={8} fontFamily="monospace">
                의존도: {(hoveredPoint.dependency * 100).toFixed(0)}%
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
