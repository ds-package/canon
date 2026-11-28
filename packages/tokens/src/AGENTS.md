# src

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-22

## Purpose
`@canon/tokens`의 JS/TS 진입점이다. 값이 아니라 `var(--...)` 문자열 참조를 담은 `tokens` 객체를 export해, 스타일 코드가 CSS 변수를 타입 안전하게 가리키게 한다.

## Key Files

| File | Description |
|------|-------------|
| `index.ts` | `cssVar(name)`, `tokens`, `type Tokens`를 export한다. `color`, `brand`, `semantic` 등을 손으로 작성한 헬퍼(`chromaticScale`, `alphaScale`, `semanticStatus`, `brandScale`, `typographyStyle`)로 만든다. |

## For AI Agents

### Working In This Directory
- 이 파일은 `tokens/*.json`에서 생성되지 않는다. 손으로 작성한다. 그래서 토큰을 추가·삭제·개명하면 여기도 직접 고쳐야 한다.
- 모든 값은 `cssVar('<변수명>')`이 만든 `var(--<변수명>)`이어야 한다. 변수명은 `dist/css/variables.css`의 선언과 정확히 같아야 한다(`:root`의 `--tint-*`는 예외로 공개 참조가 필요 없다).
- 짝 검사: `scripts/build.test.js`는 모든 `tokens` 참조가 CSS에 선언되어 있고, `:root`의 공개 기본 변수(`--tint-*` 제외)가 모두 `tokens`에 참조되는지 검사한다.
- `pnpm build`는 `node scripts/build.js && tsup`이므로 JSON 변경만으로는 이 파일이 갱신되지 않는다.
- 출력 형식은 `tsup.config.ts`가 정한다: CJS는 `.cjs`, ESM은 `.mjs`, 타입은 `dist/index.d.ts`와 `dist/index.d.cts`. 패키지 `exports`의 `.` 조건과 맞아야 한다.
- 타입 검사: `tsconfig.json`의 `include`는 `src`뿐이다. 루트 `pnpm typecheck`가 실행한다.

### Testing Requirements
- `pnpm --filter @canon/tokens test`
- 공개 export 동작은 `scripts/package-smoke.test.js`(ESM·CJS import, 타입 확인)가 패킹된 패키지로 검증한다.

### Common Patterns
- 중첩 구조는 CSS 변수명을 camelCase로 옮긴다. 예: `--semantic-text-on-status` → `tokens.semantic.text.onStatus`, `--semantic-overlay-hover-inverse` → `tokens.semantic.overlay.hoverInverse`, `--semantic-status-<의미>-<강도>` → `tokens.semantic.status[의미][강도]`.

## Dependencies

### External
- 런타임 의존성이 없다. 빌드는 `tsup`, 타입은 `typescript`를 쓴다.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
