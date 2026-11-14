import type { ReactNode } from 'react'
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components'

export type TextFieldSize = 'sm' | 'md' | 'lg'
export type TextFieldType = 'text' | 'search' | 'email' | 'password' | 'url' | 'tel'

type TextFieldBehaviorProps = Omit<
  AriaTextFieldProps,
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'className'
  | 'isDisabled'
  | 'isInvalid'
  | 'isReadOnly'
  | 'isRequired'
  | 'slot'
  | 'style'
  | 'type'
>

export interface TextFieldProps extends TextFieldBehaviorProps {
  label: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  type?: TextFieldType
  size?: TextFieldSize
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  readOnly?: boolean
}

const textFieldTypes = new Set<TextFieldType>(['text', 'search', 'email', 'password', 'url', 'tel'])

export function TextField({
  label,
  description,
  errorMessage,
  type = 'text',
  size = 'md',
  disabled,
  required,
  invalid,
  readOnly,
  ...props
}: TextFieldProps) {
  if (label == null || label === false || (typeof label === 'string' && !label.trim())) {
    throw new Error('TextField requires a visible label')
  }
  if (!textFieldTypes.has(type)) {
    throw new Error(`TextField does not support type="${type}"`)
  }
  if (invalid && (errorMessage == null || errorMessage === false || (typeof errorMessage === 'string' && !errorMessage.trim()))) {
    throw new Error('TextField requires errorMessage when invalid is true')
  }

  return (
    <AriaTextField
      {...props}
      className="canon-text-field"
      data-size={size}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      isReadOnly={readOnly}
      type={type}
    >
      <Label className="canon-text-field-label">{label}</Label>
      <Input className="canon-text-field-input" data-size={size} />
      {description && <Text className="canon-text-field-description" slot="description">{description}</Text>}
      <FieldError className="canon-text-field-error">{errorMessage}</FieldError>
    </AriaTextField>
  )
}
