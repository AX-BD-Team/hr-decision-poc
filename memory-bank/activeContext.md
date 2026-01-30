# Active Context

## 현재 단계
모든 핵심 기능 구현 완료. 프로덕션 배포 완료. DocsPage 문서 상세보기 타입/i18n 준비 완료 (2026-01-30). `/session-end` 스킬에 배포 Phase 통합 완료.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `67d9d32` | feat: DocSection 타입, 문서 상세보기 i18n 키, DocCard 테스트 수정 |
| `c7b5acf` | feat: project-board.ts를 GitHub Project #3 실데이터 28개로 교체 + BoardCard 라벨 스타일 업데이트 |
| `125436b` | feat: Kanban 보드 뷰 — BoardColumn, ProjectBoard, DocsPage 탭 전환 |
| `ffb41fc` | feat: 프로젝트 보드 UI — BoardCard, ProjectItem 타입, i18n 키 |
| `95cb6c8` | docs: update Memory Bank — deploy scripts git push 전환 |

## 이번 세션 변경 사항

### session-end 스킬에 deploy 통합 (2026-01-30)
- **`/session-end` 스킬 Phase 3 추가**: 커밋 → Memory Bank → 배포 원스텝 워크플로우
  - `--no-deploy`: 배포 단계 건너뛰기
  - `--preview`: 프리뷰 배포 (`git push origin HEAD`)
  - 기본: 프로덕션 배포 (`git push origin main`)

### 문서 상세보기 타입/i18n 준비 (2026-01-30)
- **`DocSection` 인터페이스** 추가 (`heading` + `content`)
- **`DocMeta.sections`** 필드 추가
- **i18n 키 추가**: `backToList`, `viewDetail`, `tableOfContents` (ko/en)
- **`DocCard.test.tsx` 수정**: `sections: []` + `onSelect={noop}` 추가

## 현재 작업 포커스
- 모든 핵심 기능 구현 완료
- 문서 상세보기(DocDetail) 컴포넌트 구현 준비됨 (타입/i18n 완료)
- `/session-end` 스킬이 배포까지 통합 처리

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
