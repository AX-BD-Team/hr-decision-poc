import { useState } from 'react';
import type { MonthlyWorkforceData } from '../../types';

interface WorkforceFlowChartProps {
  data: MonthlyWorkforceData[];
}

const CHART = {
  W: 720,
  H: 300,
  PAD_L: 55,
  PAD_R: 20,
  PAD_T: 30,
  PAD_B: 40,
  MAX_BAR: 60,
} as const;

function scaleY(val: number, max: number) {
  const plotH = CHART.H - CHART.PAD_T - CHART.PAD_B;
  return CHART.H - CHART.PAD_B - (val / max) * plotH;
}

function scaleX(idx: number, count: number) {
  const plotW = CHART.W - CHART.PAD_L - CHART.PAD_R;
  const step = plotW / count;
  return CHART.PAD_L + idx * step + step / 2;
}

export function WorkforceFlowChart({ data }: WorkforceFlowChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const maxBar = CHART.MAX_BAR;
  const barW = 14;
  const gap = 3;
  const groupW = barW * 2 + gap;

  // Headcount range for line overlay
  const hcMin = Math.min(...data.map((d) => d.totalHeadcount));
  const hcMax = Math.max(...data.map((d) => d.totalHeadcount));
  const fcMax = Math.max(...data.map((d) => d.forecast));
  const lineMax = Math.max(hcMax, fcMax) * 1.05;
  const lineMin = hcMin * 0.95;

  function lineY(val: number) {
    const plotH = CHART.H - CHART.PAD_T - CHART.PAD_B;
    return CHART.H - CHART.PAD_B - ((val - lineMin) / (lineMax - lineMin)) * plotH;
  }

  // Polyline paths
  const actualPoints = data.map((d, i) => `${scaleX(i, data.length)},${lineY(d.totalHeadcount)}`).join(' ');
  const forecastPoints = data.map((d, i) => `${scaleX(i, data.length)},${lineY(d.forecast)}`).join(' ');

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-textMain">월별 인력 흐름</h3>
        <div className="flex items-center gap-4 text-micro text-textSub">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-success/80" /> 유입
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-alertRed/80" /> 유출
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 h-0.5 bg-decisionBlue" /> 총인원
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 h-0.5 border-t-2 border-dashed border-warning" /> 예측
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART.W} ${CHART.H}`}
          className="w-full min-w-[600px]"
          role="img"
          aria-label="월별 인력 흐름 차트"
          onMouseLeave={() => setHoverIdx(null)}
        >
          {/* Y axis grid */}
          {[0, 15, 30, 45, 60].map((v) => {
            const y = scaleY(v, maxBar);
            return (
              <g key={v}>
                <line x1={CHART.PAD_L} y1={y} x2={CHART.W - CHART.PAD_R} y2={y} stroke="#334155" strokeWidth={0.5} strokeDasharray="4 4" />
                <text x={CHART.PAD_L - 8} y={y + 4} textAnchor="end" fill="#AAB4C5" fontSize={9}>{v}</text>
              </g>
            );
          })}

          {/* Bars per month */}
          {data.map((m, idx) => {
            const cx = scaleX(idx, data.length);
            const bx = cx - groupW / 2;
            const inH = (m.in / maxBar) * (CHART.H - CHART.PAD_T - CHART.PAD_B);
            const outH = (m.out / maxBar) * (CHART.H - CHART.PAD_T - CHART.PAD_B);
            const baseY = CHART.H - CHART.PAD_B;
            const monthLabel = m.month.split('-')[1];

            return (
              <g
                key={m.month}
                onMouseEnter={() => setHoverIdx(idx)}
                className="cursor-crosshair"
              >
                {/* Hover hit area */}
                <rect
                  x={cx - 26}
                  y={CHART.PAD_T}
                  width={52}
                  height={CHART.H - CHART.PAD_T - CHART.PAD_B}
                  fill="transparent"
                />
                {/* In bar */}
                <rect x={bx} y={baseY - inH} width={barW} height={inH} fill="#34D399" rx={2} opacity={hoverIdx === idx ? 1 : 0.75} className="transition-opacity" />
                {/* Out bar */}
                <rect x={bx + barW + gap} y={baseY - outH} width={barW} height={outH} fill="#FF4D4F" rx={2} opacity={hoverIdx === idx ? 1 : 0.75} className="transition-opacity" />
                {/* Month label */}
                <text x={cx} y={CHART.H - CHART.PAD_B + 16} textAnchor="middle" fill="#AAB4C5" fontSize={10}>
                  {monthLabel}월
                </text>
              </g>
            );
          })}

          {/* Actual headcount line */}
          <polyline
            points={actualPoints}
            fill="none"
            stroke="#4F8CFF"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {data.map((d, i) => (
            <circle key={`a-${i}`} cx={scaleX(i, data.length)} cy={lineY(d.totalHeadcount)} r={hoverIdx === i ? 4 : 2.5} fill="#4F8CFF" className="transition-all" />
          ))}

          {/* Forecast line (dashed) */}
          <polyline
            points={forecastPoints}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            strokeLinejoin="round"
          />
          {data.map((d, i) => (
            <circle key={`f-${i}`} cx={scaleX(i, data.length)} cy={lineY(d.forecast)} r={hoverIdx === i ? 3.5 : 2} fill="#F59E0B" className="transition-all" />
          ))}

          {/* Hover crosshair + tooltip */}
          {hoverIdx !== null && (() => {
            const m = data[hoverIdx];
            const cx = scaleX(hoverIdx, data.length);
            const tooltipW = 140;
            const tooltipH = 88;
            let tx = cx + 12;
            if (tx + tooltipW > CHART.W - 10) tx = cx - tooltipW - 12;
            const ty = CHART.PAD_T + 10;

            return (
              <g>
                <line x1={cx} y1={CHART.PAD_T} x2={cx} y2={CHART.H - CHART.PAD_B} stroke="#4F8CFF" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={8} fill="rgba(17,26,46,0.95)" stroke="rgba(79,140,255,0.3)" strokeWidth={1} />
                <text x={tx + 10} y={ty + 18} fill="#E6EAF2" fontSize={11} fontWeight="600">{m.month}</text>
                <text x={tx + 10} y={ty + 35} fill="#34D399" fontSize={10}>유입: +{m.in}</text>
                <text x={tx + 10} y={ty + 50} fill="#FF4D4F" fontSize={10}>유출: -{m.out}</text>
                <text x={tx + 10} y={ty + 65} fill="#4F8CFF" fontSize={10}>총인원: {m.totalHeadcount.toLocaleString()}</text>
                <text x={tx + 10} y={ty + 80} fill="#F59E0B" fontSize={10}>예측: {m.forecast.toLocaleString()}</text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
