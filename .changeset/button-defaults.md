---
"@canon/react": minor
---

Change Button and IconButton defaults.

- Button now defaults to `variant="secondary"` and `size="lg"` (was `primary` and `md`).
- IconButton now defaults to `variant="secondary"` and `size="lg"` (was `quiet` and `md`).
- IconButton no longer accepts `variant="destructive"`. Use a labeled Button for destructive actions.
- The secondary variant now uses the neutral control fill without a border, matching Figma.
- Variant names are unchanged. Pass `variant="primary"` for the main action in an area, and pass `size="md"` to keep the previous size.
