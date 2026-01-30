# Active Context

## 현재 단계
모든 핵심 기능 구현 완료. Claude Code 스킬/설정 효율화 완료 (2026-01-30). 프로덕션 배포 완료.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `902f5de` | docs: update Memory Bank — 문서 정리 및 현행화, 4파일 현행 동기화 |
| `ce63d40` | docs: CLAUDE.md 전면 업데이트 — 프로젝트 구조, 테스트 명령어, 엔티티 타입, docs 목록 |
| `f0e0f5d` | docs: update Memory Bank — session-end deploy 통합, DocSection 타입 준비 |
| `6c6c460` | feat: 문서 상세보기 Master-Detail UI |
| `67d9d32` | feat: DocSection 타입, 문서 상세보기 i18n 키, DocCard 테스트 수정 |

## 이번 세션 변경 사항

### Claude Code 스킬/설정 점검 및 효율화 (2026-01-30)

**변경된 파일** (모두 `.gitignore` 대상, git 추적 외):

1. **`.claude/skills/deploy/skill.md`** — URL/명령어 하드코딩 제거 → CLAUDE.md 참조 방식으로 전환
   - `hr2.minu.best`, `hr-decision-prototype.pages.dev` 직접 기재 제거
   - `npm run lint`, `npm run build` 직접 기재 → "CLAUDE.md에 정의된 명령어 사용" 지시
   - **효과**: CLAUDE.md만 프로젝트별로 변경하면 deploy 스킬 그대로 재사용 가능

2. **`.claude/settings.local.json`** — 68개 → 41개 규칙 정리 + hooks 추가
   - 일회성 특정 경로 규칙 27개 제거 (del, ls, dir, powershell, git -C 등)
   - 와일드카드 통합 (`npm run *`, `npx vitest *`, `ls *` 등)
   - 비범용 WebFetch 도메인 제거 (hr2.minu.best, docs.cline.bot, awesomescreenshot.com)
   - **hooks 추가**: `PreToolUse` — `git commit` 전 자동 `npm run lint` (non-blocking)

3. **`~/.claude/settings.json`** (글로벌) — 잔존 규칙 5개 제거
   - `ax-discovery-portal` 프로젝트의 긴 커밋 메시지 3개 (git commit:* 와일드카드로 커버)
   - 특정 프로젝트 경로 ls 규칙 1개
   - `Read(//d/**)` D드라이브 전체 읽기 허용 (과도한 권한)

4. **CLAUDE.md** — 변경 불필요 (스킬 테이블이 이미 현재 상태와 동기화)

## 현재 작업 포커스
- 스킬/설정 효율화 완료
- 이식 가능한 구조 달성: `.claude/skills/*`, `.claude/settings.local.json` 그대로 복사 가능
- 프로젝트별 수정 필요: `CLAUDE.md`, `.clinerules`, `memory-bank/*.md` 내용만

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
- **스킬 시스템**: 단일 책임 + composable + CLAUDE.md 참조 패턴 — 이식 가능한 구조
- **설정 관리**: 와일드카드 통합 + hooks 자동화 (git commit 전 lint)
