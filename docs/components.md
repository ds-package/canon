---
verified: 2026-11-15
navigation: component
---
# 컴포넌트 프로퍼티 모델

Canon의 표준 언어는 호출자가 정하는 조건과 콘텐츠, runtime이 계산하는 interaction, Figma에서 검수하는 시각 상태를 분리한다. 같은 의미는 `disabled`, `checked`, `value`, `open`처럼 같은 명사로 연결하되 각 표면의 역할 때문에 표현이 다르면 명시적으로 변환한다.

이 문서에 기록한 property model이 현재 Canon의 정본이다. React public interface와 Figma authoring interface는 모두 이 모델을 따라야 한다. 실제 코드와 Figma inventory는 현재 구현을 확인하고 migration 범위를 찾는 근거이며, 현재 상태가 정본과 다르면 정본을 현재 상태에 맞추지 않고 각 표면의 migration을 결정한다.

## 네 가지 표면

| 표면 | 역할 | 현재 구현 근거 | 정본에 맞출 때 |
| --- | --- | --- | --- |
| React public interface | 제품이 콘텐츠, 값, 조건, 동작을 선언한다. | `packages/react/src/*.tsx` | property 이름, 타입, 변환 규칙을 이 모델에 맞춘다. |
| Runtime-derived state | 브라우저와 React Aria가 interaction과 현재 값을 계산한다. | DOM과 `packages/react/styles.css` | 모델의 의미를 platform 표현으로 변환한다. `data-*`와 pseudo-class를 public prop으로 만들지 않는다. |
| Figma authoring interface | 설계자가 조합과 시각 상태를 편집하고 검수한다. | Canon Figma component property | property 이름과 값을 이 모델에 맞춘다. 현재 inventory는 migration 입력이다. |
| Playground state | 문서 사용자가 예제를 바꾸고 JSX를 복사한다. | `apps/docs` playground model | 정본과 React 구현을 재현한다. `dark`, `component`, `showFooter`를 public prop으로 복사하지 않는다. |

## Property 사전

### 선택과 구조

| 이름 | 뜻과 타입 | 기본값 | 사용 | 사용하지 않는 조건 |
| --- | --- | --- | --- | --- |
| `variant` | `ButtonVariant = 'primary' \| 'secondary' \| 'quiet' \| 'destructive'` | Button `primary`, IconButton `quiet` | Button, IconButton | 범용 variant 목록, token 이름, Figma 면 처리 축을 복사하지 않는다. |
| `status` | 구현 전 후보는 `'informative' \| 'positive' \| 'notice' \| 'negative'` | 확정 기본값 없음 | 구현된 컴포넌트 없음 | Alert와 Badge가 구현되기 전에는 예상 public prop으로 만들지 않는다. |
| `size` | Button은 `'xs' \| 'sm' \| 'md' \| 'lg'`, field는 `'sm' \| 'md' \| 'lg'` | 모두 `md` | Button 계열, Select, TextField, TextArea, NumberField | 의미, icon 형태, 반응형 breakpoint를 값에 넣지 않는다. |
| `orientation` | `'horizontal' \| 'vertical'`, 선택지 구조와 keyboard 방향 | `vertical` | RadioGroup | 단순 CSS 정렬만 바꾸는 prop으로 쓰지 않는다. |
| `shape` | `'square' \| 'round'`, 같은 역할의 외곽 형태 | `square` | IconButton | Button의 의미나 icon 종류를 표현하지 않는다. |

`variant` 값은 컴포넌트마다 다를 수 있다. Button의 `destructive`는 되돌리기 어려운 행동의 결과이므로 feedback `status`가 아니라 Button variant다.

### 호출자가 정하는 조건

| 이름 | 타입과 기본값 | 사용 | 사용하지 않는 조건 |
| --- | --- | --- | --- |
| `disabled` | `boolean`, 기본 `false` | 사용할 수 없는 interactive component | hover, focus 같은 순간 interaction을 대신하지 않는다. |
| `readOnly` | `boolean`, 기본 `false` | 값은 제출하고 focus할 수 있지만 수정할 수 없는 field | Select처럼 플랫폼에 안정적인 read-only 동작이 없으면 노출하지 않는다. |
| `required` | `boolean`, 기본 `false` | 제출 전 값이 필요한 form control | Switch의 즉시 적용 설정, Button, Dialog에 쓰지 않는다. |
| `invalid` | `boolean`, 기본 `false` | 검증 실패를 명시하는 form control | 시각적 강조나 warning status를 대신하지 않는다. `errorMessage`와 함께 쓴다. |
| `pending` | `boolean`, 기본 `false` | 비동기 action 중인 Button | 모든 loading 표현이나 field validation 상태로 일반화하지 않는다. |
| `indeterminate` | `boolean`, 기본 `false` | 일부 하위 항목만 선택된 Checkbox | 세 번째 form value나 일반적인 mixed style로 쓰지 않는다. |

React boolean에는 `is` 접두사를 붙이지 않는다. adapter가 `disabled`를 React Aria `isDisabled`로, `checked`를 `isSelected`로 번역한다.

### 지속 상태 문법

| 상태 | 값 타입 | Controlled | Uncontrolled와 생략 기본값 | 변경 알림 | 사용하지 않는 조건 |
| --- | --- | --- | --- | --- | --- |
| 일반 값 | text `string`, NumberField `number \| null`, 선택 key `string \| null` | `value` | `defaultValue`, 생략하면 빈 값 또는 미선택 | `onValueChange` | boolean 선택 여부나 overlay 열림에 쓰지 않는다. |
| 선택 여부 | `boolean` | `checked` | `defaultChecked`, 생략하면 `false` | `onCheckedChange` | RadioGroup과 Select의 단일 선택 key에 쓰지 않는다. |
| 열림 여부 | `boolean` | `open` | `defaultOpen`, 생략하면 `false` | `onOpenChange` | 단순 visibility나 interaction state에 쓰지 않는다. |

- controlled 값과 default 값은 함께 받지 않는다.
- controlled 값에는 변경 알림이 필요하다. `readOnly` field만 callback을 생략할 수 있다.
- uncontrolled 변경 알림은 선택 사항이다.
- `value` 타입은 역할을 따른다. 텍스트는 `string`, NumberField는 `number | null`, Select와 RadioGroup은 선택 key를 쓴다.
- React Aria의 `selectedKey`, `isSelected`, `isOpen`, `onSelectionChange`는 adapter 안에서 번역한다.

### 콘텐츠와 슬롯

| 이름 | 타입과 기본값 | 사용 | 사용하지 않는 조건 |
| --- | --- | --- | --- |
| `children` | Button과 Dialog anatomy는 필수 `ReactNode`; Checkbox, Switch, RadioOption은 필수 `string`; option container는 제한된 element | 해당 컴포넌트 | 생략 기본값은 없다. 보임을 위한 별도 `showChildren`을 만들지 않는다. |
| `label` | 필수 `ReactNode`, 생략 기본값 없음 | Select, TextField, TextArea, NumberField, RadioGroup | placeholder나 주변 문맥으로 대신하지 않는다. |
| `description` | `ReactNode \| undefined`, 기본 `undefined` | 설명을 연결하는 field와 choice control | label이나 오류를 반복하지 않는다. |
| `errorMessage` | `ReactNode \| undefined`, 기본 `undefined` | `invalid`를 지원하는 control | `invalid` 없이 상시 helper text로 쓰지 않는다. |
| `leadingIcon` | `ReactElement \| undefined`, 기본 `undefined` | Button | 콘텐츠 존재로 보임을 정한다. `showLeadingIcon`을 함께 만들지 않는다. |
| `trailingIcon` | `ReactElement \| undefined`, 기본 `undefined` | Button | 콘텐츠 존재로 보임을 정한다. `showTrailingIcon`을 함께 만들지 않는다. |
| `leadingSlot` | 구현된 타입과 기본값 없음 | 구현된 컴포넌트 없음 | Figma InputGroup의 instance swap만 보고 React prop을 만들지 않는다. |
| `trailingSlot` | 구현된 타입과 기본값 없음 | 구현된 컴포넌트 없음 | 실제 runtime 사용 사례와 접근성 계약이 생길 때 결정한다. |
| `pendingLabel` | 비어 있지 않은 `string`, 기본 `Loading` | Button의 progressbar 이름 | 보이는 Button label을 대체하지 않는다. |

Checkbox, Switch, RadioOption의 `children`은 단일한 보이는 label이므로 `string`으로 제한한다. SelectItem은 rich content를 허용하지만 문자열이 아니면 typeahead용 `textValue`가 필요하다. 이 차이는 같은 의미의 이름 불일치가 아니라 역할별 콘텐츠 제약이다.

### Action, native form, focus, escape hatch

| 이름 | 타입과 생략 기본값 | 지원 범위 | 사용하지 않는 조건 |
| --- | --- | --- | --- |
| `onPress` | `AriaButtonProps['onPress'] \| undefined`, 기본 `undefined` | Button, IconButton | native `onClick`을 함께 노출하지 않는다. |
| `type`, `form`, `name`, `value` | Button type은 `'button' \| 'submit' \| 'reset'`, 기본 `button`; 나머지는 `string \| undefined` | Button의 native form seam | submit일 때만 type을 바꾸고 field state value와 혼동하지 않는다. |
| `form`, `name` | `string \| undefined`, 기본 `undefined` | form field와 choice control | native form 연결이 검증되지 않은 컴포넌트에는 노출하지 않는다. |
| 제출용 `value` | `string \| undefined`, 생략하면 native 기본값 `on` | Checkbox, Switch | `checked` 상태와 같은 prop으로 취급하지 않는다. |
| `autoFocus` | `boolean \| undefined`, 기본 `false` | Button, IconButton, Select, TextField | 검증하지 않은 control로 일괄 확대하지 않는다. |
| `onFocus`, `onBlur` | React Aria focus handler 또는 `undefined`, 기본 `undefined` | Select, TextField | DOM 상태를 제어하는 prop으로 쓰지 않는다. |
| `aria-label`, `aria-labelledby`, `aria-describedby` | `string \| undefined`, 기본 `undefined`; IconButton의 `aria-label`은 필수 | Button 계열 | 보이는 label이 있는 곳에 중복 이름을 만들지 않는다. |
| `className` | `string \| undefined`, 기본 `undefined` | Button, IconButton | 공통 escape hatch로 가정하지 않는다. |
| native input props | `autoComplete`, `inputMode`, `pattern`은 string 계열, length는 `number \| undefined`; 모두 기본 `undefined` | TextField | 검증한 allowlist 밖 native prop을 추가하지 않는다. |
| 숫자 props | bound와 step은 `number \| undefined`, format은 `Intl.NumberFormatOptions \| undefined`; 모두 기본 `undefined` | NumberField | 비유한 숫자 식별자에 쓰지 않는다. |
| 구조 props | TextArea `rows: number = 4`; Dialog close 조건은 `boolean`, outside 기본 `false`, Escape 기본 `true` | TextArea, Dialog | 범용 layout prop으로 확대하지 않는다. |

React Aria props 전체를 상속하지 않는다. 지원되지 않는 focus·form prop은 누락이 아니라 아직 검증되지 않은 interface다.

## Figma, React, runtime 변환 계약

| 의미 | Figma 목표 표현 | React public interface | 현재 runtime 표현 |
| --- | --- | --- | --- |
| hover | `interaction=hover` | 없음 | React Aria `data-hovered` 또는 native `:hover` |
| pressed | `interaction=pressed` | 없음 | React Aria `data-pressed` |
| keyboard focus | `interaction=focus` | 없음 | `data-focus-visible`, native `:focus-visible`, composite field의 `data-focus-within` |
| disabled | `disabled=true` | `disabled` | React Aria `data-disabled`와 native `disabled` |
| checked | `checked=true` | `checked/defaultChecked/onCheckedChange` | Checkbox와 Switch의 `data-selected`, native `checked` |
| selected | `selected=true` 또는 선택 value example | `value/defaultValue/onValueChange` | option의 `data-selected`와 native 선택 상태 |
| invalid | `invalid=true` | `invalid` | `data-invalid`와 `aria-invalid` |
| filled | 실제 value가 있는 example | 별도 prop 없음 | value와 placeholder 상태에서 파생 |
| pending | `pending=true` | `pending` | Button `data-pending`과 progressbar |
| open | 열린 상태 example | `open/defaultOpen/onOpenChange` | React Aria open state, overlay와 popover layer |

TextField와 TextArea는 native input과 textarea가 직접 hover와 focus를 계산하므로 `:hover`와 `:focus-visible`을 쓴다. SelectItem의 `data-focused`는 roving focus로 현재 option을 가리키고, `data-focus-visible`은 keyboard focus ring을 그린다. 두 상태는 합치지 않는다.

## 실제 Figma inventory

2026-11-15에 파일 `9GZgtyTnVbm2YfJoadmIjp`의 31개 페이지와 모든 local component property owner를 읽었다. 아래는 구현된 React component에 대응하는 현재 Figma다. 이는 목표 convention이나 정본이 아니라, Figma를 Canon property model에 맞추기 위한 원문 확인 결과다.

| Figma owner | 현재 property와 값 | local instance, override 있음 |
| --- | --- | --- |
| Button | TEXT `children=Button`; BOOLEAN `showLeadingIcon=true`, `showTrailingIcon=true`; VARIANT `variant=[quiet], default quiet`, `interaction=[default, focus, hover, pressed], default default`, `size=[lg, md, sm, xs], default md`, `disabled=[false, true], default false` | 26, override key migration 완료 |
| IconButton | INSTANCE_SWAP `icon`; VARIANT `variant=[quiet], default quiet`, `interaction=[default, hover, pressed, focus], default default`, `size=[lg, md, sm, xs], default md`, `disabled=[false, true], default false`, `shape=[square, round], default square` | local instance 없음 |
| Checkbox | TEXT `children=Checkbox Label`; VARIANT `size=[sm, md, lg], default sm`, `interaction=[hover, pressed, focus, default], default default`, `checked=[false, true], default false`, `disabled=[false, true], default false`, `indeterminate=[false, true], default false` | 45, stale `state` override 0 |
| Switch | VARIANT `size=[sm, md, lg], default sm`, `checked=[false, true], default false`, `disabled=[false, true], default false`, `interaction=[default, hover, pressed, focus], default default` | 30, stale `state` override 0 |
| Radio | TEXT `children=Radio Label`; VARIANT `size=[sm, md, lg], default sm`, `interaction=[hover, pressed, default, focus], default default`, `disabled=[false, true], default false`, `checked=[false, true], default false`; RadioGroup owner 없음 | local instance 없음 |
| Input Next | TEXT `placeholder=Placeholder`; VARIANT `size=[xs, sm, md, lg], default md`, `appearance=[filled, flushed, outline, unstyled], default outline`, `invalid=[false, true], default false`, `disabled=[false, true], default false`, `readOnly=[false, true], default false`, `interaction=[default, focus], default default` | 411, stale `state`·`variant` override 0 |
| NumberInput | TEXT `defaultValue=40`; VARIANT `size=[md, sm, xs, lg], default md`, `interaction=[default, focus], default default`, `invalid=[false, true], default false`, `disabled=[false, true], default false`, `readOnly=[false, true], default false` | 20, stale `state` override 0 |
| Select | TEXT `placeholder=Placeholder`; VARIANT `size=[xs, sm, md, lg], default md`, `appearance=[filled, flushed, outline, unstyled], default outline`, `invalid=[false, true], default false`, `disabled=[false, true], default false`, `readOnly=[false, true], default false`, `interaction=[default, focus], default default` | 80, stale `state`·`variant` override 0 |
| Modal, ModalContent | Modal property 없음; Next는 BOOLEAN `showCloseButton=true`, `showFooter=true`; legacy는 `showCloseButton=true`와 VARIANT `showFooter=true\|false` | Modal 3, 3; Next 6, 6 |

Figma의 boolean 의미가 VARIANT의 문자열 `true|false`로 구현된 경우가 있다. 외형 조합과 instance override를 보존하기 위한 Figma 구현 선택이므로 이름이 boolean이라는 이유만으로 BOOLEAN property로 일괄 변환하지 않는다.

### 현재와 목표, migration 영향

| migration 전 Figma | 목표 convention | migration 결과와 영향 |
| --- | --- | --- |
| interaction 검수 축 이름이 `state` | `interaction` | 8개 component set과 local instance를 migration했다. stale `state` override는 0개다. 외부 library 소비 파일은 미확인이다. |
| Button `state`에 pressed 없음, hover/lg variant 중복 | `default\|hover\|pressed\|focus` 완성 | pressed token을 쓰던 중복 hover를 `pressed`로 바로잡았다. |
| Figma Button `variant=subtle`, `intent=neutral` | React 행동 의미 `variant` | 기존 표현은 `variant=quiet`로 옮겼다. 단일값 `intent`는 제거했다. `primary`, `secondary`, `destructive` 시각 정의는 아직 없다. |
| Figma field에 `xs`와 표현 `variant` 존재 | React field는 `sm\|md\|lg`, 표현 variant 없음 | 표현 축은 Figma 전용 `appearance`로 분리했다. 기본 size는 `md`로 맞췄다. `xs` catalog variant는 React에 노출하지 않는다. |
| Figma Select에 `readOnly` 존재 | React Select는 `readOnly` 미지원 | 플랫폼에 예측 가능한 read-only 선택 동작이 없어 현재는 mapping하지 않는다. |
| Badge와 Alert가 feedback 의미를 `intent`로 표현 | 구현 시 `status`를 검토 | React 미구현이므로 아직 확정 계약이 아니다. |
| `show*` BOOLEAN과 icon INSTANCE_SWAP | 콘텐츠와 composition 존재 | React에는 `show*`를 만들지 않는다. icon은 `leadingIcon`, `trailingIcon` 같은 제한된 콘텐츠 prop으로 번역한다. |

Figma Plugin API의 property rename을 사용해 기존 component와 local instance ID를 유지한 채 `state`를 `interaction`으로 옮겼다. Button 계열의 `intent`와 IconButton의 중복 `showLeadingIcon`도 제거했다. library publish는 하지 않았다.

미확인 범위는 외부 소비 Figma 파일의 library instance 수와 publish 이후 override 보존이다. TextArea에 직접 대응하는 Figma property owner도 확인되지 않았다.

## 구현 coverage matrix

세 번째 열은 TypeScript public interface와 자동 대조한다. 컴포넌트별 사용 판단과 값 설명은 링크한 문서가 맡는다.

| Component | Public type | Public props | 문서와 예외 |
| --- | --- | --- | --- |
| [Button](./button.md) | `ButtonProps` | `children`, `variant`, `size`, `leadingIcon`, `trailingIcon`, `disabled`, `pending`, `pendingLabel`, `className`, `id`, `form`, `name`, `value`, `type`, `autoFocus`, `onPress`, `aria-label`, `aria-labelledby`, `aria-describedby` | `className`과 press/form allowlist를 지원한다. |
| [IconButton](./button.md) | `IconButtonProps` | `icon`, `aria-label`, `variant`, `shape`, `size`, `disabled`, `pending`, `pendingLabel`, `className`, `id`, `form`, `name`, `value`, `type`, `autoFocus`, `onPress`, `aria-labelledby`, `aria-describedby` | children 대신 icon과 필수 이름을 받는다. |
| [Checkbox](./checkbox.md) | `CheckboxProps` | `children`, `description`, `errorMessage`, `indeterminate`, `disabled`, `required`, `invalid`, `name`, `value`, `form`, `checked`, `defaultChecked`, `onCheckedChange`, `readOnly` | public checked를 runtime selected로 번역한다. |
| [RadioGroup](./radio-group.md) | `RadioGroupProps` | `children`, `label`, `description`, `errorMessage`, `orientation`, `disabled`, `required`, `invalid`, `name`, `form`, `value`, `defaultValue`, `onValueChange`, `readOnly` | rich label, 제한된 RadioOption children을 쓴다. |
| [RadioOption](./radio-group.md) | `RadioOptionProps` | `value`, `children`, `description`, `disabled` | label children은 string이다. |
| [SelectItem](./select.md) | `SelectItemProps` | `id`, `children`, `textValue`, `disabled` | rich children에는 textValue가 필요하다. |
| [Select](./select.md) | `SelectProps` | `children`, `label`, `description`, `errorMessage`, `placeholder`, `size`, `disabled`, `required`, `invalid`, `name`, `form`, `autoFocus`, `onFocus`, `onBlur`, `value`, `defaultValue`, `onValueChange` | readOnly를 지원하지 않는다. |
| [Switch](./switch.md) | `SwitchProps` | `children`, `description`, `disabled`, `name`, `value`, `form`, `checked`, `defaultChecked`, `onCheckedChange`, `readOnly` | required, invalid, errorMessage를 지원하지 않는다. |
| [TextField](./text-field.md) | `TextFieldProps` | `label`, `description`, `errorMessage`, `type`, `size`, `disabled`, `required`, `invalid`, `name`, `form`, `autoComplete`, `placeholder`, `autoFocus`, `onFocus`, `onBlur`, `inputMode`, `pattern`, `minLength`, `maxLength`, `value`, `defaultValue`, `onValueChange`, `readOnly` | native hover와 focus pseudo-class를 쓴다. |
| [TextArea](./text-area.md) | `TextAreaProps` | `label`, `description`, `errorMessage`, `placeholder`, `rows`, `size`, `disabled`, `required`, `invalid`, `name`, `form`, `value`, `defaultValue`, `onValueChange`, `readOnly` | native textarea 계약을 쓴다. |
| [NumberField](./number-field.md) | `NumberFieldProps` | `label`, `description`, `errorMessage`, `size`, `minValue`, `maxValue`, `step`, `formatOptions`, `disabled`, `required`, `invalid`, `name`, `form`, `value`, `defaultValue`, `onValueChange`, `readOnly` | 빈 값은 null이며 composite focus를 쓴다. |
| [DialogClose](./dialog.md) | `DialogCloseProps` | `children`, `aria-label` | children이 없으면 aria-label이 필수다. |
| [Dialog](./dialog.md) | `DialogProps` | `children`, `closeOnInteractOutside`, `closeOnEscape` | 기본 closeOnEscape는 true다. |
| [DialogTrigger](./dialog.md) | `DialogTriggerProps` | `children`, `open`, `defaultOpen`, `onOpenChange` | trigger와 Dialog 두 element를 제한한다. |
| [DialogTitle, DialogDescription, DialogBody, DialogFooter](./dialog.md) | 내부 공통 타입 | `children` | public anatomy component이며 별도 exported Props type은 없다. |

## Figma에만 있는 property와 React에만 있는 prop

Figma에만 있는 `interaction`, `appearance`, `showLeadingIcon`, `showFooter`, INSTANCE_SWAP `icon`, component catalog용 `size`는 편집과 시각 검수를 위한 것이다. React에 같은 이름을 자동 추가하지 않는다.

React에만 있는 callback, native form 연결, focus handler, `formatOptions`, `rows`, 접근성 이름, controlled와 uncontrolled 쌍은 실행과 데이터 흐름을 위한 것이다. Figma property로 자동 추가하지 않고 필요한 example이나 annotation으로 검수한다.

## AI 선택 규칙

1. 먼저 이 문서의 property 사전과 변환 규칙을 따른다. component 문서와 exported `*Props`는 현재 구현 coverage이며, 정본과 충돌하면 차이를 migration 대상으로 기록한다.
2. Figma `show*`는 콘텐츠나 composition 존재로 번역한다. React에 같은 boolean을 만들지 않는다.
3. hover, pressed, focus, filled는 runtime-derived다. public `state`나 각각의 boolean prop을 만들지 않는다.
4. 값은 `value`, 선택 여부는 `checked`, 열림은 `open` 문법을 쓴다. React Aria 이름을 public interface로 새지 않게 한다.
5. 위치에는 `leading`, `trailing`을 쓴다. `left`, `right`나 token 이름을 public prop으로 만들지 않는다.
6. 지원되지 않은 native prop이 필요하면 기존 allowlist와 테스트 근거를 먼저 확인한다. React Aria props 전체를 상속하지 않는다.
7. Figma 현재값과 정본 convention이 다르면 현재값, 정본값, instance migration 영향을 따로 쓴다. 현재 Figma에 맞춰 정본을 바꾸지 않는다.
8. 미구현 컴포넌트의 예상 props는 확정 계약처럼 쓰지 않는다.

## 근거

- Canon property model 정본: 이 문서에 기록한 사용자와 에이전트의 합의
- Canon runtime 구현 근거: `packages/react/src/*.tsx`, `packages/react/styles.css`
- Canon Figma 현황 근거: file `9GZgtyTnVbm2YfJoadmIjp`, 2026-11-15 원문 확인
- Prism: `packages/liner-prism/rules/`, `packages/design-token/rules/`의 표면 분리와 migration 방식만 비교
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html): interaction과 accessibility behavior, DOM state contract
