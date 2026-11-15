import type { ReactNode } from 'react'
import {
  FieldError,
  Label,
  Text,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
} from 'react-aria-components'

export type TextAreaSize = 'sm' | 'md' | 'lg'

interface TextAreaBaseProps {
  label: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  placeholder?: string
  rows?: number
  size?: TextAreaSize
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  form?: string
}

type TextAreaControlledProps =
  | {
      value: string
      defaultValue?: never
      readOnly: true
      onValueChange?: never
    }
  | {
      value: string
      defaultValue?: never
      readOnly?: false
      onValueChange: (value: string) => void
    }

type TextAreaUncontrolledProps = {
  value?: never
  defaultValue?: string
  onValueChange?: (value: string) => void
  readOnly?: boolean
}

export type TextAreaProps = TextAreaBaseProps & (TextAreaControlledProps | TextAreaUncontrolledProps)

function isEmptyContent(content: ReactNode) {
  return content == null || content === false || (typeof content === 'string' && !content.trim())
}

export function TextArea({
  label,
  description,
  errorMessage,
  placeholder,
  rows = 4,
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  invalid,
  readOnly,
  ...props
}: TextAreaProps) {
  if (isEmptyContent(label)) {
    throw new Error('TextArea requires a visible label')
  }
  if (invalid && isEmptyContent(errorMessage)) {
    throw new Error('TextArea requires errorMessage when invalid is true')
  }
  if (!Number.isInteger(rows) || rows < 1) {
    throw new Error('TextArea rows must be a positive integer')
  }
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error('TextArea cannot use value and defaultValue together')
  }
  if (value !== undefined && !readOnly && typeof onValueChange !== 'function') {
    throw new Error('Controlled TextArea requires onValueChange')
  }

  return (
    <AriaTextField
      {...props}
      className="canon-text-area"
      data-size={size}
      value={value}
      defaultValue={defaultValue}
      onChange={onValueChange}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      isReadOnly={readOnly}
    >
      <Label className="canon-text-area-label">{label}</Label>
      <AriaTextArea
        className="canon-text-area-input"
        data-size={size}
        placeholder={placeholder}
        rows={rows}
      />
      {description && <Text className="canon-text-area-description" slot="description">{description}</Text>}
      <FieldError className="canon-text-area-error">{errorMessage}</FieldError>
    </AriaTextField>
  )
}
