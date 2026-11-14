export const initialNumberFieldPlaygroundState = Object.freeze({
  size: 'md',
  defaultValue: 1000,
  minValue: 0,
  maxValue: 10000,
  step: 100,
  disabled: false,
  required: false,
  invalid: false,
  readOnly: false,
  dark: false,
})

export function getNumberFieldPlaygroundModel(state) {
  const componentProps = {
    label: 'Budget',
    name: 'budget',
    size: state.size,
    defaultValue: state.defaultValue,
    minValue: state.minValue,
    maxValue: state.maxValue,
    step: state.step,
    formatOptions: { style: 'currency', currency: 'USD' },
    disabled: state.disabled,
    required: state.required,
    invalid: state.invalid,
    readOnly: state.readOnly,
    description: 'Enter the approved amount.',
    ...(state.invalid ? { errorMessage: 'Enter a number in the allowed range.' } : {}),
  }
  const attributes = [
    'label="Budget"',
    'name="budget"',
    `size="${state.size}"`,
    `defaultValue={${state.defaultValue === null ? 'null' : state.defaultValue}}`,
    `minValue={${state.minValue}}`,
    `maxValue={${state.maxValue}}`,
    `step={${state.step}}`,
    "formatOptions={{ style: 'currency', currency: 'USD' }}",
    state.disabled && 'disabled',
    state.required && 'required',
    state.invalid && 'invalid',
    state.readOnly && 'readOnly',
    'description="Enter the approved amount."',
    state.invalid && 'errorMessage="Enter a number in the allowed range."',
  ].filter(Boolean).join(' ')

  return {
    componentProps,
    previewKey: [
      state.size,
      state.defaultValue,
      state.minValue,
      state.maxValue,
      state.step,
      state.disabled,
      state.required,
      state.invalid,
      state.readOnly,
    ].join(':'),
    theme: state.dark ? 'dark' : 'light',
    jsx: `<NumberField ${attributes} />`,
  }
}
