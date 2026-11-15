---
"@canon/react": minor
---

Make component state interfaces explicit and consistent.

- Replace Select and TextField `onChange` with `onValueChange`.
- Replace Dialog `dismissable` with `closeOnInteractOutside`.
- Replace Dialog `keyboardDismissDisabled` with `closeOnEscape={false}`.
- Stop accepting arbitrary React Aria props through Canon components. Button, Select, and TextField now expose a tested allowlist instead, including the form and focus integration props each component supports.
