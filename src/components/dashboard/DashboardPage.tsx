import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';
import { KpiCardGrid } from './KpiCardGrid';
import { ProjectStatusChart } from './ProjectStatusChart';
import { SkillTreemap } from './SkillTreemap';
import dashboardData from '../../data/dashboard-data.json';
import type { DashboardData } from '../../types';

const data = dashboardData as DashboardData;

type TabId = 'resourceAllocation' | 'talentInfo' | 'workforceForecast';

const tabs: { id: TabId; label: string }[] = [
  { id: 'resourceAllocation', label: '자원 배분' },
  { id: 'talentInfo', label: '인재 정보' },
  { id: 'workforceForecast', label: '인력 예측' },
];

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('resourceAllocation');

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-decisionBlue" aria-hidden="true" />
        <div>
          <h1 className="text-lg font-semibold text-textMain">HR 대시보드</h1>
          <p className="text-xs text-textSub">인력 현황, 프로젝트 배분, 스킬 분포를 한눈에 확인합니다.</p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-1 border-b border-neutralGray/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-decisionBlue text-decisionBlue'
                : 'border-transparent text-textSub hover:text-textMain hover:border-neutralGray/40'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 자원 배분 탭 */}
      {activeTab === 'resourceAllocation' && (
        <div className="space-y-6">
          <KpiCardGrid kpis={data.resourceAllocation.kpis} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProjectStatusChart data={data.resourceAllocation.projectStatus} />
            <SkillTreemap data={data.resourceAllocation.skillTreemap} title="기술 스킬 분포" />
          </div>
        </div>
      )}

      {/* 인재 정보 탭 */}
      {activeTab === 'talentInfo' && (
        <div className="space-y-6">
          <KpiCardGrid kpis={data.talentInfo.kpis} />
          <SkillTreemap data={data.talentInfo.skillTreemap} title="직무 역량 분포" />

          {/* 인재 테이블 */}
          <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-textMain">핵심 인재 목록</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutralGray/20 text-left text-xs text-textSub">
                    <th className="py-2 pr-3">이름</th>
                    <th className="py-2 pr-3">직급</th>
                    <th className="py-2 pr-3">역할</th>
                    <th className="py-2 pr-3">역량수준</th>
                    <th className="py-2 pr-3">평가등급</th>
                    <th className="py-2">부서</th>
                  </tr>
                </thead>
                <tbody>
                  {data.talentInfo.talentTable.map((row) => (
                    <tr key={row.id} className="border-b border-neutralGray/10 hover:bg-appBg/30">
                      <td className="py-2 pr-3 text-textMain font-medium">{row.name}</td>
                      <td className="py-2 pr-3 text-textSub">{row.rank}</td>
                      <td className="py-2 pr-3 text-textSub">{row.role}</td>
                      <td className="py-2 pr-3">
                        <span className="rounded bg-decisionBlue/15 px-2 py-0.5 text-xs text-decisionBlue font-mono">
                          {row.skillLevel}
                        </span>
                      </td>
                      <td className="py-2 pr-3">
                        <span className={clsx(
                          'rounded px-2 py-0.5 text-xs font-bold',
                          row.evalGrade === 'S' ? 'bg-success/15 text-success' :
                          row.evalGrade === 'A' ? 'bg-decisionBlue/15 text-decisionBlue' :
                          'bg-warning/15 text-warning'
                        )}>
                          {row.evalGrade}
                        </span>
                      </td>
                      <td className="py-2 text-textSub">{row.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 인력 예측 탭 */}
      {activeTab === 'workforceForecast' && (
        <div className="space-y-6">
          {/* 월별 인력 예측 차트 (SVG 바 차트) */}
          <div className="rounded-xl glass-panel border border-neutralGray/20 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-textMain">월별 인력 흐름</h3>
            <div className="overflow-x-auto">
              <svg viewBox="0 0 720 260" className="w-full min-w-[600px]" role="img" aria-label="월별 인력 흐름 차트">
                {/* Y축 기준선 */}
                {[0, 20, 40, 60].map((v) => {
                  const y = 220 - (v / 60) * 200;
                  return (
                    <g key={v}>
                      <line x1={50} y1={y} x2={700} y2={y} stroke="#334155" strokeWidth={0.5} strokeDasharray="4 4" />
                      <text x={45} y={y + 4} textAnchor="end" fill="#AAB4C5" fontSize={10}>{v}</text>
                    </g>
                  );
                })}

                {data.workforceForecast.monthly.map((m, idx) => {
                  const x = 70 + idx * 52;
                  const barW = 16;
                  const maxVal = 60;
                  const inH = (m.in / maxVal) * 200;
                  const outH = (m.out / maxVal) * 200;
                  const monthLabel = m.month.split('-')[1];

                  return (
                    <g key={m.month}>
                      {/* 유입 바 */}
                      <rect x={x} y={220 - inH} width={barW} height={inH} fill="#34D399" rx={2} opacity={0.8} />
                      {/* 유출 바 */}
                      <rect x={x + barW + 2} y={220 - outH} width={barW} height={outH} fill="#FF4D4F" rx={2} opacity={0.8} />
                      {/* 월 라벨 */}
                      <text x={x + barW} y={240} textAnchor="middle" fill="#AAB4C5" fontSize={10}>
                        {monthLabel}월
                      </text>
                    </g>
                  );
                })}

                {/* 범례 */}
                <rect x={580} y={5} width={10} height={10} fill="#34D399" rx={2} />
                <text x={595} y={14} fill="#AAB4C5" fontSize={10}>유입</text>
                <rect x={630} y={5} width={10} height={10} fill="#FF4D4F" rx={2} />
                <text x={645} y={14} fill="#AAB4C5" fontSize={10}>유출</text>
              </svg>
            </div>
          </div>

          {/* 인력 예측 테이블 */}
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
                  {data.workforceForecast.monthly.map((m) => (
                    <tr key={m.month} className="border-b border-neutralGray/10 hover:bg-appBg/30">
                      <td className="py-2 pr-3 text-textMain font-medium font-mono">{m.month}</td>
                      <td className="py-2 pr-3 text-success font-medium">+{m.in}</td>
                      <td className="py-2 pr-3 text-alertRed font-medium">-{m.out}</td>
                      <td className="py-2 pr-3 text-textMain">{m.totalHeadcount.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-textSub">{m.forecast.toLocaleString()}</td>
                      <td className="py-2 pr-3">
                        <span className={clsx(
                          'font-medium',
                          m.surplus >= 0 ? 'text-success' : 'text-alertRed'
                        )}>
                          {m.surplus >= 0 ? '+' : ''}{m.surplus}
                        </span>
                      </td>
                      <td className="py-2 text-textSub">{m.pipeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
