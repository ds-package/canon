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

export interface DialogTriggerProps {
  children: [ReactElement<ComponentProps<'button'>, 'button'>, ReactElement<DialogProps, typeof Dialog>]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogTrigger({ children, open, defaultOpen, onOpenChange }: DialogTriggerProps) {
  const parts = Children.toArray(children)
  if (parts.length !== 2) throw new Error('DialogTrigger requires a trigger and a Dialog')
  if (!isValidElement(parts[0]) || parts[0].type !== 'button') {
    throw new Error('DialogTrigger requires a native button trigger')
  }
  if (!isValidElement(parts[1]) || parts[1].type !== Dialog) {
    throw new Error('DialogTrigger requires Dialog as its second child')
  }
  const trigger = parts[0] as ReactElement<ComponentProps<'button'>, 'button'>

  return (
    <AriaDialogTrigger isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Pressable>{cloneElement(trigger, { type: trigger.props.type ?? 'button' }) as ComponentProps<typeof Pressable>['children']}</Pressable>
      {parts[1]}
    </AriaDialogTrigger>
  )
}

export interface DialogProps {
  children: ReactNode
  dismissable?: boolean
  keyboardDismissDisabled?: boolean
}

const DialogDescriptionContext = createContext<string | undefined>(undefined)

export function Dialog({ children, dismissable, keyboardDismissDisabled }: DialogProps) {
  const parts = Children.toArray(children)
  const hasTitle = parts.some((part) => isValidElement(part) && part.type === DialogTitle)
  const hasDescription = parts.some((part) => isValidElement(part) && part.type === DialogDescription)
  if (!hasTitle || !hasDescription) throw new Error('Dialog requires a direct DialogTitle and DialogDescription')

  const descriptionId = useId()
  return (
    <ModalOverlay
      className="canon-dialog-overlay"
      isDismissable={dismissable}
      isKeyboardDismissDisabled={keyboardDismissDisabled}
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

export function DialogTitle({ children }: DialogPartProps) {
  return <Heading className="canon-dialog-title" slot="title">{children}</Heading>
}

export function DialogDescription({ children }: DialogPartProps) {
  const id = useContext(DialogDescriptionContext)
  return <Text className="canon-dialog-description" id={id} slot="description">{children}</Text>
}

export function DialogBody({ children }: DialogPartProps) {
  return <div className="canon-dialog-body">{children}</div>
}

export function DialogFooter({ children }: DialogPartProps) {
  return <div className="canon-dialog-footer">{children}</div>
}

export type DialogCloseProps =
  | { children: ReactNode; 'aria-label'?: string }
  | { children?: undefined; 'aria-label': string }

export function DialogClose({ children, 'aria-label': ariaLabel }: DialogCloseProps) {
  return (
    <Button className="canon-dialog-close" slot="close" aria-label={ariaLabel}>
      {children ?? <XIcon aria-hidden size={16} />}
    </Button>
  )
}
