import { useState } from 'react';
import { LayoutDashboard, PieChart, Users, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { KpiCardGrid } from './KpiCardGrid';
import { ProjectStatusChart } from './ProjectStatusChart';
import { SkillTreemap } from './SkillTreemap';
import { TalentTable } from './TalentTable';
import { WorkforceFlowChart } from './WorkforceFlowChart';
import { WorkforceDetailTable } from './WorkforceDetailTable';
import dashboardData from '../../data/dashboard-data.json';
import type { DashboardData } from '../../types';
import { useT } from '../../i18n';

const data = dashboardData as DashboardData;

type TabId = 'resourceAllocation' | 'talentInfo' | 'workforceForecast';

const tabKeys: { id: TabId; labelKey: string; icon: typeof PieChart }[] = [
  { id: 'resourceAllocation', labelKey: 'dashboard.tabResourceAllocation', icon: PieChart },
  { id: 'talentInfo', labelKey: 'dashboard.tabTalentInfo', icon: Users },
  { id: 'workforceForecast', labelKey: 'dashboard.tabWorkforceForecast', icon: TrendingUp },
];

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('resourceAllocation');
  const t = useT();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-decisionBlue" aria-hidden="true" />
        <div>
          <h1 className="text-lg font-semibold text-textMain">{t('dashboard.title')}</h1>
          <p className="text-xs text-textSub">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-1 border-b border-neutralGray/20">
        {tabKeys.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-decisionBlue text-decisionBlue'
                  : 'border-transparent text-textSub hover:text-textMain hover:border-neutralGray/40'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Tab content with fade-in-up animation via key */}
      <div key={activeTab} className="animate-fade-in-up">
        {activeTab === 'resourceAllocation' && (
          <div className="space-y-6">
            <KpiCardGrid kpis={data.resourceAllocation.kpis} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProjectStatusChart data={data.resourceAllocation.projectStatus} />
              <SkillTreemap data={data.resourceAllocation.skillTreemap} title={t('dashboard.skillTreemapResource')} />
            </div>
          </div>
        )}

        {activeTab === 'talentInfo' && (
          <div className="space-y-6">
            <KpiCardGrid kpis={data.talentInfo.kpis} />
            <SkillTreemap data={data.talentInfo.skillTreemap} title={t('dashboard.skillTreemapTalent')} />
            <TalentTable data={data.talentInfo.talentTable} />
          </div>
        )}

        {activeTab === 'workforceForecast' && (
          <div className="space-y-6">
            <WorkforceFlowChart data={data.workforceForecast.monthly} />
            <WorkforceDetailTable data={data.workforceForecast.monthly} />
          </div>
        )}
      </div>
    </div>
  );
}
