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
├── main.tsx         # React DOM 진입점
├── App.tsx          # 메인 애플리케이션 컴포넌트
├── index.css        # Tailwind CSS 스타일
└── vite-env.d.ts    # Vite 타입 정의
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

## 경로 별칭

`@/*` → `src/*` (tsconfig.app.json, vite.config.ts에 설정됨)

## 문서

- `01_Project_Charter_O-AOD_HR_Decision_PoC.docx` - 프로젝트 헌장
- `02_WBS_Execution_Plan.docx` - WBS 및 실행 계획
- `03_Data_Requirements_Spec.docx` - 데이터 요구사항 명세
- `04_Evaluation_Plan.docx` - 평가 계획
- `05_PRD_Integrated_v1_2.docx` - 통합 PRD v1.2
