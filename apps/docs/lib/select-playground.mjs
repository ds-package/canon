export const initialSelectPlaygroundState = Object.freeze({
  size: 'md',
  defaultValue: 'apple',
  disabled: false,
  required: false,
  invalid: false,
  dark: false,
})

export function getSelectPlaygroundModel(state) {
  const defaultValue = state.defaultValue || undefined
  const componentProps = {
    label: 'Fruit',
    name: 'fruit',
    size: state.size,
    disabled: state.disabled,
    required: state.required,
    invalid: state.invalid,
    description: 'Choose one fruit.',
    defaultValue,
    ...(state.invalid ? { errorMessage: 'Choose a valid fruit.' } : {}),
  }
  const attributes = [
    'label="Fruit"',
    'name="fruit"',
    `size="${state.size}"`,
    defaultValue && `defaultValue="${defaultValue}"`,
    state.disabled && 'disabled',
    state.required && 'required',
    state.invalid && 'invalid',
    'description="Choose one fruit."',
    state.invalid && 'errorMessage="Choose a valid fruit."',
  ].filter(Boolean).join(' ')

  return {
    componentProps,
    previewKey: [state.size, defaultValue, state.disabled, state.required, state.invalid].join(':'),
    theme: state.dark ? 'dark' : 'light',
    jsx: [
      `<Select ${attributes}>`,
      '  <SelectItem id="apple">Apple</SelectItem>',
      '  <SelectItem id="banana">Banana</SelectItem>',
      '  <SelectItem id="orange" disabled>Orange</SelectItem>',
      '</Select>',
    ].join('\n'),
  }
}
