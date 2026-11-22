# src

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`@canon/react`의 모든 컴포넌트 소스와 테스트가 평평하게 놓인 디렉터리다. 컴포넌트 하나는 `<Name>.tsx`와 `<Name>.test.tsx` 한 쌍이고, 공개 API는 `index.ts`가 정한다.

## Key Files

| Component | File | React Aria primitive와 특징 |
|-----------|------|------------------------------|
| `Button`, `IconButton` | `Button.tsx` | `Button` + `ProgressBar`(pending 스피너). `variant` 기본값 `secondary`, `size` 기본값 `lg`. `IconButton`은 `Button`을 다시 감싸며 비어 있지 않은 `aria-label` 필수이고 `destructive` variant가 없다 |
| `Checkbox` | `Checkbox.tsx` | `CheckboxField` + `CheckboxButton`. `checked`를 `isSelected`로, `indeterminate` 지원 |
| `RadioGroup`, `RadioOption` | `RadioGroup.tsx` | `RadioGroup`, `RadioField`, `RadioButton`. 자식은 `RadioOption`만 허용하고 `value` 중복을 막는다 |
| `Dialog` 외 6개 파트 | `Dialog.tsx` | `ModalOverlay`, `Modal`, `Dialog`, `DialogTrigger`. `DialogTitle`, `DialogDescription`이 직접 자식이어야 한다. 트리거는 native `button` 또는 Canon `Button`만 받는다 |
| `Select`, `SelectItem` | `Select.tsx` | `Select`, `Popover`, `ListBox`, `ListBoxItem`. `onValueChange`는 `string \| null`. `readOnly` 미지원 |
| `Switch` | `Switch.tsx` | `SwitchField` + `SwitchButton`. `required`, `invalid`, `errorMessage` 미지원 |
| `TextField` | `TextField.tsx` | `TextField` + `Input`. `type`은 text, search, email, password, url, tel만 허용 |
| `TextArea` | `TextArea.tsx` | `rows`는 양의 정수만 허용한다. 구조는 TextField와 같다 |
| `NumberField` | `NumberField.tsx` | `NumberField` + `Group` + 증감 `Button`. 빈 값은 `null`이며 내부에서 `NaN`으로 번역한다. 유한한 숫자만 허용 |
| (공개 API) | `index.ts` | 컴포넌트와 `*Props`, `*Size` 타입을 이름으로 export한다 |
| (테스트 설정) | `test-setup.ts` | jsdom에 `CSS.escape`를 보충한다 |

## For AI Agents

### Working In This Directory
- 새 컴포넌트는 아래 순서를 따른다(기존 컴포넌트에서 확인한 단계만 적는다).
  1. `<Name>.tsx`와 `<Name>.test.tsx` 작성
  2. `index.ts`에 컴포넌트와 타입 export 추가. `scripts/docs/validate.mjs`가 이 파일의 export를 읽는다
  3. `../styles.css`에 `.canon-<name>` 스타일 추가
  4. `docs/components/README.md`의 `## Implementation coverage matrix`, `docs/foundations/properties.md`의 `## Shared contract`·`### React` 표의 `이름` 열 갱신
  5. 컴포넌트 문서가 필요하면 `docs/components/<kebab-case 이름>.md`를 쓴다(문서가 없는 컴포넌트도 허용된다). `validateRuntimeStatus`가 이름을 확인하는 문서(`docs/guides/README.md`, `docs/decisions/interaction-foundation.md`)의 컴포넌트 이름 목록 갱신, 필요하면 `RUNTIME_STATUS_COMPONENTS`(`scripts/docs/validate.mjs`)에도 추가. `RUNTIME_STATUS_COMPONENTS`에 이름을 넣었다면 `scripts/docs/validate.test.mjs`의 `requires runtime status docs to acknowledge the public React package` 테스트도 고친다. 이 테스트는 문서마다 `<문서>: missing <이름> runtime status` 오류를 `RUNTIME_STATUS_COMPONENTS` 순서대로 하드코딩하므로, 해당 문서 블록에서 같은 위치에 새 이름의 줄을 추가한다. 고치지 않으면 `pnpm check`(`pnpm test:docs`)가 실패한다
  6. 1에서 만든 공개 함수 컴포넌트마다 `export function` 바로 위에 한국어 JSDoc을 쓴다. JSDoc이 비어 있으면 `validatePropertyCoverage`가 실패한다. `docs/components/<kebab-case 이름>.md`가 있는 컴포넌트의 JSDoc 구성은 요약 한 문장, 생성 영역 표식 한 쌍(` * <!-- canon:selection source=docs/components/<kebab-case 이름>.md -->`, ` * <!-- /canon:selection -->`), 타입이 막지 못하는 규칙만 담은 `### 제약`, 최소 TSX `### 예시`다. 요약, `### 제약`, `### 예시`는 손으로 쓰고 내용은 `docs/foundations/properties.md`, 그 컴포넌트 문서, 구현과 테스트에 있는 것만 쓴다. 표식 사이의 `### 언제 쓰나`, `### 쓰지 않는 경우`는 5에서 쓴 문서의 `## 선택` 절이 정본이므로 손으로 쓰지 않고 `pnpm sync:comments`로 생성한다. 문서 하나는 컴포넌트 하나를 다루며 대안 컴포넌트는 `[Name](./name.md)` 링크로 쓴다(생성기가 `{@link Name}`으로 바꾼다). 컴포넌트 문서가 없으면(anatomy 파트, item, 아직 문서를 다시 쓰지 않은 컴포넌트) 표식 없이 요약과 `### 제약`만 쓴다. 문서가 있는데 표식이 없으면 `validatePropertyCoverage`가, 영역이 문서와 다르면 `node scripts/docs/sync-comments.mjs --check`가 `pnpm test:docs`에서 실패한다. 현재 표식이 있는 컴포넌트는 Button과 IconButton뿐이다
  7. 문서가 있는 컴포넌트는 `apps/docs/components/<Name>Playground.jsx`, `apps/docs/lib/<name>-playground.mjs`를 만들고 `apps/docs/app/docs/[...slug]/page.jsx`의 `playgrounds` 맵에 `/docs/components/<name>` 경로로 등록, `apps/docs/app/globals.css`에 `.playground-<name>-stage` 추가
  8. 컴포넌트 문서를 추가했다면 `apps/docs/lib/docs.test.mjs`의 컴포넌트 route 목록에 `/docs/components/<name>`을 추가하고 playground 모델 테스트 작성. route 목록을 고치지 않으면 `pnpm test:docs`가 실패한다
  9. `scripts/package-consumption.test.mjs`의 export 이름 검증(ESM, CJS)과 렌더 검증에 새 컴포넌트를 포함할지 확인
  10. `.changeset/<name>-preview.md` 추가(`'@canon/react': minor`)
- 컴포넌트 파일은 `*Props` 인터페이스(또는 판별 유니온) → 검증용 `throw` → React Aria 컴포넌트 렌더 순서다. `className`은 `canon-<name>` 고정이며, 합칠 때는 `['canon-button', className].filter(Boolean).join(' ')`를 쓴다. `className`을 노출하는 것은 `Button`과 `IconButton`뿐이고, `IconButton`은 `canon-icon-button`을 더한다.
- 공개 prop 이름은 `docs/foundations/properties.md`의 `이름` 열에 있는 것만 쓴다. 후보 목록에 있는 이름은 허용 목록이 아니다.
- 모든 컴포넌트에서 `export function`으로 선언한다. validate가 함수 선언만 컴포넌트로 센다(`const` 화살표 함수는 누락된다).
- 컴포넌트 안에서 쓰는 아이콘은 `@phosphor-icons/react`의 `*Icon` 이름과 `aria-hidden`을 쓴다.

### Testing Requirements
- `pnpm --filter @canon/react test` 한 번에 모든 `*.test.tsx`를 실행한다. 한 파일만 돌릴 때는 `pnpm --filter @canon/react exec vitest run --environment jsdom src/Button.test.tsx`
- 테스트는 `vitest`의 `test`/`expect`, `@testing-library/react`의 `render`/`screen`/`cleanup`, `@testing-library/user-event`를 쓴다. 각 파일은 `afterEach(cleanup)`을 선언한다.
- 컴포넌트는 `./index`에서 가져와 공개 export 경로까지 검증한다.
- 단언은 role과 접근 가능한 이름(`getByRole`), `data-*` 속성, native form 값(`FormData`), 렌더 시점 에러 메시지다. 스타일은 검증하지 않는다.

## Dependencies

### Internal
- `../styles.css` — 여기서 쓰는 클래스와 `data-*` 속성의 스타일 정본
- `docs/foundations/properties.md`, `docs/components/README.md` — 공개 props 정본과 coverage

### External
- `react-aria-components`, `@phosphor-icons/react`

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
