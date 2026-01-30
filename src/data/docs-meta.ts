import type { DocMeta } from '../types';

export const docsMeta: DocMeta[] = [
  {
    id: 'doc-01',
    filename: '01_Project_Charter_O-AOD_HR_Decision_PoC.docx',
    title: '프로젝트 헌장',
    description: 'O-AOD HR 의사결정 PoC 프로젝트의 목적, 범위, 이해관계자 및 주요 마일스톤을 정의한 헌장 문서.',
    category: '기획',
    lastUpdated: '2025-01-15',
    fileSize: '245 KB',
    sections: [
      {
        heading: '프로젝트 목적',
        content:
          '- HR 의사결정 과정에서 데이터 기반 근거를 체계적으로 제공\n- 온톨로지 그래프를 활용한 조직 구조·역할·인력 관계 시각화\n- 의사결정 대안(A/B/C) 비교 및 리스크 분석 지원',
      },
      {
        heading: '프로젝트 범위',
        content:
          '- 대상: HR 조직관리(TO) 및 역할 재배치(R&R) 시나리오\n- 데이터: HR 마스터, 근태(TMS), 성과평가, 비용 데이터\n- 산출물: PoC 프로토타입 (React SPA), 평가 보고서',
      },
      {
        heading: '이해관계자',
        content:
          '- 프로젝트 스폰서: HR 본부장\n- 프로젝트 매니저: HR 디지털혁신팀\n- 개발팀: 프론트엔드 2명, 데이터 엔지니어 1명\n- 사용자: HR 기획 담당자, 조직관리 담당자',
      },
      {
        heading: '주요 마일스톤',
        content:
          '- M1: 요구사항 확정 및 데이터 명세 완료\n- M2: 프로토타입 v1 (4-Zone 레이아웃 + 데모 시나리오)\n- M3: 사용자 평가 및 피드백 수집\n- M4: 최종 보고서 및 확산 전략 수립',
      },
      {
        heading: '리스크 및 제약사항',
        content:
          '- 실제 HR 데이터 접근 제한 → Mock/Estimate 데이터 활용\n- PoC 범위 한정: 2개 시나리오(TO, R&R)로 제한\n- 보안 요건: 개인정보 비식별화 필수',
      },
    ],
  },
  {
    id: 'doc-02',
    filename: '02_WBS_Execution_Plan.docx',
    title: 'WBS 및 실행 계획',
    description: '작업 분해 구조(WBS)와 단계별 실행 계획, 일정 및 담당자 배정.',
    category: '기획',
    lastUpdated: '2025-01-15',
    fileSize: '312 KB',
    sections: [
      {
        heading: 'WBS 개요',
        content:
          '- 1단계: 기획 및 요구사항 분석\n- 2단계: 데이터 설계 및 준비\n- 3단계: UI/UX 설계 및 프로토타입 개발\n- 4단계: 통합 테스트 및 평가\n- 5단계: 보고서 작성 및 마무리',
      },
      {
        heading: '단계별 실행 계획',
        content:
          '- 기획 (1주): PRD 작성, 데이터 요구사항 명세, 평가 기준 수립\n- 데이터 (1주): 데이터 소스 매핑, Mock 데이터 생성, 라벨링 체계 적용\n- 개발 (3주): 4-Zone 레이아웃, 온톨로지 그래프, 의사결정 경로 UI\n- 평가 (1주): 사용성 평가, 피드백 수집, 개선사항 도출',
      },
      {
        heading: '담당자 배정',
        content:
          '- PM: 전체 일정 관리 및 이해관계자 소통\n- 프론트엔드: React/TypeScript 개발, UI 구현\n- 데이터: 데이터 파이프라인, Mock 데이터 설계\n- UX: 와이어프레임, 사용성 테스트 설계',
      },
      {
        heading: '일정 요약',
        content:
          '- 전체 기간: 6주\n- 주간 스프린트 단위 진행\n- 주 1회 스프린트 리뷰 및 데모',
      },
    ],
  },
  {
    id: 'doc-03',
    filename: '03_Data_Requirements_Spec.docx',
    title: '데이터 요구사항 명세',
    description: 'HR 데이터 소스 정의, 필드 매핑, 품질 기준 및 데이터 라벨링 체계.',
    category: '데이터',
    lastUpdated: '2025-01-15',
    fileSize: '198 KB',
    sections: [
      {
        heading: '데이터 소스 정의',
        content:
          '- HR 마스터: 사번, 직급, 부서, 입사일, 직무 등 기본 인사정보\n- 근태/TMS: 출퇴근, 근무시간, 프로젝트별 투입시간\n- 성과평가: 평가등급, 역량 수준, 목표 달성률\n- 비용 데이터: 인건비, 교육비, 프로젝트 비용',
      },
      {
        heading: '필드 매핑 체계',
        content:
          '- 각 데이터 소스별 필수/선택 필드 정의\n- 엔티티(Person, Role, Task, Org) 매핑 규칙\n- 관계(Edge) 도출 로직: depends_on, covers, bottleneck 등',
      },
      {
        heading: '데이터 라벨링 체계',
        content:
          '- REAL: 실제 시스템에서 추출한 데이터\n- MOCK: 시연용으로 생성한 가상 데이터\n- ESTIMATE: 통계적 추정으로 산출한 데이터\n- SYNTH: AI/알고리즘으로 합성한 데이터',
      },
      {
        heading: '품질 기준',
        content:
          '- 완전성: 필수 필드 누락률 5% 이하\n- 정확성: 데이터 라벨과 실제 출처 일치\n- 일관성: 엔티티 간 참조 무결성 보장\n- 적시성: 최신 데이터 반영 주기 정의',
      },
    ],
  },
  {
    id: 'doc-04',
    filename: '04_Evaluation_Plan.docx',
    title: '평가 계획',
    description: 'PoC 성과 평가 기준, 측정 지표 및 평가 프로세스 정의.',
    category: '평가',
    lastUpdated: '2025-01-15',
    fileSize: '156 KB',
    sections: [
      {
        heading: '평가 목적',
        content:
          '- PoC 프로토타입의 유효성 검증\n- HR 의사결정 지원 도구로서의 실용성 판단\n- 확산(Scale-up) 가능성 평가',
      },
      {
        heading: '평가 기준',
        content:
          '- 사용성: SUS(System Usability Scale) 점수 70점 이상\n- 효과성: 의사결정 소요시간 단축률\n- 정보 품질: 데이터 출처 투명성 인식도\n- 만족도: 사용자 만족도 설문 (5점 척도)',
      },
      {
        heading: '평가 프로세스',
        content:
          '- 사전 준비: 평가 시나리오 및 태스크 설계\n- 평가 실시: 대상 사용자 5~8명, 태스크 기반 평가\n- 사후 분석: 정량 지표 + 정성 피드백 종합',
      },
      {
        heading: '측정 지표',
        content:
          '- 태스크 완료율 및 소요시간\n- 오류 발생 빈도\n- 사용자 인터뷰 핵심 인사이트\n- 개선 요청사항 우선순위',
      },
    ],
  },
  {
    id: 'doc-05',
    filename: '05_PRD_Integrated_v1_2.docx',
    title: '통합 PRD v1.2',
    description: '제품 요구사항 정의서 — 기능 명세, UI/UX 설계, 기술 아키텍처 통합본.',
    category: '기획',
    lastUpdated: '2025-01-15',
    fileSize: '428 KB',
    sections: [
      {
        heading: '제품 비전',
        content:
          '- HR 담당자가 조직 변경·인력 재배치 시 데이터에 기반한 의사결정을 내릴 수 있도록 지원\n- 온톨로지 그래프로 조직 관계를 시각화하고, 대안별 리스크와 효과를 비교',
      },
      {
        heading: '핵심 기능',
        content:
          '- 4-Zone 워크플로우 캔버스 (데이터 수집 → 구조화 → 그래프 → 의사결정)\n- 온톨로지 관계 그래프 (Person, Role, Task, Org, Risk, Cost)\n- 의사결정 경로 A/B/C 비교 카드\n- 데이터 라벨링 시스템 (REAL/MOCK/ESTIMATE/SYNTH)\n- HR 컨텍스트 패널 (KPI, 활용도-의존도 매핑)',
      },
      {
        heading: 'UI/UX 설계 원칙',
        content:
          '- 다크 테마 기반 Glassmorphism 스타일\n- 정보 밀도 최적화: 4-Zone 동시 표시\n- Progressive Disclosure: 단계적 정보 노출\n- 접근성: WCAG 2.1 AA 기준 준수',
      },
      {
        heading: '기술 아키텍처',
        content:
          '- React 19 + TypeScript + Vite 6\n- 상태관리: Zustand\n- 그래프: @xyflow/react (ReactFlow)\n- 스타일: Tailwind CSS\n- 배포: Cloudflare Pages',
      },
      {
        heading: '비기능 요구사항',
        content:
          '- 초기 로딩 3초 이내\n- 반응형 레이아웃 (최소 1280px)\n- 다국어 지원 (KO/EN)\n- 브라우저 호환: Chrome, Edge, Safari 최신 2개 버전',
      },
    ],
  },
  {
    id: 'doc-06',
    filename: 'Cloudflare_Pages_Deploy_KO.md',
    title: 'Cloudflare Pages 배포 가이드',
    description: 'Cloudflare Pages를 활용한 배포 절차, 커스텀 도메인 설정 및 CI/CD 구성 안내.',
    category: '배포',
    lastUpdated: '2025-01-15',
    fileSize: '12 KB',
    sections: [
      {
        heading: '배포 개요',
        content:
          '- Cloudflare Pages Git 통합을 통한 자동 배포\n- main 브랜치 push 시 프로덕션 자동 배포\n- 기타 브랜치 push 시 프리뷰 배포',
      },
      {
        heading: '초기 설정',
        content:
          '- Cloudflare 대시보드에서 Pages 프로젝트 생성\n- GitHub 리포지토리 연결\n- 빌드 명령어: npm run build\n- 출력 디렉토리: dist',
      },
      {
        heading: '커스텀 도메인',
        content:
          '- 프로덕션: hr2.minu.best\n- Pages 기본: hr-decision-prototype.pages.dev\n- DNS 설정: Cloudflare DNS에서 CNAME 레코드 추가',
      },
      {
        heading: '배포 명령어',
        content:
          '- npm run deploy: 빌드 검증 후 main에 push → 자동 배포\n- npm run deploy:preview: 빌드 검증 후 현재 브랜치 push → 프리뷰 배포',
      },
    ],
  },
];
