# Active Context

## 현재 단계
페이지 라우팅 + 대시보드/문서 페이지 구현 완료.
workflow/dashboard/docs 3개 페이지 네비게이션 추가. Cloudflare Pages 프로덕션 배포 완료.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `57b7497` | feat: dashboard, docs 페이지 + PageNav 페이지 네비게이션 추가 |
| `94e1f4f` | fix: Header 미사용 import/변수 제거 |
| `9c9e8f2` | feat: 페이지 라우팅 state + dashboard/docs 타입 정의 |
| `d6057a6` | perf: recharts 제거, React.lazy + manualChunks 번들 분할 (565KB→277KB) |
| `975bf76` | feat: Zone별 극적 로딩 애니메이션, tailwind keyframes 확장, CSS 애니메이션 |

## 이번 세션 변경 사항

### 페이지 라우팅 시스템
- `PageNav.tsx` — workflow/dashboard/docs 탭 네비게이션 컴포넌트
- `useStore.ts` — `activePage: PageId` 상태 + `setActivePage` 액션 추가
- `types/index.ts` — `PageId`, `DashboardKpi`, `ProjectStatusItem`, `SkillTreemapItem`, `TalentRow`, `MonthlyWorkforceData`, `DashboardData`, `DocMeta` 타입 추가
- `App.tsx` — `DashboardPage`, `DocsPage` lazy import + activePage 기반 조건부 렌더링

### 대시보드 페이지
- `DashboardPage.tsx` — 자원배분/인재정보/인력예측 3탭 구성
- `KpiCardGrid.tsx` — KPI 카드 그리드 (TrendingUp/Down 아이콘)
- `ProjectStatusChart.tsx` — SVG 도넛 차트 (프로젝트 현황)
- `SkillTreemap.tsx` — Squarified treemap 알고리즘 (스킬 분포)
- `dashboard-data.json` — 대시보드 전체 데이터 (KPI, 프로젝트 현황, 스킬 분포, 인재 테이블, 월별 인력)

### 문서 페이지
- `DocsPage.tsx` — 카테고리 필터링 + DocCard 그리드
- `DocCard.tsx` — 문서 카드 컴포넌트
- `docs-meta.ts` — 6개 문서 메타데이터

### 빌드 오류 수정
- `DashboardPage.tsx` 누락 (TS2307) → 파일 생성으로 해결
- `SkillTreemap.tsx` 미사용 변수 `total` (TS6133) → 제거

### 빌드 결과
| 청크 | 크기 |
|------|------|
| `index.js` (메인) | 279 KB |
| `vendor-xyflow.js` | 284 KB |
| `DashboardPage.js` | 16.5 KB |
| `TourOverlay.js` | 8.3 KB |
| `HRContextView.js` | 7.8 KB |
| `ZoneGraph.js` | 6.9 KB |
| `DocsPage.js` | 5.6 KB |

## 현재 작업 포커스
- 페이지 라우팅 + 대시보드/문서 페이지 구현 완료
- Cloudflare Pages 프로덕션 배포 완료

## 다음 작업 목록 (우선순위순)
1. **국제화(i18n)** — 하드코딩 한국어 다국어 지원
2. **다크/라이트 테마** — 테마 전환 기능
3. **UI 컴포넌트 테스트** — Vitest/Testing Library
4. **대시보드 인터랙션 강화** — 차트 클릭 드릴다운, 필터링 등

## 알려진 이슈 — 모두 해결됨
- ~~#1~8: 이전 이슈~~ → 모두 해결
- ~~#9 DashboardPage.tsx 누락 (TS2307)~~ → 해결 (파일 생성)
- ~~#10 SkillTreemap 미사용 변수 (TS6133)~~ → 해결 (제거)

## 활성 결정 사항
- 페이지 라우팅: Zustand `activePage` 상태 기반 (React Router 미사용, 단순 조건부 렌더링)
- 데이터 소스: 독립 JSON 파일 (`demo-s1.json`, `demo-s2.json`, `demo-s3.json`, `dashboard-data.json`) + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어 (`loadingPhase` phased 로딩, `isContextSidebarOpen` 사이드바, `activePage` 라우팅)
- 스타일링: Tailwind CSS (커스텀 다크 테마) + 시맨틱 디자인 토큰 체계
- 그래프: @xyflow/react v12, dagre 자동 레이아웃, 커스텀 `EntityNode`
- 산점도: 순수 SVG 기반 (`UtilizationScatterChart.tsx`)
- 대시보드 차트: 순수 SVG (도넛 차트, 트리맵, 바 차트) — 외부 차트 라이브러리 미사용
- 배포: Cloudflare Pages (`/deploy` 스킬 + wrangler)
- 레이아웃: flex (main + aside sidebar), `grid-cols-[360px_1fr]` 내부 그리드
- Error Boundary: zone 레벨 격리
- Tour: `TourOverlay` (portal, 9스텝, 키보드/다이얼로그 a11y)
- 테스트: Vitest (17 tests), `npm run test`
- 모바일: sm 미만 3-row Header + overflow menu, sm+ 기존 레이아웃
