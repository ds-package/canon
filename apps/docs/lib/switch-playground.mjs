export const initialSwitchPlaygroundState = Object.freeze({
  defaultChecked: false,
  disabled: false,
  readOnly: false,
  dark: false,
})

export function getSwitchPlaygroundModel(state) {
  const componentProps = {
    name: 'notifications',
    value: 'enabled',
    defaultChecked: state.defaultChecked,
    disabled: state.disabled,
    readOnly: state.readOnly,
    description: 'Applies immediately.',
  }
  const attributes = [
    'name="notifications"',
    'value="enabled"',
    state.defaultChecked && 'defaultChecked',
    state.disabled && 'disabled',
    state.readOnly && 'readOnly',
    'description="Applies immediately."',
    !state.readOnly && 'onCheckedChange={(checked) => updateNotificationSettings(checked)}',
  ].filter(Boolean).join(' ')

  return {
    componentProps,
    previewKey: [state.defaultChecked, state.disabled, state.readOnly].join(':'),
    theme: state.dark ? 'dark' : 'light',
    jsx: `<Switch ${attributes}>Notifications</Switch>`,
  }
}
