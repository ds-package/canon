---
verified: 2026-11-01
---
# Dialog

Dialog는 다른 화면 위에 열리고, 닫힐 때까지 사용자의 초점을 내부에 유지하는 overlay다. Canon은 공개 anatomy와 style을 소유하고 focus, keyboard, dismissal, portal behavior는 [React Aria Components](./decisions/interaction-foundation.md)에 맡긴다.

## Anatomy

```tsx
import '@canon/tokens/css'
import '@canon/react/styles.css'

<DialogTrigger>
  <button type="button">Open dialog</button>
  <Dialog dismissable>
    <DialogClose aria-label="Close dialog" />
    <DialogTitle>Delete document?</DialogTitle>
    <DialogDescription>This action cannot be undone.</DialogDescription>
    <DialogBody>Review the document before deleting it.</DialogBody>
    <DialogFooter>
      <DialogClose>Done</DialogClose>
    </DialogFooter>
  </Dialog>
</DialogTrigger>
```

| Part | 역할 |
| --- | --- |
| `DialogTrigger` | trigger와 Dialog를 연결하고 controlled 또는 uncontrolled open state를 관리한다. |
| `Dialog` | overlay, modal surface, accessible dialog를 구성한다. |
| `DialogTitle` | 보이는 이름을 `aria-labelledby`에 연결한다. |
| `DialogDescription` | 설명을 `aria-describedby`에 연결한다. |
| `DialogBody` | 주요 콘텐츠를 담는다. |
| `DialogFooter` | 닫기와 제품 action을 담는다. |
| `DialogClose` | Dialog를 닫는다. children을 생략하면 Phosphor X 아이콘을 쓴다. |

## Props

| 대상 | Prop | 기본값 | 역할 |
| --- | --- | --- | --- |
| `DialogTrigger` | `open` | uncontrolled | 제품 state로 열림 여부를 제어한다. |
| `DialogTrigger` | `defaultOpen` | `false` | uncontrolled 초기값이다. |
| `DialogTrigger` | `onOpenChange` | 없음 | 열림 여부가 바뀔 때 호출한다. |
| `Dialog` | `dismissable` | `false` | overlay를 눌러 닫을 수 있게 한다. |
| `Dialog` | `keyboardDismissDisabled` | `false` | Escape로 닫히는 동작을 막는다. 확인된 제품 요구가 있을 때만 쓴다. |

## Figma mapping

2026-11-01에 개인 계정 `mini940511@gmail.com`으로 Canon 파일의 `Modal` page를 읽었다. Figma의 `Modal`은 코드의 `Dialog`에 대응한다. Figma 이름은 시각 pattern을, 코드 이름은 ARIA role을 따른다.

| Figma | Code | 확인 결과 |
| --- | --- | --- |
| `Modal` | `Dialog` | overlay와 448px content 구조가 일치한다. |
| `ModalContent Next` | `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter` | header, body, footer anatomy가 일치한다. |
| `showCloseButton` | `DialogClose` 포함 여부 | composition으로 표현한다. |
| `showFooter` | `DialogFooter` 포함 여부 | composition으로 표현한다. |
| `surface/default`, `overlay/scrim`, `text/primary` | 같은 semantic CSS variable | 일치한다. |
| `space/24`, `space/16`, `space/12`, `space/8` | `spacing-6`, `spacing-4`, `spacing-3`, `spacing-2` | 값이 각각 24px, 16px, 12px, 8px로 일치한다. |
| `radius/6` | `radius-md` | 값이 6px로 일치한다. |

Figma footer의 `_ModalActions`는 Button 조합을 보여 주지만 React Button runtime은 아직 없다. 현재 `DialogFooter`는 action children의 배치만 소유하고 variant나 intent를 만들지 않는다.

## Accessibility

- title과 description을 함께 제공한다.
- Escape, outside interaction, controlled state, focus return은 public interface를 통해 자동 검증한다.
- focus containment는 React Aria가 소유한다. 브라우저 keyboard walkthrough와 screen reader 검증 전에는 Canon 전체 접근성 검증 완료로 보지 않는다.
- `keyboardDismissDisabled`를 쓰면 화면 안에 명확한 닫기 action을 제공한다.

## 미검증

- macOS VoiceOver와 Windows NVDA announcement
- nested overlay 안의 focus와 dismissal
- 실제 브라우저에서 entry motion과 reduced motion 전환
