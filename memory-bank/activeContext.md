# Active Context

## 현재 단계
대시보드 재설계 + 문서 파일 커밋 + gitignore 정리 완료. 모든 기능 구현 완료, 프로덕션 배포 대기.

## 최근 변경 이력

| 커밋 | 설명 |
|------|------|
| `c7090d1` | chore: tool artifacts gitignore 추가 (.playwright-mcp, .trae, .vercel 등) |
| `358ed7e` | chore: public/docs/ 6개 문서 파일 커밋 (docx + md) |
| `1376285` | feat: 대시보드 재설계 — 컴포넌트 추출, 인터랙션/애니메이션 강화 |
| `c40319c` | docs: Memory Bank 업데이트 — dashboard/docs 페이지, 페이지 라우팅 |
| `57b7497` | feat: dashboard, docs 페이지 + PageNav 페이지 네비게이션 추가 |

## 이번 세션 변경 사항

### 브라우저 검증 완료
- **Workflow 페이지**: 4-Zone UI, 시나리오 선택, 데모, Decision Record 모두 정상
- **대시보드 페이지**: KPI 카드(stagger 애니메이션), 도넛차트(호버 연동), 트리맵(플로팅 툴팁), 인재 테이블(정렬/필터), 인력 예측(콤보 차트+스파크라인) 모두 정상
- **문서 페이지**: 6개 문서 카드, 카테고리 필터, 다운로드 링크 정상

### Git 정리
- `public/docs/` 6개 문서 파일 커밋
- `.gitignore`에 `.playwright-mcp/`, `.trae/`, `.vercel/`, `nul`, `loading-phase*.png` 추가
- Working tree clean, origin 대비 26 커밋 ahead (push 필요)

### 빌드 결과
| 청크 | 크기 |
|------|------|
| `index.js` (메인) | 279 KB |
| `vendor-xyflow.js` | 284 KB |
| `DashboardPage.js` | 24 KB |
| `TourOverlay.js` | 8.3 KB |
| `HRContextView.js` | 7.8 KB |
| `ZoneGraph.js` | 6.9 KB |
| `DocsPage.js` | 5.6 KB |

## 현재 작업 포커스
- 모든 기능 구현 완료
- 브라우저 검증 통과
- 프로덕션 배포 대기 (origin 대비 26 커밋 ahead)

## 다음 작업 목록 (우선순위순)
1. **git push + Cloudflare 배포** — 26 커밋 push 후 프로덕션 배포
2. **국제화(i18n)** — 하드코딩 한국어 다국어 지원
3. **다크/라이트 테마** — 테마 전환 기능
4. **UI 컴포넌트 테스트** — Vitest/Testing Library

## 알려진 이슈 — 모두 해결됨
- ~~#1~10: 이전 이슈~~ → 모두 해결

## 활성 결정 사항
- 페이지 라우팅: Zustand `activePage` 상태 기반 (React Router 미사용, 단순 조건부 렌더링)
- 데이터 소스: 독립 JSON 파일 (`demo-s1.json`, `demo-s2.json`, `demo-s3.json`, `dashboard-data.json`) + `scenarios.ts` import
- 상태 관리: Zustand 단일 스토어 (`loadingPhase` phased 로딩, `isContextSidebarOpen` 사이드바, `activePage` 라우팅)
- 스타일링: Tailwind CSS (커스텀 다크 테마) + 시맨틱 디자인 토큰 체계
- 그래프: @xyflow/react v12, dagre 자동 레이아웃, 커스텀 `EntityNode`
- 산점도: 순수 SVG 기반 (`UtilizationScatterChart.tsx`)
- 대시보드 차트: 순수 SVG (stroke 도넛, squarified 트리맵, 그룹 바차트+라인) — 외부 차트 라이브러리 미사용
- 대시보드 테이블: TalentTable(정렬/필터), WorkforceDetailTable(스파크라인) — 로컬 state만 사용
- 배포: Cloudflare Pages (`/deploy` 스킬 + wrangler)
- 레이아웃: flex (main + aside sidebar), `grid-cols-[360px_1fr]` 내부 그리드
- Error Boundary: zone 레벨 격리
- Tour: `TourOverlay` (portal, 9스텝, 키보드/다이얼로그 a11y)
- 테스트: Vitest (17 tests), `npm run test`
- 모바일: sm 미만 3-row Header + overflow menu, sm+ 기존 레이아웃
