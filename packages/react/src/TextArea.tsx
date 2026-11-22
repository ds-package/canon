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

/**
 * 사용자가 여러 줄의 자유로운 텍스트를 입력하는 form field다.
 *
 * ### 제약
 * - `rows`는 처음 보이는 줄 수만 정하고 입력 길이를 제한하지 않는다. 양의 정수여야 하며(throw) 기본값은 `4`다.
 * - `label`은 보이며 필수다(throw). `placeholder`로 대신하지 않는다.
 * - `invalid`에는 비어 있지 않은 `errorMessage`가 필요하다(throw).
 * - `value`와 `defaultValue`는 함께 쓸 수 없다(throw). `readOnly`가 아닌 controlled `value`에는 `onValueChange`가 필요하다(throw).
 * - `disabled`는 입력과 form 제출을 막고, `readOnly`는 focus와 form 제출을 유지한다.
 * - 자동 높이, 글자 수 표시, rich text와 Markdown 편집은 지원하지 않는다.
 *
 * ### 예시
 * ```tsx
 * <TextArea label="Message" name="message" rows={4} required />
 * ```
 */
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
