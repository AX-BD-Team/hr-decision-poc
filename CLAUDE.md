# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

O-AOD HR 의사결정 PoC 프로토타입 - HR 의사결정 지원을 위한 React/TypeScript + Vite SPA.

## 빌드 및 개발 명령어

```bash
npm run dev          # Vite 개발 서버 시작 (HMR, localhost:5173)
npm run build        # TypeScript 컴파일 + Vite 프로덕션 빌드
npm run lint         # ESLint 검사
npm run preview      # 프로덕션 빌드 로컬 미리보기
npm run test         # Vitest 단위/데이터 검증 테스트 실행 (191 tests)
npm run deploy       # 빌드 검증 + git push origin main → Cloudflare 자동 배포
npm run deploy:preview # 빌드 검증 + git push origin HEAD → Cloudflare 프리뷰 배포
```

## 기술 스택

- **React 19** + TypeScript
- **Vite 6** 빌드 도구
- **Tailwind CSS** 스타일링
- **Zustand** 상태 관리
- **@xyflow/react** 그래프 시각화
- **Lucide React** 아이콘

## 프로젝트 구조

```
src/
├── main.tsx                          # React DOM 진입점
├── App.tsx                           # 메인 애플리케이션 (4-Zone 레이아웃)
├── index.css                         # Tailwind + glassmorphism 스타일
├── vite-env.d.ts                     # Vite 타입 정의
├── types/index.ts                    # 전체 TypeScript 타입 정의
├── store/useStore.ts                 # Zustand 상태 관리
├── i18n/
│   ├── index.ts                      # useT() hook (dot-path 키 해석)
│   ├── ko.ts                         # 한국어 번역 (기본)
│   └── en.ts                         # 영어 번역
├── constants/
│   ├── tokens.ts                     # 색상 상수 (ENTITY_COLORS, EDGE_COLORS, PANEL_BG, CHART_COLORS)
│   └── layout.ts                     # 레이아웃 상수 (DOCK_COLLAPSED/MIN/MAX_HEIGHT)
├── data/
│   ├── demo-s1.json                  # S1 TO 추가 요청 시나리오 데이터
│   ├── demo-s2.json                  # S2 상시 조직 변경 / R&R 시나리오 데이터
│   ├── demo-s3.json                  # S3 솔루션 사업화 내부 체계 시나리오 데이터
│   ├── demo-s4.json                  # S4 역량 강화 시나리오 데이터
│   ├── scenarios.ts                  # JSON import + type cast + 무결성 검증 호출
│   ├── validateScenario.ts           # 시나리오 참조 무결성 검증
│   ├── tourSteps.ts                  # 9개 투어 스텝 정의
│   ├── dashboard-data.json           # 대시보드 데이터 (KPI, 프로젝트, 스킬, 인재, 인력예측)
│   ├── docs-meta.ts                  # 문서 메타데이터
│   ├── project-board.ts              # 프로젝트 보드 Kanban 데이터
│   └── __tests__/
│       └── scenarios.test.ts         # 시나리오 데이터 검증 테스트
├── test/
│   ├── setup.ts                      # jest-dom matchers 등록
│   └── utils.tsx                     # 커스텀 render (resetStore + userEvent)
├── utils/
│   └── layoutGraph.ts                # dagre 그래프 자동 레이아웃
└── components/
    ├── common/
    │   ├── DataLabelBadge.tsx         # 데이터 라벨 배지
    │   ├── ErrorBoundary.tsx          # Zone 레벨 에러 바운더리
    │   └── SkeletonZone.tsx           # 스켈레톤 로딩 컴포넌트
    ├── layout/
    │   ├── Header.tsx                 # 헤더 (sticky, 시나리오 선택, Guide 버튼)
    │   └── PageNav.tsx                # 페이지 네비게이션 (workflow/dashboard/docs)
    ├── tour/
    │   └── TourOverlay.tsx            # Guided Tour 오버레이
    ├── demo/
    │   └── DemoIntroModal.tsx         # 데모 인트로 모달
    ├── zones/
    │   ├── ZoneDataIngestion.tsx      # Zone 1: 데이터 수집
    │   ├── DecisionCriteriaPanel.tsx  # Zone 1: 의사결정 기준 체크박스
    │   ├── DataReadinessPanel.tsx     # Zone 1: 데이터 준비도 요약
    │   ├── ZoneStructuring.tsx        # Zone 2: 분석 패턴
    │   ├── ZoneGraph.tsx              # Zone 3: 온톨로지 그래프 (ReactFlow)
    │   └── ZoneDecisionPaths.tsx      # Zone 4: 의사결정 경로
    ├── graph/
    │   └── EntityNode.tsx             # 커스텀 ReactFlow 노드
    ├── context/
    │   ├── HRContextView.tsx          # HR 컨텍스트 사이드 패널
    │   └── UtilizationScatterChart.tsx # SVG 기반 산점도
    ├── record/
    │   └── DecisionRecordSection.tsx   # Decision Record 독립 섹션
    ├── loading/
    │   ├── LoadingZone1Ingestion.tsx   # Zone 1 스켈레톤
    │   ├── LoadingZone2Structuring.tsx # Zone 2 스켈레톤
    │   ├── LoadingZone3Graph.tsx       # Zone 3 스켈레톤
    │   └── LoadingZone4Paths.tsx       # Zone 4 스켈레톤
    ├── dashboard/
    │   ├── DashboardPage.tsx          # 대시보드 메인 (3탭: 자원배분/인재/인력예측)
    │   ├── KpiCardGrid.tsx            # KPI 카드 그리드
    │   ├── ProjectStatusChart.tsx     # SVG 도넛 차트
    │   ├── SkillTreemap.tsx           # Squarified 트리맵
    │   ├── TalentTable.tsx            # 인재 테이블
    │   ├── WorkforceFlowChart.tsx     # 바 + 라인 차트
    │   └── WorkforceDetailTable.tsx   # 인력 상세 테이블
    ├── docs/
    │   ├── DocsPage.tsx               # 문서 페이지 (탭: 문서 + 프로젝트 보드)
    │   ├── DocCard.tsx                # 문서 카드
    │   ├── DocDetailView.tsx          # 문서 상세보기 (Master-Detail)
    │   ├── ProjectBoard.tsx           # Kanban 보드 메인
    │   ├── BoardColumn.tsx            # Kanban 컬럼
    │   └── BoardCard.tsx              # 태스크 카드
    └── dock/
        ├── Dock.tsx                    # Bottom Dock (4 sections)
        └── DockContent.tsx             # Record 탭별 콘텐츠
```

## 스타일링

`tailwind.config.js`에 정의된 커스텀 색상 토큰:
- `decisionBlue`: 주요 액션/선택 (#4F8CFF)
- `alertRed`: 경고/병목 (#FF4D4F)
- `contextGreen`: HR 컨텍스트 참조 (#10B981)
- `appBg`: 메인 배경 (#0B1220)
- `panelBg`: 패널 배경 (#111A2E)
- `textMain`: 주요 텍스트 (#E6EAF2)
- `textSub`: 보조 텍스트 (#AAB4C5)

Zone 별 액센트 색상:
- `zoneIngest`: Zone 1 (#3B82F6, blue)
- `zoneStruct`: Zone 2 (#8B5CF6, purple)
- `zoneGraph`: Zone 3 (#06B6D4, cyan)
- `zonePath`: Zone 4 (#F59E0B, amber)

시맨틱 토큰 (status/severity/label/entity/assumption):
- `warning` / `warningDark`: 주의 (#FBBF24 / #F59E0B)
- `success` / `successDark`: 성공/양호 (#34D399 / #10B981)
- `label-{real|estimate|mock|synth}`: 데이터 라벨 색상
- `entity-{org|role|person|project|task|risk|cost|capability|stage|training_program}`: 그래프 엔티티 색상
- `assumption-{data|logic|scope}`: 가정 카테고리 색상
- `severity-{critical|high|medium|low|info}`: 심각도 색상
- `surface-{0..4}`: Surface elevation scale

커스텀 폰트 크기:
- `text-mini`: 9px (0.5625rem)
- `text-micro`: 10px (0.625rem)
- `text-tiny`: 11px (0.6875rem)

그래프 인라인 스타일용 상수: `src/constants/tokens.ts`
- `ENTITY_COLORS`: 엔티티 노드 색상 (ReactFlow inline style)
- `EDGE_COLORS`: 엣지 색상 (ReactFlow inline style)
- `PANEL_BG`: 패널 배경 (#111A2E)

## 코드 컨벤션

- **컴포넌트**: named export 사용 (default export 금지)
- **조건부 클래스**: `clsx` + `tailwind-merge` 사용
- **상태 접근**: `useStore()` 훅 (Zustand)
- **UI 텍스트**: 한국어 / **코드(변수, 함수, 타입)**: 영어
- **데이터 라벨**: `REAL` | `MOCK` | `ESTIMATE` | `SYNTH` (출처 표시 시스템)
- **테스트**: Vitest + @testing-library/react (191 tests — 117 데이터 검증 + 74 UI 컴포넌트)

## 경로 별칭

`@/*` → `src/*` (tsconfig.app.json, vite.config.ts에 설정됨)

## 배포

- **호스팅**: Cloudflare Pages (Git 통합 — `main` push 시 자동 배포)
- **프로덕션 URL**: https://hr2.minu.best
- **Pages URL**: https://hr-decision-prototype.pages.dev
- **설정 파일**: `wrangler.toml` (커스텀 도메인은 대시보드에서 수동 설정)
- **CI**: `.github/workflows/ci.yml` (lint + build 검증, 배포는 CF Git 통합이 담당)

## 문서

`docs/` 폴더에 위치:
- `01_Project_Charter_O-AOD_HR_Decision_PoC.docx` - 프로젝트 헌장
- `02_WBS_Execution_Plan.docx` - WBS 및 실행 계획
- `03_Data_Requirements_Spec.docx` - 데이터 요구사항 명세
- `04_Evaluation_Plan.docx` - 평가 계획
- `05_PRD_Integrated_v1_2.docx` - 통합 PRD v1.2
- `4scenario_data_mapping_v1_20260129.xlsx` — 4개 시나리오 데이터 매핑
- `prototype_scenarios_v1.md` — 시나리오 설계 문서
- `Cloudflare_Pages_Deploy_KO.md` — 배포 가이드

## Cline Memory Bank

Cline VS Code 익스텐션을 위한 Memory Bank 파일이 `memory-bank/` 디렉토리에 존재한다.
Cline 전용 규칙은 `.clinerules` 파일을 참조.

### Memory Bank 스킬 (Claude Code ↔ Cline 연동)

Claude Code와 Cline 간 프로젝트 컨텍스트를 공유하기 위한 스킬:

| 스킬 | 용도 |
|------|------|
| `/session-start [작업내용]` | 세션 시작 시 Memory Bank에서 컨텍스트 복원 |
| `/session-end [메모]` | 세션 종료 시 Git 커밋 + Memory Bank 업데이트 (배포 제외) |
| `/deploy [--preview]` | Cloudflare Pages 배포 (lint → build → git push → CF 자동 배포) |

**스킬 상세**:
- `/session-start` — Phase 1: Memory Bank 6개 파일 읽기 → Phase 2: 현재 상태 요약 출력
- `/session-end` — Phase 1: Git 커밋 (memory-bank 제외) → Phase 2: Memory Bank 업데이트 + 커밋
- `/deploy` — lint → build → git push (프로덕션: `main`, 프리뷰: `HEAD`)

**워크플로우 패턴**:

```
# 패턴 1: 빠른 프로토타이핑 (배포 없이)
/session-start 오늘은 새 컴포넌트 구현
→ 작업 수행
/session-end 컴포넌트 구현 완료

# 패턴 2: 배포 포함
/session-end 기능 구현 완료
/deploy

# 패턴 3: 프리뷰 배포
/session-end QA용 변경사항
/deploy --preview
```

**Cline 연동**:
```
Claude Code: /session-end [메모] → Memory Bank 업데이트
Cline: "follow your custom instructions" → 업데이트된 Memory Bank로 이어받기
```
