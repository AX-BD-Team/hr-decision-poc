# Active Context

## 현재 단계
모든 기능 구현 완료. i18n(KO/EN), 다크/라이트 테마, UI 컴포넌트 테스트 인프라 구축 완료. **프로덕션 배포 완료** (Cloudflare Pages). ErrorBoundary i18n 마이그레이션 완료.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `7783cce` | feat: ErrorBoundary i18n 마이그레이션 — getT() 헬퍼 함수, fallbackTitleKey prop |
| `7da6d21` | fix: Header 테마 토글 aria-label 하드코딩 한국어 → i18n 교체 |
| `bd08ef2` | feat: 나머지 14개 컴포넌트 i18n 마이그레이션 완료 |
| `0261fb6` | feat: ZoneDecisionPaths, ZoneGraph 남은 라벨 i18n 적용 |
| `56a996f` | feat: i18n 커버리지 확장 — locale 토글, 대시보드/zone/차트 번역 |

## 이번 세션 변경 사항

### ErrorBoundary i18n 마이그레이션
- **`getT()` 함수 추가** (`src/i18n/index.ts`) — 클래스 컴포넌트용 비-hook 번역 함수
- **ErrorBoundary 리팩토링** — `fallbackTitle` → `fallbackTitleKey` prop (i18n 키 기반)
- **errorBoundary 네임스페이스** ko.ts/en.ts에 추가 (defaultTitle, description, retry, 6개 zone별 에러 타이틀)
- **App.tsx** — 모든 ErrorBoundary 사용처 `fallbackTitleKey` prop으로 교체

### 브라우저 전체 페이지 검증 완료
- Decision Workflow (EN + Dark) ✅
- Dashboard > Resource Allocation (EN + Dark) ✅
- Dashboard > Talent Info (EN + Dark) ✅
- Dashboard > Workforce Forecast (EN + Dark) ✅
- Documents (EN + Dark) ✅

## 현재 작업 포커스
- 모든 기능 구현 + 배포 완료
- 전체 페이지 브라우저 검증 완료 (Documents 페이지 포함)

## 다음 작업 목록 (우선순위순)
1. **추가 컴포넌트 테스트** — 커버리지 확장
2. **라이트 테마 미세 조정** — 일부 글래스 패널/그래프 노드 가시성 개선 (필요 시)

## 알려진 이슈 — 모두 해결됨
- ~~#1~10: 이전 이슈~~ → 모두 해결

## 활성 결정 사항
- 페이지 라우팅: Zustand `activePage` 상태 기반 (React Router 미사용, 단순 조건부 렌더링)
- 데이터 소스: 독립 JSON 파일 (`demo-s1.json`, `demo-s2.json`, `demo-s3.json`, `dashboard-data.json`) + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어 (`loadingPhase`, `isContextSidebarOpen`, `activePage`, `theme`, `locale`)
- 스타일링: Tailwind CSS + CSS 변수 테마 (`data-theme` 속성) + 시맨틱 디자인 토큰 체계
- 테마: CSS 변수 기반 다크/라이트, localStorage 퍼시스턴스, `CHART_COLORS`는 CSS 변수 참조
- i18n: 경량 자체 구현 (`src/i18n/`), `useT()` hook + `getT()` 비-hook 함수, KO/EN 토글, localStorage 퍼시스턴스
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
