# commands

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`canon init`과 `canon eject`의 구현이다. 각 파일은 명령 하나를 export하고, 소비 프로젝트(`process.cwd()`)에 파일을 쓴다.

## Key Files

| File | Description |
|------|-------------|
| `init.ts` | `canon.css`를 만든다. 내용은 `@import '@canon/tokens/css';`와 `:root` 오버라이드 주석이다. `canon.config.json`은 만들지 않는다 |
| `eject.ts` | `canon/tokens/*.json`을 복사하고 `canon/build.mjs`를 만든다. 다음 단계 안내에 `style-dictionary@<버전>`을 출력한다 |

## For AI Agents

### Working In This Directory
- `init`은 `canon.css`가 있으면 `wx` 플래그의 `EEXIST`를 잡아 건너뛰고 종료 코드는 0이다. 다른 오류는 다시 던진다.
- `eject`는 `createRequire(path.join(cwd, 'package.json'))`로 `@canon/tokens/tokens/color.json`을 해석해 원본 JSON 디렉터리를 찾는다. JSON 파일은 `COPYFILE_EXCL`로 복사하고 이미 있으면 건너뛴다. `build.mjs`도 `wx`로 쓴다.
- `eject`의 style-dictionary 버전은 소비 프로젝트의 `@canon/tokens/package.json`의 `peerDependencies['style-dictionary']`에서 읽는다. 버전을 하드코딩하지 않는다.
- 예상된 실패(`@canon/tokens` 미설치 또는 비호환, 원본 JSON 없음)는 `fail()`이 `✗` 메시지를 출력하고 `process.exitCode = 1`로 둔다. 예상하지 못한 오류는 스택을 그대로 던진다.
- `eject`가 만드는 `canon/build.mjs`는 `@canon/tokens/build`의 `buildTokens`를 쓰며, 빌드 산출물은 `canon/dist/`에, CSS는 `src/styles/canon-variables.css`로 복사된다. 이 템플릿 문자열이 바뀌면 `scripts/package-smoke.test.js`의 eject 재빌드 테스트를 확인한다.
- 출력은 `picocolors`로 성공 `✓`(green), 건너뜀 `!`(yellow), 실패 `✗`(red)를 구분한다.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
