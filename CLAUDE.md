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
npm run deploy       # 빌드 + Cloudflare Pages 배포
npm run deploy:preview # 프리뷰 브랜치 배포
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
├── types/index.ts                    # 전체 TypeScript 타입 정의
├── store/useStore.ts                 # Zustand 상태 관리
├── constants/
│   └── tokens.ts                     # 그래프용 색상 상수 (ENTITY_COLORS, EDGE_COLORS)
├── data/
│   ├── scenarios.ts                  # 데모 시나리오 설정
│   └── demo-s1.json                  # S1 시나리오 데이터
└── components/
    ├── layout/Header.tsx             # 헤더 + 스텝 네비게이터
    ├── zones/
    │   ├── ZoneDataIngestion.tsx     # Zone 1: 데이터 수집
    │   ├── ZoneStructuring.tsx       # Zone 2: 분석 패턴
    │   ├── ZoneGraph.tsx            # Zone 3: 온톨로지 그래프 (ReactFlow)
    │   └── ZoneDecisionPaths.tsx    # Zone 4: 의사결정 경로
    ├── context/HRContextView.tsx     # HR 컨텍스트 사이드 패널
    ├── record/DecisionRecordSection.tsx # 하단 독 탭
    ├── dock/                         # Dock 컨테이너/콘텐츠
    └── common/DataLabelBadge.tsx     # 데이터 라벨 배지
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
- `entity-{org|role|person|project|task|risk|cost}`: 그래프 엔티티 색상
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
- **테스트 없음**: 현재 단위/통합 테스트 미구성

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

## Cline Memory Bank

Cline VS Code 익스텐션을 위한 Memory Bank 파일이 `memory-bank/` 디렉토리에 존재한다.
Cline 전용 규칙은 `.clinerules` 파일을 참조.

### Memory Bank 스킬 (Claude Code ↔ Cline 연동)

Claude Code와 Cline 간 프로젝트 컨텍스트를 공유하기 위한 스킬:

| 스킬 | 용도 |
|------|------|
| `/session-start [작업내용]` | 세션 시작 시 Memory Bank에서 컨텍스트 복원 |
| `/session-end [메모]` | 세션 종료 시 변경사항을 Memory Bank에 반영 |
| `/deploy [--preview]` | Cloudflare Pages 배포 (lint → build → deploy) |

**워크플로우**:
```
Claude Code: /session-start 오늘은 Tour UI 구현
  → (Memory Bank 읽기 → 컨텍스트 복원)
  → 작업 수행
Claude Code: /session-end Tour 완료, Error Boundary 남음
  → (Memory Bank 업데이트)
Cline: "follow your custom instructions"
  → (업데이트된 Memory Bank로 이어받기)
```
