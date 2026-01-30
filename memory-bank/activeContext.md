# Active Context

## 현재 단계
Deploy 스크립트를 `wrangler pages deploy` → `git push` 방식으로 전환 완료. CF Git 통합 배포 파이프라인 완성. `npm run build` 통과.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `b989881` | chore: deploy 스크립트를 git push 방식으로 전환 (wrangler pages deploy 제거) |
| `2c32f3a` | chore: CF Pages 배포 설정 마이그레이션 — hr-decision-support → hr-decision-prototype, Git 통합 방식 전환 |
| `cb4e0f3` | feat: DecisionCriteriaPanel, DataReadinessPanel 신규 + 검증 강화 + Header badge + Zone 1 통합 |
| `3d04a91` | feat: 데모 인트로 모달 — DemoIntroModal 컴포넌트, DemoStepDescription 타입, demo i18n 키, isDemoIntroOpen 상태 |
| `25558ad` | feat: 대시보드 데이터 kt ds 규모(1,700명)로 업데이트 — Cloud/AI 핵심역량 반영, 58개 프로젝트, 조직명 실제 부문명 |

## 이번 세션 변경 사항

### Deploy 스크립트 git push 전환
- `package.json`: `deploy` → `npm run build && git push origin main`, `deploy:preview` → `npm run build && git push origin HEAD`
- `CLAUDE.md`: 배포 명령어 설명 업데이트 (git push 기반)
- `.claude/skills/deploy/skill.md`: 배포 플로우를 git push 기반으로 재작성 (Step 4~5 변경)

## 현재 작업 포커스
- Deploy 스크립트 git push 전환 완료
- 빌드 통과 (`npm run build` 성공)

## 다음 작업 목록 (우선순위순)
1. **DemoIntroModal App.tsx 연동** — 시나리오 선택 시 인트로 모달 표시
2. **추가 기능 요청 대기**

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
