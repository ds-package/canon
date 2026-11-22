import type { ReactElement, ReactNode } from 'react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  ProgressBar,
} from 'react-aria-components'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'destructive'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// Icon-only destructive actions are easy to trigger by mistake; use a labeled Button.
export type IconButtonVariant = Exclude<ButtonVariant, 'destructive'>

export interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  leadingIcon?: ReactElement
  trailingIcon?: ReactElement
  disabled?: boolean
  pending?: boolean
  pendingLabel?: string
  className?: string
  id?: string
  form?: string
  name?: string
  value?: string
  type?: 'button' | 'submit' | 'reset'
  autoFocus?: boolean
  onPress?: AriaButtonProps['onPress']
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

/**
 * 현재 화면에서 동작을 실행하는 버튼이다.
 *
 * <!-- canon:selection source=docs/components/button.md -->
 * ### 언제 쓰나
 * - 화면의 대표 동작이면 `variant="primary"`를 씁니다. 한 영역에 하나만 둡니다.
 * - 대표 동작보다 낮은 위계의 동작이면 기본값 `variant="secondary"`를 씁니다.
 * - 툴바처럼 배경 강조가 필요 없는 동작이면 `variant="quiet"`를 씁니다.
 * - 삭제처럼 되돌리기 어려운 동작이면 `variant="destructive"`를 씁니다.
 *
 * ### 쓰지 않는 경우
 * - 아이콘만 보이면 {@link IconButton}을 씁니다.
 * - 다른 위치로 이동하면 Link를 씁니다(Canon에 아직 없습니다).
 * - 선택 가능한 toggle을 Button으로 만들지 않습니다.
 * - 색이나 정보·성공·주의 상태를 표현하면 해당 feedback 컴포넌트를 씁니다(Canon에 아직 없습니다).
 * <!-- /canon:selection -->
 *
 * ### 제약
 * - 기본값은 `variant="secondary"`, `size="lg"`, `type="button"`이다. form을 제출할 때만 `type="submit"`을 쓴다.
 * - `disabled`나 `pending`이면 `onPress`가 실행되지 않는다. `pending`은 focus와 label을 유지하고 progressbar를 보인다.
 * - `pendingLabel`의 기본값은 "Loading"이고 `pending`일 때 비어 있지 않은 문자열이어야 한다(throw). 서비스 언어가 영어가 아니면 번역한다.
 * - `sm`과 `xs`는 밀도 높은 도구 영역에만 쓰고 모바일의 주 동작에는 쓰지 않는다.
 *
 * ### 예시
 * ```tsx
 * <Button variant="primary" onPress={save}>Save changes</Button>
 * ```
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'lg',
  leadingIcon,
  trailingIcon,
  disabled,
  pending,
  pendingLabel = 'Loading',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  if (pending && (typeof pendingLabel !== 'string' || !pendingLabel.trim())) {
    throw new Error('Button pendingLabel must be a non-empty string')
  }

  return (
    <AriaButton
      {...props}
      type={type}
      isDisabled={disabled}
      isPending={pending}
      data-variant={variant}
      data-size={size}
      className={['canon-button', className].filter(Boolean).join(' ')}
    >
      {pending && <ProgressBar className="canon-button-spinner" aria-label={pendingLabel} isIndeterminate />}
      {leadingIcon && <span className="canon-button-icon" aria-hidden>{leadingIcon}</span>}
      <span className="canon-button-label">{children}</span>
      {trailingIcon && <span className="canon-button-icon" aria-hidden>{trailingIcon}</span>}
    </AriaButton>
  )
}

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingIcon' | 'trailingIcon' | 'variant'> {
  icon: ReactElement
  'aria-label': string
  variant?: IconButtonVariant
  shape?: 'square' | 'round'
}

/**
 * 아이콘만 보이고 현재 화면에서 동작을 실행하는 버튼이다.
 *
 * <!-- canon:selection source=docs/components/icon-button.md -->
 * ### 언제 쓰나
 * - 닫기처럼 아이콘만으로 뜻이 분명한 익숙한 동작이면 필수 `aria-label`과 함께 씁니다.
 *
 * ### 쓰지 않는 경우
 * - 동작 이름이 화면에 보여야 하면 {@link Button}을 씁니다.
 * - 삭제처럼 되돌리기 어려운 동작이면 label이 있는 {@link Button}의 `variant="destructive"`를 씁니다.
 * - 다른 위치로 이동하면 Link를 씁니다(Canon에 아직 없습니다).
 * <!-- /canon:selection -->
 *
 * ### 제약
 * - `aria-label`은 필수이고 비어 있지 않아야 한다(throw). "Close"처럼 동작 이름을 쓴다.
 * - 아이콘은 장식이며 보조 기술에 노출되지 않는다.
 * - 기본값은 `variant="secondary"`, `shape="square"`, `size="lg"`, `type="button"`이다.
 * - `disabled`나 `pending`이면 `onPress`가 실행되지 않는다.
 *
 * ### 예시
 * ```tsx
 * <IconButton icon={<XIcon />} aria-label="Close" onPress={close} />
 * ```
 */
export function IconButton({
  icon,
  'aria-label': ariaLabel,
  variant = 'secondary',
  shape = 'square',
  className,
  ...props
}: IconButtonProps) {
  if (typeof ariaLabel !== 'string' || !ariaLabel.trim()) {
    throw new Error('IconButton requires a non-empty aria-label')
  }

  return (
    <Button
      {...props}
      aria-label={ariaLabel}
      variant={variant}
      className={['canon-icon-button', className].filter(Boolean).join(' ')}
      data-shape={shape}
    >
      <span className="canon-button-icon" aria-hidden>{icon}</span>
    </Button>
  )
}
