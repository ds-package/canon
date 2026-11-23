export const initialButtonPlaygroundState = Object.freeze({
  component: 'button',
  variant: 'secondary',
  size: 'lg',
  disabled: false,
  pending: false,
  shape: 'square',
  dark: false,
})

export function getButtonPlaygroundModel(state) {
  const commonProps = {
    variant: state.variant,
    size: state.size,
    disabled: state.disabled,
    pending: state.pending,
  }
  const flags = [state.disabled && 'disabled', state.pending && 'pending'].filter(Boolean)

  if (state.component === 'icon') {
    // IconButton has no destructive variant; fall back to the default.
    const variant = state.variant === 'destructive' ? 'secondary' : state.variant
    const componentProps = {
      ...commonProps,
      variant,
      shape: state.shape,
      'aria-label': 'Close',
    }
    return {
      component: 'IconButton',
      componentProps,
      theme: state.dark ? 'dark' : 'light',
      jsx: [
        '<IconButton',
        '  icon={<XIcon />}',
        '  aria-label="Close"',
        `  variant="${variant}"`,
        `  size="${state.size}"`,
        `  shape="${state.shape}"`,
        ...flags.map((flag) => `  ${flag}`),
        '/>',
      ].join('\n'),
    }
  }

  const attributes = [
    `variant="${state.variant}"`,
    `size="${state.size}"`,
    ...flags,
  ].join(' ')
  return {
    component: 'Button',
    componentProps: commonProps,
    theme: state.dark ? 'dark' : 'light',
    jsx: `<Button ${attributes}>Save changes</Button>`,
  }
}
