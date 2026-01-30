# Cloudflare Pages 배포 (Git 통합)

## 배포 방식

Cloudflare Pages **Git 통합**을 사용합니다.
- `main` 브랜치에 push하면 **프로덕션 자동 배포**
- PR 생성/업데이트 시 **Preview 자동 배포**
- GitHub Actions(`ci.yml`)는 lint + build **검증 전용** (배포는 CF가 담당)

## Cloudflare Pages 프로젝트

- **Project name**: `hr-decision-prototype`
- **Pages URL**: `https://hr-decision-prototype.pages.dev`
- **커스텀 도메인**: `hr2.minu.best`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: (레포 루트)

## 로컬 설정 파일

- `wrangler.toml`: 프로젝트명 `hr-decision-prototype`, 출력 디렉터리 `dist`
- `package.json` 스크립트: `deploy` / `deploy:preview` (wrangler 수동 배포 백업용)

## 커스텀 도메인 `hr2.minu.best`

Cloudflare Pages → Custom domains에서 `hr2.minu.best` 추가 완료.

- DNS가 Cloudflare에서 관리 중이므로 CNAME 자동 설정됨
- CNAME: `hr2` → `hr-decision-prototype.pages.dev`

## GitHub 연동 확인

Cloudflare Pages → Settings → Builds & deployments에서:

- Connected repository가 GitHub 레포로 연결되어 있는지 확인
- Production branch: `main`

## CI 워크플로우 (`.github/workflows/ci.yml`)

GitHub Actions는 **배포하지 않고** lint + build 검증만 수행합니다.

- `main` push 및 PR 시 실행
- `npm run lint` → `npm run build` 순서로 검증
- 배포는 Cloudflare Git 통합이 별도로 처리
