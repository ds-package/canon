# docs

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`scripts/docs/`는 `DESIGN.md`, `docs/`, `apps/docs`, `@canon/react` 공개 타입이 서로 어긋나지 않는지 검사하는 문서 검증기를 담는다. 새 컴포넌트나 문서를 추가할 때 어떤 상수와 문서 표를 함께 고쳐야 하는지가 이 파일의 검사 항목에 박혀 있다.

## Key Files

| File | Description |
|------|-------------|
| `validate.mjs` | `validateDocs(root)`가 오류 문자열 배열을 돌려준다. 직접 실행(`node scripts/docs/validate.mjs`, 루트에서)하면 `process.cwd()`를 root로 검사하고 오류가 있으면 종료 코드 1이다. |
| `validate.test.mjs` | 임시 디렉터리에 fixture 저장소를 만들어 `validateDocs`를 검증하는 `node:test` 테스트 14개. |
| `sync-comments.mjs` | `syncComments(root, { check })`가 `packages/react/src/*.tsx`(테스트 제외)의 `export function` JSDoc에서 `<!-- canon:selection source=docs/components/<kebab-case 컴포넌트 이름>.md -->`와 `<!-- /canon:selection -->` 사이를 그 문서의 `## 선택` 절로 다시 쓴다(`selectionDocPath`: IconButton → `docs/components/icon-button.md`). 직접 실행(`pnpm sync:comments`)하면 쓰고, `--check`면 쓰지 않고 다른 영역을 `<파일>: <컴포넌트> selection comment differs from <문서>`로 출력한 뒤 종료 코드 1이다. 형식 오류가 하나라도 있으면 어떤 파일도 쓰지 않는다. |
| `sync-comments.test.mjs` | 생성, `--check` 성공·실패(CLI 종료 코드), 링크 변환과 거부, 표식 누락, 한 파일이 선언한 두 컴포넌트가 각자의 문서를 읽는 것, 다른 컴포넌트 문서를 가리키는 `source`, 다른 파일 오류가 있을 때 쓰지 않고 종료 코드 1을 내는 것을 fixture로 검증하는 `node:test` 테스트 7개. |

## For AI Agents

### Working In This Directory
검증 항목은 `validateDocs`가 순서대로 실행한다.

1. **route 링크** (`validateRouteLinks`): `ROUTE_DOCUMENTS`(`DESIGN.md`, `docs/README.md`)가 존재하고 모든 로컬 링크가 repo 안의 실제 파일을 가리켜야 한다. repo 밖으로 나가는 링크도 오류다. 링크는 인라인 형식만 읽는다.
   - `DESIGN.md`는 `REQUIRED_DESIGN_ROUTES` 6행을 요구한다. 각 항목의 질문 문구와 대상 링크가 같은 줄에 있어야 한다: token naming(`컬러 토큰의 이름` → `./docs/foundations/color.md`), Figma migration(`Figma 변수, 스타일, 컴포넌트를 안전하게 변경한다`) → `./docs/maintainers/figma-workflow.md`, component property model(`React props, runtime 상태, Figma property의 책임과 이름을 정한다`) → `./docs/foundations/properties.md`, interaction decision(`interaction foundation`) → `./docs/decisions/interaction-foundation.md`, docs platform decision(`docs web, search, playground`) → `./docs/decisions/docs-platform.md`, component selection(`제품 상황에 맞는 컴포넌트를 고른다`) → `./docs/guides/README.md`.
   - `DESIGN.md`에 문장 `추정하지 않고 미확인으로 남긴다`가 있어야 한다.
2. **decision frontmatter** (`validateDecisions`): `docs/decisions/` 바로 아래 모든 `.md`에 `id`, `status`, `verified`가 있어야 한다. `status`는 `proposed`/`adopted`/`superseded`/`deprecated` 중 하나, `verified`는 `YYYY-MM-DD`, `id`는 중복 불가다. frontmatter는 한 줄 scalar만 읽는다. 새 decision 문서는 이 필드를 반드시 넣는다.
3. **apps/docs 무Markdown** (`validateDocsApp`): `apps/docs`에서 `node_modules`, `.next`, `out`을 뺀 모든 `.md`/`.mdx`는 오류다.
4. **runtime status** (`validateRuntimeStatus`): `packages/react/package.json`이 있으면 `RUNTIME_STATUS_DOCUMENTS`(`docs/README.md`, `docs/guides/README.md`, `docs/decisions/interaction-foundation.md`) 각각에 문자열 `@canon/react`가 있어야 한다. `docs/README.md`는 시작 가이드라 예시 하나만 보이므로 컴포넌트 이름 목록은 검사하지 않고, 나머지 두 문서에는 `RUNTIME_STATUS_COMPONENTS`의 모든 이름이 들어 있어야 한다. 현재 목록: Button, IconButton, Checkbox, Dialog, NumberField, RadioGroup, Select, Switch, TextField, TextArea.
5. **property coverage** (`validatePropertyCoverage`): TypeScript compiler API로 `packages/react/src/index.ts`의 공개 export를 읽어 `docs/components/README.md`와 `docs/foundations/properties.md`에 대조한다.
   - 이름이 `Props`로 끝나는 모든 공개 export는 `docs/components/README.md`의 `## Implementation coverage matrix` 표에서 `` `XxxProps` `` 행과 그 행의 props 목록이 실제 타입 속성과 정확히 일치해야 한다. 누락과 초과 모두 오류다.
   - 모든 공개 prop 이름은 `docs/foundations/properties.md`의 `## Shared contract`와 `### React` 절의 표에서 `이름` 열에 백틱으로 적힌 이름 집합에 있어야 한다(`readContractNames`). 다른 열, 본문, iOS·Android 표는 읽지 않는다. 후보를 allowlist에 넣지 않으려면 `이름` 열에 쓰지 않는다.
   - 함수 선언인 공개 컴포넌트는 모두 `docs/components/README.md`의 `## Implementation coverage matrix` 첫 열에 있어야 하고(링크 여부는 상관없다), 반대로 matrix에만 있는 이름은 오류다. `Public type` 열이 `-`인 행은 아직 구현하지 않은 후보라 건너뛴다.
   - 함수 선언인 공개 컴포넌트는 모두 JSDoc이 있어야 한다(checker의 `getDocumentationComment`로 읽는다). 비어 있으면 `public component <이름> has no JSDoc` 오류다. `selectionDocPath(컴포넌트)`, 즉 `docs/components/<kebab-case 이름>.md`가 실제로 존재하는 컴포넌트는 JSDoc에 생성 영역 시작 표식(`<!-- canon:selection source=`로 시작해 `-->`로 끝나는 줄)과 끝 표식(`<!-- /canon:selection -->`)이 있어야 한다. 문서가 없는 컴포넌트는 표식을 요구하지 않는다(현재 Button과 IconButton만 문서가 있고 표식도 이 둘에만 있다). 영역 안 내용은 검사하지 않는다. 내용의 최신성은 6번이 맡는다. 이 주석은 `dist/index.d.ts`로 배포되어 소비자와 에이전트가 읽는 선택 기준이다.
6. **선택 주석 최신성** (`sync-comments.mjs --check`, `validateDocs` 밖에서 `pnpm test:docs`가 실행): 각 생성 영역이 `source` 문서의 `## 선택` 절과 같아야 한다.
   - 문서 형식: 문서 하나가 컴포넌트 하나를 다루고, `## 선택` 아래 `### 언제 쓰나`, `### 쓰지 않는 경우` 목록을 둔다. 여러 컴포넌트를 한 문서에 나누는 `### <Name>` 모드는 없다. `## 선택`에서 이 목록 밖의 문단은 생성하지 않는다.
   - 목록에는 한 줄짜리 `- ` 항목만 둔다. 다른 줄, 빈 목록, `*/`는 오류다.
   - 링크는 `[Name](./kebab-name.md)` 형식만 허용하고 `{@link Name}`으로 바꾼다. 대상은 `./`로 시작하는 kebab-case `.md`이고(앵커 불가), label은 `packages/react/src/index.ts`가 값으로 export하는 이름이어야 한다. 다른 링크는 오류다. Canon에 없는 대안은 링크 없이 "(Canon에 아직 없습니다)"를 붙인다.
   - `source`는 그 컴포넌트 이름에서 정해지는 문서여야 한다(Button → `docs/components/button.md`, `Button.tsx`가 선언한 IconButton → `docs/components/icon-button.md`). 다른 문서를 가리키면 오류다.
   - 표식이 한 쌍이 아니거나, `source` 문서가 없거나, `## 선택`·컴포넌트 절·두 목록이 없으면 오류다.
- 컴포넌트를 추가·삭제하면 `validate.mjs`의 `RUNTIME_STATUS_COMPONENTS`를 고치고 `docs/guides/README.md`, `docs/decisions/interaction-foundation.md`에 이름을 반영한다. 같은 변경에서 `validate.test.mjs`의 `requires runtime status docs to acknowledge the public React package` 테스트도 고친다. 이 테스트는 `missing <이름> runtime status` 오류를 `RUNTIME_STATUS_COMPONENTS` 순서대로 하드코딩한다. 모든 공개 컴포넌트에는 JSDoc이 필요하다. `docs/components/<component>.md`를 만들면 그 컴포넌트 JSDoc에 생성 영역 표식을 넣고 `pnpm sync:comments`를 실행한다. 문서가 없으면 표식 없이 요약과 제약만 둔다(예외 목록은 없다). 그 문서의 `## 선택`을 고친 뒤에도 `pnpm sync:comments`를 실행한다. `docs/components/README.md`의 coverage matrix 행도 함께 갱신한다. DESIGN.md 안내 행이나 대상 문서를 바꾸면 `REQUIRED_DESIGN_ROUTES`와 `validate.test.mjs`의 `REQUIRED_DESIGN`도 같이 고친다.
- `docs/foundations/properties.md`의 표 형식(unindented pipe table, `이름` 열)을 바꾸면 `readContractNames`가 읽지 못한다. 형식을 바꾸려면 검증기를 함께 바꾼다.
- 검증기의 `shortcut:` 주석은 의도된 단순화다(평면 YAML, 인라인 링크, pipe table, 한 줄 목록 항목).

### Testing Requirements
- 검증기만: `node scripts/docs/validate.mjs`(성공 시 `Docs validation passed`). `packages/react/src/index.ts`나 `docs/components/README.md`가 없으면 property coverage(5번)는 건너뛴다.
- 검증기 테스트: `node --test scripts/docs/validate.test.mjs`.
- 선택 주석: `pnpm sync:comments`(쓰기), `node scripts/docs/sync-comments.mjs --check`(검사, 성공 시 `Selection comments are up to date`), 테스트는 `node --test scripts/docs/sync-comments.test.mjs`.
- 둘 다 포함한 전체: `pnpm test:docs`.
- 테스트는 fixture(`DESIGN.md` 필수 행, `docs/*.md`, decisions)를 `mkdtemp`로 만들고 `t.after`에서 지운다. 검사 항목을 바꾸면 해당 오류 메시지를 확인하는 테스트를 추가한다.

### Common Patterns
- 오류는 `<상대 경로>: <메시지>` 문자열로 모으고 끝에서 한꺼번에 출력한다.
- 실제 저장소 대신 root를 인자로 받아 fixture에서 같은 코드를 재사용한다.

## Dependencies

### Internal
- `DESIGN.md`, `docs/**`(`docs/components/README.md`, `docs/foundations/properties.md`, `docs/components/<component>.md`), `apps/docs`(Markdown 부재만 검사한다), `packages/react/src/index.ts`(읽기 전용).
- `packages/react/src/*.tsx`: `sync-comments.mjs`가 JSDoc 생성 영역만 다시 쓴다.

### External
- `typescript`(루트 devDependency, compiler API), Node 내장 `node:fs/promises`, `node:path`, `node:test`.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
