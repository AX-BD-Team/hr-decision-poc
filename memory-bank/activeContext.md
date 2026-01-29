# Active Context

## 현재 단계
4개 시나리오 완전 교체 완료. 시나리오 데이터 점검 완료 — S1~S4 전 항목 PASS. Zone 3 그래프 expand 모드 Portal 방식 수정. `npm run build` 통과.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `8df4183` | fix: Zone 3 그래프 expand 모드 — createPortal로 transform 조상 우회 + S4 utilizationMap 채우기 + S1/S2 badge 추가 + docs 추가 |
| `3300696` | feat: Zone 3 그래프 expand/collapse 전체화면 모드 |
| `aa9f60c` | feat: Zone UI 강화 — DecisionPaths Evidence/Assumptions/Limitations 블록, Structuring 새 패턴 아이콘, i18n 번역, 테스트 업데이트 |
| `636044c` | feat: S4 시나리오 데이터 추가 + S1-S3 JSON readiness/decisionCriteria 보강 + Header badge + Zone 1 readiness UI |
| `c330d1a` | fix: EntityNode 타입 에러 해결 — capability/stage/training_program 아이콘 + decisionCriteria optional |

## 이번 세션 변경 사항

### 시나리오 데이터 점검 및 수정
- **점검 결과**: S1~S4 전 항목 PASS (meta, entities, edges, assumptions, evidence, riskSignals, decisionPaths, 참조 무결성)
- **Fix 1**: S4 `utilizationMap` 빈 배열 → 5개 포인트 채움 (cap-digital, cap-leadership, cap-domain, role-trainer, person-mentor)
- **Fix 2**: S1 `meta.badge` 추가 ("TO"), S2 `meta.badge` 추가 ("R&R")
- dev 서버에서 S1/S2 badge pill 표시, S4 산점도 데이터 표시 확인 완료

### Zone 3 그래프 expand 모드 수정
- **문제**: `animate-stagger-2` CSS 클래스의 `transform` 속성이 CSS spec에 따라 `position:fixed`의 containing block이 되어, expand 모드가 viewport 대신 section 기준으로 위치
- **해결**: `createPortal(expandedContent, document.body)`로 transform 조상 우회, placeholder div로 grid 레이아웃 보존

### 문서 추가
- `docs/prototype_scenarios_v1.md` — 4개 시나리오 명세 문서
- `docs/4scenario_data_mapping_v1_20260129.xlsx` — 시나리오 데이터 매핑 엑셀

## 현재 작업 포커스
- 빌드 통과 (`npm run build` 성공)
- 시나리오 데이터 무결성 점검 완료 (S1~S4 전 항목 PASS)
- 배포 준비 완료

## 다음 작업 목록 (우선순위순)
1. **배포** — 프로덕션 배포
2. **DecisionCriteriaPanel 신규 컴포넌트** — 5개 기준 체크박스 UI (store의 checkedCriteria 활용)
3. **DataReadinessPanel** — readiness 상태 요약 패널 (또는 Zone 1 확장)
4. **추가 기능 요청 대기**

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
