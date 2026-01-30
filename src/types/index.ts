// 페이지 라우팅
export type PageId = 'workflow' | 'dashboard' | 'docs';

// 데이터 라벨 타입
export type DataLabel = 'REAL' | 'MOCK' | 'ESTIMATE' | 'SYNTH';

// 데이터 소스
export interface DataSource {
  id: string;
  name: string;
  type: 'hr_master' | 'tms' | 'rr' | 'bizforce' | 'vrb' | 'opex' | 'assignment_history' | 'to_request' | 'training_history' | 'competency_model' | 'work_allocation';
  label: DataLabel;
  description: string;
  coverage: number; // 0-100%
  fields: string[];
  readiness?: 'available' | 'recommended' | 'missing' | 'undefined_rules';
  readinessNote?: string;
}

// 엔티티 타입
export type EntityType = 'person' | 'role' | 'task' | 'org' | 'risk' | 'cost' | 'project' | 'capability' | 'stage' | 'training_program';

// 엔티티 (Ontology Graph 노드)
export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  label: DataLabel;
  properties: Record<string, unknown>;
  // 위치 정보 (ReactFlow용)
  position?: { x: number; y: number };
}

// 엣지 타입
export type EdgeType =
  | 'depends_on'
  | 'covers'
  | 'bottleneck'
  | 'overlap'
  | 'cost_supports'
  | 'risk_of'
  | 'belongs_to'
  | 'assigned_to'
  | 'requires_capability'
  | 'trains_for'
  | 'part_of_stage'
  | 'duplicates';

// 엣지 (관계)
export interface Edge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label: DataLabel;
  weight?: number;
}

// 가정 (Assumption)
export interface Assumption {
  id: string;
  text: string;
  category: 'data' | 'logic' | 'scope';
  relatedPaths: string[];
}

// 근거 (Evidence)
export interface Evidence {
  id: string;
  text: string;
  source: string;
  label: DataLabel;
  relatedPaths: string[];
}

// 리스크 신호
export interface RiskSignal {
  id: string;
  text: string;
  severity: 'high' | 'medium' | 'low';
  label: DataLabel;
  relatedEntityIds: string[];
  relatedPaths: string[];
}

// 의사결정 경로 (A/B/C)
export interface DecisionPath {
  id: string;
  name: string;
  summary: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  effectLevel: 'high' | 'medium' | 'low';
  keyMetrics: {
    name: string;
    value: string;
    change?: string;
    changeIsPositive?: boolean;
    label: DataLabel;
  }[];
  highlights: string[];
  relatedEntityIds?: string[];
  limitations?: string;
}

// KPI 카드
export interface HRKpi {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  change?: string;
  higherIsBetter?: boolean;
  label: DataLabel;
}

// Utilization Map 데이터 포인트
export interface UtilizationPoint {
  id: string;
  name: string;
  dependency: number; // 0-1
  utilization: number; // 0-1
  label: DataLabel;
  entityId?: string;
}

// Context Insight
export interface ContextInsight {
  id: string;
  text: string;
  severity: 'info' | 'warning' | 'critical';
  label: DataLabel;
}

// HR Context View 데이터
export interface HRContextView {
  id: string;
  scope: string;
  kpis: HRKpi[];
  utilizationMap: UtilizationPoint[];
  insights: ContextInsight[];
}

// 분석 패턴 (Zone 2)
export interface AnalysisPattern {
  id: string;
  name: string;
  description: string;
  type: 'gap_analysis' | 'dependency' | 'bottleneck' | 'cost_impact' | 'role_overlap' | 'capability_gap' | 'stage_readiness';
  label: DataLabel;
  severity: 'critical' | 'high' | 'medium' | 'low';
  metric: { name: string; value: string; label: DataLabel };
  findings: string[];
  affectedScope: { count: number; unit: string };
}

// 의사결정 기준
export interface DecisionCriterion {
  id: string;
  text: string;
  description: string;
  evidenceCount: number;
}

// 데모 스텝 설명 (시나리오별 배너 텍스트)
export interface DemoStepDescription {
  step: number;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
}

// 데모 시나리오 메타데이터
export interface ScenarioMeta {
  id: string;
  name: string;
  description: string;
  keyQuestion: string;
  badge?: 'TO' | 'R&R' | 'Phase-2' | 'HRD';
  decisionCriteria?: DecisionCriterion[];
  demoSteps?: DemoStepDescription[];
}

// 전체 데모 데이터
export interface DemoData {
  meta: ScenarioMeta;
  dataSources: DataSource[];
  analysisPatterns: AnalysisPattern[];
  entities: Entity[];
  edges: Edge[];
  assumptions: Assumption[];
  evidence: Evidence[];
  riskSignals: RiskSignal[];
  decisionPaths: DecisionPath[];
  hrContextViews: HRContextView[];
}

// Guided Tour Step
export interface TourStep {
  id: number;
  target: string; // data-tour attribute selector
  titleKo: string;
  titleEn: string;
  contentKo: string;
  contentEn: string;
  action?: 'HIGHLIGHT_ZONE' | 'SELECT_NODE' | 'SELECT_PATH' | 'OPEN_DOCK_TAB' | 'SHOW_REPORT';
  actionPayload?: unknown;
}

// App Mode
export type AppMode = 'OVERVIEW' | 'GUIDED_DEMO' | 'DRILLDOWN';

// Theme
export type Theme = 'dark' | 'light';

// Locale
export type Locale = 'ko' | 'en';

// Bottom Dock (primary)
export type DockSection = 'paths' | 'record' | 'structuring' | 'context';

// Decision Record Tabs (secondary)
export type RecordTab = 'assumptions' | 'evidence' | 'risks' | 'alternatives' | 'report';

// Dashboard 데이터 타입
export interface DashboardKpi {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeIsPositive?: boolean;
}

export interface HeadcountSummary {
  total: number;
  newTMTarget: number;
  projectUtilRate: number;
  avgTenure: number;
  avgSkillLevel: string;
}

export interface ProjectStatusItem {
  status: string;
  count: number;
  color: string;
}

export interface SkillTreemapItem {
  name: string;
  value: number;
  color: string;
}

export interface TalentRow {
  id: string;
  name: string;
  rank: string;
  role: string;
  skillLevel: string;
  evalGrade: string;
  department: string;
}

export interface MonthlyWorkforceData {
  month: string;
  in: number;
  out: number;
  forecast: number;
  surplus: number;
  totalHeadcount: number;
  pipeline: number;
}

export interface DashboardData {
  resourceAllocation: {
    kpis: DashboardKpi[];
    headcount: HeadcountSummary;
    projectStatus: ProjectStatusItem[];
    skillTreemap: SkillTreemapItem[];
  };
  talentInfo: {
    kpis: DashboardKpi[];
    talentTable: TalentRow[];
    skillTreemap: SkillTreemapItem[];
  };
  workforceForecast: {
    monthly: MonthlyWorkforceData[];
  };
}

// 프로젝트 보드 타입
export type BoardStatus = 'todo' | 'in_progress' | 'done';
export type BoardPriority = 'P0' | 'P1' | 'P2';
export type BoardSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface ProjectItem {
  id: string;
  title: string;
  status: BoardStatus;
  priority: BoardPriority;
  size: BoardSize;
  assignees: string[];
  labels: string[];
  startDate?: string;
  targetDate?: string;
}

// 문서 메타데이터
export interface DocMeta {
  id: string;
  filename: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  fileSize: string;
}
