import { clsx } from 'clsx';
import type { MonthlyWorkforceData } from '../../types';

interface WorkforceDetailTableProps {
  data: MonthlyWorkforceData[];
}

function MiniSparkline({ data, width = 60, height = 16 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="inline-block align-middle ml-2" aria-hidden="true">
      <polyline points={points} fill="none" stroke="#4F8CFF" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

export function WorkforceDetailTable({ data }: WorkforceDetailTableProps) {
  const headcountSeries = data.map((m) => m.totalHeadcount);

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-textMain">월별 상세 데이터</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutralGray/20 text-left text-xs text-textSub">
              <th className="py-2 pr-3">월</th>
              <th className="py-2 pr-3">유입</th>
              <th className="py-2 pr-3">유출</th>
              <th className="py-2 pr-3">총 인원</th>
              <th className="py-2 pr-3">예측</th>
              <th className="py-2 pr-3">수급 차이</th>
              <th className="py-2">파이프라인</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m, idx) => {
              const isNegSurplus = m.surplus < 0;
              return (
                <tr
                  key={m.month}
                  className={clsx(
                    'border-b border-neutralGray/10 hover:bg-decisionBlue/5 transition-colors',
                    isNegSurplus && 'border-l-2 border-l-alertRed'
                  )}
                >
                  <td className="py-2 pr-3 text-textMain font-medium font-mono">{m.month}</td>
                  <td className="py-2 pr-3 text-success font-medium">+{m.in}</td>
                  <td className="py-2 pr-3 text-alertRed font-medium">-{m.out}</td>
                  <td className="py-2 pr-3 text-textMain whitespace-nowrap">
                    {m.totalHeadcount.toLocaleString()}
                    <MiniSparkline data={headcountSeries.slice(0, idx + 1)} />
                  </td>
                  <td className="py-2 pr-3 text-textSub">{m.forecast.toLocaleString()}</td>
                  <td className="py-2 pr-3">
                    <span className={clsx('font-medium', m.surplus >= 0 ? 'text-success' : 'text-alertRed')}>
                      {m.surplus >= 0 ? '+' : ''}{m.surplus}
                    </span>
                  </td>
                  <td className="py-2 text-textSub">{m.pipeline}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
