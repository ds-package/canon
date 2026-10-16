---
"@canon/tokens": major
"@canon/cli": patch
---

Add theme axes that vary independently of the light/dark scheme, mirroring the Figma variable collections.

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
