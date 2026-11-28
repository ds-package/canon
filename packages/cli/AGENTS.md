# cli

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`@canon/cli`는 소비 프로젝트에 Canon 토큰을 적용하는 `canon` 명령(`init`, `eject`)이다. 파일 두 종류를 만들고 기존 파일은 덮어쓰지 않는다. 사용자 메시지는 모두 한국어다. 이 동작을 설명하는 `docs` 문서는 현재 없고 `scripts/package-smoke.test.js`가 동작을 검증한다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | `bin.canon`은 `./dist/index.js`이고 `files`는 `dist`만 발행한다. 런타임 의존성은 `picocolors` 하나다 |
| `tsup.config.ts` | `src/index.ts`를 esm으로만 빌드하고 `dts: false`다. 산출물 맨 위에 `#!/usr/bin/env node` shebang을 붙인다 |
| `tsconfig.json` | `../../tsconfig.base.json`을 확장한다 |
| `CHANGELOG.md` | changesets가 생성한다. 직접 편집하지 않는다 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | 진입점과 명령 구현 (see `src/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 이 패키지에는 라이브러리 API가 없다. `exports`는 있지만 소비자는 `canon` 바이너리(`npx @canon/cli <command>`)로만 쓴다.
- `@canon/tokens`는 의존성이 아니다. CLI는 `npx`로 따로 설치되므로, `eject`는 `process.cwd()`의 `package.json` 기준으로 소비 프로젝트에 설치된 `@canon/tokens`를 찾는다. CLI에 `@canon/tokens`를 의존성으로 추가하지 않는다.
- 기존 파일 보호가 계약이다. 새 명령도 `flag: 'wx'`나 `COPYFILE_EXCL`로 쓰고 `EEXIST`는 "건너뜀"으로 처리한다.
- 사용자 메시지(`console.log`, `console.error`)는 한국어로 쓴다. 명령 출력이 바뀌면 `scripts/package-smoke.test.js`의 기대 메시지를 확인한다.
- 발행 가능한 변경은 `.changeset/*.md`에 `'@canon/cli'` patch 또는 minor로 기록한다(`pnpm changeset`).

### Testing Requirements
- 이 패키지에는 자체 `test` 스크립트가 없다. 빌드는 `pnpm --filter @canon/cli build`, 감시 빌드는 `pnpm --filter @canon/cli dev`다.
- 동작 검증은 루트 테스트가 맡는다. `scripts/package-smoke.test.js`는 `npm pack`한 CLI를 임시 소비 프로젝트에서 실행해 `init`, `eject`, 실패 종료 코드를 확인하고, `scripts/package-consumption.test.mjs`는 세 패키지를 함께 설치해 검증한다. 둘 다 루트 `pnpm test`에 포함되며 먼저 `pnpm --filter './packages/*' build`가 실행된다.
- 타입 검사는 루트 `pnpm typecheck`다.

## Dependencies

### Internal
- `@canon/tokens` — 코드 의존성이 아니라 런타임에 소비 프로젝트에서 해석하는 대상이다

### External
- `picocolors`(출력 색), Node 내장 `fs`, `path`, `module`
- 개발: `tsup`, `typescript`, `@types/node`

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
