---
verified: 2026-11-22
navigation: component
---
# Button

> Status: Preview. 공통 계약은 새 `variant`·`tone`을 확정했고, React public interface와 playground는 이전 variant를 유지한 migration 대상이다.

Button은 현재 화면에서 동작을 실행한다. 다른 위치로 이동하는 동작에는 Link를 사용한다.

## 목표 선택

| 시각 표현 | 선택 |
| --- | --- |
| 면과 색 대비가 명확한 표현 | `variant="solid"` |
| 올라온 면으로 낮은 강조를 만드는 표현 | `variant="subtle"` |
| 지속적인 배경 없이 표시하는 표현 | `variant="ghost"` |

| 색 의미 | 선택 |
| --- | --- |
| 제품의 강조색을 쓰는 action | `tone="accent"` |
| 중립적인 action | `tone="neutral"` |
| 삭제처럼 부정적 결과를 만드는 action | `tone="negative"` |

| 목적 | 선택 |
| --- | --- |
| 아이콘만 보이는 익숙한 동작 | `IconButton`과 필수 `aria-label` |

Button의 표현 강도는 `variant`, action의 색 의미는 `tone`으로 고른다. 화면의 1차·2차 위계는 prop 이름이 아니라 배치와 action 조합으로 만든다. 정보·성공·주의 상태는 해당 feedback 컴포넌트가 맡는다.

## 현재 React migration

현재 `@canon/react`는 아직 `primary`, `secondary`, `quiet`, `destructive`를 노출하며 `tone`을 제공하지 않는다. 아래 예제와 Public interface는 migration 전 실제 코드 계약을 기록한다.

## 기본 사용

```tsx
import { Button, IconButton } from '@canon/react'

<Button onPress={save}>Save changes</Button>

<Button variant="secondary" onPress={cancel}>Cancel</Button>

<Button variant="destructive" onPress={remove}>Delete</Button>

<IconButton icon={<XIcon />} aria-label="Close" />
```

`Button`의 기본값은 `variant="primary"`, `size="md"`, `type="button"`이다. form을 제출할 때만 `type="submit"`을 명시한다. `pending`은 동작을 막지만 focus와 기존 label을 유지하고 progressbar를 노출한다. 서비스 언어가 영어가 아니면 `pendingLabel`을 번역해 제공한다.

## Public interface

`Button`과 `IconButton`은 다음 공통 props를 받는다. React Aria props 전체를 자동 노출하지 않는다.

| Prop | 타입 | 기본값·의미 |
| --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'quiet' \| 'destructive'` | Button은 `primary`, IconButton은 `quiet` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `md` |
| `disabled` | `boolean` | 누르지 못하게 한다. |
| `pending` | `boolean` | 진행 표시를 보이고 누르지 못하게 한다. |
| `pendingLabel` | `string` | `Loading`. `pending` 상태에서 빈 문자열을 허용하지 않는다. |
| `className` | `string` | 소비 프로젝트의 class를 추가한다. |
| `id`, `form`, `name`, `value` | `string` | DOM과 native form에 연결한다. |
| `type` | `'button' \| 'submit' \| 'reset'` | `button` |
| `autoFocus` | `boolean` | 마운트할 때 focus를 준다. |
| `onPress` | React Aria press handler | pointer, touch, keyboard press를 받는다. |
| `aria-labelledby`, `aria-describedby` | `string` | 외부 label과 설명을 연결한다. |

`Button`은 다음 props로 보이는 콘텐츠를 구성한다.

| Prop | 타입 | 의미 |
| --- | --- | --- |
| `children` | `ReactNode` | 필수 label과 rich content다. |
| `leadingIcon` | `ReactElement` | label 앞의 장식 icon이다. |
| `trailingIcon` | `ReactElement` | label 뒤의 장식 icon이다. |
| `aria-label` | `string` | 보이는 label을 대체해야 할 때만 쓴다. |

`IconButton`은 `children`, `leadingIcon`, `trailingIcon`을 받지 않고 다음 props를 받는다.

| Prop | 타입 | 기본값·의미 |
| --- | --- | --- |
| `icon` | `ReactElement` | 필수로 보여 줄 icon이다. |
| `aria-label` | `string` | 필수이며 빈 문자열을 허용하지 않는다. |
| `shape` | `'square' \| 'round'` | `square` |

## Playground

문서 아래 playground에서 `Button`과 `IconButton`, `variant`, `size`, `disabled`, `pending`을 바꿔 실제 코드를 확인한다. `IconButton`을 고르면 `shape`도 바꿀 수 있다.

Copy JSX는 현재 설정을 `@canon/react` public interface로 복사한다. Dark theme은 미리보기의 문서 테마만 바꾸며 Button prop으로 복사하지 않는다.

## 접근성 계약

- 텍스트 Button은 화면에 보이는 동작 이름을 children으로 제공한다.
- `IconButton`은 비어 있지 않은 `aria-label`을 반드시 제공한다.
- leading·trailing icon은 장식이다. 크기, `currentColor`, 보조 기술 노출은 Button이 통제한다.
- `disabled`와 `pending` 상태에서는 press가 실행되지 않는다.
- keyboard focus와 pointer·touch press 동작은 React Aria Components가 담당하고 Canon은 실제 DOM과 스타일을 검증한다.

## 크기

`md`가 기본이다. `lg`는 넓은 화면의 중요한 동작, `sm`과 `xs`는 밀도 높은 도구 영역에만 사용한다. 작은 크기를 모바일의 주 동작에 사용하지 않는다.

## AI 사용 규칙

1. 새 설계와 migration 목표에는 `variant`로 `solid`, `subtle`, `ghost`만 사용한다.
2. 색 의미는 `tone`의 `accent`, `neutral`, `negative`로 분리한다.
3. 현재 제품 코드에는 구현된 public interface만 사용하고 미구현 `tone`을 임의로 추가하지 않는다.
4. 아이콘만 있으면 `Button` 대신 `IconButton`을 사용하고 동작 이름을 `aria-label`에 쓴다.
5. 링크 이동, 상태 배지, 선택 가능한 toggle을 Button으로 만들지 않는다.
