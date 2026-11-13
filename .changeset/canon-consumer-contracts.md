---
"@canon/tokens": patch
"@canon/cli": patch
---

Expose token sources and the shared Canon builder so ejected tokens retain the public CSS names and theme selectors. Resolve tokens from the consumer project, preserve existing files on repeated CLI runs, and use current brand tokens in initialization guidance.

Rebuild token and TypeScript outputs during development, validate public token references, and verify packed consumers before publishing. Theme attributes are supported on the document root.
