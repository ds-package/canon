---
verified: 2026-11-23
navigation: component
---
# Button

Button은 현재 화면에서 동작을 실행합니다. 다른 위치로 이동할 때는 Link를 사용합니다.
아이콘만으로 동작을 표시할 때는 [IconButton](./icon-button.md)을 사용합니다.

이 문서는 현재 `@canon/react`의 공개 API를 설명합니다. prop의 공통 의미는 [Component Properties](../foundations/properties.md)에서 확인하고, 사용할 수 있는 값은 아래 표와 [Button 구현](../../packages/react/src/Button.tsx)을 따릅니다. `tone`은 현재 React API에 없습니다.

Figma와 다른 값은 [Component Properties](../foundations/properties.md)의 「React differences」 표를 봅니다.

## Basic usage

```tsx
import { Button } from '@canon/react'

<Button variant="primary" onPress={save}>Save changes</Button>

<Button onPress={cancel}>Cancel</Button>

<Button variant="destructive" onPress={remove}>Delete</Button>
```

기본값은 `variant="secondary"`, `size="lg"`, `type="button"`입니다. 폼을 제출할 때만 `type="submit"`을 지정합니다. `pending` 상태에서는 동작을 막고 label과 focus를 유지합니다. 진행 표시는 progressbar로 제공합니다. 서비스 언어가 영어가 아니면 `pendingLabel`을 번역해 지정합니다.

## Props

| Prop | 타입 | 기본값·의미 |
| --- | --- | --- |
| `children` | `ReactNode` | 필수 label과 내용을 전달합니다. |
| `variant` | `'primary' \| 'secondary' \| 'quiet' \| 'destructive'` | `secondary`. 대표 동작은 `primary`를 한 영역에 하나만 둡니다. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `lg`. 아래 「Sizes」를 참고합니다. |
| `leadingIcon`, `trailingIcon` | `ReactElement` | label 앞이나 뒤에 장식 아이콘을 표시합니다. |
| `disabled` | `boolean` | 누를 수 없게 합니다. |
| `pending` | `boolean` | 진행 표시를 보이고 동작을 막습니다. |
| `pendingLabel` | `string` | `Loading`. `pending` 상태에서는 비어 있으면 안 됩니다. |
| `type` | `'button' \| 'submit' \| 'reset'` | `button` |
| `onPress` | React Aria press handler | pointer, touch, keyboard 입력을 받습니다. |
| `aria-label` | `string` | 보이는 label을 대체해야 할 때 사용합니다. |
| `aria-labelledby`, `aria-describedby` | `string` | 외부 label과 설명을 연결합니다. |
| `id`, `form`, `name`, `value` | `string` | DOM과 native form에 연결합니다. |
| `autoFocus` | `boolean` | 마운트할 때 focus를 줍니다. |
| `className` | `string` | 소비 프로젝트의 class를 추가합니다. |

## Sizes

- `xl` 높이는 56px이고 `radius/3xl` 토큰을 사용합니다. 기본 shape에서 토큰값은 14px입니다.
- `xl`의 글자 크기, 아이콘 크기, 좌우 padding은 `lg`와 같습니다.
- `lg`는 넓은 화면의 중요한 동작에 사용합니다.
- `sm`과 `xs`는 밀도가 높은 도구 영역에 사용합니다.
- 모바일 주요 동작에는 작은 크기를 사용하지 않습니다.

## Usage guidelines

- Button에는 동작을 설명하는 보이는 label을 넣습니다.
- `leadingIcon`과 `trailingIcon`은 장식용입니다. 크기, 색, 보조 기술 노출은 Button이 제어합니다.
- `disabled`와 `pending` 상태에서는 동작하지 않습니다.
- 키보드 focus와 pointer·touch 입력은 React Aria Components가 처리합니다.

## Playground

아래 playground는 Button으로 시작합니다. component 선택에서 IconButton으로 바꿀 수 있으며, 설정에 맞는 현재 React JSX를 복사합니다. Dark theme은 미리보기만 바꿉니다.
