# react

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`@canon/react`는 Canon의 React 런타임 컴포넌트 패키지다. `react-aria-components` 위에 Canon의 공개 props 계약을 얹고, 스타일은 `@canon/tokens`의 CSS 변수를 쓰는 `styles.css` 하나로 제공한다. 현재 React가 구현된 유일한 플랫폼 번역이며, 공개 props의 공통 의미 정본은 `docs/foundations/properties.md`이고 `docs/components/README.md`의 coverage matrix가 공개 props 목록을 기록한다.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | `exports`는 `.`(`dist/index.mjs`, `dist/index.cjs`, `dist/index.d.ts`)와 `./styles.css`다. `files`는 `dist`, `styles.css`만 발행한다 |
| `styles.css` | 모든 컴포넌트의 스타일. `.canon-*` 클래스와 `data-*` 속성 선택자, `@canon/tokens` CSS 변수만 쓴다 |
| `tsup.config.ts` | `src/index.ts` 하나를 cjs(`.cjs`)와 esm(`.mjs`)로 빌드하고 `.d.ts`를 만든다 |
| `vitest.config.ts` | `src/test-setup.ts`를 setup 파일로 등록한다 |
| `tsconfig.json` | `../../tsconfig.base.json`을 확장하고 `jsx: react-jsx`, `include: ["src"]`다 |
| `CHANGELOG.md` | changesets가 생성한다. 직접 편집하지 않는다 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | 컴포넌트, 테스트, 공개 export (see `src/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 공개 prop이나 컴포넌트를 추가, 이름 변경, 삭제하면 같은 변경에서 `docs/components/README.md`와 `docs/foundations/properties.md`를 고친다. `scripts/docs/validate.mjs`의 `validatePropertyCoverage`가 `src/index.ts`의 모든 `*Props` export와 함수 컴포넌트를 TypeScript checker로 읽어 대조하며, 어긋나면 `pnpm test:docs`가 실패한다. 대조 대상은 세 곳이다.
  - `docs/components/README.md`의 `## Implementation coverage matrix` 컴포넌트 행(`Component`, `Public type`, `Public props`)
  - `docs/foundations/properties.md`의 `## Shared contract`와 `### React` 표의 `이름` 열
  - 컴포넌트 목록 자체는 `validateRuntimeStatus`가 `docs/guides/README.md`, `docs/decisions/interaction-foundation.md`에서도 이름으로 확인한다(`docs/README.md`는 `@canon/react` 언급만 확인한다)
- 의존성 버전은 `react-aria-components` `1.22.1`, `@phosphor-icons/react` `2.1.10`처럼 정확히 고정한다. 올릴 때는 `^`를 붙이지 않는다.
- `react`, `react-dom`, `@canon/tokens`는 peer 의존성이다. devDependencies의 `@canon/tokens`는 `workspace:*`다.
- `apps/docs`는 이 패키지의 빌드 산출물(`dist`)과 `styles.css`를 쓴다. watch 스크립트가 없으므로 컴포넌트 코드를 고친 뒤 `pnpm --filter @canon/react build`를 다시 실행해야 docs playground에 반영된다.
- `src/index.ts`가 유일한 빌드 entry다. 여기서 export하지 않은 것은 발행되지 않는다.
- 발행 가능한 변경은 `.changeset/*.md`를 함께 추가한다(`pnpm changeset`). 기존 파일은 frontmatter에 `'@canon/react': minor`처럼 패키지와 bump 종류를 쓰고 본문에 영어로 변경 내용을 쓴다.

### Testing Requirements
- `pnpm --filter @canon/react test`(`vitest run --environment jsdom`)
- `pnpm --filter @canon/react build`
- `pnpm typecheck`(루트, 모든 패키지에서 `tsc --noEmit`)
- `pnpm test:docs`(docs와 코드의 props 대조, 선택 주석 최신성, docs 앱 테스트와 빌드)
- 루트 `pnpm test`는 모든 `packages/*`를 빌드한 뒤 이 패키지 테스트와 `scripts/package-consumption.test.mjs`를 실행한다. 이 테스트는 tokens, cli, react를 `pnpm pack`해 소비 프로젝트에서 설치하고 `.d.ts`, `styles.css` 해석을 확인한다
- 전체 검증은 `pnpm check`다

### Common Patterns
- `Button`과 `IconButton`의 기본값은 `variant="secondary"`, `size="lg"`다. `IconButton`의 `variant`는 `primary`, `secondary`, `quiet`이고 `destructive`는 없다.
- 컴포넌트는 React Aria 컴포넌트를 감싸고 Canon 어휘로 번역한다(`disabled` → `isDisabled`, `checked` → `isSelected`). React Aria props 전체를 상속하지 않고 지원하는 prop만 명시한다.
- 잘못된 사용은 렌더 시점에 `throw new Error('<Component> requires ...')`로 막는다. 테스트가 이 메시지를 검증한다.
- controlled와 uncontrolled는 판별 유니온 타입으로 표현한다(`value`와 `defaultValue` 동시 지정 불가, controlled는 `onValueChange` 필수 또는 `readOnly`).
- 클래스는 `canon-<component>`, `canon-<component>-<part>`이고 variant, size는 `data-variant`, `data-size`다. 상태 스타일은 React Aria가 붙이는 `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`, `data-invalid`, `data-selected` 선택자로 쓴다. 색, 간격, 타이포는 `var(--semantic-*)`, `var(--spacing-*)`, `var(--radius-*)`, `var(--typography-*)`를 쓰고, 크기는 `var(--control-height-*)`, `var(--icon-size-*)`, `var(--border-width-*)`를 쓴다. 색 토큰을 고르는 규칙은 `docs/foundations/color.md`의 「2. Semantic naming rules」다(진한 채움의 hover·pressed는 `overlay/*-inverse`를 얹는다).
- 애니메이션은 `styles.css` 끝의 `@media (prefers-reduced-motion: reduce)` 블록에서 줄인다.

## Dependencies

### Internal
- `@canon/tokens` — `styles.css`가 소비하는 CSS 변수(peer)
- `apps/docs`(소비자) — `@canon/react`와 `@canon/react/styles.css`를 가져온다

### External
- `react-aria-components`, `@phosphor-icons/react`
- 개발: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `tsup`, `typescript`

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
