# Product Context

## 프로젝트 존재 이유
HR 의사결정은 여러 부서의 데이터(인사 마스터, 공수 관리, R&R, 비용)를 종합해야 하지만,
기존에는 스프레드시트와 구두 보고에 의존하여 **의사결정 과정이 불투명**하고 **재현 불가능**했다.
이 프로토타입은 데이터를 구조화·시각화하여 "왜 이 결정을 내렸는가?"를 추적 가능하게 만든다.

## 4-Zone 워크플로우

### Zone 1 — 데이터 수집 (Data Ingestion)
- HR 마스터, Project/Task, Org Role Map, OPEX Range 등 데이터 소스 표시
- 각 소스의 커버리지(%), 데이터 레이블(REAL/MOCK/ESTIMATE), 포함 필드 표시

### Zone 2 — 분석 구조화 (Structuring)
- 역할 커버리지 갭 분석, 의존도 집중도, 활용도 병목, 비용 영향 시뮬레이션
- 분석 패턴 카드 형태로 표시

### Zone 3 — 온톨로지 그래프 (Graph)
- ReactFlow 기반 인터랙티브 그래프
- 엔티티: 조직, 역할, 인원, 프로젝트, 리스크, 비용, 태스크, 역량, 단계, 교육 프로그램
- 엣지: depends_on, covers, bottleneck, overlap, cost_supports, risk_of, belongs_to, assigned_to, requires_capability, trains_for, part_of_stage, duplicates
- 노드 타입별 색상 구분 (person→green, role→blue, risk→red 등)

### Zone 4 — 의사결정 경로 (Decision Paths)
- 3개 대안 비교 카드
- 각 경로의 리스크 수준, 효과 수준, 핵심 메트릭(비용·기간·Score) 표시

## 지원 UI 요소

### Header (sticky)
- 단계 네비게이터 (Step 1-4 진행 표시 + smooth scroll)
- 시나리오 선택 드롭다운 (S1/S2/S3/S4)
- Start Demo / Stop / Reset / Export 버튼

### DecisionRecordSection (메인 하단)
- Explainability & Decision Record 독립 섹션
- 5개 탭: Evidence, Assumptions, Risks, Alternatives, Record
- Export HTML / Generate / Reset 기능

### Bottom Dock (접을 수 있는 패널)
- 4개 섹션: 대안 카드, 결정 레코드, 구조화, HR 컨텍스트
- 드래그 리사이즈 (220~560px)

### HR Context (Dock 내부)
- HR KPI 카드 (인력 충원율, 평균 활용도, 핵심인재 비율, 채용 소요일)
- 인재 활용도 산점도 (의존도 vs 활용도)
- 컨텍스트 인사이트 (경고/정보 메시지)

## 페이지 구성

### 의사결정 워크플로우 (workflow) — 기본 페이지
4-Zone 워크플로우 캔버스 + HR Context 사이드바 + Decision Record

### 대시보드 (dashboard)
- **자원 배분** 탭: KPI 4개 + 프로젝트 현황 도넛 차트 + 기술 스킬 트리맵
- **인재 정보** 탭: KPI 4개 + 직무 역량 트리맵 + 핵심 인재 테이블 (20명)
- **인력 예측** 탭: 월별 유입/유출 바 차트 + 월별 상세 데이터 테이블 (12개월)

### 문서 (docs)
- 탭 전환: **프로젝트 문서** (기존) / **프로젝트 보드** (Kanban)
- 프로젝트 산출물 열람 (6개 문서: 헌장, WBS, 데이터 명세, 평가 계획, PRD, 배포 가이드)
- 카테고리 필터링 (기획/데이터/평가/배포)
- Kanban 보드: Todo / In Progress / Done 3컬럼, Priority 필터 (P0/P1/P2), GitHub Project #3 실데이터 28개 항목
- 문서 상세보기 (DocDetailView): Master-Detail 패턴, sticky 목차 사이드바, 섹션별 렌더링

## 데모 시나리오

### S1: TO 추가 요청 [TO]
- **핵심 질문**: "정말 인력이 부족한가, 아니면 현재 구조와 배치가 문제인가?"
- Path A: 증원 (신규 채용) — 리스크 medium, 효과 high
- Path B: 재배치 (내부 이동) — 리스크 low, 효과 medium
- Path C: 구조조정 (역할 재정의) — 리스크 low, 효과 medium

### S2: 상시 조직 변경 / R&R [R&R]
- **핵심 질문**: "조직을 바꾸는 게 맞나, 아니면 역할과 책임을 바꾸는 게 맞나?"
- 조직 구조 vs 역할 재정의 대안 비교

### S3: 솔루션 사업화 내부 체계 [Phase-2]
- **핵심 질문**: "솔루션 사업화를 위한 내부 체계를 어떻게 구축할 것인가?"
- PoC → Pilot → Scale 단계별 분석

### S4: 역량 강화 [HRD]
- **핵심 질문**: "조직/인력의 역량을 어떻게 강화할 것인가?"
- 역량 갭 분석 + 교육/순환배치/멘토링 대안 비교
