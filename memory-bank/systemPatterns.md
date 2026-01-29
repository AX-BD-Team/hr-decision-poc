# System Patterns

## 페이지 라우팅 패턴

```typescript
// Zustand 기반 클라이언트 라우팅 (React Router 미사용)
type PageId = 'workflow' | 'dashboard' | 'docs';

// useStore.ts
activePage: PageId;
setActivePage: (page: PageId) => void;

// App.tsx — 조건부 렌더링
{activePage === 'workflow' && <WorkflowLayout />}
{activePage === 'dashboard' && <Suspense><DashboardPage /></Suspense>}
{activePage === 'docs' && <Suspense><DocsPage /></Suspense>}

// PageNav.tsx — 탭 네비게이션 (Header 내부)
// border-b-2 active indicator, aria-current="page"
```

## 대시보드 SVG 차트 패턴

외부 차트 라이브러리 없이 순수 SVG로 구현:
- **도넛 차트** (`ProjectStatusChart.tsx`) — stroke 기반 도넛 (`<circle>` strokeDasharray/offset), 범례↔arc 호버 dim/highlight 연동, 중앙 텍스트 동적 업데이트
- **트리맵** (`SkillTreemap.tsx`) — Squarified treemap, 커서 추적 플로팅 툴팁 (SVG rect+text), white stroke 하이라이트
- **그룹 바 + 라인 차트** (`WorkforceFlowChart.tsx`) — 유입/유출 그룹 바 + totalHeadcount polyline + forecast 점선, 호버 크로스헤어 + glass 툴팁

### 대시보드 테이블 패턴
- **TalentTable** — 로컬 state 정렬 (sortKey/sortDir), 드롭다운 필터, 역량수준/평가등급 뱃지 색상 분기
- **WorkforceDetailTable** — surplus 음수 행에 `border-l-2 border-l-alertRed`, 인라인 미니 스파크라인 (SVG polyline, 60x16)

## 레이아웃 구조

```
┌──────────────────────────────────────────────────────────────┐
│  Header (sticky top-0 z-50 glass-header)                     │
│  Step Navigator + Scenario Dropdown + Controls               │
├──────────────────────────────────────────────────────────────┤
│  max-w-[1440px] mx-auto px-4 pb-10                           │
│                                                              │
│  ┌─────────────┬──────────────────────────────────────────┐  │
│  │ Zone 1:     │ Zone 3:                                  │  │
│  │ Data        │ Graph (animate-stagger-2)                │  │
│  │ Ingestion   │                                          │  │
│  │ (360px)     │ (1fr)                                    │  │
│  ├─────────────┼──────────────────────────────────────────┤  │
│  │ Zone 2:     │ Zone 4:                                  │  │
│  │ Structuring │ Decision Paths                           │  │
│  │ (360px)     │ (1fr)                                    │  │
│  └─────────────┴──────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ DecisionRecordSection (full width)                       ││
│  │ Explainability & Decision Record                         ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

- 최상위: `min-h-screen bg-appBg cmd-grid-bg text-textMain`
- Header: `sticky top-0 z-50 glass-header`
- 메인 영역: `mx-auto w-full max-w-[1440px] px-4 pb-10`
- Zone 그리드: `grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]`
- 각 섹션: `id="section-*"` + `scroll-mt-32` (smooth scroll 타겟)

## Zustand 스토어 구조

```typescript
interface AppState {
  // 데이터
  data: DemoData;
  scenarioId: string;
  loadingPhase: number;              // 0=idle, 1~4=zone skeleton, 5=all reveal
  _loadingAbortId: number;           // 시나리오 전환 abort 지원

  // UI 상태
  mode: AppMode;                     // 'OVERVIEW' | 'GUIDED_DEMO' | 'DRILLDOWN'
  activeStep: number;                // 1~4 (현재 활성 Zone)
  selectedEntityId: string | null;
  selectedPathId: string | null;
  dockSection: DockSection;          // 'paths' | 'record' | 'structuring' | 'context'
  recordTab: RecordTab;              // 'assumptions' | 'evidence' | 'risks' | 'alternatives' | 'report'
  isDockExpanded: boolean;
  dockHeight: number;                // 리사이즈 가능 (220~560px)
  isContextSidebarOpen: boolean;     // HR Context 사이드바 토글

  // 투어 상태
  isTourActive: boolean;
  tourStep: number;

  // 데모 자동재생 (TourOverlay 없이 Zone 하이라이팅만)
  isDemoRunning: boolean;

  // 액션
  setScenario, setMode, setActiveStep, selectEntity, selectPath,
  setDockSection, setRecordTab, setDockExpanded, setDockHeight,
  toggleDock, toggleContextSidebar,
  startTour, nextTourStep, prevTourStep, endTour,
  startDemo, stopDemo, reset
}
```

## Zone 컴포넌트 패턴

### 활성/비활성 스타일링
```tsx
const isActive = activeStep === ZONE_NUMBER;
const { isTourActive, isDemoRunning } = useStore();

className={clsx(
  'rounded-xl border p-4 transition-all',
  isActive
    ? clsx('border-zoneAccent/70 bg-zoneAccent/10 shadow-glow-accent', (isDemoRunning || isTourActive) && 'zone-pulse-color')
    : 'border-neutralGray/20 bg-panelBg/50'
)}
// zone-pulse-{blue|violet|cyan|amber}: demo/tour 활성 시 glow 펄스 애니메이션
```

### Named Export 패턴
```tsx
export function ZoneName() { ... }  // default export 대신 named export 사용
```

### Variant 패턴 (Zone/Dock 공용)
```tsx
export function ZoneDecisionPaths({ variant = 'zone' }: { variant?: 'zone' | 'dock' }) {
  // variant에 따라 wrapper 스타일 분기
}
```

## Dock 구조 (2레벨 탭)

```
Dock
├── DockSection: paths      → ZoneDecisionPaths (variant='dock')
├── DockSection: record     → RecordTab 5개 (evidence/assumptions/risks/alternatives/report)
│                              └── DockContent 컴포넌트
├── DockSection: structuring → ZoneStructuring
└── DockSection: context     → HRContextView
```

- Dock 리사이즈: `onStartResize` (pointer events 기반, 220~560px 클램핑)
- `GripHorizontal` 핸들로 드래그

## DecisionRecordSection

메인 레이아웃에 직접 배치된 독립 섹션:
- RecordTab 5개 (pill 형태 탭 버튼)
- DockContent 렌더링
- Export HTML: scenario meta + selectedPathId → HTML blob 다운로드
- Reset / Generate 버튼

## 시나리오 데이터 패턴

```typescript
// src/data/scenarios.ts — 독립 JSON import 방식
import demoS1 from './demo-s1.json';
import demoS2 from './demo-s2.json';
import demoS3 from './demo-s3.json';

const s1 = demoS1 as DemoData;
const s2 = demoS2 as DemoData;
const s3 = demoS3 as DemoData;

export const scenarioDataById: Record<string, DemoData> = {
  [s1.meta.id]: s1, [s2.meta.id]: s2, [s3.meta.id]: s3,
};
export const scenarioMetas = [s1.meta, s2.meta, s3.meta];
validateAllScenarios(scenarioDataById);

// 이전: structuredClone + mutation 방식 (165줄) → 현재: JSON import (20줄)
// 비개발자가 JSON 파일을 직접 검토/수정 가능
```

## 시나리오 데이터 무결성 검증 패턴

```typescript
// src/data/validateScenario.ts
// ValidationError types: orphan_edge_source | orphan_edge_target | missing_field | orphan_related_path | orphan_related_entity
export function validateScenario(data: DemoData): ValidationError[] {
  // 1. edge.source/target → entity IDs
  // 2. assumption/evidence/riskSignal.relatedPaths → decisionPath IDs
  // 3. decisionPath/riskSignal.relatedEntityIds → entity IDs
  // 4. utilizationMap.entityId → entity IDs
}

export function validateAllScenarios(scenarios: Record<string, DemoData>): void {
  if (import.meta.env.PROD) return; // 프로덕션에서는 스킵
  // 개발 모드에서 console.warn으로 무결성 오류 출력
}

// Vitest 테스트 (71 tests):
// - 구조 완전성, DataLabel 유효성, 메타 고유성, decisionPaths 일관성
// - 참조 무결성 (relatedPaths, relatedEntityIds)
// - Enum 유효성 (EntityType, EdgeType, severity, category, etc.)
// - 값 범위 유효성 (coverage, dependency, weight)
```

## 아이콘 맵 패턴

```tsx
const iconMap: Record<string, LucideIcon> = {
  'type-a': IconA,
  'type-b': IconB,
};
const Icon = iconMap[item.type] || FallbackIcon;
```

## Severity 색상 패턴 (시맨틱 토큰)

```tsx
// 시맨틱 severity 토큰 사용 (tailwind.config.js에 정의)
const severityStyles = {
  high: 'border-severity-high/50 bg-severity-high/10 text-severity-high',
  medium: 'border-severity-medium/50 bg-severity-medium/10 text-warning',
  low: 'border-severity-low/50 bg-severity-low/10 text-success',
};
```

## DataLabel 시스템 (시맨틱 토큰)

```tsx
type DataLabel = 'REAL' | 'MOCK' | 'ESTIMATE' | 'SYNTH';

// label-* 시맨틱 토큰 사용 (tailwind.config.js에 정의)
const labelStyles: Record<DataLabel, string> = {
  REAL: 'bg-label-real/20 text-label-real',
  ESTIMATE: 'bg-label-estimate/20 text-label-estimate',
  MOCK: 'bg-label-mock/20 text-label-mock',
  SYNTH: 'bg-label-synth/20 text-label-synth',
};
```

## 인라인 스타일 색상 상수 패턴

ReactFlow 노드/엣지 등 인라인 style이 필요한 곳에서는 `src/constants/tokens.ts` 상수를 import:
```tsx
import { ENTITY_COLORS, EDGE_COLORS, PANEL_BG, CHART_COLORS } from '../../constants/tokens';
// Tailwind 클래스 대신 인라인 style에서 사용
const baseColor = ENTITY_COLORS[entity.type] || '#666';

// SVG 차트에서는 CHART_COLORS 사용 (CSS 변수 참조로 테마 대응)
<line stroke={CHART_COLORS.gridLine} />
<text fill={CHART_COLORS.textSub} />
<rect fill={CHART_COLORS.tooltipBg} stroke={CHART_COLORS.tooltipBorder} />
```

## CSS 변수 테마 패턴

```css
/* index.css — 다크/라이트 테마 CSS 변수 */
:root, :root[data-theme="dark"] {
  --color-app-bg: #0B1220;
  --color-panel-bg: #111A2E;
  --color-text-main: #E6EAF2;
  --chart-text-sub: #AAB4C5;
  /* ... 50+ CSS 변수 */
}
:root[data-theme="light"] {
  --color-app-bg: #F8FAFC;
  --color-panel-bg: #FFFFFF;
  --color-text-main: #1E293B;
  --chart-text-sub: #64748B;
  /* ... */
}

/* tailwind.config.js — CSS 변수 참조 */
appBg: 'var(--color-app-bg)',
panelBg: 'var(--color-panel-bg)',
textMain: 'var(--color-text-main)',

/* tokens.ts — CHART_COLORS는 CSS 변수 참조 */
export const CHART_COLORS = {
  textSub: 'var(--chart-text-sub)',
  tooltipBg: 'var(--chart-tooltip-bg)',
  // ...
} as const;
```

### 테마 전환 패턴
```tsx
// types/index.ts
export type Theme = 'dark' | 'light';

// store/useStore.ts
theme: getInitialTheme(),  // localStorage에서 복원
toggleTheme: () => {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  return { theme: next };
},

// main.tsx — 초기 적용
document.documentElement.dataset.theme = useStore.getState().theme;
```

## i18n 패턴 (경량 자체 구현)

```typescript
// src/i18n/ko.ts — 한국어 번역 (기본, 타입 정의 원천)
export const ko = {
  common: { appTitle: 'HR 의사결정 지원', reset: '초기화', ... },
  dashboard: { title: 'HR 대시보드', ... },
  zones: { zone1Title: '데이터 수집', ... },
  // 11개 네임스페이스: common, a11y, pages, header, dataLabel, zones, dashboard, dock, record, context, tour, docs, loading
} as const;

// Widen<T> — 리터럴 타입을 string으로 확장 (영어 번역 할당 가능)
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type TranslationKeys = Widen<typeof ko>;

// src/i18n/en.ts — 영어 번역 (TranslationKeys 타입 적용)
export const en: TranslationKeys = { ... };

// src/i18n/index.ts — useT() hook
export function useT() {
  const locale = useStore((s) => s.locale);
  const dict = translations[locale];
  return (key: string) => get(dict, key); // dot-path 해석: 'dashboard.title' → '대시보드'
}

// 컴포넌트에서 사용:
const t = useT();
<h1>{t('dashboard.title')}</h1>
<button aria-label={t('a11y.resetLabel')}>{t('common.reset')}</button>
```

- Locale 상태: `useStore.locale` ('ko' | 'en'), `toggleLocale()`, localStorage 퍼시스턴스
- KO|EN 토글: PageNav + Header 모바일 메뉴
- 데이터 파일(JSON)의 한국어 콘텐츠는 i18n 범위 제외 (UI 라벨만 번역)

## 레이아웃 상수 패턴
```tsx
// src/constants/layout.ts
export const DOCK_COLLAPSED_HEIGHT = 56;
export const DOCK_MIN_HEIGHT = 220;
export const DOCK_MAX_HEIGHT = 560;

// Dock.tsx에서 import하여 사용
const clampHeight = (h: number) => Math.max(DOCK_MIN_HEIGHT, Math.min(DOCK_MAX_HEIGHT, h));
```

## 버튼 유틸리티 클래스 패턴
```css
/* index.css */
.btn-primary { @apply rounded-lg px-4 py-2 text-sm font-medium text-white transition-all; background-color: #4F8CFF; }
.btn-secondary { @apply rounded-lg px-3 py-2 text-sm transition-all; color: var(--color-text-sub); }
.btn-ghost { @apply rounded-lg px-3 py-2 text-sm transition-all; color: var(--color-text-sub); }
/* hover에 color-mix 사용 — CSS 변수와 opacity 호환 */
.btn-secondary:hover { background: color-mix(in srgb, var(--color-app-bg) 50%, transparent); }
```

## 데이터 흐름

```
src/data/demo-s1.json, demo-s2.json, demo-s3.json
  ↓ (import)
src/data/scenarios.ts  (JSON import + type cast + validateAllScenarios)
  ↓ (import)
src/store/useStore.ts  (Zustand store, scenarioId + data)
  ↓ (useStore hook)
Components (각 Zone, Record, Dock에서 필요한 데이터 구독)
```

## ReactFlow 그래프 패턴

- `@xyflow/react` 사용 (v12)
- **Dagre 자동 레이아웃**: `src/utils/layoutGraph.ts` — dagre LR 계층 배치 우선, `entity.position` fallback
- 엔티티 → ReactFlow Node 변환 (dagre 위치 우선, entity.position fallback)
- 엣지 → ReactFlow Edge 변환 (type별 색상/스타일)
- 엔티티 타입별 색상:
  - person → `#10B981` (contextGreen)
  - role → `#3B82F6` (blue)
  - task → `#F59E0B` (amber)
  - org → `#6366F1` (indigo)
  - risk → `#FF4D4F` (alertRed)
  - cost → `#EC4899` (pink)
  - project → `#06B6D4` (cyan)

## 커스텀 색상 토큰 (tailwind.config.js)

### 기본 토큰
| 토큰 | 값 | 용도 |
|------|-----|------|
| `decisionBlue` | #4F8CFF | 주요 액션/선택 |
| `alertRed` | #FF4D4F | 경고/병목 |
| `contextGreen` | #10B981 | HR 컨텍스트 참조 |
| `neutralGray` | #AAB4C5 | 보조 텍스트/경계선 |
| `appBg` | #0B1220 | 메인 배경 |
| `panelBg` | #111A2E | 패널 배경 |
| `textMain` | #E6EAF2 | 주요 텍스트 |
| `textSub` | #AAB4C5 | 보조 텍스트 |
| `zoneIngest` | #3B82F6 | Zone 1 강조 |
| `zoneStruct` | #8B5CF6 | Zone 2 강조 |
| `zoneGraph` | #06B6D4 | Zone 3 강조 |
| `zonePath` | #F59E0B | Zone 4 강조 |

### 시맨틱 토큰 (신규)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `warning` / `warningDark` | #FBBF24 / #F59E0B | 주의 상태 |
| `success` / `successDark` | #34D399 / #10B981 | 양호/성공 상태 |
| `label-{real\|estimate\|mock\|synth}` | 다양 | 데이터 라벨 색상 |
| `entity-{org\|role\|person\|...}` | 다양 | 그래프 엔티티 색상 |
| `assumption-{data\|logic\|scope}` | 다양 | 가정 카테고리 색상 |
| `severity-{critical\|high\|medium\|low\|info}` | 다양 | 심각도 색상 |
| `surface-{0..4}` | 다양 | Surface elevation |

### 커스텀 폰트 크기
| 토큰 | 값 | 용도 |
|------|-----|------|
| `text-mini` | 9px | 최소 라벨 |
| `text-micro` | 10px | 소형 라벨 |
| `text-tiny` | 11px | 배지/보조 텍스트 |

## CSS 유틸리티 클래스 (index.css)

| 클래스 | 용도 |
|--------|------|
| `.cmd-grid-bg` | 도트 그리드 배경 |
| `.glass-panel` | 글래스모피즘 패널 |
| `.glass-header` | 헤더 전용 글래스 (더 불투명) |
| `.zone-card` | 좌측 accent 보더 + hover 효과 |
| `.scan-line-overlay` | Zone 3 스캔라인 애니메이션 |
| `.focus-ring` | 포커스 링 유틸리티 |
| `.scroll-fade-x` | 수평 스크롤 페이드 |
| `.coverage-bar` | 커버리지 바 그래디언트 |
| `.ingest-row-scan` | Zone 1: 행 위 파란 스캔바 pseudo |
| `.struct-beam-line` | Zone 2: 보라 수직 분석 빔 |
| `.graph-edge-draw` | Zone 3: SVG stroke-dashoffset 엣지 애니메이션 |
| `.path-card-flash` | Zone 4: amber 착지 플래시 pseudo |
| `.loading-progress-fill` | 프로그레스바 fill |

## 애니메이션 패턴

- 진입 애니메이션: `opacity-0` 초기 + `animate-stagger-{1-4}` 순차 페이드인
- 사이드바: `animate-slide-in-right`
- 강조 효과: `animate-glow-pulse`
- 박스 그림자: `shadow-glow-{blue|violet|cyan|amber}`
- 스캔라인: `scan-line` 4s linear infinite (Zone 3)
- Phase reveal: `animate-phase-reveal` — `fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both`
- Zone 활성 펄스: `zone-pulse-{blue|violet|cyan|amber}` — `isTourActive` 시 2s ease-in-out infinite glow 펄스, 라이트 테마 별도 CSS 변수

### Zone별 극적 로딩 애니메이션 (시나리오 전환 시)
| Zone | 애니메이션 | 타이밍 |
|------|-----------|--------|
| Zone 1 | 행 슬라이드인 (`ingest-item-in`) + 파란 스캔바 (`ingest-scan`) + 프로그레스바 | ~600ms |
| Zone 2 | 보라 빔 sweep (`struct-beam`) + blur→선명 (`struct-analyze`) + border glow (`struct-glow`) | ~1200ms |
| Zone 3 | SVG 노드 pop-in (`graph-node-pop`) + 펄스 링 (`graph-pulse-ring`) + 엣지 draw (CSS `stroke-dashoffset`) | ~1800ms |
| Zone 4 | 카드 바운스 착지 (`path-card-snap`) + amber flash (`path-landing-flash`) + 카운터 + ready pulse (`path-ready-pulse`) | ~2400ms |

- `SkeletonZone.tsx`는 fallback으로 유지, Zone 컴포넌트에서 특화 Loading 컴포넌트 사용
- `ENTITY_COLORS` 토큰을 Zone 3 SVG 노드에서 inline style로 활용

## React.lazy 코드 분할 패턴

```tsx
// App.tsx — named export를 lazy import하는 패턴
const ZoneGraph = lazy(() =>
  import('./components/zones/ZoneGraph').then(m => ({ default: m.ZoneGraph }))
);

// Suspense fallback: 각 컴포넌트 특성에 맞는 fallback
<Suspense fallback={<LoadingZone3Graph />}>  // ZoneGraph: 스켈레톤
  <ZoneGraph />
</Suspense>

<Suspense fallback={null}>                   // TourOverlay: 숨김
  <TourOverlay />
</Suspense>

<Suspense fallback={<div>불러오는 중...</div>}> // HRContextView: 텍스트
  <HRContextView variant="panel" />
</Suspense>
```

- `vendor-xyflow` manualChunk: `@xyflow/react` + `dagre` 분리 (캐시 효율)
- named export → `.then(m => ({ default: m.X }))` 변환 필수

## Phased Loading 패턴 (순차 분석 애니메이션)

```typescript
// useStore.ts — loadingPhase: 0~5
// 0=idle, 1=Zone1 skeleton, 2=Zone1 reveal+Zone2 skeleton, ...
// 5=all reveal (Record 포함), → 0=idle 복귀
// _loadingAbortId: 빠른 시나리오 전환 시 stale setTimeout 무효화
// 각 phase 간격: 600ms, 총 ~3초
```

각 Zone의 스켈레톤/reveal 조건:
| Zone | 스켈레톤 조건 | processingLabel |
|------|-------------|-----------------|
| Zone 1 | `phase === 1` | "데이터 소스 수집 중..." |
| Zone 2 | `phase >= 1 && < 3` | "분석 패턴 구조화 중..." |
| Zone 3 | `phase >= 1 && < 4` | "온톨로지 그래프 생성 중..." |
| Zone 4 | `phase >= 1 && < 5` | "의사결정 경로 도출 중..." |
| Record | `phase >= 1 && < 5` → null | phase 5에서 reveal |

## Error Boundary 패턴

```tsx
// Zone 레벨 에러 격리
<ErrorBoundary fallbackTitle="데이터 수집 영역 오류">
  <ZoneDataIngestion />
</ErrorBoundary>
```

- React class component (`getDerivedStateFromError` + `componentDidCatch`)
- `fallbackTitle` prop으로 한국어 제목 커스터마이징
- Compact fallback UI (zone 크기에 맞춤, alertRed 테두리)
- "다시 시도" 버튼으로 에러 상태 리셋

## Graph-Path 연동 패턴

```tsx
// ZoneGraph.tsx
const pathRelatedEntityIds = useMemo(() => {
  if (!selectedPathId) return new Set<string>();
  const ids = new Set<string>();
  // riskSignals에서 relatedPaths.includes(selectedPathId)인 항목의 relatedEntityIds 수집
  // decisionPaths에서 relatedEntityIds 수집 (있는 경우)
  return ids;
}, [data.riskSignals, data.decisionPaths, selectedPathId]);

// 노드 스타일 분기:
// isPathRelated → 두꺼운 border + 강한 glow
// isDimmed (path 선택 + 비관련) → opacity: 0.35
// transition: 'all 0.3s ease'
```

## Guided Tour 패턴

```tsx
// TourOverlay.tsx — createPortal로 body에 렌더링
createPortal(<div className="fixed inset-0 z-[9999]">...</div>, document.body);
```

- SVG mask 기반 dark overlay + 타겟 요소 cutout
- 타겟 위치: `querySelector('[data-tour="..."]')` + `getBoundingClientRect()`
- `scrollIntoView` 후 400ms 대기로 위치 측정
- 키보드: ESC(종료), ←(이전), →(다음)
- 액션 실행: `HIGHLIGHT_ZONE`, `SELECT_PATH`, `OPEN_DOCK_TAB`, `SHOW_REPORT`
- resize/scroll 이벤트 리스너로 재측정

### Tour 데이터 구조
```typescript
// src/data/tourSteps.ts — 9개 스텝
// target 값은 data-tour 속성과 매칭:
// step-navigator, start-demo, data-labels, zone-1~4, hr-context, dock
```

## Phased Loading 패턴

```typescript
// loadingPhase: 0=idle, 1~4=zone skeleton, 5=all reveal
setScenario: (scenarioId) => {
  const abortId = Date.now();
  set({ loadingPhase: 1, _loadingAbortId: abortId });
  for (let phase = 2; phase <= 5; phase++) {
    setTimeout(() => {
      if (state._loadingAbortId !== abortId) return; // abort 체크
      set({ loadingPhase: phase, activeStep: Math.min(phase, 4) });
    }, 600 * (phase - 1));
  }
}

// Zone 컴포넌트에서:
const showSkeleton = loadingPhase >= 1 && loadingPhase < 3; // zone별 조건
if (showSkeleton) return <SkeletonZone variant="graph" processingLabel="온톨로지 그래프 생성 중..." />;
```

## Custom ReactFlow Node 패턴

```tsx
// src/components/graph/EntityNode.tsx
const nodeTypes = { entity: EntityNode }; // ZoneGraph에서 등록

// EntityNode: Handle (top/bottom) + icon + name + detail + DataLabelBadge
// data: { entity, isSelected, isPathRelated, isDimmed }
```

## HR Context Sidebar 패턴

```tsx
// App.tsx: flex 레이아웃 + sticky aside
<div className="flex">
  <main style={{ flex: '1 1 0%', minWidth: 0 }}>...</main>
  <aside className="hidden lg:block sticky top-[72px] h-[calc(100vh-72px)] w-[340px]">
    <HRContextView variant="panel" />
  </aside>
</div>
```

## 반응형 전략

### Breakpoint 체계
| 크기 | 레이아웃 |
|------|---------|
| <640px (sm) | 1컬럼, 스텝 숫자만, 컨트롤 축소, sidebar 숨김 |
| 640-1023px (md) | 1컬럼, 경로 3컬럼, 탭 라벨 표시 |
| ≥1024px (lg) | 2컬럼 그리드 `[360px_1fr]`, sidebar, 풀 UI |

### 반응형 패턴
- `px-2 sm:px-4` — 모바일 여백 축소
- `gap-2 sm:gap-4` — 모바일 갭 축소
- `hidden md:inline` — 버튼 라벨 모바일 숨김
- `hidden sm:flex` — Controls 모바일 숨김
- `overflow-x-auto whitespace-nowrap` — 탭 가로 스크롤
- `h-[120px] sm:h-[200px]` — 산점도 높이 반응형

## Accessibility 패턴

```tsx
// Skip link
<a href="#main-content" className="sr-only focus:not-sr-only ...">본문으로 건너뛰기</a>
<main id="main-content">

// aria-live 시나리오 전환 알림
<div ref={announcementRef} aria-live="polite" className="sr-only" />

// Step Nav: role + aria-current
<nav role="navigation" aria-label="워크플로우 단계 네비게이터">
  <button aria-label="Step 1: Data Ingestion" aria-current={isActive ? 'step' : undefined}>

// Tabs: tablist + tab + aria-selected
<div role="tablist" aria-label="독 섹션">
  <button role="tab" aria-selected={active}>

// aria-expanded 토글 버튼
<button aria-expanded={isContextSidebarOpen}>  // HR Context
<button aria-expanded={isDockExpanded}>         // Dock

// Dock 키보드 리사이즈
<div role="separator" aria-orientation="horizontal"
     aria-valuenow={dockHeight} aria-valuemin={220} aria-valuemax={560}
     onKeyDown={ArrowUp→+20px, ArrowDown→-20px}>

// 장식 아이콘 aria-hidden
<Icon className="h-4 w-4" aria-hidden="true" />

// Path cards: aria-pressed
<button aria-pressed={selected} aria-label="경로 A, 리스크 medium, 효과 high">

// Tour dialog: dialog + modal
<div role="dialog" aria-modal="true" aria-labelledby="tour-title">
```

## 모바일 반응형 패턴

### Header 모바일 레이아웃
```tsx
// sm+ (≥640px): 기존 3-column 레이아웃 (hidden sm:flex)
// <sm (모바일): 3-row 레이아웃 (sm:hidden)
//   Row 1: 타이틀 + 시나리오 셀렉터 + ⋮ 오버플로 메뉴
//   Row 2: 스텝 네비게이터 (overflow-x-auto 수평 스크롤)
//   Row 3: Demo + Guide 버튼

// 오버플로 메뉴 (Export/Reset/HR Context)
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// outside-click dismiss: useEffect + document.addEventListener('mousedown')
```

### 터치 타겟 패턴
```tsx
// 모바일 버튼: min-h-[44px] (44px 최소 터치 타겟)
className="min-h-[44px] min-w-[44px]"
```

### Safe Area
```css
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
}
```
