# Cloudflare Pages 배포( GitHub 연동 )

## 현재 레포 상태(확인 결과)
- `wrangler.toml` 존재: Pages 출력 디렉터리 `dist`, 프로젝트명 `hr-decision-support` 설정
- `package.json` 스크립트 존재: `build`, `deploy`, `deploy:preview`
- 커스텀 도메인 목표: `hr2.minu.best`

## GitHub → Cloudflare Pages 자동 배포(워크플로우)
레포에 `.github/workflows/cloudflare-pages.yml`을 추가했습니다.

- `main` 브랜치 `push` 시: 프로덕션(Production) 배포
- PR 생성/업데이트 시: Preview 배포

## GitHub Secrets 설정(필수)
GitHub 레포 → Settings → Secrets and variables → Actions → **New repository secret**

- `CLOUDFLARE_API_TOKEN`
  - Cloudflare → My Profile → API Tokens → Create Token
  - 권한 예시: `Cloudflare Pages:Edit` (또는 Pages 배포 가능한 권한)
- `CLOUDFLARE_ACCOUNT_ID`
  - Cloudflare 대시보드 우측 사이드바 또는 Workers/Pages 설정에서 확인

## Cloudflare Pages 프로젝트 연결(대시보드)
Cloudflare → Pages → 프로젝트 생성/선택 후

- Project name: `hr-decision-support`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: (레포 루트)

## 커스텀 도메인 `hr2.minu.best`
Cloudflare Pages → Custom domains에서 `hr2.minu.best` 추가

- DNS가 Cloudflare에서 관리 중이라면 자동으로 CNAME/레코드가 생성됩니다.
- 외부 DNS라면 `hr2`를 `{project}.pages.dev`로 CNAME 설정합니다.

## “GitHub 연동 여부” 확인 방법
Cloudflare Pages → Settings → Builds & deployments에서

- Connected repository가 GitHub 레포(`AX-BD-Team/hr-decision-poc`)로 보이는지 확인
- Production branch가 `main`인지 확인

