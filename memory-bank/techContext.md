# Tech Context

## 런타임 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `react` | ^19.0.0 | UI 프레임워크 |
| `react-dom` | ^19.0.0 | React DOM 렌더링 |
| `zustand` | ^5.0.0 | 상태 관리 |
| `@xyflow/react` | ^12.0.0 | 그래프 시각화 (ReactFlow) |
| `lucide-react` | ^0.468.0 | 아이콘 라이브러리 |
| `clsx` | ^2.1.1 | 조건부 클래스명 결합 |
| `tailwind-merge` | ^2.6.0 | Tailwind 클래스 충돌 해결 |
| `dagre` | ^0.8.5 | 그래프 자동 레이아웃 (LR 계층) |

## 개발 의존성

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `vite` | ^6.0.5 | 빌드 도구 + 개발 서버 |
| `@vitejs/plugin-react` | ^4.3.4 | Vite React 플러그인 |
| `typescript` | ~5.7.2 | 타입 시스템 |
| `tailwindcss` | ^3.4.17 | CSS 유틸리티 프레임워크 |
| `autoprefixer` | ^10.4.20 | CSS 벤더 프리픽스 |
| `postcss` | ^8.4.49 | CSS 후처리 |
| `eslint` | ^9.17.0 | 코드 린팅 |
| `eslint-plugin-react-hooks` | ^5.0.0 | React Hooks 린트 규칙 |
| `eslint-plugin-react-refresh` | ^0.4.16 | React Refresh 린트 규칙 |
| `typescript-eslint` | ^8.18.2 | TypeScript ESLint 통합 |
| `globals` | ^15.14.0 | ESLint 전역 변수 정의 |
| `vitest` | ^4.0.18 | 단위 테스트 프레임워크 |
| `@testing-library/react` | ^16.x | React 컴포넌트 테스트 |
| `@testing-library/user-event` | ^14.x | 사용자 이벤트 시뮬레이션 |
| `@testing-library/jest-dom` | ^6.x | DOM 매처 확장 |
| `jsdom` | ^26.x | 테스트용 DOM 환경 |
| `wrangler` | ^3.99.0 | Cloudflare Pages 배포 |

## 설정 파일 요약

### Vite (`vite.config.ts`)
- React 플러그인 사용
- 경로 별칭: `@` → `/src`
- `manualChunks`: `@xyflow/react` + `dagre` → `vendor-xyflow` 청크 분리

### TypeScript (`tsconfig.app.json`)
- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict 모드 활성화
- `noUnusedLocals`, `noUnusedParameters` 활성화
- 경로 별칭: `@/*` → `src/*`

### Tailwind (`tailwind.config.js`)
- 콘텐츠 경로: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- 커스텀 폰트: Pretendard (sans), JetBrains Mono (mono)
- 커스텀 색상 토큰 13개 기본 + 시맨틱 토큰 (label, entity, assumption, severity, status)
- 커스텀 폰트 크기 3개 (mini 9px, micro 10px, tiny 11px)
- 커스텀 애니메이션 19개 + 키프레임 15개 (Zone별 로딩 애니메이션 포함)
- 커스텀 박스 그림자 4개 (glow 계열)

### ESLint
- Flat config (eslint.config.js)
- TypeScript + React Hooks + React Refresh 규칙

### PostCSS (`postcss.config.js`)
- Tailwind CSS + Autoprefixer

## 프로젝트 구조

```
src/
├── main.tsx                          # React DOM 진입점
├── App.tsx                           # 메인 레이아웃 (grid 기반)
├── index.css                         # Tailwind + 커스텀 CSS 유틸리티
├── vite-env.d.ts                     # Vite 타입 정의
├── types/index.ts                    # 전체 타입 정의
├── store/useStore.ts                 # Zustand 스토어
├── i18n/
│   ├── index.ts                      # useT() hook (dot-path 키 해석)
│   ├── ko.ts                         # 한국어 번역 (기본)
│   └── en.ts                         # 영어 번역
├── constants/
│   ├── tokens.ts                     # 색상 상수 (ENTITY_COLORS, EDGE_COLORS, PANEL_BG, CHART_COLORS — CSS 변수 참조)
│   └── layout.ts                     # 레이아웃 상수 (DOCK_COLLAPSED/MIN/MAX_HEIGHT)
├── data/
│   ├── demo-s1.json                  # S1 기본 데이터
│   ├── demo-s2.json                  # S2 OPEX 절감 시나리오 데이터
│   ├── demo-s3.json                  # S3 병목 완화 시나리오 데이터
│   ├── scenarios.ts                  # JSON import + type cast + 무결성 검증 호출
│   ├── validateScenario.ts           # 시나리오 참조 무결성 검증 (edge/relatedPaths/relatedEntityIds/utilizationMap)
│   ├── tourSteps.ts                  # 9개 투어 스텝 정의
│   ├── dashboard-data.json           # 대시보드 데이터 (KPI, 프로젝트, 스킬, 인재, 인력예측)
│   ├── docs-meta.ts                  # 6개 문서 메타데이터
│   └── __tests__/
│       └── scenarios.test.ts         # Vitest 시나리오 데이터 검증 (71 tests)
├── test/
│   ├── setup.ts                      # jest-dom matchers 등록
│   └── utils.tsx                     # 커스텀 render (resetStore + userEvent)
├── components/
│   ├── common/
│   │   ├── DataLabelBadge.tsx       # DataLabel 배지 공용 컴포넌트
│   │   └── ErrorBoundary.tsx        # zone 레벨 에러 바운더리 (fallbackTitle prop)
│   ├── tour/
│   │   └── TourOverlay.tsx          # Guided Tour 오버레이 (portal, SVG mask, 키보드 nav)
│   ├── layout/
│   │   ├── Header.tsx               # 헤더 (sticky, 시나리오 선택, Guide 버튼)
│   │   └── PageNav.tsx              # 페이지 네비게이션 (workflow/dashboard/docs)
│   ├── dashboard/
│   │   ├── DashboardPage.tsx        # 대시보드 메인 (3탭: 자원배분/인재/인력예측)
│   │   ├── KpiCardGrid.tsx          # KPI 카드 그리드 (stagger 애니메이션, accent bar)
│   │   ├── ProjectStatusChart.tsx   # SVG stroke 도넛 차트 (호버 연동)
│   │   ├── SkillTreemap.tsx         # Squarified treemap (플로팅 툴팁)
│   │   ├── TalentTable.tsx          # 인재 테이블 (정렬/필터/뱃지)
│   │   ├── WorkforceFlowChart.tsx   # 그룹 바 + 라인 차트 (호버 툴팁)
│   │   └── WorkforceDetailTable.tsx # 인력 상세 테이블 (스파크라인)
│   ├── docs/
│   │   ├── DocsPage.tsx             # 문서 페이지 (카테고리 필터)
│   │   └── DocCard.tsx              # 문서 카드
│   ├── zones/
│   │   ├── ZoneDataIngestion.tsx     # Zone 1
│   │   ├── DecisionCriteriaPanel.tsx # Zone 1: 의사결정 기준 체크박스
│   │   ├── DataReadinessPanel.tsx    # Zone 1: 데이터 준비도 요약
│   │   ├── ZoneStructuring.tsx       # Zone 2
│   │   ├── ZoneGraph.tsx             # Zone 3
│   │   └── ZoneDecisionPaths.tsx     # Zone 4 (variant: zone|dock)
│   ├── context/
│   │   ├── HRContextView.tsx        # HR Context Sidebar
│   │   └── UtilizationScatterChart.tsx  # SVG 기반 산점도
│   ├── graph/
│   │   └── EntityNode.tsx           # 커스텀 ReactFlow 노드
│   ├── record/
│   │   └── DecisionRecordSection.tsx # Decision Record 독립 섹션
│   ├── loading/
│   │   ├── LoadingZone1Ingestion.tsx # Zone 1 스켈레톤
│   │   ├── LoadingZone2Structuring.tsx # Zone 2 스켈레톤
│   │   ├── LoadingZone3Graph.tsx     # Zone 3 스켈레톤
│   │   └── LoadingZone4Paths.tsx     # Zone 4 스켈레톤
│   └── dock/
│       ├── Dock.tsx                  # Bottom Dock (4 sections)
│       └── DockContent.tsx           # Record 탭별 콘텐츠
├── utils/
│   └── layoutGraph.ts               # dagre 그래프 자동 레이아웃
```

## 빌드 명령어

```bash
npm run dev          # Vite 개발 서버 (HMR, localhost:5173)
npm run build        # tsc -b && vite build (TypeScript 컴파일 후 번들)
npm run lint         # ESLint 검사
npm run preview      # 프로덕션 빌드 미리보기
npm run deploy       # 빌드 검증 + git push origin main → CF 자동 배포
npm run test         # Vitest 시나리오 데이터 검증 테스트
npm run deploy:preview  # 빌드 검증 + git push origin HEAD → CF 프리뷰 배포
```

## 빌드 출력
- JS 메인: ~277KB (gzip ~78KB) — React.lazy + manualChunks 적용
- JS vendor-xyflow: ~284KB (gzip ~95KB) — @xyflow/react + dagre
- JS lazy 청크: DashboardPage ~24KB, TourOverlay ~8KB, HRContextView ~8KB, ZoneGraph ~7KB, DocsPage ~6KB
- CSS: ~52KB (gzip ~10KB)

## 배포 환경
- Cloudflare Pages Git 통합 (`main` push 시 자동 배포, PR → Preview)
- 프로젝트명: `hr-decision-prototype` (Pages URL: `hr-decision-prototype.pages.dev`)
- 커스텀 도메인: `hr2.minu.best`
- SPA 라우팅: `public/_headers` 파일로 설정
- GitHub Actions CI: `.github/workflows/ci.yml` (lint + build 검증 전용, 배포는 CF 담당)
- deploy 스크립트: `npm run deploy` (build + git push origin main) / `npm run deploy:preview` (build + git push origin HEAD)

## 제약 사항
- 백엔드 API 없음 — 정적 JSON + scenarios.ts 데이터만 사용
- 라우팅: Zustand `activePage` 기반 조건부 렌더링 (React Router 미사용, 3페이지: workflow/dashboard/docs)
- 다크/라이트 테마: CSS 변수 기반 (`data-theme` 속성), Zustand `theme` 상태, localStorage 퍼시스턴스
- 국제화(i18n): 경량 자체 구현 (`src/i18n/`), useT() hook, KO/EN 토글, localStorage 퍼시스턴스
- 접근성(a11y) 기본 구현 — ARIA roles/labels, 키보드 nav, screen reader 지원
- TypeScript strict 모드 활성화
- ESLint 코드 품질 검사 활성화
- Vitest 157 tests (83 데이터 검증 + 74 UI 컴포넌트 — @testing-library/react, jsdom)
