import type { ReactNode } from 'react'
import { CheckIcon, MinusIcon } from '@phosphor-icons/react'
import {
  CheckboxButton,
  CheckboxField,
  FieldError,
  Text,
} from 'react-aria-components'

interface CheckboxBaseProps {
  children: string
  description?: ReactNode
  errorMessage?: ReactNode
  indeterminate?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  name?: string
  value?: string
  form?: string
}

type CheckboxControlledProps =
  | {
      checked: boolean
      defaultChecked?: never
      readOnly: true
      onCheckedChange?: never
    }
  | {
      checked: boolean
      defaultChecked?: never
      readOnly?: false
      onCheckedChange: (checked: boolean) => void
    }

type CheckboxUncontrolledProps = {
  checked?: never
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  readOnly?: boolean
}

export type CheckboxProps = CheckboxBaseProps & (CheckboxControlledProps | CheckboxUncontrolledProps)

function isEmptyContent(content: ReactNode) {
  return content == null || content === false || (typeof content === 'string' && !content.trim())
}

/**
 * 하나의 독립적인 결정을 받거나 목록의 항목을 각각 선택하는 checkbox다.
 *
 * ### 제약
 * - `children`은 보이는 label이며 비어 있지 않은 텍스트여야 한다(throw).
 * - `invalid`에는 사용자가 해결할 수 있는 `errorMessage`가 필요하다(throw).
 * - `checked`와 `defaultChecked`는 함께 쓸 수 없다(throw). `readOnly`가 아닌 controlled `checked`에는 `onCheckedChange`가 필요하다(throw).
 * - form 안에서 선택되면 `name=value`를 제출한다. `value`를 생략하면 native 기본값 `on`이다.
 * - `indeterminate`는 세 번째 form value가 아니다. `onCheckedChange`가 전달한 값으로 하위 항목을 갱신하고 `indeterminate`를 해제한다.
 *
 * ### 예시
 * ```tsx
 * <Checkbox name="terms" value="accepted" required>Accept the terms</Checkbox>
 * ```
 */
export function Checkbox({
  children,
  description,
  errorMessage,
  checked,
  defaultChecked,
  onCheckedChange,
  indeterminate,
  disabled,
  required,
  invalid,
  readOnly,
  ...props
}: CheckboxProps) {
  if (isEmptyContent(children)) {
    throw new Error('Checkbox requires a visible label')
  }
  if (invalid && isEmptyContent(errorMessage)) {
    throw new Error('Checkbox requires errorMessage when invalid is true')
  }
  if (checked !== undefined && defaultChecked !== undefined) {
    throw new Error('Checkbox cannot use checked and defaultChecked together')
  }
  if (checked !== undefined && !readOnly && typeof onCheckedChange !== 'function') {
    throw new Error('Controlled Checkbox requires onCheckedChange')
  }

  return (
    <CheckboxField
      {...props}
      className="canon-checkbox"
      isSelected={checked}
      defaultSelected={defaultChecked}
      onChange={onCheckedChange}
      isIndeterminate={indeterminate}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={invalid}
      isReadOnly={readOnly}
    >
      <CheckboxButton className="canon-checkbox-button">
        {({ isIndeterminate, isSelected }) => (
          <>
            <span className="canon-checkbox-control" aria-hidden>
              {isIndeterminate ? <MinusIcon /> : isSelected ? <CheckIcon /> : null}
            </span>
            <span className="canon-checkbox-label">{children}</span>
          </>
        )}
      </CheckboxButton>
      {description && <Text className="canon-checkbox-description" slot="description">{description}</Text>}
      <FieldError className="canon-checkbox-error">{errorMessage}</FieldError>
    </CheckboxField>
  )
}
