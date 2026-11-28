import type { ComponentProps, ReactNode } from 'react'
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

interface TextFieldBaseProps {
  label: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  type?: TextFieldType
  size?: TextFieldSize
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  form?: string
  autoComplete?: string
  placeholder?: string
  autoFocus?: AriaTextFieldProps['autoFocus']
  onFocus?: AriaTextFieldProps['onFocus']
  onBlur?: AriaTextFieldProps['onBlur']
  inputMode?: ComponentProps<'input'>['inputMode']
  pattern?: ComponentProps<'input'>['pattern']
  minLength?: ComponentProps<'input'>['minLength']
  maxLength?: ComponentProps<'input'>['maxLength']
}

type TextFieldControlledProps =
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

type TextFieldUncontrolledProps = {
  value?: never
  defaultValue?: string
  onValueChange?: (value: string) => void
  readOnly?: boolean
}

export type TextFieldProps = TextFieldBaseProps & (TextFieldControlledProps | TextFieldUncontrolledProps)

const textFieldTypes = new Set<TextFieldType>(['text', 'search', 'email', 'password', 'url', 'tel'])

/**
 * 사용자가 한 줄의 텍스트를 직접 입력하는 form field다.
 *
 * ### 제약
 * - `type`은 `text`, `search`, `email`, `password`, `url`, `tel`만 받는다(그 밖은 throw). 기본값은 `text`다.
 * - `label`은 보이며 필수다(throw). `placeholder`로 대신하지 않는다.
 * - `invalid`에는 비어 있지 않은 `errorMessage`가 필요하다(throw).
 * - `value`와 `defaultValue`는 함께 쓸 수 없다(throw). `readOnly`가 아닌 controlled `value`에는 `onValueChange`가 필요하다(throw).
 * - `disabled`는 입력과 form 제출을 막고, `readOnly`는 focus와 form 제출을 유지한다.
 * - prefix, suffix, clear button, password reveal은 지원하지 않는다.
 *
 * ### 예시
 * ```tsx
 * <TextField label="Email" name="email" type="email" autoComplete="email" required />
 * ```
 */
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
  value,
  defaultValue,
  onValueChange,
  name,
  form,
  autoComplete,
  placeholder,
  autoFocus,
  onFocus,
  onBlur,
  inputMode,
  pattern,
  minLength,
  maxLength,
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
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error('TextField cannot use value and defaultValue together')
  }
  if (value !== undefined && !readOnly && typeof onValueChange !== 'function') {
    throw new Error('Controlled TextField requires onValueChange')
  }

  return (
    <AriaTextField
      className="canon-text-field"
      data-size={size}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      isReadOnly={readOnly}
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={onValueChange}
      name={name}
      form={form}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Label className="canon-text-field-label">{label}</Label>
      <Input
        className="canon-text-field-input"
        data-size={size}
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
      />
      {description && <Text className="canon-text-field-description" slot="description">{description}</Text>}
      <FieldError className="canon-text-field-error">{errorMessage}</FieldError>
    </AriaTextField>
  )
}
