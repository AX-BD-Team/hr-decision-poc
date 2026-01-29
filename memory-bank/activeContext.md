# Active Context

## 현재 단계
모든 기능 구현 완료. i18n(KO/EN), 다크/라이트 테마, UI 컴포넌트 테스트 인프라 구축 완료. 프로덕션 배포 대기.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `bd08ef2` | feat: 나머지 14개 컴포넌트 i18n 마이그레이션 완료 |
| `0261fb6` | feat: ZoneDecisionPaths, ZoneGraph 남은 라벨 i18n 적용 |
| `95a9ea1` | feat: ZoneGraph, ZoneStructuring 라벨 i18n 적용 |
| `56a996f` | feat: i18n 커버리지 확장 — locale 토글, 대시보드/zone/차트 번역 |
| `bdb1f95` | feat: locale 토글 상태 + i18n 기반 구축 |
| `f36c97e` | feat: PageNav/Header 모바일 메뉴에 테마 토글 버튼 추가 |
| `4900a26` | fix: 버튼 hover에 color-mix 사용 (CSS 변수 호환) |

## 이번 세션 변경 사항

### 1. Git Push (27 커밋)
- 이전 세션의 미 push 커밋 + 이번 세션 커밋 모두 `origin main`에 push

### 2. UI 컴포넌트 테스트 인프라 구축
- **의존성 설치**: @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom
- **vitest.config.ts** 신규 생성 (jsdom 환경, 글로벌, 셋업 파일)
- **src/test/setup.ts** — jest-dom matchers 등록
- **src/test/utils.tsx** — 커스텀 render(resetStore + userEvent)
- **6개 컴포넌트 테스트 파일**: DataLabelBadge(11), PageNav(4), KpiCardGrid(4), TalentTable(5), DashboardPage(5), ZoneDecisionPaths(5) → 총 34 UI 테스트
- 전체 105 tests (71 데이터 + 34 컴포넌트) 통과

### 3. 다크/라이트 테마 시스템
- CSS 변수 기반 다크/라이트 테마 (~50 CSS 변수)
- Tailwind 색상 토큰 → CSS 변수 참조 (appBg, panelBg, textMain, textSub, surface)
- CHART_COLORS/PANEL_BG → CSS 변수 참조
- Theme 타입 + Zustand toggleTheme + localStorage 퍼시스턴스
- PageNav + Header 모바일 메뉴에 Sun/Moon 토글

### 4. 국제화(i18n) 시스템
- **경량 자체 구현** (외부 라이브러리 없음): `src/i18n/` (ko.ts, en.ts, index.ts)
- **useT() hook**: dot-path 키 해석 (`t('dashboard.title')`)
- **타입 안전성**: `as const` + `Widen<T>` 유틸리티 타입
- **Locale 상태**: Zustand toggleLocale + localStorage 퍼시스턴스
- **KO|EN 토글**: PageNav + Header 모바일 메뉴
- **38개 컴포넌트 마이그레이션**: 모든 하드코딩 한국어 → `t()` 호출 교체

### 빌드 결과
- `npm run build` 통과
- `npm run lint` 통과 (0 errors, 1 warning)
- `npm run test` 통과 (105/105)

## 현재 작업 포커스
- 모든 기능 구현 완료
- 프로덕션 배포 대기

## 다음 작업 목록 (우선순위순)
1. **Cloudflare 배포** — 프로덕션 배포 (`/deploy`)
2. **라이트 테마 시각 검증** — 브라우저에서 light mode 확인
3. **ErrorBoundary i18n** — ErrorBoundary는 클래스 컴포넌트라 hook 사용 불가, props로 번역 전달 필요
4. **추가 컴포넌트 테스트** — 커버리지 확장

## 알려진 이슈 — 모두 해결됨
- ~~#1~10: 이전 이슈~~ → 모두 해결

## 활성 결정 사항
- 페이지 라우팅: Zustand `activePage` 상태 기반 (React Router 미사용, 단순 조건부 렌더링)
- 데이터 소스: 독립 JSON 파일 (`demo-s1.json`, `demo-s2.json`, `demo-s3.json`, `dashboard-data.json`) + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어 (`loadingPhase`, `isContextSidebarOpen`, `activePage`, `theme`, `locale`)
- 스타일링: Tailwind CSS + CSS 변수 테마 (`data-theme` 속성) + 시맨틱 디자인 토큰 체계
- 테마: CSS 변수 기반 다크/라이트, localStorage 퍼시스턴스, `CHART_COLORS`는 CSS 변수 참조
- i18n: 경량 자체 구현 (`src/i18n/`), `useT()` hook, KO/EN 토글, localStorage 퍼시스턴스
- 그래프: @xyflow/react v12, dagre 자동 레이아웃, 커스텀 `EntityNode`
- 산점도: 순수 SVG 기반 (`UtilizationScatterChart.tsx`)
- 대시보드 차트: 순수 SVG (stroke 도넛, squarified 트리맵, 그룹 바차트+라인) — 외부 차트 라이브러리 미사용
- 대시보드 테이블: TalentTable(정렬/필터), WorkforceDetailTable(스파크라인) — 로컬 state만 사용
- 배포: Cloudflare Pages (`/deploy` 스킬 + wrangler)
- 레이아웃: flex (main + aside sidebar), `grid-cols-[360px_1fr]` 내부 그리드
- Error Boundary: zone 레벨 격리
- Tour: `TourOverlay` (portal, 9스텝, 키보드/다이얼로그 a11y)
- 테스트: Vitest (105 tests — 71 데이터 검증 + 34 UI 컴포넌트), `npm run test`
- 런타임 검증: `validateScenario.ts` (dev-only, edge/relatedPaths/relatedEntityIds/utilizationMap 역참조)
- 모바일: sm 미만 3-row Header + overflow menu, sm+ 기존 레이아웃
