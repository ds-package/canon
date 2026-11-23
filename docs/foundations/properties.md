---
verified: 2026-11-23
navigation: foundation
navigationOrder: 4
---
# Component Properties

이 문서의 공통 계약이 Canon 컴포넌트 property 의미의 정본입니다. React public interface와 Figma component property는 공통 계약을 각 표면에 옮긴 번역입니다.

현재 구현이 공통 계약과 다르면 공통 계약을 구현에 맞추지 않습니다. 차이는 아래 「React differences」 표에 migration으로 기록합니다. React에서 지금 쓸 수 있는 prop과 값은 각 컴포넌트 문서와 [Components](../components/README.md)의 coverage 표를 따릅니다.

## Shared contract

prop은 제품이 정하는 의미를 드러냅니다. interaction 중에 바뀌는 상태는 runtime이 계산하며 public prop으로 만들지 않습니다.

### Selection and structure

| 이름 | 뜻과 값 | 기본값 | 사용 | 사용하지 않는 조건 |
| --- | --- | --- | --- | --- |
| `variant` | 컴포넌트의 스타일. Button 계열은 `'primary' \| 'secondary' \| 'quiet' \| 'destructive'` | 컴포넌트별로 정합니다. | 동작 컴포넌트는 쓰임에 맞는 스타일 하나를 고릅니다. 상태 표시 컴포넌트는 면 처리를 고릅니다. | 외곽 형태와 interaction 상태를 값에 섞지 않습니다. |
| `tone` | 상태 표시 컴포넌트의 의미색. 값은 해당 컴포넌트를 만들 때 정합니다. | 컴포넌트별로 정합니다. | Badge, Tag, Alert처럼 면 처리와 의미색을 따로 고르는 컴포넌트에 씁니다. | Button과 IconButton에는 두지 않습니다. |
| `size` | 크기. Button 계열은 `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`, field는 `'sm' \| 'md' \| 'lg'` | 컴포넌트별로 정합니다. | 컴포넌트가 제공하는 밀도를 선택합니다. | 의미, 아이콘 모양, 반응형 breakpoint를 값에 넣지 않습니다. |
| `orientation` | `'horizontal' \| 'vertical'` | `vertical` | RadioGroup의 배치와 키보드 이동 방향을 정합니다. | 단순 정렬 전용 prop으로 쓰지 않습니다. |
| `shape` | `'square' \| 'round'` | `square` | IconButton의 외곽 형태를 정합니다. | 동작 의미나 아이콘 종류를 나타내지 않습니다. |
| `id` | 비어 있지 않고 목록에서 고유한 선택 key | 필수 | SelectItem의 항목을 식별합니다. | 표시 순서나 label로 대신하지 않습니다. |

스타일 축은 컴포넌트 종류에 따라 정합니다.

1. 동작 컴포넌트(Button, IconButton)는 `variant` 하나로 고릅니다. 값은 `primary`, `secondary`, `quiet`, `destructive`이며 `primary`는 한 영역에 하나만 둡니다. IconButton은 `destructive`를 두지 않습니다. 아이콘만 있는 위험 동작은 잘못 누르기 쉬워서 label이 있는 Button을 씁니다.
2. 상태 표시 컴포넌트(Badge, Tag, Alert)는 `variant`와 `tone`을 함께 씁니다. 면 처리와 의미색이 독립적으로 조합되기 때문입니다.
3. 색이 의미를 갖지 않는 컴포넌트(Checkbox, Radio, Switch)에는 색 축을 두지 않습니다.

새 값은 실제 화면 사례가 생겼을 때만 추가합니다. 결정 배경은 [Action style 결정](../decisions/action-style.md)에 있습니다.

컴포넌트마다 실제 사용 사례와 시각 정의가 있는 값과 조합만 공개합니다. 현재 React와 다른 값은 아래 「React differences」 표에 적습니다.

### Conditions and persistent state

| 이름 | 값과 기본값 | 사용 | 사용하지 않는 조건 |
| --- | --- | --- | --- |
| `disabled` | boolean, `false` | 사용할 수 없는 interactive component에 씁니다. | hover나 focus 같은 순간 상태를 대신하지 않습니다. |
| `readOnly` | boolean, `false` | 값을 바꾸지 못하지만 focus할 수 있는 field와 choice control에 씁니다. | 안정적인 read-only 동작이 없는 컴포넌트에는 추가하지 않습니다. |
| `required` | boolean, `false` | 제출 전에 값이 필요한 form control에 씁니다. | 즉시 적용되는 Switch, Button, Dialog에는 쓰지 않습니다. |
| `invalid` | boolean, `false` | 검증에 실패한 form control에 씁니다. | 시각적 강조나 warning status를 대신하지 않습니다. `errorMessage`와 함께 씁니다. |
| `pending` | boolean, `false` | 비동기 action 중인 Button과 IconButton에 씁니다. | 모든 loading 표현이나 field validation에 일반화하지 않습니다. |
| `indeterminate` | boolean, `false` | 일부 하위 항목만 선택된 Checkbox에 씁니다. | 별도 form value나 일반 mixed style로 쓰지 않습니다. |
| `value`, `onValueChange` | 값과 변경 알림 | text, NumberField, Select, RadioGroup의 현재 값을 다룹니다. | boolean 선택이나 overlay 열림 상태에 쓰지 않습니다. |
| `checked`, `onCheckedChange` | boolean과 변경 알림 | Checkbox와 Switch의 선택 여부를 다룹니다. | Select나 RadioGroup의 선택 key에 쓰지 않습니다. |
| `open`, `onOpenChange` | boolean과 변경 알림 | Dialog의 열림 여부를 다룹니다. | 단순 visibility나 interaction 상태에 쓰지 않습니다. |

NumberField의 빈 값은 `0`이 아니라 빈 값입니다. 선택 key는 SelectItem의 `id`와 RadioOption의 `value`로 정합니다.

### Content and accessibility

| 이름 | 값과 기본값 | 사용 | 사용하지 않는 조건 |
| --- | --- | --- | --- |
| `children` | 텍스트 또는 rich content | 각 컴포넌트가 허용하는 label과 콘텐츠에 씁니다. | 보임 여부를 위한 `showChildren`을 만들지 않습니다. |
| `label` | 필수 텍스트 또는 rich content | Select, TextField, TextArea, NumberField, RadioGroup에 씁니다. | placeholder나 주변 문맥으로 대신하지 않습니다. |
| `placeholder` | 텍스트, 기본 없음 | Select, TextField, TextArea의 입력 예시에 씁니다. | label이나 입력 조건 설명을 대신하지 않습니다. |
| `description` | rich content, 기본 없음 | field와 choice control의 설명에 씁니다. | label이나 오류 메시지를 반복하지 않습니다. |
| `errorMessage` | rich content, 기본 없음 | `invalid` 상태를 설명합니다. | `invalid` 없이 일반 helper text로 쓰지 않습니다. |
| `leadingIcon`, `trailingIcon` | 아이콘, 기본 없음 | Button label의 앞이나 뒤에 배치합니다. | 별도의 `show*` boolean으로 보임을 제어하지 않습니다. |
| `icon` | 필수 아이콘 | IconButton에 씁니다. | 접근 가능한 이름 없이 쓰지 않습니다. |
| `pendingLabel` | 비어 있지 않은 텍스트, 기본 `Loading` | Button 진행 상태의 이름으로 씁니다. | 보이는 Button label을 대체하지 않습니다. |
| 접근 가능한 이름 | 텍스트. IconButton은 필수 | Button 계열의 이름을 제공합니다. | 보이는 label이 있으면 이름을 중복하지 않습니다. |

Checkbox, Switch, RadioOption의 `children`은 보이는 단일 label이므로 텍스트를 씁니다. SelectItem의 rich content가 텍스트가 아니면 검색과 보조 기술용 `textValue`를 지정합니다.

### Action and interaction

| 이름 | 값과 기본값 | 사용 | 사용하지 않는 조건 |
| --- | --- | --- | --- |
| `onPress` | action, 기본 없음 | Button과 IconButton의 동작을 연결합니다. | 링크 이동에 쓰지 않습니다. |
| `minValue`, `maxValue`, `step` | 숫자, 기본 없음 | NumberField의 입력 범위를 정합니다. | 식별자에 쓰지 않습니다. |
| `formatOptions` | locale에 맞는 숫자 표시 규칙, 기본 없음 | NumberField의 숫자 표시를 정합니다. | 통화나 단위 문자열을 직접 붙이지 않습니다. |
| `rows` | 처음 표시할 줄 수, 기본 `4` | TextArea의 높이를 정합니다. | 입력 가능한 줄 수 제한으로 쓰지 않습니다. |

- hover, pressed, focus, filled는 runtime이 계산합니다. public `state`나 상태별 boolean prop을 만들지 않습니다.
- `disabled`와 `pending` 상태에서는 action이 실행되지 않습니다.
- 위치에는 `leading`, `trailing`을 씁니다. `left`, `right`를 public prop으로 만들지 않습니다.

## Platform translations

### React

현재 public 구현은 `@canon/react`입니다. 각 component 문서가 실제로 지원하는 prop과 사용 예시를 설명합니다. React Aria Components의 전체 props를 그대로 상속하지 않습니다.

#### React differences

공통 계약을 아직 React에 옮기지 않은 항목입니다. 각 컴포넌트 문서는 현재 React 값을 설명합니다. Figma 칸은 2026-11-23에 Canon Figma 파일에서 직접 읽은 값입니다.

| 항목 | 공통 계약 | 현재 React | Figma | 상태 |
| --- | --- | --- | --- | --- |
| Button `variant` | `primary`, `secondary`, `quiet`, `destructive`. 기본 `secondary` | 계약과 같음 | 같은 네 값. 기본 `primary` | Figma 기본값만 다름 |
| IconButton `variant` | `primary`, `secondary`, `quiet`. 기본 `secondary` | 계약과 같음 | 계약과 같음. 기본 `primary` | Figma 기본값만 다름 |
| Button과 IconButton 기본 `size` | `lg` | 계약과 같음 | `xl` | Figma 기본값만 다름 |
| Button 아이콘 | `leadingIcon`, `trailingIcon` 콘텐츠로 표현 | 계약과 같음 | `showLeadingIcon`, `showTrailingIcon` boolean | Figma authoring 전용 |

Button과 IconButton 외 컴포넌트의 Figma는 Chakra UI에서 가져온 초안이며 디자인 정리 전입니다. 이 컴포넌트들의 Figma 값은 아직 비교 기준으로 쓰지 않습니다.

React는 2026-11-23에 기본값을 반영했습니다. Figma도 같은 날 `tone`을 없애고 네 variant로 다시 묶었습니다. Figma 기본값은 component set의 왼쪽 위 variant로 정해지므로 정렬 규칙상 `primary`, `xl`로 표시됩니다.

- boolean prop은 `disabled`처럼 제품 의미를 쓰고, React Aria 이름인 `isDisabled`와 `isSelected`는 내부에서 처리합니다.
- action은 `onPress`로 노출합니다. native `onClick`은 공개하지 않습니다.
- 텍스트는 `string`, rich content는 `ReactNode`, 아이콘은 `ReactElement`를 사용합니다.
- React Aria의 선택·열림 상태 이름은 Canon prop으로 번역하며 원래 이름을 public interface로 노출하지 않습니다.

#### Initial values and state flow

| 이름 | 대응하는 현재 값과 변경 알림 | 생략 기본값 |
| --- | --- | --- |
| `defaultValue` | `value`, `onValueChange` | 빈 값 또는 미선택 |
| `defaultChecked` | `checked`, `onCheckedChange` | `false` |
| `defaultOpen` | `open`, `onOpenChange` | `false` |

controlled 값과 default 값은 함께 받지 않습니다. `readOnly`인 controlled field와 choice control은 변경 알림을 받지 않습니다.

#### Native form, focus, and extra props

| 이름 | 타입과 기본값 | 지원 범위와 조건 |
| --- | --- | --- |
| `type`, `form`, `name`, `value` | Button type은 `'button' \| 'submit' \| 'reset'`, 기본 `button`; 나머지는 `string \| undefined` | Button의 native form 연결입니다. submit일 때만 type을 바꿉니다. |
| `form`, `name` | `string \| undefined` | 검증된 form field와 choice control에서 지원합니다. |
| 제출용 `value` | `string \| undefined`, 생략하면 native 기본값 `on` | Checkbox와 Switch에 사용합니다. `checked`와 구분합니다. |
| `id` | `string \| undefined` | Button과 IconButton의 DOM id입니다. |
| `autoFocus` | `boolean \| undefined`, 기본 `false` | Button, IconButton, Select, TextField에서 지원합니다. |
| `onFocus`, `onBlur` | React Aria focus handler | Select와 TextField에서 지원합니다. |
| `aria-label`, `aria-labelledby`, `aria-describedby` | `string \| undefined` | Button 계열에서 지원합니다. IconButton은 `aria-label`이 필수입니다. |
| `className` | `string \| undefined` | Button과 IconButton에서 지원합니다. |
| `autoComplete`, `inputMode`, `pattern`, `minLength`, `maxLength` | native input props | TextField의 검증된 allowlist에서 지원합니다. |
| `type` | `'text' \| 'search' \| 'email' \| 'password' \| 'url' \| 'tel'`, 기본 `text` | TextField 입력 종류입니다. 숫자 입력에는 NumberField를 씁니다. |
| `textValue` | `string \| undefined` | 텍스트가 아닌 SelectItem 콘텐츠에 지정합니다. |
| `closeOnInteractOutside`, `closeOnEscape` | boolean, 각각 기본 `false`, `true` | Dialog 닫힘 동작을 정합니다. |

검증하지 않은 React Aria 또는 native prop은 지원 범위에 추가하지 않습니다.

#### Dialog composition

- `DialogTrigger`에는 트리거(native `button` 또는 Canon `Button`)와 `Dialog`를 이 순서로 넣습니다.
- Dialog의 제목, 설명, 본문, 푸터는 각각 rich `children`으로 구성합니다.
- `DialogClose`의 `children`은 선택 사항입니다. 생략하면 닫기 아이콘을 표시하며 `aria-label`을 지정합니다.
