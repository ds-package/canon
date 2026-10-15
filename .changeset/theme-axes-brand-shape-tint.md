---
"@canon/tokens": minor
"@canon/cli": patch
---

Add theme axes that vary independently of the light/dark scheme, mirroring the Figma variable collections.

- `tint` (`data-tint="warm"`): warm surfaces and borders with cool ink, referenced from Dawn.
- `brand` (`data-brand`): brand ramp `--brand-*` and `--semantic-accent-*`; `text.link` and `border.focus` now follow the brand. Default is blue, so nothing changes visually.
- `shape` (`data-shape="sharp" | "soft"`): swaps the `--radius-*` scale. Adds `--radius-xs`.
- `radius.json` is replaced by `shape.json`; `--radius-*` names are unchanged.
- `canon eject` copies the new token files (`tint.json`, `brand.json`, `shape.json`).
