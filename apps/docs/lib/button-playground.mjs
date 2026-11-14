export const initialButtonPlaygroundState = Object.freeze({
  component: 'button',
  variant: 'primary',
  size: 'md',
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
    const componentProps = {
      ...commonProps,
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
        `  variant="${state.variant}"`,
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
