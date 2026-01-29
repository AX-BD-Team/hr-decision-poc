# Progress

## 구현 현황

### 완료

#### 레이아웃 & 구조
- [x] Header (단계 네비게이터, 시나리오 선택, 컨트롤 버튼)
- [x] Header sticky 고정 (`sticky top-0 z-50 glass-header`)
- [x] 4-Zone 워크플로우 그리드 레이아웃 (`grid-cols-[360px_1fr]`)
- [x] HR Context Sidebar (sticky aside, 토글 가능)
- [x] Bottom Dock (DockSection 4개 + RecordTab 5개 2레벨 구조)
- [x] DecisionRecordSection 독립 컴포넌트 (메인 레이아웃에 직접 배치)
- [x] 순차 진입 애니메이션 (stagger-1~4, slide-in-right)
- [x] 스크롤 가능 레이아웃 (`min-h-screen` + section별 `scroll-mt-32`)
- [x] **모바일 반응형** — breakpoint별 레이아웃 최적화 (sm/md/lg)

#### Zone 1 — 데이터 수집
- [x] 데이터 소스 카드 표시
- [x] 커버리지 퍼센트 바
- [x] DataLabel 배지 (REAL/MOCK/ESTIMATE/SYNTH)
- [x] 포함 필드 목록
- [x] **카드 인라인 확장** — 클릭 시 필드 pill badge + 요약 라인, ChevronDown 아이콘, CSS transition, 키보드/aria 접근성
- [x] 로딩 스켈레톤 (phase 1)

#### Zone 2 — 분석 구조화
- [x] 분석 패턴 카드 (4개: 갭분석, 의존도, 병목, 비용영향)
- [x] 타입별 아이콘 매핑
- [x] 로딩 스켈레톤 (phase 1~2)
- [x] **카드 UI 리디자인** — severity/metric/findings/affectedScope 필드, 2x2 그리드, severity 색상 left border

#### Zone 3 — 온톨로지 그래프
- [x] ReactFlow 기반 노드/엣지 렌더링
- [x] 엔티티 타입별 색상 구분
- [x] 엣지 타입별 스타일링
- [x] 패닝/줌 컨트롤
- [x] **그래프-경로 연동** — Decision Path 선택 시 관련 노드 하이라이팅 + 비관련 디밍
- [x] **커스텀 ReactFlow 노드** — EntityNode (타입별 아이콘, 속성 표시, DataLabel 배지)
- [x] 로딩 스켈레톤 (phase 1~3)
- [x] **Dagre 자동 레이아웃** (`layoutGraph.ts`, LR 계층 방향)

#### Zone 4 — 의사결정 경로
- [x] 3개 경로 비교 카드 (Path A/B/C)
- [x] 리스크/효과 수준 표시
- [x] 핵심 메트릭 표시 (비용, 기간, 활용도 개선)
- [x] 경로 선택 인터랙션
- [x] `variant` prop (`zone` | `dock`) 지원
- [x] 로딩 스켈레톤 (phase 1~3)

#### HR Context Sidebar
- [x] KPI 카드 4개 (충원율, 활용도, 핵심인재, 채용소요일)
- [x] **인재 활용도 산점도** (순수 SVG viewBox, 과부하/고의존 기준선, 리스크 영역, 호버 툴팁)
- [x] 컨텍스트 인사이트 (severity별 색상)
- [x] 메인 레이아웃 sticky aside로 복원 (토글 가능)

#### Decision Record
- [x] DecisionRecordSection 독립 컴포넌트
- [x] 5개 RecordTab (Evidence, Assumptions, Risks, Alternatives, Record)
- [x] **종합 리포트 뷰** (선택 경로 요약 + 관련 근거/가정/리스크 + 대안 비교표)
- [x] **구조화된 Export HTML** (styled HTML 보고서 — 경로 요약/근거/가정/리스크/비교표 포함)
- [x] Generate / Reset 버튼

#### Bottom Dock
- [x] 4개 DockSection (paths/record/structuring/context)
- [x] record 섹션 내 5개 RecordTab 2레벨 탭
- [x] 펼침/접힘 토글
- [x] 드래그 리사이즈 (pointer events 기반, 220~560px 범위)
- [x] 탭별 콘텐츠 렌더링

#### 시나리오 데이터
- [x] **S1**: TO 추가 요청 — 인력 충원 구조적 분석 (JSON 전면 교체)
- [x] **S2**: 상시 조직 변경 / R&R — 조직 구조 vs 역할 재정의 (JSON 전면 교체)
- [x] **S3**: 솔루션 사업화 내부 체계 [Phase-2] — PoC→Pilot→Scale (JSON 전면 교체)
- [x] **S4**: 역량 강화 [HRD] — 역량 갭 분석 및 개발 수단 (신규)
- [x] **S2/S3 독립 JSON 파일** (`demo-s2.json`, `demo-s3.json`)
- [x] **타입 시스템 확장** — DataSource/EntityType/EdgeType/AnalysisPattern/DecisionCriterion/ScenarioMeta 확장
- [x] **S4 시나리오 데이터** — `demo-s4.json` 작성 + scenarios.ts 등록
- [x] **DecisionCriteria** — 시나리오별 5개 의사결정 기준 + badge (Phase-2/HRD)
- [x] **readiness 시스템** — DataSource 준비도 (available/recommended/missing/undefined_rules) + readinessNote
- [x] `scenarios.ts` 리팩토링 — structuredClone 제거, JSON import 방식
- [x] `scenarioDataById` / `scenarioMetas` export
- [x] Header에 시나리오 선택 드롭다운
- [x] S1 이중 정의 정리 (JSON에서 dataSources/decisionPaths 통합)
- [x] S2/S3 hrContextViews 시나리오 분화
- [x] Edge 참조 무결성 검증 유틸리티 (`validateScenario.ts`)
- [x] 확장 검증: relatedPaths/relatedEntityIds/utilizationMap.entityId 역참조 + orphan error types

#### 상태 관리 & 데이터
- [x] Zustand 스토어 (모드, 스텝, 선택, Dock 상태)
- [x] `scenarioId` + `setScenario()` 액션
- [x] `loadingPhase` phased 로딩 (0=idle, 1~4=zone, 5=reveal) + abort
- [x] `isContextSidebarOpen` + `toggleContextSidebar()`
- [x] `DockSection` + `RecordTab` 2레벨 상태
- [x] `dockHeight` + `setDockHeight()` 리사이즈 상태
- [x] 타입 시스템 (DemoData, Entity, Edge, DecisionPath 등)
- [x] DataLabel 시스템

#### Loading States
- [x] **Phased skeleton loading** — 시나리오 전환 시 zone별 순차 로딩
- [x] `SkeletonZone` 컴포넌트 (default/graph/paths variant)
- [x] Shimmer 애니메이션 + ProcessingIndicator 라벨
- [x] Phase-reveal 애니메이션 (zone 등장 시)

#### Accessibility (a11y)
- [x] **ARIA 속성** — navigation, tablist, tab, dialog, alert, aria-pressed, aria-selected
- [x] **키보드 내비게이션** — Tour (ESC/←/→), 포커스 링
- [x] **Screen reader** — aria-label (step buttons, data labels, graph, buttons)
- [x] `.sr-only` CSS 유틸리티
- [x] **Skip navigation link** — `<a href="#main-content">본문으로 건너뛰기</a>`
- [x] **aria-expanded** — HR Context 토글, Dock 토글, 모바일 오버플로 메뉴
- [x] **aria-hidden="true"** — 모든 장식 Lucide 아이콘 (Header, Dock, Zone 1~4, HRContextView)
- [x] **aria-live** — 시나리오 전환 알림 (`aria-live="polite"`)
- [x] **Dock 키보드 리사이즈** — `role="separator"`, ArrowUp/Down ±20px, aria-valuenow/min/max

#### Error Handling
- [x] **Error Boundaries** — zone 레벨 에러 격리, `fallbackTitleKey` prop (i18n 키 기반)
- [x] **ErrorBoundary i18n** — `getT()` 비-hook 번역 함수로 클래스 컴포넌트 지원
- [x] App.tsx 5개 섹션 ErrorBoundary 래핑

#### Guided Tour
- [x] **Guided Tour UI** — TourOverlay (portal, SVG mask, 키보드 nav, dialog a11y)
- [x] 9개 투어 스텝
- [x] Tour 액션: HIGHLIGHT_ZONE, SELECT_PATH, OPEN_DOCK_TAB, SHOW_REPORT
- [x] **Tour 스텝 수정** — Step 8 sidebar 강제 열기, Step 9 target decision-record로 변경
- [x] **Fallback tooltip** — 타겟 부재 시 화면 중앙 tooltip (spotlight 없음)
- [x] **Scroll 개선** — block:'center' + 500ms 지연 (sidebar 애니메이션 고려)

#### Zone별 극적 로딩 애니메이션
- [x] `LoadingZone1Ingestion.tsx` — 행 슬라이드인 + 파란 스캔바 + 프로그레스바
- [x] `LoadingZone2Structuring.tsx` — 보라 빔 sweep + blur→선명 전환 + border glow
- [x] `LoadingZone3Graph.tsx` — SVG 노드 pop-in + 엣지 draw + 펄스 링
- [x] `LoadingZone4Paths.tsx` — 카드 바운스 착지 + amber flash + 카운터 + ready pulse
- [x] `tailwind.config.js` — 9개 신규 keyframes + 10개 animation 유틸리티
- [x] `index.css` — 5개 신규 CSS 클래스 (스캔바, 빔, 엣지 드로우, 플래시, 프로그레스)
- [x] **Start Demo 하이라이팅 가시성 개선** — glow 강도↑, zone-active-pulse 애니메이션, 라이트 테마 glow 변수, skeleton 재생 트리거
- [x] **isDemoRunning 상태 분리** — Demo 자동재생과 Tour 오버레이 독립 제어, 긴 스텝 간격, Guide 버튼 Demo 중 비활성화

#### 페이지 라우팅 & 대시보드/문서
- [x] PageNav 페이지 네비게이션 (workflow/dashboard/docs)
- [x] Zustand `activePage` 상태 + `setActivePage` 액션
- [x] DashboardPage (자원배분/인재정보/인력예측 3탭)
- [x] KpiCardGrid, ProjectStatusChart (SVG 도넛), SkillTreemap (squarified)
- [x] 인재 테이블 + 월별 인력 흐름 바 차트 (SVG)
- [x] DocsPage + DocCard + 카테고리 필터링
- [x] dashboard-data.json, docs-meta.ts 데이터 소스
- [x] App.tsx lazy import (`DashboardPage`, `DocsPage`)

#### 대시보드 재설계 (인터랙션 + 컴포넌트 추출)
- [x] TalentTable 추출 (정렬, 부서 필터, 역량/평가 뱃지 색상 분기)
- [x] WorkforceFlowChart 추출 (그룹 바차트 + headcount/forecast 라인 + 호버 툴팁)
- [x] WorkforceDetailTable 추출 (음수 surplus 빨간 border + 스파크라인)
- [x] KpiCardGrid 개선 (stagger 애니메이션, hover 리프트, accent bar, pill 뱃지)
- [x] ProjectStatusChart 개선 (stroke 도넛, 범례↔arc 호버 연동)
- [x] SkillTreemap 개선 (플로팅 툴팁, white stroke 하이라이트)
- [x] DashboardPage 재작성 (탭 아이콘, fade-in-up 전환, 인라인 코드 제거)

#### 디자인 시스템 토큰 통합
- [x] CHART_COLORS 상수 (tokens.ts) — SVG 인라인 색상 18개, CSS 변수 참조
- [x] SVG 하드코딩 색상 교체 (7개 컴포넌트, 30+ hex 리터럴 → 토큰)
- [x] 버튼 유틸리티 클래스 (.btn-primary, .btn-secondary, .btn-ghost)
- [x] 레이아웃 상수 추출 (constants/layout.ts — Dock 높이 상수)
- [x] severity.critical 색상 차별화 (#DC2626 vs #FF4D4F)
- [x] CSS 변수 `:root` 기본값 선언 (--zone-accent, 테마 팔레트)
- [x] Tailwind 색상 토큰 CSS 변수 연동 (appBg, panelBg, textMain, textSub, surface)

#### 인프라
- [x] Vite 빌드 설정
- [x] TypeScript strict 설정
- [x] Tailwind CSS 커스텀 테마 + 시맨틱 토큰 확장
- [x] ESLint 설정
- [x] Cloudflare Pages 배포 설정
- [x] GitHub Actions CI/CD
- [x] Vitest 테스트 프레임워크 (191 tests — 117 데이터 검증 + 74 UI 컴포넌트)
- [x] vitest.config.ts + src/test/setup.ts + src/test/utils.tsx 테스트 인프라
- [x] `/deploy` 스킬 — Cloudflare Pages 자동 배포 (lint → build → deploy)

---

### 미구현 — Medium Priority

- [x] ~~S2/S3 독립 JSON 파일 생성~~ → 완료 (`demo-s2.json`, `demo-s3.json`)

### 미구현 — Low Priority

- [x] ~~국제화(i18n)~~ → 완료 (경량 자체 구현, useT() hook, KO/EN 토글, 38개 컴포넌트 마이그레이션)
- [x] ~~다크/라이트 테마 전환~~ → 완료 (CSS 변수 테마 + Zustand toggleTheme + localStorage)
- [x] ~~번들 크기 최적화~~ → 완료 (React.lazy + manualChunks, 565KB→277KB)
- [x] ~~UI 컴포넌트 테스트~~ → 완료 (vitest + @testing-library/react, 74 UI 컴포넌트 테스트, 총 157 tests)
- [x] ~~recharts 패키지 제거~~ → 완료

---

## 알려진 이슈

| # | 설명 | 심각도 | 상태 |
|---|------|--------|------|
| 1 | ~~`GuidedTourOverlay.tsx` dead code~~ | Low | 해결 (이미 제거됨) |
| 2 | ~~HRContextView 메인 레이아웃 제거~~ | Medium | 해결 (우측 사이드바 추가) |
| 3 | ~~산점도 CSS 하드코딩~~ | Medium | 해결 (SVG viewBox) |
| 4 | ~~그래프 노드 위치 하드코딩~~ | Low | 해결 (dagre 자동 레이아웃) |
| 5 | ~~리포트 탭 미완~~ | Medium | 해결 (종합 뷰 + HTML Export) |
| 6 | ~~TourOverlay text-[10px]~~ | Low | 해결 (text-micro) |
| 7 | ~~번들 크기 560KB > 500KB 경고~~ | Low | 해결 (277KB, React.lazy+manualChunks) |
| 8 | ~~recharts 미사용 패키지 잔존~~ | Low | 해결 (제거됨) |
| 9 | ~~DashboardPage.tsx 누락 (TS2307)~~ | High | 해결 (파일 생성) |
| 10 | ~~SkillTreemap 미사용 변수 (TS6133)~~ | Low | 해결 (제거) |
| 11 | ~~EntityNode.tsx iconMap에 새 EntityType 누락~~ | Medium | 해결 (c330d1a 아이콘 추가) |
| 12 | ~~useStore.ts `decisionCriteria` 참조 빌드 에러~~ | Medium | 해결 (c330d1a optional + nullish coalescing) |
