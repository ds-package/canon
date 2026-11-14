export const initialCheckboxPlaygroundState = Object.freeze({
  defaultChecked: false,
  indeterminate: false,
  disabled: false,
  required: false,
  invalid: false,
  readOnly: false,
  dark: false,
})

export function getCheckboxPlaygroundModel(state) {
  const componentProps = {
    name: 'terms',
    value: 'accepted',
    defaultChecked: state.indeterminate ? false : state.defaultChecked,
    indeterminate: state.indeterminate,
    disabled: state.disabled,
    required: state.required,
    invalid: state.invalid,
    readOnly: state.readOnly,
    description: 'Confirm before continuing.',
    ...(state.invalid ? { errorMessage: 'Accept the terms to continue.' } : {}),
  }
  const attributes = [
    'name="terms"',
    'value="accepted"',
    state.defaultChecked && !state.indeterminate && 'defaultChecked',
    state.disabled && 'disabled',
    state.required && 'required',
    state.invalid && 'invalid',
    state.readOnly && 'readOnly',
    'description="Confirm before continuing."',
    state.invalid && 'errorMessage="Accept the terms to continue."',
  ].filter(Boolean).join(' ')

  const jsx = state.indeterminate
    ? `const [checked, setChecked] = useState(false)\nconst [indeterminate, setIndeterminate] = useState(true)\n\n<Checkbox ${attributes} checked={checked} indeterminate={indeterminate} onCheckedChange={(nextChecked) => { setChecked(nextChecked); setIndeterminate(false) }}>Accept the terms</Checkbox>`
    : `<Checkbox ${attributes}>Accept the terms</Checkbox>`

  return {
    componentProps,
    previewKey: [
      state.defaultChecked,
      state.indeterminate,
      state.disabled,
      state.required,
      state.invalid,
      state.readOnly,
    ].join(':'),
    theme: state.dark ? 'dark' : 'light',
    jsx,
  }
}
