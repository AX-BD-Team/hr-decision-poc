import type { ProjectStatusItem } from '../../types';

interface ProjectStatusChartProps {
  data: ProjectStatusItem[];
}

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-textMain">프로젝트 현황</h3>

      {/* 도넛 차트 */}
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 120 120" className="w-28 h-28 flex-shrink-0" aria-label="프로젝트 현황 도넛 차트">
          {(() => {
            let cumAngle = 0;
            return data.map((item) => {
              const angle = (item.count / total) * 360;
              const startAngle = cumAngle;
              cumAngle += angle;

              const r = 50;
              const cx = 60;
              const cy = 60;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((startAngle + angle - 90) * Math.PI) / 180;
              const largeArc = angle > 180 ? 1 : 0;

              const x1 = cx + r * Math.cos(startRad);
              const y1 = cy + r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad);
              const y2 = cy + r * Math.sin(endRad);

              return (
                <path
                  key={item.status}
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  opacity={0.85}
                  stroke="#111A2E"
                  strokeWidth={2}
                />
              );
            });
          })()}
          <circle cx={60} cy={60} r={28} fill="#111A2E" />
          <text x={60} y={57} textAnchor="middle" fill="#E6EAF2" fontSize={18} fontWeight="bold">
            {total}
          </text>
          <text x={60} y={72} textAnchor="middle" fill="#AAB4C5" fontSize={9}>
            전체 프로젝트
          </text>
        </svg>

        <div className="space-y-2 flex-1">
          {data.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-textSub">{item.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-textMain">{item.count}</span>
                <span className="text-micro text-textSub">
                  ({((item.count / total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
