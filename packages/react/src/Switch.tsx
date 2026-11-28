import type { ReactNode } from 'react'
import { SwitchButton, SwitchField, Text } from 'react-aria-components'

interface SwitchBaseProps {
  children: string
  description?: ReactNode
  disabled?: boolean
  name?: string
  value?: string
  form?: string
}

type SwitchControlledProps =
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

type SwitchUncontrolledProps = {
  checked?: never
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  readOnly?: boolean
}

export type SwitchProps = SwitchBaseProps & (SwitchControlledProps | SwitchUncontrolledProps)

/**
 * 설정을 켜거나 끄고 변경을 즉시 적용하는 switch다.
 *
 * ### 제약
 * - `children`은 보이는 label이며 비어 있지 않은 텍스트여야 한다(throw).
 * - `checked`와 `defaultChecked`는 함께 쓸 수 없다(throw). `readOnly`가 아닌 controlled `checked`에는 `onCheckedChange`가 필요하다(throw).
 * - `readOnly`는 현재 값을 보여주지만 변경을 허용하지 않을 때만 쓴다.
 * - `description`에는 상태 이름을 반복하지 않고 켰을 때 달라지는 결과를 쓴다.
 * - form 안에서 켜지면 `name=value`를 제출한다. `value`를 생략하면 native 기본값 `on`이다.
 *
 * ### 예시
 * ```tsx
 * <Switch name="notifications" value="enabled">Notifications</Switch>
 * ```
 */
export function Switch({
  children,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  readOnly,
  ...props
}: SwitchProps) {
  if (typeof children !== 'string' || !children.trim()) {
    throw new Error('Switch requires a visible label')
  }
  if (checked !== undefined && defaultChecked !== undefined) {
    throw new Error('Switch cannot use checked and defaultChecked together')
  }
  if (checked !== undefined && !readOnly && typeof onCheckedChange !== 'function') {
    throw new Error('Controlled Switch requires onCheckedChange')
  }

  return (
    <SwitchField
      {...props}
      className="canon-switch"
      isSelected={checked}
      defaultSelected={defaultChecked}
      onChange={onCheckedChange}
      isDisabled={disabled}
      isReadOnly={readOnly}
    >
      <SwitchButton className="canon-switch-button">
        <span className="canon-switch-control" aria-hidden>
          <span className="canon-switch-thumb" />
        </span>
        <span className="canon-switch-label">{children}</span>
      </SwitchButton>
      {description && <Text className="canon-switch-description" slot="description">{description}</Text>}
    </SwitchField>
  )
}
