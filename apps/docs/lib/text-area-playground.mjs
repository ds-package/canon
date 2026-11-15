export const initialTextAreaPlaygroundState = Object.freeze({
  size: 'md',
  rows: 4,
  defaultValue: '',
  disabled: false,
  required: false,
  invalid: false,
  readOnly: false,
  dark: false,
})

export function getTextAreaPlaygroundModel(state) {
  const componentProps = {
    label: 'Message',
    name: 'message',
    size: state.size,
    rows: state.rows,
    defaultValue: state.defaultValue,
    placeholder: 'Write your message',
    disabled: state.disabled,
    required: state.required,
    invalid: state.invalid,
    readOnly: state.readOnly,
    description: 'Include the details needed to help.',
    ...(state.invalid ? { errorMessage: 'Enter a message.' } : {}),
  }
  const attributes = [
    'label="Message"',
    'name="message"',
    `size="${state.size}"`,
    `rows={${state.rows}}`,
    state.defaultValue && `defaultValue="${state.defaultValue}"`,
    'placeholder="Write your message"',
    state.disabled && 'disabled',
    state.required && 'required',
    state.invalid && 'invalid',
    state.readOnly && 'readOnly',
    'description="Include the details needed to help."',
    state.invalid && 'errorMessage="Enter a message."',
  ].filter(Boolean).join(' ')

  return {
    componentProps,
    previewKey: [state.size, state.rows, state.defaultValue, state.disabled, state.required, state.invalid, state.readOnly].join(':'),
    theme: state.dark ? 'dark' : 'light',
    jsx: `<TextArea ${attributes} />`,
  }
}
