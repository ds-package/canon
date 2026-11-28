# src

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-22

## Purpose
`canon` 바이너리의 진입점이다. 명령 구현은 `commands/`에 있다.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `process.argv`의 첫 인자를 `commands` 맵(`init`, `eject`)에서 찾아 실행한다 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `commands/` | 명령별 구현 (see `commands/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 명령을 추가하려면 `commands/<name>.ts`에서 `(args: string[]) => Promise<void>`를 export하고 `index.ts`의 `commands` 맵과 `printHelp()` 문구에 함께 등록한다.
- 인자가 없거나 `--help`, `-h`면 도움말을 출력하고 종료 코드 0으로 끝난다. 알 수 없는 명령은 `알 수 없는 명령어: <name>`과 도움말을 출력하고 종료 코드 1이다.
- 처리되지 않은 예외는 `main().catch`가 `console.error`로 출력하고 종료 코드 1로 끝낸다.
- 상대 import는 ESM 규칙에 따라 `.js` 확장자를 쓴다(`./commands/init.js`).

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
