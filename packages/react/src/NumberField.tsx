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
  label: string
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
  if (!label.trim()) {
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
