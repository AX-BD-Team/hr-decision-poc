# Active Context

## 현재 단계
Zone 1 데이터 소스 카드 인라인 확장 기능 추가 완료. Demo 자동재생과 Tour 오버레이 상태를 분리하여 `isDemoRunning` 도입.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `63afcdb` | feat: isDemoRunning zone pulse를 4개 Zone 전체에 적용 |
| `02cc57f` | feat: Zone 1 데이터 소스 카드 인라인 확장 — 필드 pill badge, 요약 라인, 키보드 접근성, CSS transition |
| `55ea264` | feat: isDemoRunning 상태 분리 — Demo 자동재생을 Tour 오버레이에서 분리, 긴 스텝 간격, Guide 비활성화 |
| `d56909c` | feat: Start Demo zone highlighting 가시성 개선 — glow 강도↑, 펄스 애니메이션, 라이트 테마 glow, skeleton 재생 |
| `b7a6da6` | feat: Zone 2 분석 패턴 카드 리디자인 — severity/metric/findings/affectedScope 필드 + 2x2 그리드 UI |

## 이번 세션 변경 사항

### Zone 1 카드 인라인 확장
- `ZoneDataIngestion.tsx` — `expandedId` 상태 + 카드 클릭 토글, ChevronDown 아이콘 회전, `aria-expanded` 접근성
- `ko.ts` / `en.ts` — `zones.fieldsIncluded` i18n 키 추가 ("포함 필드" / "Included Fields")
- 확장 영역: 필드 pill badge (`bg-surface-2`, mono 폰트) + 요약 라인 (필드 수 · 커버리지)
- CSS transition: `max-height` + `opacity` 200ms ease-in-out

### isDemoRunning 상태 분리
- `useStore.ts` — `isDemoRunning`, `startDemo()`, `stopDemo()` 추가
- `Header.tsx` — Demo 자동재생이 `isTourActive` 대신 `isDemoRunning` 사용, 스텝 간격 확대 (2s→5s), Guide 버튼 Demo 중 비활성화
- `PageNav.tsx` — 중복 KO/EN + 테마 토글 제거 (Header에만 유지)
- 4개 Zone 컴포넌트 — `(isDemoRunning || isTourActive)` 조건으로 펄스 애니메이션 적용

## 현재 작업 포커스
- 전체 기능 구현 + 배포 + 검증 완료
- 157 테스트 모두 통과

## 다음 작업 목록 (우선순위순)
1. **배포** — isDemoRunning + Zone 1 확장 반영 후 프로덕션 배포
2. **추가 기능 요청 대기**

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
- Error Boundary: zone 레벨 격리, i18n 키 기반 (`fallbackTitleKey`)
- Tour: `TourOverlay` (portal, 9스텝, 키보드/다이얼로그 a11y)
- 테스트: Vitest (157 tests — 83 데이터 검증 + 74 UI 컴포넌트), `npm run test`
- 런타임 검증: `validateScenario.ts` (dev-only, edge/relatedPaths/relatedEntityIds/utilizationMap 역참조)
- 모바일: sm 미만 3-row Header + overflow menu, sm+ 기존 레이아웃
