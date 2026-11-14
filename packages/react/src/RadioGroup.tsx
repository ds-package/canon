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
  label: string
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
  if (typeof label !== 'string' || !label.trim()) {
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
