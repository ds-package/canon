---
verified: 2026-11-23
navigation: component
---
# IconButton

IconButton은 아이콘만 보여 주는 동작에 사용합니다. 아이콘으로 뜻이 분명하지 않거나 보이는 label이 필요하면 [Button](./button.md)을 사용합니다. 다른 위치로 이동할 때는 Link를 사용합니다.

이 문서는 현재 `@canon/react`의 공개 API를 설명합니다. prop의 공통 의미는 [Component Properties](../foundations/properties.md)에서 확인하고, 사용할 수 있는 값은 아래 표와 [Button 구현](../../packages/react/src/Button.tsx)을 따릅니다. `tone`은 현재 React API에 없습니다.

Figma와 다른 값은 [Component Properties](../foundations/properties.md)의 「React differences」 표를 봅니다.

## Basic usage

```tsx
import { IconButton } from '@canon/react'

<IconButton icon={<XIcon />} aria-label="Close" />

<IconButton
  icon={<MoreIcon />}
  aria-label="More actions"
  variant="quiet"
  onPress={openMenu}
/>
```

`icon`과 비어 있지 않은 `aria-label`은 필수입니다. 기본값은 `variant="secondary"`, `shape="square"`, `size="lg"`, `type="button"`입니다. 폼을 제출할 때만 `type="submit"`을 지정합니다.

## Props

| Prop | 타입 | 기본값·의미 |
| --- | --- | --- |
| `icon` | `ReactElement` | 필수 아이콘입니다. |
| `aria-label` | `string` | 필수이며 비어 있으면 안 됩니다. |
| `variant` | `'primary' \| 'secondary' \| 'quiet' \| 'destructive'` | `secondary` |
| `shape` | `'square' \| 'round'` | `square` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `lg`. 크기 기준은 [Button](./button.md)의 「Sizes」와 같습니다. |
| `disabled` | `boolean` | 누를 수 없게 합니다. |
| `pending` | `boolean` | 진행 표시를 보이고 동작을 막습니다. |
| `pendingLabel` | `string` | `Loading`. `pending` 상태에서는 비어 있으면 안 됩니다. |
| `onPress` | React Aria press handler | pointer, touch, keyboard 입력을 받습니다. |
| `type` | `'button' \| 'submit' \| 'reset'` | `button` |
| `aria-labelledby`, `aria-describedby` | `string` | 외부 label과 설명을 연결합니다. |
| `id`, `form`, `name`, `value` | `string` | DOM과 native form에 연결합니다. |
| `autoFocus` | `boolean` | 마운트할 때 focus를 줍니다. |
| `className` | `string` | 소비 프로젝트의 class를 추가합니다. |

`IconButton`은 `children`, `leadingIcon`, `trailingIcon`을 받지 않습니다. 아이콘은 장식으로 처리되며 버튼의 접근 가능한 이름은 `aria-label`이 제공합니다.

## Playground

아래 playground는 IconButton으로 시작합니다. component 선택에서 Button으로 바꿀 수 있으며, 설정에 맞는 현재 React JSX를 복사합니다. Dark theme은 미리보기만 바꿉니다.
