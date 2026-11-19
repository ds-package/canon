# @canon/react

## 0.2.0

### Minor Changes

- 561af81: Add the Preview Button and IconButton interfaces, allow Canon Button to trigger Dialog, and strengthen contrast across supported interactive token states.
- 561af81: Add the Preview Checkbox component with native form behavior, validation messaging, and accessible checked and indeterminate states.
- 546a905: Align tokens with Figma variables.

  - Rename semantic colors to the Figma structure: `background/default`, `surface/tinted`, `text/default|low|lowest`, `icon/default|low`, `status/{intent}/emphasis|default|low`, `control/accent`, `control/selected*`, `control/neutral`. Old names are removed without aliases.
  - Hover and pressed states on filled controls now layer `overlay/*` tokens instead of dedicated `solid-hover` and `solid-pressed` colors.
  - Rename spacing to the Figma scale (`--spacing-100` = 8px), add `--control-height-*`, `--icon-size-*`, `--border-width-*`, and follow the Figma radius steps.
  - Use the neutral gray ramp from Figma and put `gray/700` back on the ramp.
  - `@canon/react` styles use the new token names and require `@canon/tokens` 2.x.

- 561af81: Add the Preview NumberField interface with localized formatting, steppers, range constraints, form behavior, and nullable controlled values.
- 561af81: Add the Preview RadioGroup and RadioOption components with accessible single-selection and native form behavior.
- 561af81: Add the Preview Select and SelectItem interfaces with accessible keyboard selection, validation messaging, and native form integration.
- 561af81: Make component state interfaces explicit and consistent.

  - Replace Select and TextField `onChange` with `onValueChange`.
  - Replace Dialog `dismissable` with `closeOnInteractOutside`.
  - Replace Dialog `keyboardDismissDisabled` with `closeOnEscape={false}`.
  - Stop accepting arbitrary React Aria props through Canon components. Button, Select, and TextField now expose a tested allowlist instead, including the form and focus integration props each component supports.
  - Allow rich React content in TextArea, NumberField, and RadioGroup labels without changing their accessible names.

- 561af81: Add the Preview Switch component with accessible setting state and native form behavior.
- 561af81: Add the Preview TextArea interface with visible labels, form behavior, validation messaging, rows, and three sizes.
- 561af81: Add the Preview TextField interface with visible labels, form behavior, validation messaging, and three sizes.

### Patch Changes

- Updated dependencies [561af81]
- Updated dependencies [a5123dc]
- Updated dependencies [546a905]
  - @canon/tokens@2.0.0

## 0.1.0

### Minor Changes

- eb4e717: Add the first Canon React package with Dialog parts built on React Aria Components.
