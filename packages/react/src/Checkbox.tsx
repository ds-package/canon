import type { ReactNode } from 'react'
import { CheckIcon, MinusIcon } from '@phosphor-icons/react'
import {
  CheckboxButton,
  CheckboxField,
  FieldError,
  Text,
} from 'react-aria-components'

interface CheckboxBaseProps {
  children: string
  description?: ReactNode
  errorMessage?: ReactNode
  indeterminate?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  value?: string
  form?: string
}

type CheckboxControlledProps =
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

type CheckboxUncontrolledProps = {
  checked?: never
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  readOnly?: boolean
}

export type CheckboxProps = CheckboxBaseProps & (CheckboxControlledProps | CheckboxUncontrolledProps)

function isEmptyContent(content: ReactNode) {
  return content == null || content === false || (typeof content === 'string' && !content.trim())
}

export function Checkbox({
  children,
  description,
  errorMessage,
  checked,
  defaultChecked,
  onCheckedChange,
  indeterminate,
  disabled,
  required,
  invalid,
  readOnly,
  ...props
}: CheckboxProps) {
  if (isEmptyContent(children)) {
    throw new Error('Checkbox requires a visible label')
  }
  if (invalid && isEmptyContent(errorMessage)) {
    throw new Error('Checkbox requires errorMessage when invalid is true')
  }
  if (checked !== undefined && defaultChecked !== undefined) {
    throw new Error('Checkbox cannot use checked and defaultChecked together')
  }
  if (checked !== undefined && !readOnly && typeof onCheckedChange !== 'function') {
    throw new Error('Controlled Checkbox requires onCheckedChange')
  }

  return (
    <CheckboxField
      {...props}
      className="canon-checkbox"
      isSelected={checked}
      defaultSelected={defaultChecked}
      onChange={onCheckedChange}
      isIndeterminate={indeterminate}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      isReadOnly={readOnly}
    >
      <CheckboxButton className="canon-checkbox-button">
        {({ isIndeterminate, isSelected }) => (
          <>
            <span className="canon-checkbox-control" aria-hidden>
              {isIndeterminate ? <MinusIcon /> : isSelected ? <CheckIcon /> : null}
            </span>
            <span className="canon-checkbox-label">{children}</span>
          </>
        )}
      </CheckboxButton>
      {description && <Text className="canon-checkbox-description" slot="description">{description}</Text>}
      <FieldError className="canon-checkbox-error">{errorMessage}</FieldError>
    </CheckboxField>
  )
}
