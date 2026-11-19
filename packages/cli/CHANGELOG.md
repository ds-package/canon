# @canon/cli

## 0.1.2

### Patch Changes

- a5123dc: Expose token sources and the shared Canon builder so ejected tokens retain the public CSS names and theme selectors. Resolve tokens from the consumer project, preserve existing files on repeated CLI runs, and use current brand tokens in initialization guidance.

  Rebuild token and TypeScript outputs during development, validate public token references, and verify packed consumers before publishing. Theme attributes are supported on the document root.

## 0.1.1

### Patch Changes

- 3dcb13d: Resolve `@canon/tokens` from the consuming project when running `canon eject`.

- a6ca9d7: Copy `tint.json`, `brand.json`, and `shape.json` from `canon eject`, replacing `radius.json` with `shape.json`.
