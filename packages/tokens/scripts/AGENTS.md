# scripts

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`tokens/*.json`을 Style Dictionary로 읽어 `dist/css/variables.css`와 `dist/tailwind/preset.js`를 만드는 빌드 스크립트와 그 산출물을 검증하는 테스트를 둔다.

## Key Files

| File | Description |
|------|-------------|
| `build.js` | `buildTokens({ source, outDir, StyleDictionary })`를 export한다. 직접 실행하면 `tokens/**/*.json`을 `dist/`로 빌드한다. `package.json`의 `./build` export이고 `files`에 포함되어 npm으로 배포된다. `canon eject`가 만드는 `canon/build.mjs`도 이것을 import한다. |
| `build.test.js` | 생성된 `dist/css/variables.css`와 `dist/index.mjs`를 검사한다. `status/<의미>/low·default·emphasis` 구조와 옛 대상별 토큰(`control/<의미>/solid`, `border/status-*`, `text/primary` 등)의 부재, overlay를 얹은 채움 위 라벨 대비 4.5:1, Figma와 맞춘 gray·blackAlpha 값, 「5. Values that differ from Figma」의 대비 예외 고정, 크기 토큰의 접두사 없는 경로와 shape 모드, 지원 면 위 글자 대비, warm tint의 알려진 AA 미달 하한, 포커스 테두리 3:1, 프리뷰의 현재 역할 이름, TypeScript 참조와 CSS 선언의 양방향 일치. |
| `generator.test.js` | `@canon/tokens/build`로 임시 소스를 빌드해 CSS 이름 충돌(`Duplicate CSS variable`), Tailwind 항목 덮어쓰기(`Duplicate Tailwind token`), `constructor`·`__proto__` 키 처리를 검사한다. |
| `watch.test.js` | 패키지를 임시 디렉터리에 복사해 `pnpm dev`를 띄우고, JSON 수정이 CSS·Tailwind에, TypeScript 수정이 `dist/index.*`에 반영되는지 본다. |

## For AI Agents

### Working In This Directory
- 이 디렉터리에서 npm으로 나가는 파일은 `build.js` 하나다(`files: "scripts/build.js"`). 다른 파일을 import하는 로컬 모듈을 `build.js`에 추가하면 배포본이 깨진다.
- CSS 변수명 규칙은 `build.js`에만 있다. `cssPath`가 `shape.<mode>` 접두사와 `semantic`/축의 모드 세그먼트를 제거하고, 마지막이 `default`인 `typography` 경로는 그 세그먼트를 제거한다. 모든 세그먼트는 kebab-case로 바뀐다.
- `:root`에는 프리미티브, typography, 축의 기본 모드, `semantic.light`가 들어간다. 축의 다른 모드는 `[data-<axis>="<mode>"]`, 다크는 `[data-theme="dark"]`와 `@media (prefers-color-scheme: dark)`의 `:root:not([data-theme="light"])`에 나온다. 테스트는 이 셀렉터 모양에 정규식으로 의존한다.
- Tailwind 프리셋은 `semantic.light`, `color`, `spacing`, 기본 `brand`·`shape`, `shadow`, `font`, `line-height`, `letter-spacing`만 담고 값은 `var(--...)`이다. `size`, `control.height`, `icon.size`, `border.width`는 CSS 변수로만 나온다.
- `*.test.js`는 `node --test scripts/*.test.js` glob으로 실행되므로 이 디렉터리에 `.test.js`가 아닌 파일은 테스트로 잡히지 않는다.

### Testing Requirements
- `pnpm --filter @canon/tokens test` (먼저 `pnpm build`를 실행한다. 테스트가 `dist/`를 읽는다.)
- 단일 파일: 빌드 뒤 `cd packages/tokens && node --test scripts/generator.test.js`.

### Common Patterns
- 테스트는 `node:test`와 `node:assert/strict`를 쓰고, 임시 파일은 `mkdtemp`로 만들어 `t.after`에서 지운다.
- 출력 비교는 생성 CSS를 정규식으로 파싱해 변수 값을 `var(--...)` 체인으로 풀어 계산한다.

## Dependencies

### External
- `style-dictionary` ^4.1.4, Node 내장 `fs`, `path`, `url`, `node:test`.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
