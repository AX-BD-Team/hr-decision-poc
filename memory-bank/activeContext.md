# Active Context

## 현재 단계
테스트 & 검증 체계 대폭 강화 완료 (17→71 tests). 모든 기능 구현 완료, 프로덕션 배포 대기.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `3b364be` | test: 시나리오 검증 확장 — 71 tests, 참조 무결성, enum/범위 검증 |
| `d216ed3` | docs: Memory Bank 업데이트 — 세션 종료, 브라우저 검증, git 정리 |
| `c7090d1` | chore: tool artifacts gitignore 추가 |
| `358ed7e` | chore: public/docs/ 6개 문서 파일 커밋 |
| `1376285` | feat: 대시보드 재설계 — 컴포넌트 추출, 인터랙션/애니메이션 강화 |

## 이번 세션 변경 사항

### 테스트 & 검증 체계 강화 (17→71 tests)
- **참조 무결성 — relatedPaths**: assumption/evidence/riskSignal → decisionPath ID 역참조 검증
- **참조 무결성 — relatedEntityIds**: decisionPath/riskSignal/utilizationMap.entityId → entity ID 역참조 검증
- **Enum 유효성**: EntityType, EdgeType, severity, riskLevel, effectLevel, assumption.category, insight.severity, analysisPattern.type, dataSource.type
- **값 범위 유효성**: coverage 0~100, dependency 0~1, edge.weight 0~1
- **validateScenario.ts 확장**: `orphan_related_path`, `orphan_related_entity` 에러 타입 추가, relatedPaths/relatedEntityIds/utilizationMap.entityId 역참조 런타임 검증
- **CHART_COLORS 상수 추가**: SVG 인라인 스타일용 색상 상수 (`constants/tokens.ts`)
- **S1 JSON 포맷 정리**: pretty-printed → compact (S2/S3와 동일 형식, 데이터 변경 없음)

### 빌드 결과
- 71 tests all pass
- 프로덕션 빌드 성공

## 현재 작업 포커스
- 모든 기능 구현 완료
- 테스트 & 검증 체계 강화 완료
- 프로덕션 배포 대기 (origin 대비 27 커밋 ahead)

## 다음 작업 목록 (우선순위순)
1. **git push + Cloudflare 배포** — 27 커밋 push 후 프로덕션 배포
2. **국제화(i18n)** — 하드코딩 한국어 다국어 지원
3. **다크/라이트 테마** — 테마 전환 기능
4. **UI 컴포넌트 테스트** — Vitest/Testing Library

## 알려진 이슈 — 모두 해결됨
- ~~#1~10: 이전 이슈~~ → 모두 해결

## 활성 결정 사항
- 페이지 라우팅: Zustand `activePage` 상태 기반 (React Router 미사용, 단순 조건부 렌더링)
- 데이터 소스: 독립 JSON 파일 (`demo-s1.json`, `demo-s2.json`, `demo-s3.json`, `dashboard-data.json`) + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어 (`loadingPhase` phased 로딩, `isContextSidebarOpen` 사이드바, `activePage` 라우팅)
- 스타일링: Tailwind CSS (커스텀 다크 테마) + 시맨틱 디자인 토큰 체계
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
