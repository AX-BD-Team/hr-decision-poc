# Project Specification — O-AOD HR 의사결정 PoC

## 1. Project Overview

### 미션
HR 의사결정 과정을 **데이터 기반**으로 투명하게 지원하는 프로토타입을 개발한다.
조직의 인력 구성, 역할 배정, 비용/리스크를 온톨로지 그래프로 시각화하고,
복수의 의사결정 경로(대안)를 비교/평가할 수 있는 인터페이스를 제공한다.

### 핵심 질문 (데모 시나리오)
- **S1 TO 추가 요청**: "정말 인력이 부족한가, 아니면 현재 구조와 배치가 문제인가?"
- **S2 상시 조직 변경 / R&R**: "조직을 바꾸는 게 맞나, 아니면 역할과 책임을 바꾸는 게 맞나?"
- **S3 솔루션 사업화 내부 체계**: "솔루션 사업화를 위한 내부 체계를 어떻게 구축할 것인가?"
- **S4 역량 강화**: "조직/인력의 역량을 어떻게 강화할 것인가?"

### 범위
- **In-scope**: 프론트엔드 SPA 프로토타입, 정적 데모 데이터, 4-Zone 워크플로우 캔버스, HR 컨텍스트 사이드바, 하단 Dock, 4개 시나리오 전환(S1~S4), 대시보드(3탭), 문서 페이지(DocDetailView + Kanban 보드)
- **Out-of-scope**: 백엔드 API, 실시간 데이터, 인증/인가

### 성공 기준
1. 4개 Zone (데이터 수집 -> 분석 구조화 -> 온톨로지 그래프 -> 의사결정 경로) 정상 렌더링
2. ReactFlow 기반 온톨로지 그래프가 엔티티와 관계를 시각화
3. 3개 의사결정 경로 비교 가능
4. HR 컨텍스트 뷰에서 KPI/활용도/인사이트 표시
5. 하단 Dock에서 가정/근거/리스크/대안/리포트 탭 전환
6. 4개 시나리오 전환 및 데이터 무결성 검증
7. 대시보드 3탭(자원배분/인재/인력예측)
8. 문서 페이지(DocDetailView + Kanban 보드)
9. 다크/라이트 테마 + KO/EN 국제화
10. Vitest 191 tests (117 데이터 검증 + 74 UI 컴포넌트)

### 대상 사용자
- HR 의사결정자 (인사 담당 임원/관리자)
- 조직 분석 전문가
- PoC 평가자 / 이해관계자

---

## 2. Product Design

### 4-Zone 워크플로우

**Zone 1 — 데이터 수집 (Data Ingestion)**
- HR 마스터, Project/Task, Org Role Map, OPEX Range 등 데이터 소스 표시
- 각 소스의 커버리지(%), 데이터 레이블(REAL/MOCK/ESTIMATE), 포함 필드 표시

**Zone 2 — 분석 구조화 (Structuring)**
- 역할 커버리지 갭 분석, 의존도 집중도, 활용도 병목, 비용 영향 시뮬레이션
- 분석 패턴 카드 형태로 표시

**Zone 3 — 온톨로지 그래프 (Graph)**
- ReactFlow 기반 인터랙티브 그래프
- 엔티티: 조직, 역할, 인원, 프로젝트, 리스크, 비용, 태스크, 역량, 단계, 교육 프로그램
- 엣지: depends_on, covers, bottleneck, overlap, cost_supports, risk_of, belongs_to, assigned_to, requires_capability, trains_for, part_of_stage, duplicates
- 노드 타입별 색상 구분

**Zone 4 — 의사결정 경로 (Decision Paths)**
- 3개 대안 비교 카드
- 각 경로의 리스크 수준, 효과 수준, 핵심 메트릭(비용/기간/Score) 표시

### 지원 UI 요소

**Header (sticky)** — 단계 네비게이터, 시나리오 선택 드롭다운, Start Demo / Stop / Reset / Export 버튼

**DecisionRecordSection (메인 하단)** — Explainability & Decision Record, 5개 탭(Evidence, Assumptions, Risks, Alternatives, Record), Export HTML / Generate / Reset

**Bottom Dock (접이식 패널)** — 4개 섹션: 대안 카드, 결정 레코드, 구조화, HR 컨텍스트. 드래그 리사이즈 (220~560px)

**HR Context (Dock 내부)** — HR KPI 카드 4개, 인재 활용도 산점도 (의존도 vs 활용도), 컨텍스트 인사이트

### 페이지 구성

**의사결정 워크플로우 (workflow)** — 기본 페이지. 4-Zone + HR Context Sidebar + Decision Record

**대시보드 (dashboard)** — 자원 배분 탭(KPI + 도넛 차트 + 트리맵), 인재 정보 탭(KPI + 트리맵 + 인재 테이블), 인력 예측 탭(월별 바 차트 + 상세 테이블)

**문서 (docs)** — 프로젝트 문서 탭(6개 문서 카드, 카테고리 필터, Master-Detail 상세보기), 프로젝트 보드 탭(Kanban 3컬럼, Priority 필터, 28개 항목)

### 데모 시나리오 상세

| ID | 이름 | 배지 | 핵심 경로 |
|----|------|------|-----------|
| S1 | TO 추가 요청 | TO | 증원(신규 채용) / 재배치(내부 이동) / 구조조정(역할 재정의) |
| S2 | 상시 조직 변경 / R&R | R&R | 조직 구조 vs 역할 재정의 대안 비교 |
| S3 | 솔루션 사업화 내부 체계 | Phase-2 | PoC -> Pilot -> Scale 단계별 분석 |
| S4 | 역량 강화 | HRD | 역량 갭 분석 + 교육/순환배치/멘토링 대안 비교 |

---

## 3. Architecture Patterns

### 페이지 라우팅
```typescript
// Zustand 기반 클라이언트 라우팅 (React Router 미사용)
type PageId = 'workflow' | 'dashboard' | 'docs';
// App.tsx — 조건부 렌더링
{activePage === 'workflow' && <WorkflowLayout />}
{activePage === 'dashboard' && <Suspense><DashboardPage /></Suspense>}
{activePage === 'docs' && <Suspense><DocsPage /></Suspense>}
```

### Zustand 스토어 구조
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

  // 투어/데모 상태
  isTourActive: boolean;
  tourStep: number;
  isDemoRunning: boolean;

  // 액션
  setScenario, setMode, setActiveStep, selectEntity, selectPath,
  setDockSection, setRecordTab, setDockExpanded, setDockHeight,
  toggleDock, toggleContextSidebar,
  startTour, nextTourStep, prevTourStep, endTour,
  startDemo, stopDemo, reset
}
```

### Zone 컴포넌트 패턴
```tsx
// 활성/비활성 스타일링
const isActive = activeStep === ZONE_NUMBER;
className={clsx(
  'rounded-xl border p-4 transition-all',
  isActive
    ? clsx('border-zoneAccent/70 bg-zoneAccent/10 shadow-glow-accent',
           (isDemoRunning || isTourActive) && 'zone-pulse-color')
    : 'border-neutralGray/20 bg-panelBg/50'
)}

// Variant 패턴 (Zone/Dock 공용)
export function ZoneDecisionPaths({ variant = 'zone' }: { variant?: 'zone' | 'dock' })
```

### Dock 구조 (2레벨 탭)
```
Dock
├── DockSection: paths      → ZoneDecisionPaths (variant='dock')
├── DockSection: record     → RecordTab 5개 → DockContent
├── DockSection: structuring → ZoneStructuring
└── DockSection: context     → HRContextView
```
- 리사이즈: pointer events 기반, 220~560px 클램핑, GripHorizontal 핸들

### 시나리오 데이터 패턴
```typescript
// src/data/scenarios.ts — 독립 JSON import 방식
import demoS1 from './demo-s1.json';
const s1 = demoS1 as DemoData;
export const scenarioDataById: Record<string, DemoData> = { ... };
export const scenarioMetas = [s1.meta, s2.meta, s3.meta, s4.meta];
validateAllScenarios(scenarioDataById); // dev-only 무결성 검증
```

### 시나리오 무결성 검증
```typescript
// validateScenario.ts — ValidationError types:
// orphan_edge_source | orphan_edge_target | missing_field |
// orphan_related_path | orphan_related_entity | invalid_type |
// criteria_count | badge_mismatch | invalid_readiness
// Vitest 117 데이터 검증 테스트로 보강
```

### 레이아웃 구조
```
┌──────────────────────────────────────────────────────────────┐
│  Header (sticky top-0 z-50 glass-header)                     │
├──────────────────────────────────────────────────────────────┤
│  max-w-[1440px] mx-auto px-4 pb-10                           │
│  ┌─────────────┬──────────────────────────────────────────┐  │
│  │ Zone 1 (360px)  │ Zone 3 (1fr)                        │  │
│  ├─────────────┼──────────────────────────────────────────┤  │
│  │ Zone 2 (360px)  │ Zone 4 (1fr)                        │  │
│  └─────────────┴──────────────────────────────────────────┘  │
│  DecisionRecordSection (full width)                           │
└──────────────────────────────────────────────────────────────┘
```
- 최상위: `min-h-screen bg-appBg cmd-grid-bg text-textMain`
- Zone 그리드: `grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]`
- 각 섹션: `id="section-*"` + `scroll-mt-32`

### SVG 차트 패턴 (외부 라이브러리 없음)
- **도넛 차트** (`ProjectStatusChart`) — stroke 기반, 범례↔arc 호버 연동
- **트리맵** (`SkillTreemap`) — Squarified, 커서 추적 플로팅 툴팁
- **그룹 바 + 라인 차트** (`WorkforceFlowChart`) — 유입/유출 + headcount polyline + forecast 점선, 호버 크로스헤어
- **산점도** (`UtilizationScatterChart`) — 순수 SVG, 과부하/고의존 기준선, 리스크 영역

### ReactFlow 그래프 패턴
- `@xyflow/react` v12, dagre 자동 레이아웃 (LR 계층), `entity.position` fallback
- 커스텀 EntityNode: Handle (top/bottom) + icon + name + detail + DataLabelBadge
- Graph-Path 연동: 선택 Path의 관련 노드 하이라이팅 + 비관련 디밍 (opacity: 0.35)
- `vendor-xyflow` manualChunk: `@xyflow/react` + `dagre` 분리 (캐시 효율)

### CSS 변수 테마 패턴
```css
:root, :root[data-theme="dark"] { --color-app-bg: #0B1220; ... }
:root[data-theme="light"] { --color-app-bg: #F8FAFC; ... }
/* tokens.ts — CHART_COLORS는 CSS 변수 참조 */
export const CHART_COLORS = { textSub: 'var(--chart-text-sub)', ... };
```
- Zustand `theme` 상태 + `toggleTheme()` + localStorage 퍼시스턴스
- `document.documentElement.dataset.theme` 적용

### i18n 패턴 (경량 자체 구현)
```typescript
// ko.ts — 타입 정의 원천, 11개 네임스페이스
// en.ts — TranslationKeys (Widen<T>) 타입 적용
// useT() hook — dot-path 해석 ('dashboard.title' → '대시보드')
// getT() — 비-hook 함수 (ErrorBoundary 클래스 컴포넌트용)
```
- Locale: `useStore.locale` ('ko' | 'en'), `toggleLocale()`, localStorage
- 데이터 파일(JSON) 한국어 콘텐츠는 i18n 범위 제외

### Severity / DataLabel 시맨틱 패턴
```tsx
// Severity 토큰
const severityStyles = {
  high: 'border-severity-high/50 bg-severity-high/10 text-severity-high',
  medium: 'border-severity-medium/50 bg-severity-medium/10 text-warning',
  low: 'border-severity-low/50 bg-severity-low/10 text-success',
};

// DataLabel 토큰
type DataLabel = 'REAL' | 'MOCK' | 'ESTIMATE' | 'SYNTH';
const labelStyles: Record<DataLabel, string> = {
  REAL: 'bg-label-real/20 text-label-real',
  ESTIMATE: 'bg-label-estimate/20 text-label-estimate',
  MOCK: 'bg-label-mock/20 text-label-mock',
  SYNTH: 'bg-label-synth/20 text-label-synth',
};
```

### 인라인 스타일 색상 상수
```tsx
import { ENTITY_COLORS, EDGE_COLORS, PANEL_BG, CHART_COLORS } from '../../constants/tokens';
const baseColor = ENTITY_COLORS[entity.type] || '#666';
// SVG 차트: CHART_COLORS (CSS 변수 참조로 테마 대응)
```

### Phased Loading 패턴
```typescript
// loadingPhase: 0=idle, 1~4=zone skeleton, 5=all reveal
// _loadingAbortId: 빠른 시나리오 전환 시 stale setTimeout 무효화
// 각 phase 간격: 600ms, 총 ~3초
```
| Zone | 스켈레톤 조건 | processingLabel |
|------|-------------|-----------------|
| Zone 1 | `phase === 1` | "데이터 소스 수집 중..." |
| Zone 2 | `phase >= 1 && < 3` | "분석 패턴 구조화 중..." |
| Zone 3 | `phase >= 1 && < 4` | "온톨로지 그래프 생성 중..." |
| Zone 4 | `phase >= 1 && < 5` | "의사결정 경로 도출 중..." |
| Record | `phase >= 1 && < 5` -> null | phase 5에서 reveal |

### Zone별 로딩 애니메이션
| Zone | 애니메이션 | 타이밍 |
|------|-----------|--------|
| Zone 1 | 행 슬라이드인 + 파란 스캔바 + 프로그레스바 | ~600ms |
| Zone 2 | 보라 빔 sweep + blur→선명 + border glow | ~1200ms |
| Zone 3 | SVG 노드 pop-in + 펄스 링 + 엣지 draw | ~1800ms |
| Zone 4 | 카드 바운스 착지 + amber flash + 카운터 + ready pulse | ~2400ms |

### React.lazy 코드 분할
```tsx
const ZoneGraph = lazy(() =>
  import('./components/zones/ZoneGraph').then(m => ({ default: m.ZoneGraph }))
);
// named export → .then(m => ({ default: m.X })) 변환 필수
```

### Error Boundary
- Zone 레벨 에러 격리, `fallbackTitle` prop, alertRed 테두리
- "다시 시도" 버튼으로 에러 상태 리셋

### Guided Tour
- TourOverlay: `createPortal` → body, SVG mask 기반 dark overlay + 타겟 cutout
- 9개 스텝, 키보드(ESC/←/→), 액션 실행(HIGHLIGHT_ZONE, SELECT_PATH 등)
- Fallback: 타겟 부재 시 화면 중앙 tooltip
- 사전 조건: `startTour()`에서 `isContextSidebarOpen: true`

### HR Context Sidebar
```tsx
// App.tsx: flex 레이아웃 + sticky aside
<aside className="hidden lg:block sticky top-[72px] h-[calc(100vh-72px)] w-[340px]">
```

### 반응형 전략
| 크기 | 레이아웃 |
|------|---------|
| <640px (sm) | 1컬럼, 스텝 숫자만, sidebar 숨김 |
| 640-1023px (md) | 1컬럼, 경로 3컬럼, 탭 라벨 표시 |
| >=1024px (lg) | 2컬럼 그리드, sidebar, 풀 UI |

### Accessibility
- ARIA: navigation, tablist, tab, dialog, aria-pressed, aria-selected, aria-expanded
- 키보드: Tour (ESC/←/→), Dock 리사이즈(ArrowUp/Down ±20px)
- Screen reader: aria-label, aria-live (시나리오 전환 알림), sr-only
- Skip link: `<a href="#main-content">본문으로 건너뛰기</a>`

### 모바일 패턴
- Header 모바일: 3-row 레이아웃, 오버플로 메뉴, outside-click dismiss
- 터치 타겟: `min-h-[44px] min-w-[44px]`
- Safe area: `env(safe-area-inset-bottom)`

### CSS 유틸리티 클래스
| 클래스 | 용도 |
|--------|------|
| `.cmd-grid-bg` | 도트 그리드 배경 |
| `.glass-panel` | 글래스모피즘 패널 |
| `.glass-header` | 헤더 전용 글래스 |
| `.zone-card` | 좌측 accent 보더 + hover |
| `.scan-line-overlay` | Zone 3 스캔라인 |
| `.btn-primary` / `.btn-secondary` / `.btn-ghost` | 버튼 유틸리티 |
| `.focus-ring` | 포커스 링 |

### 데이터 흐름
```
demo-s{1-4}.json → scenarios.ts (import + validate) → useStore.ts (Zustand) → Components
```

---

## 4. Technical Constraints

### 빌드 산출물
- JS 메인: ~277KB (gzip ~78KB) — React.lazy + manualChunks 적용
- JS vendor-xyflow: ~284KB (gzip ~95KB) — @xyflow/react + dagre
- JS lazy 청크: DashboardPage ~24KB, TourOverlay ~8KB, HRContextView ~8KB, ZoneGraph ~7KB, DocsPage ~6KB
- CSS: ~52KB (gzip ~10KB)

### 제약사항
- 백엔드 API 없음 — 정적 JSON + scenarios.ts 데이터만 사용
- 라우팅: Zustand `activePage` 기반 조건부 렌더링 (React Router 미사용)
- 다크/라이트 테마: CSS 변수 기반 (`data-theme` 속성)
- i18n: 경량 자체 구현 (UI 라벨만 번역, JSON 데이터 콘텐츠 제외)
- TypeScript strict 모드 + ESLint 활성화
- SPA 라우팅: `public/_headers` (Cloudflare Pages)

---

## 5. Current Status

### 현재 단계
모든 핵심 기능 구현 완료. SDD 체계 전환 완료 (2026-01-30). 프로덕션 배포 완료.

### 최근 변경 이력
| 커밋 | 설명 |
|------|------|
| `8fd80b2` | refactor: migrate to SDD — consolidate memory-bank into SPEC.md |
| `1056682` | docs: update Memory Bank — 스킬/설정 효율화 + 배포 완료 반영 |
| `1bb7ae0` | docs: update Memory Bank — 스킬/설정 효율화, 설정 관리 패턴 추가 |

### 현재 작업 포커스
- SDD 체계 전환 완료: memory-bank 6개 파일 → SPEC.md 단일 사양서
- Claude Code 단일 체계 운영 중 (Cline 연동 제거)

### 활성 결정사항
- 페이지 라우팅: Zustand `activePage` 기반
- 데이터 소스: 독립 JSON 파일 + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어
- 스타일링: Tailwind CSS + CSS 변수 테마 + 시맨틱 토큰
- 그래프: @xyflow/react v12, dagre 자동 레이아웃
- 차트: 순수 SVG (외부 라이브러리 미사용)
- 배포: Cloudflare Pages Git 통합
- 테스트: Vitest 191 tests
- 프로젝트 사양: SPEC.md (SDD 워크플로우) + CLAUDE.md (Claude Code 지침)

---

## 6. Implementation Log

### 완료 항목 요약

**레이아웃 & 구조** — Header (sticky, 시나리오 선택, 단계 네비게이터), 4-Zone 워크플로우 그리드, HR Context Sidebar (sticky aside), Bottom Dock (4 섹션 + RecordTab 5개 2레벨), DecisionRecordSection 독립 컴포넌트, 모바일 반응형 (sm/md/lg breakpoint).

**Zone 1~4** — Zone 1: 데이터 소스 카드, 커버리지 바, DataLabel 배지, 카드 인라인 확장, DecisionCriteriaPanel (5개 기준 체크박스), DataReadinessPanel. Zone 2: 분석 패턴 카드 (severity/metric/findings), 2x2 그리드. Zone 3: ReactFlow 노드/엣지, 엔티티별 색상, Graph-Path 연동, dagre 자동 레이아웃, EntityNode 커스텀 노드. Zone 4: 3개 경로 비교 카드, variant prop (zone/dock).

**HR Context** — KPI 카드 4개, 인재 활용도 산점도 (SVG), 컨텍스트 인사이트, sticky aside 토글.

**Decision Record** — 5개 RecordTab, 종합 리포트 뷰, 구조화된 Export HTML, Generate/Reset.

**시나리오 데이터** — S1~S4 독립 JSON, 타입 시스템 확장 (EntityType 10종, EdgeType 12종), 무결성 검증 (validateScenario.ts), Vitest 117 데이터 검증 테스트.

**대시보드** — 3탭 (자원배분/인재/인력예측), KpiCardGrid (stagger 애니메이션), ProjectStatusChart (SVG 도넛), SkillTreemap (squarified + 툴팁), TalentTable (정렬/필터/뱃지), WorkforceFlowChart (그룹 바 + 라인), WorkforceDetailTable (스파크라인).

**문서 페이지** — DocsPage 탭 전환, DocCard + 카테고리 필터, DocDetailView (Master-Detail, sticky 목차), ProjectBoard (Kanban 3컬럼, Priority 필터, 28개 항목).

**디자인 시스템** — CHART_COLORS 상수 (CSS 변수 참조), 버튼 유틸리티 (.btn-primary 등), 레이아웃 상수, severity.critical 차별화, CSS 변수 다크/라이트 테마, Tailwind 시맨틱 토큰 확장.

**인프라** — Vite 빌드, TypeScript strict, Tailwind 커스텀 테마, ESLint, Cloudflare Pages 배포, GitHub Actions CI, Vitest 191 tests, deploy/session-start/session-end 스킬.

**Guided Tour** — TourOverlay (portal, SVG mask), 9개 스텝, 키보드 nav, 액션 실행, fallback tooltip, scroll 개선.

**Zone별 로딩 애니메이션** — Loading{Zone1~4} 컴포넌트, 9개 keyframes + 10개 animation, Demo 하이라이팅 가시성 개선.

**접근성** — ARIA roles/labels, 키보드 nav, screen reader, skip link, aria-expanded, aria-live, Dock 키보드 리사이즈.

**SDD 체계 전환** (2026-01-30) — Cline + Claude Code 이중 체계 → Claude Code 단일 SDD 체계. memory-bank 6개 파일 → SPEC.md 단일 사양서 통합. session-start/session-end 스킬 SPEC.md 기반으로 전환. .clinerules 제거.

### 미래 작업 (GitHub Issues)
- **#26** 백엔드 API 연동 (P1/XL)
- **#28** 고급 분석 기능 — What-if 시뮬레이션, 시나리오 비교 (P1/XL)
- **#24** 추가 시나리오 확장 S5+ (P2/L)
- **#25** E2E 테스트 도입 (P2/L)
- **#27** 성능 모니터링 & 최적화 (P2/M)
