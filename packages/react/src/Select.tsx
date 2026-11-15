import type { ReactElement, ReactNode } from 'react'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import {
  Button,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
  Text,
} from 'react-aria-components'

export type SelectSize = 'sm' | 'md' | 'lg'

interface SelectBaseProps {
  children: ReactElement<SelectItemProps> | ReactElement<SelectItemProps>[]
  label: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode
  placeholder?: string
  size?: SelectSize
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  form?: string
  autoFocus?: AriaSelectProps<object>['autoFocus']
  onFocus?: AriaSelectProps<object>['onFocus']
  onBlur?: AriaSelectProps<object>['onBlur']
}

type SelectControlledProps = {
  value: string | null
  defaultValue?: never
  onValueChange: (value: string | null) => void
}

type SelectUncontrolledProps = {
  value?: never
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

export type SelectProps = SelectBaseProps & (SelectControlledProps | SelectUncontrolledProps)

export function Select({
  children,
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  disabled,
  required,
  invalid,
  value,
  defaultValue,
  onValueChange,
  name,
  form,
  autoFocus,
  onFocus,
  onBlur,
}: SelectProps) {
  if (label == null || label === false || (typeof label === 'string' && !label.trim())) {
    throw new Error('Select requires a visible label')
  }
  if (invalid && (errorMessage == null || errorMessage === false || (typeof errorMessage === 'string' && !errorMessage.trim()))) {
    throw new Error('Select requires errorMessage when invalid is true')
  }
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error('Select cannot use value and defaultValue together')
  }
  if (value !== undefined && typeof onValueChange !== 'function') {
    throw new Error('Controlled Select requires onValueChange')
  }

  return (
    <AriaSelect
      className="canon-select"
      data-size={size}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={(nextValue) => onValueChange?.(nextValue as string | null)}
      name={name}
      form={form}
      autoFocus={autoFocus}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Label className="canon-select-label">{label}</Label>
      <Button className="canon-select-trigger" data-size={size}>
        <SelectValue className="canon-select-value" />
        <CaretDownIcon className="canon-select-caret" aria-hidden />
      </Button>
      {description && <Text className="canon-select-description" slot="description">{description}</Text>}
      <FieldError className="canon-select-error">{errorMessage}</FieldError>
      <Popover className="canon-select-popover">
        <ListBox className="canon-select-listbox">{children}</ListBox>
      </Popover>
    </AriaSelect>
  )
}

export interface SelectItemProps {
  id: string
  children: ReactNode
  textValue?: string
  disabled?: boolean
}

export function SelectItem({ id, children, textValue, disabled }: SelectItemProps) {
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('SelectItem requires a non-empty string id')
  }
  const resolvedTextValue = textValue ?? (typeof children === 'string' ? children : undefined)
  if (!resolvedTextValue?.trim()) {
    throw new Error('SelectItem requires text children or a non-empty textValue')
  }

  return (
    <ListBoxItem
      id={id}
      className="canon-select-item"
      isDisabled={disabled}
      textValue={resolvedTextValue}
    >
      {({ isSelected }) => (
        <>
          <span className="canon-select-item-label">{children}</span>
          {isSelected && <CheckIcon className="canon-select-item-check" aria-hidden />}
        </>
      )}
    </ListBoxItem>
  )
}
