# tokens

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`@canon/tokens`는 Canon 디자인 토큰의 코드 배포 정본이다. 디자인 정본은 Figma이고, 이 패키지는 W3C 형식 JSON(`tokens/`)을 Style Dictionary로 빌드해 CSS 변수, Tailwind 프리셋, TypeScript 참조 객체(`tokens`)를 만든다. 디자인 규칙의 문서 정본은 루트 `docs/`(`docs/foundations/color.md`, `docs/foundations/typography.md`, `docs/foundations/icons.md`)이다. 코드가 Figma와 일부러 다르게 둔 값은 `docs/foundations/color.md`의 「5. Values that differ from Figma」에 있다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | `exports`(`.`, `./css`, `./tailwind`, `./tokens/*.json`, `./build`)와 `files` 배포 목록을 정의한다. `style-dictionary`는 optional peer 의존성이다. |
| `tsup.config.ts` | `src/index.ts`를 `dist/index.cjs`·`dist/index.mjs`·`dist/index.d.ts`로 묶는다. `clean: false`이므로 `dist/css`, `dist/tailwind`를 지우지 않는다. watch 모드에서는 `dts`를 끄고 `onSuccess`로 `node scripts/build.js && tsup --dts-only`를 실행해 CSS·Tailwind와 타입을 다시 만든다. |
| `tsconfig.json` | `../../tsconfig.base.json`을 상속하고 `src`만 포함한다. |
| `CHANGELOG.md` | changesets가 관리한다. 직접 편집하지 않는다. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `tokens/` | 토큰 원본 JSON 12개. 이 파일의 "tokens/ 레이어 구조" 절을 본다. 이 디렉터리에는 `AGENTS.md`를 두지 않는다. |
| `scripts/` | Style Dictionary 빌드와 회귀 테스트 (see `scripts/AGENTS.md`) |
| `preview/` | 정적 토큰 프리뷰 페이지와 테스트 (see `preview/AGENTS.md`) |
| `src/` | TypeScript 토큰 참조 객체 (see `src/AGENTS.md`) |

`dist/`는 빌드 산출물이며 소스 트리에 없다. `pnpm build` 뒤에 생긴다.

### tokens/ 레이어 구조

| File | Holds |
|------|-------|
| `color.json` | 프리미티브 색. 10개 색상 램프(red, orange, yellow, green, teal, cyan, blue, indigo, purple, pink), `gray`, `warm`, `white`, `black`, `whiteAlpha`, `blackAlpha`. |
| `brand.json` | `brand.default.50`~`1000`. `color.blue.*`를 가리킨다. 다른 브랜드는 `data-brand="<mode>"`로 추가한다. |
| `size.json` | 크기 프리미티브 `size.10`~`size.56`(px). `control.json`과 `icon.json`이 별칭으로 참조한다. |
| `tint.json` | `tint.cool`(기본)과 `tint.warm`. `background/low`, `surface/*`, `border/default`·`emphasis`·`disabled`, `control/neutral`·`disabled`의 중립색 색조 축이다. |
| `shape.json` | `shape.default`/`sharp`/`soft`. 모드마다 `radius.*` 스케일(`none`~`4xl`, `full`)을 가진다. |
| `semantic.json` | `semantic.light`와 `semantic.dark`. `background`, `surface`, `text`, `icon`, `status`, `border`, `control`, `overlay`, `static`. 위 프리미티브와 축 토큰을 `{...}` 별칭으로 참조한다. 이름 규칙은 `docs/foundations/color.md`의 「2. Semantic naming rules」다. |
| `spacing.json` | `spacing.*` 간격 스케일. 8px을 `100`으로 둔 이름(`spacing.025`=2px ~ `spacing.1200`=96px)이다. |
| `control.json` | `control.height.xs`~`lg`. `size.*`를 가리킨다. |
| `icon.json` | `icon.size.*`. `size.*`를 가리킨다. |
| `border.json` | `border.width.default`·`strong`·`selected`·`focus`. 색 `semantic.*.border`와 CSS 이름이 겹치지 않는다(`--border-width-*`와 `--semantic-border-*`). |
| `shadow.json` | `shadow.none`~`2xl`. Figma 변수에 없는 코드 전용 토큰이다. |
| `typography.json` | `font.family/size/weight`, `line-height`, `letter-spacing` 프리미티브와 `typography.display/heading/body/label/caption` 합성 스타일. |

- 계층: 프리미티브(`color`, `size`) → 축(`tint`, `brand`, `shape`) → `semantic`. 컴포넌트의 색은 `semantic`만 소비하고, 크기는 `spacing`, `control.height`, `icon.size`, `border.width`, `radius`를 쓴다.
- 축 이름과 기본 모드는 `scripts/build.js`의 `AXES`(`tint: cool`, `brand: default`, `shape: default`)가 정한다. 기본 모드는 `:root`에, 나머지는 `[data-<axis>="<mode>"]`에 출력된다. 새 축은 `AXES`와 `src/index.ts`를 함께 고친다.
- 소비처: `scripts/build.js`(CSS·Tailwind 생성), `packages/cli/src/commands/eject.ts`(소비 프로젝트의 `canon/tokens/`로 `*.json` 복사), `./tokens/*.json` export(원본 직접 import), 패키지 테스트.
- **`tokens/`에는 `AGENTS.md`나 토큰이 아닌 파일을 추가하지 않는다.** `package.json`의 `files`가 `tokens` 디렉터리 전체를 npm에 배포하고, 빌드 소스 glob이 `tokens/**/*.json`이며, `eject`가 `.json` 파일을 전부 복사한다. `scripts/package-smoke.test.js`는 `readdir`로 이 디렉터리를 나열해 `npm pack` 파일 목록과 비교하고, `scripts/package-consumption.test.mjs`는 eject 결과가 정확히 이 12개 JSON인지 단언한다.

## For AI Agents

### Working In This Directory
- `dist/`는 직접 편집하지 않는다. `dist/css/variables.css`와 `dist/tailwind/preset.js`는 `scripts/build.js`가, `dist/index.*`는 `tsup`이 만든다.
- 토큰 JSON을 바꾸면 `pnpm --filter @canon/tokens build`를 실행한다. 새 공개 CSS 변수는 `src/index.ts`에도 추가해야 한다(`scripts/build.test.js`가 양방향 일치를 검사한다).
- 같은 셀렉터에서 CSS 변수명이 겹치면 빌드가 `Duplicate CSS variable`로 실패한다. 이름은 경로를 kebab-case로 이어 만든다. `semantic`과 축의 모드 세그먼트, `shape.<mode>`는 이름에서 빠진다(`shape.soft.radius.md` → `--radius-md`).
- 테마 속성은 문서 최상위 `html`에만 둔다(`data-theme`, `data-tint`, `data-brand`, `data-shape`). 중첩 테마는 지원하지 않는다.
- 색을 바꿀 때는 WCAG 대비 검사(`scripts/build.test.js`)를 통과해야 한다. Figma와 일부러 다르게 둔 값은 `docs/foundations/color.md`의 「5. Values that differ from Figma」에만 기록한다.
- `package.json`의 `files`와 `exports`를 바꾸면 `scripts/package-smoke.test.js`의 기대 파일 목록을 함께 고친다.

### Testing Requirements
- 패키지 단독: `pnpm --filter @canon/tokens test` (`pnpm build && node --test scripts/*.test.js`). `preview/*.test.js`는 포함하지 않는다.
- 레포 전체: 루트에서 `pnpm test`가 `packages/tokens/scripts/*.test.js`와 `packages/tokens/preview/*.test.js`를 모두 실행한다. `pnpm check`는 여기에 `test:docs`와 `typecheck`를 더한다.
- 개발: `pnpm --filter @canon/tokens dev` (`tsup --watch src --watch tokens --watch scripts/build.js`).

### Common Patterns
- 값은 `$value`/`$type` 형식이고, 다른 토큰은 `"{color.gray.50}"` 별칭으로 참조한다.
- `typography.*` 토큰의 `$value`는 객체이며, 속성마다 `--typography-...-font-size` 같은 변수로 펼쳐진다.

## Dependencies

### Internal
- `@canon/react`와 `@canon/docs`가 `workspace:*`로 소비한다. `@canon/cli`의 `eject`가 `tokens/*.json`과 `./build`를 사용한다.

### External
- `style-dictionary` ^4.1.4(optional peer + devDependency), `tsup`, `typescript`.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
