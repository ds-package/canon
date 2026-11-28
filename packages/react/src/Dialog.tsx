import {
  Children,
  cloneElement,
  type ComponentProps,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useId,
} from 'react'
import {
  Button,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Pressable,
  Text,
} from 'react-aria-components'
import { XIcon } from '@phosphor-icons/react'
import { Button as CanonButton, type ButtonProps } from './Button'

type DialogTriggerElement =
  | ReactElement<ComponentProps<'button'>, 'button'>
  | ReactElement<ButtonProps, typeof CanonButton>

interface DialogTriggerBaseProps {
  children: [DialogTriggerElement, ReactElement<DialogProps, typeof Dialog>]
}

type DialogTriggerControlledProps = {
  open: boolean
  defaultOpen?: never
  onOpenChange: (open: boolean) => void
}

type DialogTriggerUncontrolledProps = {
  open?: never
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export type DialogTriggerProps = DialogTriggerBaseProps & (
  | DialogTriggerControlledProps
  | DialogTriggerUncontrolledProps
)

/**
 * trigger 버튼과 {@link Dialog}를 연결하고 열림 여부를 관리한다.
 *
 * ### 제약
 * - 자식은 정확히 두 개다. native `button` 또는 Canon {@link Button} trigger, 그다음 {@link Dialog}다(throw).
 * - `open`과 `defaultOpen`은 함께 쓸 수 없다(throw). controlled `open`에는 `onOpenChange`가 필요하다(throw).
 * - `defaultOpen`의 기본값은 `false`다.
 */
export function DialogTrigger({ children, open, defaultOpen, onOpenChange }: DialogTriggerProps) {
  if (open !== undefined && defaultOpen !== undefined) {
    throw new Error('DialogTrigger cannot use open and defaultOpen together')
  }
  if (open !== undefined && typeof onOpenChange !== 'function') {
    throw new Error('Controlled DialogTrigger requires onOpenChange')
  }
  const parts = Children.toArray(children)
  if (parts.length !== 2) throw new Error('DialogTrigger requires a trigger and a Dialog')
  if (!isValidElement(parts[0]) || (parts[0].type !== 'button' && parts[0].type !== CanonButton)) {
    throw new Error('DialogTrigger requires a native button or Canon Button trigger')
  }
  if (!isValidElement(parts[1]) || parts[1].type !== Dialog) {
    throw new Error('DialogTrigger requires Dialog as its second child')
  }
  const trigger = parts[0] as DialogTriggerElement
  const triggerElement = trigger.type === 'button'
    ? <Pressable>{cloneElement(trigger, { type: trigger.props.type ?? 'button' }) as ComponentProps<typeof Pressable>['children']}</Pressable>
    : trigger

  return (
    <AriaDialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {triggerElement}
      {parts[1]}
    </AriaDialogTrigger>
  )
}

export interface DialogProps {
  children: ReactNode
  closeOnInteractOutside?: boolean
  closeOnEscape?: boolean
}

const DialogDescriptionContext = createContext<string | undefined>(undefined)

/**
 * 다른 화면 위에 열리고, 닫힐 때까지 사용자의 초점을 내부에 유지하는 overlay다.
 *
 * ### 제약
 * - {@link DialogTrigger}의 두 번째 자식으로 렌더링한다.
 * - 직접 자식으로 {@link DialogTitle}과 {@link DialogDescription}이 필요하다(throw).
 * - `closeOnInteractOutside`의 기본값은 `false`다. `true`이면 Dialog 밖과 상호작용할 때 닫힌다.
 * - `closeOnEscape`의 기본값은 `true`다. 확인된 제품 요구가 있을 때만 `false`로 바꾸고, 그때는 화면 안에 명확한 닫기 동작을 둔다.
 *
 * ### 예시
 * ```tsx
 * <DialogTrigger>
 *   <button type="button">Open dialog</button>
 *   <Dialog>
 *     <DialogTitle>Delete document?</DialogTitle>
 *     <DialogDescription>This action cannot be undone.</DialogDescription>
 *     <DialogFooter><DialogClose>Done</DialogClose></DialogFooter>
 *   </Dialog>
 * </DialogTrigger>
 * ```
 */
export function Dialog({ children, closeOnInteractOutside, closeOnEscape = true }: DialogProps) {
  const parts = Children.toArray(children)
  const hasTitle = parts.some((part) => isValidElement(part) && part.type === DialogTitle)
  const hasDescription = parts.some((part) => isValidElement(part) && part.type === DialogDescription)
  if (!hasTitle || !hasDescription) throw new Error('Dialog requires a direct DialogTitle and DialogDescription')

  const descriptionId = useId()
  return (
    <ModalOverlay
      className="canon-dialog-overlay"
      isDismissable={closeOnInteractOutside}
      isKeyboardDismissDisabled={!closeOnEscape}
    >
      <Modal className="canon-dialog-modal">
        <AriaDialog className="canon-dialog" aria-describedby={descriptionId}>
          <DialogDescriptionContext value={descriptionId}>{children}</DialogDescriptionContext>
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  )
}

interface DialogPartProps {
  children: ReactNode
}

/**
 * {@link Dialog}의 보이는 제목이며 접근 가능한 이름으로 연결된다.
 *
 * ### 제약
 * - {@link Dialog}의 직접 자식이어야 한다.
 */
export function DialogTitle({ children }: DialogPartProps) {
  return <Heading className="canon-dialog-title" slot="title">{children}</Heading>
}

/**
 * {@link Dialog}의 설명이며 접근 가능한 설명으로 연결된다.
 *
 * ### 제약
 * - {@link Dialog}의 직접 자식이어야 한다.
 */
export function DialogDescription({ children }: DialogPartProps) {
  const id = useContext(DialogDescriptionContext)
  return <Text className="canon-dialog-description" id={id} slot="description">{children}</Text>
}

/**
 * {@link Dialog}의 주요 콘텐츠를 담는다.
 */
export function DialogBody({ children }: DialogPartProps) {
  return <div className="canon-dialog-body">{children}</div>
}

/**
 * {@link Dialog}의 닫기와 제품 동작을 담는다.
 *
 * ### 제약
 * - 동작 자식의 배치만 맡고 {@link Button} variant를 대신 정하지 않는다.
 */
export function DialogFooter({ children }: DialogPartProps) {
  return <div className="canon-dialog-footer">{children}</div>
}

export type DialogCloseProps =
  | { children: ReactNode; 'aria-label'?: string }
  | { children?: undefined; 'aria-label': string }

/**
 * 자신이 들어 있는 {@link Dialog}를 닫는 버튼이다.
 *
 * ### 제약
 * - `children`을 생략하면 닫기 아이콘을 쓰며, 이때 `aria-label`이 필수다.
 */
export function DialogClose({ children, 'aria-label': ariaLabel }: DialogCloseProps) {
  return (
    <Button className="canon-dialog-close" slot="close" aria-label={ariaLabel}>
      {children ?? <XIcon aria-hidden size={16} />}
    </Button>
  )
}
