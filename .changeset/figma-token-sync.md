---
"@canon/tokens": major
"@canon/react": minor
---

Align tokens with Figma variables.

- Rename semantic colors to the Figma structure: `background/default`, `surface/tinted`, `text/default|low|lowest`, `icon/default|low`, `status/{intent}/emphasis|default|low`, `control/accent`, `control/selected*`, `control/neutral`. Old names are removed without aliases.
- Hover and pressed states on filled controls now layer `overlay/*` tokens instead of dedicated `solid-hover` and `solid-pressed` colors.
- Rename spacing to the Figma scale (`--spacing-100` = 8px), add `--control-height-*`, `--icon-size-*`, `--border-width-*`, and follow the Figma radius steps.
- Use the neutral gray ramp from Figma and put `gray/700` back on the ramp.
- `@canon/react` styles use the new token names and require `@canon/tokens` 2.x.
