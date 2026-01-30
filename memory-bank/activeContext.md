# Active Context

## 현재 단계
모든 핵심 기능 구현 완료. 스킬 시스템 최적화 + 문서 현행화 완료 (2026-01-30). 프로덕션 배포 완료.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| (pending) | chore: session-end 스킬에서 배포 로직 제거 + CLAUDE.md 스킬 문서 업데이트 |
| `ce63d40` | docs: CLAUDE.md 전면 업데이트 — 프로젝트 구조, 테스트 명령어, 엔티티 타입, docs 목록 |
| `f0e0f5d` | docs: update Memory Bank — session-end deploy 통합, DocSection 타입 준비 |
| `6c6c460` | feat: 문서 상세보기 Master-Detail UI |
| `67d9d32` | feat: DocSection 타입, 문서 상세보기 i18n 키, DocCard 테스트 수정 |

## 이번 세션 변경 사항

### 스킬 시스템 최적화 (2026-01-30)
- **`/session-end` 스킬 리팩터링** — Phase 3 (배포) 제거로 `/deploy`와 중복 해소. 142줄 → 110줄. 단일 책임 원칙 적용.
- **CLAUDE.md 스킬 문서 업데이트** — 스킬 테이블 설명 수정, 스킬 상세 섹션 추가, 3가지 워크플로우 패턴 제공
- **Memory Bank 업데이트** — activeContext에 세션 반영, systemPatterns에 composable skills 패턴 추가

## 현재 작업 포커스
- 스킬 시스템 최적화 완료
- 각 스킬은 단일 책임 원칙: `/session-end` (커밋+MB), `/deploy` (배포)

## 다음 작업 목록 (우선순위순)
1. **Todo Issue 작업** (GitHub Project #3):
   - #26 백엔드 API 연동 (P1/XL)
   - #28 고급 분석 기능 — What-if 시뮬레이션, 시나리오 비교 (P1/XL)
   - #24 추가 시나리오 확장 S5+ (P2/L)
   - #25 E2E 테스트 도입 (P2/L)
   - #27 성능 모니터링 & 최적화 (P2/M)

## 알려진 이슈 — 모두 해결됨
| # | 설명 | 심각도 | 상태 |
|---|------|--------|------|
| ~~1~12~~ | 이전 이슈 | - | 모두 해결 |

## 활성 결정 사항
- 페이지 라우팅: Zustand `activePage` 상태 기반 (React Router 미사용, 단순 조건부 렌더링)
- 데이터 소스: 독립 JSON 파일 (`demo-s1.json`~`demo-s4.json`, `dashboard-data.json`) + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어 (`loadingPhase`, `isContextSidebarOpen`, `activePage`, `theme`, `locale`, `checkedCriteria`)
- 스타일링: Tailwind CSS + CSS 변수 테마 (`data-theme` 속성) + 시맨틱 디자인 토큰 체계
- 테마: CSS 변수 기반 다크/라이트, localStorage 퍼시스턴스, `CHART_COLORS`는 CSS 변수 참조
- i18n: 경량 자체 구현 (`src/i18n/`), `useT()` hook + `getT()` 비-hook 함수, KO/EN 토글, localStorage 퍼시스턴스
- 그래프: @xyflow/react v12, dagre 자동 레이아웃, 커스텀 `EntityNode`, expand/collapse 전체화면
- 산점도: 순수 SVG 기반 (`UtilizationScatterChart.tsx`)
- 대시보드 차트: 순수 SVG (stroke 도넛, squarified 트리맵, 그룹 바차트+라인) — 외부 차트 라이브러리 미사용
- 배포: Cloudflare Pages Git 통합 (`main` push 시 자동 배포), deploy 스크립트 = git push
- 테스트: Vitest (191 tests — 117 데이터 검증 + 74 UI 컴포넌트), `npm run test`
- 런타임 검증: `validateScenario.ts` (dev-only, edge/relatedPaths/relatedEntityIds/utilizationMap 역참조)
- **스킬 시스템**: 단일 책임 + composable 패턴 — `/session-end` (커밋+MB), `/deploy` (배포), `/session-start` (컨텍스트 복원)
