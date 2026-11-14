export const initialRadioGroupPlaygroundState = Object.freeze({
  defaultValue: 'free',
  orientation: 'vertical',
  disabled: false,
  required: false,
  invalid: false,
  readOnly: false,
  dark: false,
})

export function getRadioGroupPlaygroundModel(state) {
  const defaultValue = state.defaultValue || undefined
  const componentProps = {
    label: 'Plan',
    name: 'plan',
    orientation: state.orientation,
    defaultValue,
    disabled: state.disabled,
    required: state.required,
    invalid: state.invalid,
    readOnly: state.readOnly,
    description: 'Choose one plan.',
    ...(state.invalid ? { errorMessage: 'Choose a plan.' } : {}),
  }
  const attributes = [
    'label="Plan"',
    'name="plan"',
    `orientation="${state.orientation}"`,
    defaultValue && `defaultValue="${defaultValue}"`,
    state.disabled && 'disabled',
    state.required && 'required',
    state.invalid && 'invalid',
    state.readOnly && 'readOnly',
    'description="Choose one plan."',
    state.invalid && 'errorMessage="Choose a plan."',
  ].filter(Boolean).join(' ')

  return {
    componentProps,
    previewKey: [
      defaultValue,
      state.orientation,
      state.disabled,
      state.required,
      state.invalid,
      state.readOnly,
    ].join(':'),
    theme: state.dark ? 'dark' : 'light',
    jsx: [
      `<RadioGroup ${attributes}>`,
      '  <RadioOption value="free">Free</RadioOption>',
      '  <RadioOption value="pro">Pro</RadioOption>',
      '  <RadioOption value="team" disabled>Team</RadioOption>',
      '</RadioGroup>',
    ].join('\n'),
  }
}
