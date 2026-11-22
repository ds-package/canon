import type { ReactElement, ReactNode } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  ProgressBar,
} from 'react-aria-components'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'destructive'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactElement
  trailingIcon?: ReactElement
  disabled?: boolean
  pending?: boolean
  pendingLabel?: string
  className?: string
  id?: string
  form?: string
  name?: string
  value?: string
  type?: 'button' | 'submit' | 'reset'
  autoFocus?: boolean
  onPress?: AriaButtonProps['onPress']
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export function Button({
  children,
  variant = 'secondary',
  size = 'lg',
  leadingIcon,
  trailingIcon,
  disabled,
  pending,
  pendingLabel = 'Loading',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  if (pending && (typeof pendingLabel !== 'string' || !pendingLabel.trim())) {
    throw new Error('Button pendingLabel must be a non-empty string')
  }

  return (
    <AriaButton
      {...props}
      type={type}
      isDisabled={disabled}
      isPending={pending}
      data-variant={variant}
      data-size={size}
      className={['canon-button', className].filter(Boolean).join(' ')}
    >
      {pending && <ProgressBar className="canon-button-spinner" aria-label={pendingLabel} isIndeterminate />}
      {leadingIcon && <span className="canon-button-icon" aria-hidden>{leadingIcon}</span>}
      <span className="canon-button-label">{children}</span>
      {trailingIcon && <span className="canon-button-icon" aria-hidden>{trailingIcon}</span>}
    </AriaButton>
  )
}

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingIcon' | 'trailingIcon' | 'variant'> {
  icon: ReactElement
  'aria-label': string
  variant?: ButtonVariant
  shape?: 'square' | 'round'
}

export function IconButton({
  icon,
  'aria-label': ariaLabel,
  variant = 'secondary',
  shape = 'square',
  className,
  ...props
}: IconButtonProps) {
  if (typeof ariaLabel !== 'string' || !ariaLabel.trim()) {
    throw new Error('IconButton requires a non-empty aria-label')
  }

  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      variant={variant}
      className={['canon-icon-button', className].filter(Boolean).join(' ')}
      data-shape={shape}
    >
      <span className="canon-button-icon" aria-hidden>{icon}</span>
    </Button>
  )
}
