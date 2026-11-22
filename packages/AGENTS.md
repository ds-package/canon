# packages

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-22

## Purpose

npm에 배포하는 Canon 패키지 세 개를 담는 workspace 디렉터리다. 이 디렉터리에는 직접 두는 파일이 없다.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `tokens/` | `@canon/tokens`. 토큰 JSON 원본과 CSS 변수, JS/TypeScript, Tailwind preset 산출물 (see `tokens/AGENTS.md`) |
| `react/` | `@canon/react`. React Aria Components 위에 만든 Canon 컴포넌트와 `styles.css` (see `react/AGENTS.md`) |
| `cli/` | `@canon/cli`. 소비 프로젝트에서 실행하는 `canon init`, `canon eject` (see `cli/AGENTS.md`) |

## For AI Agents

### Working In This Directory

- 의존 방향은 `tokens` ← `react`(peer), `tokens` ← `cli`(실행 시 소비 프로젝트에 설치된 `@canon/tokens`를 찾는다)다. `tokens`는 다른 Canon 패키지에 의존하지 않는다.
- 각 패키지의 `package.json` `files`가 배포 범위를 정한다. `scripts/package-smoke.test.js`와 `scripts/package-consumption.test.mjs`가 실제로 pack한 묶음을 소비 프로젝트에서 검증하므로, `exports`나 `files`를 바꾸면 이 테스트를 함께 확인한다.
- 버전과 `CHANGELOG.md`는 changesets가 관리한다. 직접 고치지 않고 루트에서 `pnpm changeset`으로 변경을 기록한다.

### Testing Requirements

- 루트에서 `pnpm test`를 실행한다. `pnpm --filter './packages/*' build`로 세 패키지를 먼저 빌드한 뒤 테스트한다.
- 타입 검사는 루트의 `pnpm typecheck`다.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
