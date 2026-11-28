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

/**
 * 정해진 목록에서 하나를 고르는 form field다.
 *
 * ### 제약
 * - Canon에는 read-only Select가 없다.
 * - `label`은 보이며 필수다(throw). `placeholder`로 대신하지 않는다.
 * - `invalid`에는 비어 있지 않은 `errorMessage`가 필요하다(throw).
 * - `value`와 `defaultValue`는 함께 쓸 수 없다(throw). controlled `value`에는 `onValueChange`가 필요하다(throw).
 * - `onValueChange`는 선택한 {@link SelectItem}의 `id` 또는 `null`을 전달한다. `name`이 있으면 그 `id`가 form value다.
 * - `size`의 기본값은 `md`다.
 *
 * ### 예시
 * ```tsx
 * <Select label="Fruit" name="fruit" defaultValue="apple">
 *   <SelectItem id="apple">Apple</SelectItem>
 *   <SelectItem id="banana">Banana</SelectItem>
 * </Select>
 * ```
 */
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

/**
 * {@link Select} 안의 선택지 하나다.
 *
 * ### 제약
 * - `id`는 선택 key이며 비어 있지 않은 문자열이어야 한다(throw). form에 저장해도 되는 안정적인 값을 목록 안에서 고유하게 쓴다.
 * - 텍스트가 아닌 `children`에는 검색과 보조 기술용 `textValue`가 필요하다(throw).
 * - 고를 수 없는 선택지에는 `disabled`를 준다.
 */
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
