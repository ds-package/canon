import type { ReactNode } from 'react'
import { MinusIcon, PlusIcon } from '@phosphor-icons/react'
import {
  Button as AriaButton,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  Text,
} from 'react-aria-components'

export type NumberFieldSize = 'sm' | 'md' | 'lg'

interface NumberFieldBaseProps {
  label: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  size?: NumberFieldSize
  minValue?: number
  maxValue?: number
  step?: number
  formatOptions?: Intl.NumberFormatOptions
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  form?: string
}

type NumberFieldControlledProps =
  | {
      value: number | null
      defaultValue?: never
      readOnly: true
      onValueChange?: never
    }
  | {
      value: number | null
      defaultValue?: never
      readOnly?: false
      onValueChange: (value: number | null) => void
    }

type NumberFieldUncontrolledProps = {
  value?: never
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  readOnly?: boolean
}

export type NumberFieldProps = NumberFieldBaseProps & (NumberFieldControlledProps | NumberFieldUncontrolledProps)

function toAriaValue(value: number | null | undefined) {
  return value === null ? Number.NaN : value
}

function isEmptyContent(content: ReactNode) {
  return content == null || content === false || (typeof content === 'string' && !content.trim())
}

function isFiniteValue(value: number | null | undefined) {
  return value == null || Number.isFinite(value)
}

function isFiniteBound(value: number | undefined) {
  return value === undefined || Number.isFinite(value)
}

/**
 * 수량, 금액, 비율처럼 숫자로 계산하거나 범위를 검증하는 값을 입력하는 form field다.
 *
 * ### 제약
 * - 빈 값은 `0`이 아니라 `null`이다.
 * - `step`은 양의 유한한 숫자, `minValue`와 `maxValue`는 유한한 숫자이고 `minValue`가 `maxValue`보다 크면 안 된다. 값은 유한한 숫자나 `null`이어야 한다(throw).
 * - blur나 Enter로 확정하면 값이 범위 안으로 제한되고 `step` 단위에 맞춰진다. 증감 버튼과 ArrowUp·ArrowDown도 같은 `step`을 쓴다.
 * - 통화·단위·백분율은 문자열을 붙이지 않고 `formatOptions`로 표시한다. form에는 숫자 값이 제출된다.
 * - `minValue`, `maxValue`, `step`의 제품 의미를 확인하지 못하면 값을 임의로 정하지 않는다.
 * - `invalid`에는 비어 있지 않은 `errorMessage`가 필요하고, `readOnly`가 아닌 controlled `value`에는 `onValueChange`가 필요하다(throw).
 *
 * ### 예시
 * ```tsx
 * <NumberField
 *   label="Budget"
 *   name="budget"
 *   minValue={0}
 *   maxValue={10000}
 *   step={100}
 *   formatOptions={{ style: 'currency', currency: 'USD' }}
 * />
 * ```
 */
export function NumberField({
  label,
  description,
  errorMessage,
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  minValue,
  maxValue,
  step,
  formatOptions,
  disabled,
  required,
  invalid,
  readOnly,
  ...props
}: NumberFieldProps) {
  if (isEmptyContent(label)) {
    throw new Error('NumberField requires a visible label')
  }
  if (invalid && isEmptyContent(errorMessage)) {
    throw new Error('NumberField requires errorMessage when invalid is true')
  }
  if (step !== undefined && (!Number.isFinite(step) || step <= 0)) {
    throw new Error('NumberField step must be a positive finite number')
  }
  if (!isFiniteBound(minValue) || !isFiniteBound(maxValue)) {
    throw new Error('NumberField bounds must be finite numbers')
  }
  if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
    throw new Error('NumberField minValue cannot exceed maxValue')
  }
  if (!isFiniteValue(value) || !isFiniteValue(defaultValue)) {
    throw new Error('NumberField values must be finite numbers or null')
  }
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error('NumberField cannot use value and defaultValue together')
  }
  if (value !== undefined && !readOnly && typeof onValueChange !== 'function') {
    throw new Error('Controlled NumberField requires onValueChange')
  }

  return (
    <AriaNumberField
      {...props}
      className="canon-number-field"
      data-size={size}
      value={toAriaValue(value)}
      defaultValue={toAriaValue(defaultValue)}
      onChange={(nextValue) => onValueChange?.(Number.isNaN(nextValue) ? null : nextValue)}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      formatOptions={formatOptions}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      isReadOnly={readOnly}
    >
      <Label className="canon-number-field-label">{label}</Label>
      <Group className="canon-number-field-group" data-size={size}>
        <AriaButton className="canon-number-field-stepper" slot="decrement">
          <MinusIcon aria-hidden />
        </AriaButton>
        <Input className="canon-number-field-input" />
        <AriaButton className="canon-number-field-stepper" slot="increment">
          <PlusIcon aria-hidden />
        </AriaButton>
      </Group>
      {description && <Text className="canon-number-field-description" slot="description">{description}</Text>}
      <FieldError className="canon-number-field-error">{errorMessage}</FieldError>
    </AriaNumberField>
  )
}
