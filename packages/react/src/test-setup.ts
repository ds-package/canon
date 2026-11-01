globalThis.CSS ??= {} as typeof CSS
// shortcut: React Aria queries fixed meta keys in these tests, use a CSS parser when selectors become user input.
globalThis.CSS.escape ??= (value) => value
