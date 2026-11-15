export const initialTextFieldPlaygroundState = Object.freeze({
  type: 'email',
  size: 'md',
  defaultValue: 'lou@example.com',
  disabled: false,
  required: false,
  invalid: false,
  readOnly: false,
  dark: false,
})

export function getTextFieldPlaygroundModel(state) {
  const defaultValue = state.defaultValue || undefined
  const componentProps = {
    label: 'Email',
    name: 'email',
    type: state.type,
    size: state.size,
    defaultValue,
    disabled: state.disabled,
    required: state.required,
    invalid: state.invalid,
    readOnly: state.readOnly,
    description: 'We only use this for account updates.',
    ...(state.invalid ? { errorMessage: 'Enter a valid value.' } : {}),
  }
  const attributes = [
    'label="Email"',
    'name="email"',
    `type="${state.type}"`,
    `size="${state.size}"`,
    defaultValue && `defaultValue="${defaultValue}"`,
    state.disabled && 'disabled',
    state.required && 'required',
    state.invalid && 'invalid',
    state.readOnly && 'readOnly',
    'description="We only use this for account updates."',
    state.invalid && 'errorMessage="Enter a valid value."',
  ].filter(Boolean).join(' ')

  return {
    componentProps,
    previewKey: [state.type, state.size, defaultValue, state.disabled, state.required, state.invalid, state.readOnly].join(':'),
    theme: state.dark ? 'dark' : 'light',
    jsx: `<TextField ${attributes} />`,
  }
}
