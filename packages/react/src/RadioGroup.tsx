import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react'
import {
  FieldError,
  Label,
  RadioButton,
  RadioField,
  RadioGroup as AriaRadioGroup,
  Text,
} from 'react-aria-components'

export type RadioGroupOrientation = 'horizontal' | 'vertical'

interface RadioGroupBaseProps {
  children: ReactElement<RadioOptionProps> | ReactElement<RadioOptionProps>[]
  label: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  orientation?: RadioGroupOrientation
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  form?: string
}

type RadioGroupControlledProps =
  | {
      value: string | null
      defaultValue?: never
      readOnly: true
      onValueChange?: never
    }
  | {
      value: string | null
      defaultValue?: never
      readOnly?: false
      onValueChange: (value: string) => void
    }

type RadioGroupUncontrolledProps = {
  value?: never
  defaultValue?: string
  onValueChange?: (value: string) => void
  readOnly?: boolean
}

export type RadioGroupProps = RadioGroupBaseProps & (RadioGroupControlledProps | RadioGroupUncontrolledProps)

function isEmptyContent(content: ReactNode) {
  return content == null || content === false || (typeof content === 'string' && !content.trim())
}

function getOptionValues(children: ReactNode): string[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode; value?: unknown }>(child)) {
      throw new Error('RadioGroup children must be RadioOption elements')
    }
    if (child.type === Fragment) return getOptionValues(child.props.children)
    if (child.type !== RadioOption) {
      throw new Error('RadioGroup children must be RadioOption elements')
    }
    return typeof child.props.value === 'string' ? [child.props.value] : []
  })
}

/**
 * 서로 배타적인 선택지 중 하나를 고르는 group이다.
 *
 * ### 제약
 * - 자식은 {@link RadioOption}만 받고, 하나 이상이어야 하며 `value`가 겹치면 안 된다(throw).
 * - `label`은 보이는 group 이름이며 비어 있으면 안 된다(throw).
 * - `invalid`에는 비어 있지 않은 `errorMessage`가 필요하다(throw).
 * - `value`와 `defaultValue`는 함께 쓸 수 없다(throw). `readOnly`가 아닌 controlled `value`에는 `onValueChange`가 필요하다(throw).
 * - 사용자가 선택을 해제할 수 없으므로 `onValueChange`는 `null`을 전달하지 않는다.
 * - `orientation`은 배치와 방향키 탐색 방향을 함께 정하며 기본값은 `vertical`이다.
 * - form 안에서는 선택된 option의 `value`가 group의 `name`으로 제출된다.
 *
 * ### 예시
 * ```tsx
 * <RadioGroup label="Plan" name="plan" defaultValue="free">
 *   <RadioOption value="free">Free</RadioOption>
 *   <RadioOption value="pro">Pro</RadioOption>
 * </RadioGroup>
 * ```
 */
export function RadioGroup({
  children,
  label,
  description,
  errorMessage,
  orientation = 'vertical',
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  invalid,
  readOnly,
  ...props
}: RadioGroupProps) {
  if (isEmptyContent(label)) {
    throw new Error('RadioGroup requires a visible label')
  }
  if (invalid && isEmptyContent(errorMessage)) {
    throw new Error('RadioGroup requires errorMessage when invalid is true')
  }
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error('RadioGroup cannot use value and defaultValue together')
  }
  if (value !== undefined && !readOnly && typeof onValueChange !== 'function') {
    throw new Error('Controlled RadioGroup requires onValueChange')
  }
  const optionValues = getOptionValues(children)
  if (optionValues.length === 0) {
    throw new Error('RadioGroup requires at least one RadioOption')
  }
  if (new Set(optionValues).size !== optionValues.length) {
    throw new Error('RadioGroup option values must be unique')
  }

  return (
    <AriaRadioGroup
      {...props}
      className="canon-radio-group"
      orientation={orientation}
      value={value}
      defaultValue={defaultValue}
      onChange={onValueChange}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      isReadOnly={readOnly}
    >
      <Label className="canon-radio-group-label">{label}</Label>
      {description && <Text className="canon-radio-group-description" slot="description">{description}</Text>}
      <div className="canon-radio-group-options">{children}</div>
      <FieldError className="canon-radio-group-error">{errorMessage}</FieldError>
    </AriaRadioGroup>
  )
}

export interface RadioOptionProps {
  value: string
  children: string
  description?: ReactNode
  disabled?: boolean
}

/**
 * {@link RadioGroup} 안의 선택지 하나다.
 *
 * ### 제약
 * - {@link RadioGroup}의 자식으로만 쓴다.
 * - `value`는 선택 key이며 비어 있지 않은 문자열이어야 한다(throw). group 안에서 고유하다.
 * - `children`은 보이는 label이며 비어 있지 않은 텍스트여야 한다(throw).
 */
export function RadioOption({ value, children, description, disabled }: RadioOptionProps) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('RadioOption requires a non-empty string value')
  }
  if (typeof children !== 'string' || !children.trim()) {
    throw new Error('RadioOption requires a visible label')
  }

  return (
    <RadioField className="canon-radio-option" value={value} isDisabled={disabled}>
      <RadioButton className="canon-radio-option-button">
        <span className="canon-radio-option-control" aria-hidden>
          <span className="canon-radio-option-dot" />
        </span>
        <span className="canon-radio-option-label">{children}</span>
      </RadioButton>
      {description && <Text className="canon-radio-option-description" slot="description">{description}</Text>}
    </RadioField>
  )
}
