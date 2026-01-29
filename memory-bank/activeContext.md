# Active Context

## 현재 단계
디자인 시스템 토큰 통합 + 다크/라이트 테마 기반 구축 완료. 모든 기능 구현 완료, 프로덕션 배포 대기.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `f36c97e` | feat: PageNav/Header 모바일 메뉴에 테마 토글 버튼 추가 |
| `4900a26` | fix: 버튼 hover에 color-mix 사용 (CSS 변수 호환) |
| `338c00b` | feat: Header 테마 토글 UI + main.tsx 테마 초기 적용 |
| `83db624` | feat: toggleTheme 액션 구현 |
| `491e628` | feat: Theme 타입 + 다크/라이트 토글 (localStorage) |
| `2f2085d` | refactor: CHART_COLORS/PANEL_BG에 CSS 변수 사용 + layout 상수 |
| `e88f813` | refactor: CSS 변수 테마 + CHART_COLORS 마이그레이션 |

## 이번 세션 변경 사항

### 디자인 시스템 토큰 통합
- **CHART_COLORS 상수**: `tokens.ts`에 18개 SVG 인라인 색상 토큰 추가, CSS 변수(`var(--chart-*)`) 참조
- **SVG 하드코딩 교체**: 7개 SVG 컴포넌트에서 30+ hex/rgba 리터럴을 `CHART_COLORS.*`로 교체
- **버튼 유틸리티 클래스**: `.btn-primary`, `.btn-secondary`, `.btn-ghost` — `index.css`에 추가
- **레이아웃 상수**: `constants/layout.ts` 신규 (DOCK_COLLAPSED/MIN/MAX_HEIGHT), Dock.tsx 적용
- **severity.critical 차별화**: `#FF4D4F` → `#DC2626` (severity.high와 구분)
- **CSS 변수 기본값**: `:root`에 `--zone-accent`, `--zone-accent-rgb` 선언

### 다크/라이트 테마 인프라 (병렬 작업)
- **CSS 변수 테마**: `:root[data-theme="dark"]` / `:root[data-theme="light"]` 전체 팔레트 선언
- **Tailwind CSS 변수 연동**: `appBg`, `panelBg`, `textMain`, `textSub`, `neutralGray`, `surface` → CSS 변수 참조
- **Theme 상태 관리**: `Theme` 타입, `useStore.toggleTheme()`, localStorage 퍼시스턴스
- **테마 토글 UI**: PageNav + Header 모바일 메뉴에 Sun/Moon 버튼
- **color-mix 호환**: 버튼 hover에 `color-mix(in srgb, ...)` 사용 (CSS 변수 + opacity)

### 빌드 결과
- `npm run build` 통과
- `npm run lint` 통과

## 현재 작업 포커스
- 디자인 시스템 토큰 통합 완료
- 다크/라이트 테마 기반 구축 완료
- 프로덕션 배포 대기

## 다음 작업 목록 (우선순위순)
1. **git push + Cloudflare 배포** — push 후 프로덕션 배포
2. **라이트 테마 시각 검증** — 실제 브라우저에서 light mode 레이아웃/색상 확인
3. **국제화(i18n)** — 하드코딩 한국어 다국어 지원
4. **UI 컴포넌트 테스트** — Vitest/Testing Library

## 알려진 이슈 — 모두 해결됨
- ~~#1~10: 이전 이슈~~ → 모두 해결

## 활성 결정 사항
- 페이지 라우팅: Zustand `activePage` 상태 기반 (React Router 미사용, 단순 조건부 렌더링)
- 데이터 소스: 독립 JSON 파일 (`demo-s1.json`, `demo-s2.json`, `demo-s3.json`, `dashboard-data.json`) + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어 (`loadingPhase`, `isContextSidebarOpen`, `activePage`, `theme`)
- 스타일링: Tailwind CSS + CSS 변수 테마 (`data-theme` 속성) + 시맨틱 디자인 토큰 체계
- 테마: CSS 변수 기반 다크/라이트, localStorage 퍼시스턴스, `CHART_COLORS`는 CSS 변수 참조
- 그래프: @xyflow/react v12, dagre 자동 레이아웃, 커스텀 `EntityNode`
- 산점도: 순수 SVG 기반 (`UtilizationScatterChart.tsx`)
- 대시보드 차트: 순수 SVG (stroke 도넛, squarified 트리맵, 그룹 바차트+라인) — 외부 차트 라이브러리 미사용
- 대시보드 테이블: TalentTable(정렬/필터), WorkforceDetailTable(스파크라인) — 로컬 state만 사용
- 배포: Cloudflare Pages (`/deploy` 스킬 + wrangler)
- 레이아웃: flex (main + aside sidebar), `grid-cols-[360px_1fr]` 내부 그리드
- Error Boundary: zone 레벨 격리
- Tour: `TourOverlay` (portal, 9스텝, 키보드/다이얼로그 a11y)
- 테스트: Vitest (71 tests — 구조 완전성, 참조 무결성, DataLabel, Enum, 값 범위), `npm run test`
- 런타임 검증: `validateScenario.ts` (dev-only, edge/relatedPaths/relatedEntityIds/utilizationMap 역참조)
- 모바일: sm 미만 3-row Header + overflow menu, sm+ 기존 레이아웃
