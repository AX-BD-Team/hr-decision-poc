# Active Context

## 현재 단계
DecisionCriteriaPanel, DataReadinessPanel 신규 컴포넌트 완성 + Zone 1 통합 + 검증 강화. 4개 시나리오 (S1~S4) 브라우저 검증 완료. `npm run build` 통과.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `cb4e0f3` | feat: DecisionCriteriaPanel, DataReadinessPanel 신규 + 검증 강화 + Header badge + Zone 1 통합 |
| `3d04a91` | feat: 데모 인트로 모달 — DemoIntroModal 컴포넌트, DemoStepDescription 타입, demo i18n 키, isDemoIntroOpen 상태 |
| `25558ad` | feat: 대시보드 데이터 kt ds 규모(1,700명)로 업데이트 — Cloud/AI 핵심역량 반영, 58개 프로젝트, 조직명 실제 부문명 |
| `52caf96` | docs: Memory Bank 업데이트 — 시나리오 데이터 점검 + Zone 3 Portal 수정 |
| `8df4183` | fix: Zone 3 그래프 expand 모드 — createPortal로 transform 조상 우회 |

## 이번 세션 변경 사항

### DecisionCriteriaPanel 신규 컴포넌트
- `DecisionCriteriaPanel.tsx` — 시나리오별 5개 의사결정 기준 체크박스 UI
- CheckSquare/Square 아이콘, evidenceCount 배지, description 표시
- store의 `checkedCriteria` / `toggleCriterion` 연동

### DataReadinessPanel 신규 컴포넌트
- `DataReadinessPanel.tsx` — dataSources readiness 상태 요약
- 색상 코딩 progress bar (available=green, recommended=yellow, missing=red)
- non-available 소스의 readinessNote 표시

### Zone 1 통합
- `ZoneDataIngestion.tsx`에 DecisionCriteriaPanel + DataReadinessPanel 통합
- Zone 1 상단에 배치 (데이터 소스 카드 위)

### 검증 강화 (validateScenario.ts)
- entity type 유효성 검증 (VALID_ENTITY_TYPES set)
- edge type 유효성 검증 (VALID_EDGE_TYPES set)
- decisionCriteria 개수 === 5 검증
- badge 검증 (S3=Phase-2, S4=HRD)
- readiness 필드 유효성 검증

### Header badge 표시
- 4개 시나리오 badge 색상 코딩 (TO=blue, R&R=purple, Phase-2=amber, HRD=green)

### 4개 시나리오 브라우저 검증 완료
- S1 (TO 추가 요청), S2 (상시 조직 변경/R&R), S3 (사업화/Phase-2), S4 (역량 강화/HRD) 모두 정상 확인

## 현재 작업 포커스
- 빌드 통과 (`npm run build` 성공)
- 4개 시나리오 모두 브라우저 검증 완료

## 다음 작업 목록 (우선순위순)
1. **배포** — 프로덕션 배포
2. **DemoIntroModal App.tsx 연동** — 시나리오 선택 시 인트로 모달 표시
3. **추가 기능 요청 대기**

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
- 배포: Cloudflare Pages (`/deploy` 스킬 + wrangler)
- 테스트: Vitest (191 tests — 117 데이터 검증 + 74 UI 컴포넌트), `npm run test`
- 런타임 검증: `validateScenario.ts` (dev-only, edge/relatedPaths/relatedEntityIds/utilizationMap 역참조)
