import type { DemoData } from '../types';
import demoS1 from './demo-s1.json';
import { validateAllScenarios } from './validateScenario';

const base = demoS1 as DemoData;

const s1 = structuredClone(base) as DemoData;

const s2 = structuredClone(s1) as DemoData;
s2.meta = {
  id: 's2',
  name: '조직 인력 OPEX 절감(안)',
  description: '비용 제약 하에서 핵심 역할 커버리지를 유지하는 대안 탐색',
  keyQuestion: 'OPEX 10% 감축 조건에서 핵심 프로젝트 수행이 가능한가?',
};
s2.dataSources = s1.dataSources.map((ds) => {
  if (ds.id === 'ds-opex-range') return { ...ds, label: 'REAL' as const, coverage: 92, description: '운영비용 범위(재무 기준) · as of: 2026-01-01' };
  if (ds.id === 'ds-project-task') return { ...ds, coverage: 62, description: 'PM 툴 기반 과제/작업(추정치 포함) · 갱신: 2026-01-10' };
  return ds;
});
s2.entities = (s1.entities
  .map((e) => {
    if (e.id === 'proj-q2') return { ...e, name: 'Q2 신규 프로젝트(예산 제한)', label: 'REAL' as const };
    if (e.id === 'cost-hiring') return { ...e, name: 'OPEX 절감/대체 비용', properties: { amount: '120M', type: 'mixed' } };
    return e;
  })
  .concat([
    {
      id: 'cost-opex-cut',
      type: 'cost' as const,
      name: 'OPEX 10% 감축 목표',
      label: 'REAL' as const,
      properties: { amount: '-120M', type: 'target' },
      position: { x: 820, y: 360 },
    },
  ])) as DemoData['entities'];
s2.edges = (s1.edges
  .map((ed) => (ed.id === 'e11' ? { ...ed, source: 'cost-opex-cut', label: 'REAL' as const } : ed))
  .concat([
    { id: 'e12', source: 'cost-opex-cut', target: 'proj-q2', type: 'cost_supports' as const, label: 'REAL' as const, weight: 0.8 },
  ])) as DemoData['edges'];
s2.assumptions = s1.assumptions.map((a) =>
  a.id === 'asm-1'
    ? { ...a, text: '예산 감축(10%) 조건을 우선 제약으로 적용', category: 'scope' }
    : a
);
s2.evidence = s1.evidence.map((ev) =>
  ev.id === 'evd-5'
    ? { ...ev, text: '재무 기준 OPEX 3개월 평균 대비 10% 감축 목표', source: 'Finance', label: 'REAL' as const }
    : ev
);
s2.riskSignals = (s1.riskSignals
  .map((r) =>
    r.id === 'risk-2'
      ? { ...r, text: '감축 목표 달성 시 외부 채용/외주 옵션 제한', severity: 'high' as const, label: 'REAL' as const }
      : r
  )
  .concat([
    {
      id: 'risk-4',
      text: '예산 감축으로 핵심 역할 커버리지 부족 가능성',
      severity: 'medium' as const,
      label: 'SYNTH' as const,
      relatedEntityIds: ['cost-opex-cut', 'role-arch'],
      relatedPaths: ['path-a', 'path-b', 'path-c'],
    },
  ])) as DemoData['riskSignals'];
s2.decisionPaths = s1.decisionPaths.map((p) => {
  if (p.id === 'path-a') return { ...p, keyMetrics: [{ name: 'Score', value: '70/100', label: 'SYNTH' as const }, { name: '예상 비용', value: '0~10M', label: 'ESTIMATE' as const }, { name: '소요 기간', value: '즉시', label: 'REAL' as const }] };
  if (p.id === 'path-b') return { ...p, keyMetrics: [{ name: 'Score', value: '78/100', label: 'SYNTH' as const }, { name: '예상 비용', value: '10~40M', label: 'ESTIMATE' as const }, { name: '소요 기간', value: '2~4주', label: 'ESTIMATE' as const }] };
  if (p.id === 'path-c') return { ...p, keyMetrics: [{ name: 'Score', value: '64/100', label: 'SYNTH' as const }, { name: '예상 비용', value: '40~90M', label: 'ESTIMATE' as const }, { name: '소요 기간', value: '4~10주', label: 'ESTIMATE' as const }] };
  return p;
});
s2.hrContextViews = s1.hrContextViews.map((v) => ({
  ...v,
  kpis: v.kpis.map((k) =>
    k.id === 'kpi-4'
      ? { ...k, value: 68, change: '-17%', label: 'ESTIMATE' as const }
      : k
  ),
  insights: [
    ...v.insights,
    { id: 'ins-4', text: 'OPEX 10% 감축 목표 적용 시 외부 채용 옵션 제한', severity: 'warning' as const, label: 'REAL' as const },
  ],
}));

const s3 = structuredClone(s1) as DemoData;
s3.meta = {
  id: 's3',
  name: '핵심 인력 병목 완화',
  description: '특정 인력에 집중된 의존도를 낮추는 구조 재설계',
  keyQuestion: '병목 인력을 완화하면서 일정 리스크를 최소화할 수 있는가?',
};
s3.dataSources = s1.dataSources.map((ds) => {
  if (ds.id === 'ds-hr-master') return { ...ds, coverage: 97, description: 'HRIS 기반 인사 데이터(스킬 태깅 보강) · 갱신: 2026-01-15' };
  if (ds.id === 'ds-project-task') return { ...ds, coverage: 84, label: 'REAL' as const, description: 'PM 툴 기반 과제/작업(실적 기반) · 갱신: 2026-01-10' };
  return ds;
});
s3.entities = (s1.entities
  .map((e) => {
    if (e.id === 'person-a') {
      return {
        ...e,
        properties: { ...(e.properties || {}), utilization: 1.35 },
        name: '김A (아키텍트, 병목)',
      };
    }
    if (e.id === 'risk-bottleneck') return { ...e, label: 'REAL' as const, properties: { severity: 'high', probability: 0.9 } };
    return e;
  })
  .concat([
    {
      id: 'person-e',
      type: 'person' as const,
      name: '정E (시니어, 후보)',
      label: 'ESTIMATE' as const,
      properties: { tenure: 30, utilization: 0.78, skills: ['설계', '리뷰'] },
      position: { x: 520, y: 60 },
    },
  ])) as DemoData['entities'];
s3.edges = s1.edges
  .concat([
    { id: 'e13', source: 'role-arch', target: 'person-e', type: 'assigned_to' as const, label: 'ESTIMATE' as const },
    { id: 'e14', source: 'person-e', target: 'risk-bottleneck', type: 'bottleneck' as const, label: 'ESTIMATE' as const, weight: 0.6 },
  ]) as DemoData['edges'];
s3.assumptions = s1.assumptions.map((a) =>
  a.id === 'asm-4' ? { ...a, text: '후보 인력(정E) 전환 시 4주 러닝커브 가정', category: 'logic', relatedPaths: ['path-b'] } : a
);
s3.evidence = s1.evidence.map((ev) =>
  ev.id === 'evd-1' ? { ...ev, text: '김A 아키텍트 가동률 135% (최근 4주 평균)', source: 'TMS', label: 'REAL' as const } : ev
);
s3.riskSignals = s1.riskSignals.map((r) =>
  r.id === 'risk-1' ? { ...r, text: '병목 인력 단일 실패 지점(SPOF)로 일정 리스크 증가', label: 'REAL' as const } : r
);
s3.decisionPaths = s1.decisionPaths.map((p) => {
  if (p.id === 'path-a') return { ...p, keyMetrics: [{ name: 'Score', value: '74/100', label: 'SYNTH' as const }, { name: '예상 비용', value: '0~20M', label: 'ESTIMATE' as const }, { name: '소요 기간', value: '1~2주', label: 'ESTIMATE' as const }] };
  if (p.id === 'path-b') return { ...p, keyMetrics: [{ name: 'Score', value: '86/100', label: 'SYNTH' as const }, { name: '예상 비용', value: '20~60M', label: 'ESTIMATE' as const }, { name: '소요 기간', value: '2~6주', label: 'ESTIMATE' as const }] };
  if (p.id === 'path-c') return { ...p, keyMetrics: [{ name: 'Score', value: '72/100', label: 'SYNTH' as const }, { name: '예상 비용', value: '60~140M', label: 'ESTIMATE' as const }, { name: '소요 기간', value: '6~12주', label: 'ESTIMATE' as const }] };
  return p;
});
s3.hrContextViews = s1.hrContextViews.map((v) => ({
  ...v,
  utilizationMap: v.utilizationMap.map((u) =>
    u.entityId === 'person-a'
      ? { ...u, utilization: 1.35, dependency: 0.95, label: 'REAL' as const }
      : u
  ),
  insights: v.insights.map((ins) =>
    ins.id === 'ins-2'
      ? { ...ins, text: '김A 가동률 135% - 병목 심각 (SPOF)', severity: 'critical' as const, label: 'REAL' as const }
      : ins
  ),
}));

export const scenarioDataById: Record<string, DemoData> = {
  [s1.meta.id]: s1,
  s2,
  s3,
};

export const scenarioMetas = [s1.meta, s2.meta, s3.meta];

validateAllScenarios(scenarioDataById);

