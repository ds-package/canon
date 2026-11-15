import type { ReactNode } from 'react'
import { SwitchButton, SwitchField, Text } from 'react-aria-components'

interface SwitchBaseProps {
  children: string
  description?: ReactNode
  disabled?: boolean
  name?: string
  value?: string
  form?: string
}

type SwitchControlledProps =
  | {
      checked: boolean
      defaultChecked?: never
      readOnly: true
      onCheckedChange?: never
    }
  | {
      checked: boolean
      defaultChecked?: never
      readOnly?: false
      onCheckedChange: (checked: boolean) => void
    }

type SwitchUncontrolledProps = {
  checked?: never
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  readOnly?: boolean
}

export type SwitchProps = SwitchBaseProps & (SwitchControlledProps | SwitchUncontrolledProps)

export function Switch({
  children,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  readOnly,
  ...props
}: SwitchProps) {
  if (typeof children !== 'string' || !children.trim()) {
    throw new Error('Switch requires a visible label')
  }
  if (checked !== undefined && defaultChecked !== undefined) {
    throw new Error('Switch cannot use checked and defaultChecked together')
  }
  if (checked !== undefined && !readOnly && typeof onCheckedChange !== 'function') {
    throw new Error('Controlled Switch requires onCheckedChange')
  }

  return (
    <SwitchField
      {...props}
      className="canon-switch"
      isSelected={checked}
      defaultSelected={defaultChecked}
      onChange={onCheckedChange}
      isDisabled={disabled}
      isReadOnly={readOnly}
    >
      <SwitchButton className="canon-switch-button">
        <span className="canon-switch-control" aria-hidden>
          <span className="canon-switch-thumb" />
        </span>
        <span className="canon-switch-label">{children}</span>
      </SwitchButton>
      {description && <Text className="canon-switch-description" slot="description">{description}</Text>}
    </SwitchField>
  )
}
