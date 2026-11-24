# @canon/tokens

## 2.0.0

### Major Changes

- 546a905: Align tokens with Figma variables.

  - Rename semantic colors to the Figma structure: `background/default`, `surface/tinted`, `text/default|low|lowest`, `icon/default|low`, `status/{intent}/emphasis|default|low`, `control/accent`, `control/selected*`, `control/neutral`. Old names are removed without aliases.
  - Hover and pressed states on filled controls now layer `overlay/*` tokens instead of dedicated `solid-hover` and `solid-pressed` colors.
  - Rename spacing to the Figma scale (`--spacing-100` = 8px), add `--control-height-*`, `--icon-size-*`, `--border-width-*`, and follow the Figma radius steps.
  - Use the neutral gray ramp from Figma and put `gray/700` back on the ramp.
  - `@canon/react` styles use the new token names and require `@canon/tokens` 2.x.

### Patch Changes

- 561af81: Add the Preview Button and IconButton interfaces, including the 56px `xl` size and its 14px default-shape radius, allow Canon Button to trigger Dialog, and strengthen contrast across supported interactive token states.
- a5123dc: Expose token sources and the shared Canon builder so ejected tokens retain the public CSS names and theme selectors. Resolve tokens from the consumer project, preserve existing files on repeated CLI runs, and use current brand tokens in initialization guidance.

  Rebuild token and TypeScript outputs during development, validate public token references, and verify packed consumers before publishing. Theme attributes are supported on the document root.

## 1.0.0

### Major Changes

- a6ca9d7: Add theme axes that vary independently of the light/dark scheme, mirroring the Figma variable collections.

  - `tint` (`data-tint="warm"`): warm surfaces and borders with cool ink, referenced from Dawn.
  - `brand` (`data-brand`): brand ramp `--brand-*` and `--semantic-accent-*`; `text.link` and `border.focus` now follow the brand. Default is blue, so nothing changes visually.
  - `shape` (`data-shape="sharp" | "soft"`): swaps the `--radius-*` scale. Adds `--radius-xs`.
  - `radius.json` is replaced by `shape.json`; `--radius-*` names are unchanged.
  - `canon eject` copies the new token files (`tint.json`, `brand.json`, `shape.json`).

  Restructure semantic colors by layer: `background` (page), `surface` (cards, callouts), `control` (UI fills). Breaking, no aliases.

  - `surface/body` -> `background/base`, `surface/inverse` -> `background/inverse`.
  - `status/*/subtle` -> `surface/{informative,positive,notice,negative}`, `accent/subtle` -> `surface/accent`.
  - `neutral/*`, `accent/{solid*,on-solid}`, `status/*/{solid*,on-solid}` -> `control/{neutral,accent,informative,positive,notice,negative}/*`.
  - Adds `control/disabled`. `status/*` and `accent` keep only `text` and `border`.
  - `tint` keys follow: `tint.*.background.base`, `tint.*.control.neutral.*`.
  - Dark `surface/overlay` moves from gray/950 to gray/900 so the dark layers step up one tone each: default 1000, raised 950, overlay 900.
  - Adds `text/placeholder` (gray/700 light, gray/600 dark) and `text/helper` (gray/700 light, gray/500 dark). They reference primitives directly, so they do not vary with `data-tint`.
  - Adds the 13px step: `--font-size-13` and the `Body/13`, `Body/13 Strong`, `Label/13`, `Label/13 Strong` typography tokens (line-height 20px for Body, 18px for Label).

### Patch Changes

- 3dcb13d: Include raw token sources in the published tokens package and resolve them from the consuming project when running `canon eject`.

  Add a package-consumption smoke test for the ESM, CJS, CSS, and CLI entry points.
