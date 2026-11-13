import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../dist/css/variables.css', import.meta.url), 'utf8')
const previewHtml = await readFile(new URL('../preview/index.html', import.meta.url), 'utf8')
const previewCss = await readFile(new URL('../preview/styles.css', import.meta.url), 'utf8')
const { tokens } = await import('../dist/index.mjs')

test('status colors are shared unless an application target needs a distinct value', () => {
  for (const name of [
    'text-accent',
    'status-informative',
    'status-positive',
    'border-status-negative',
    'border-status-notice-subtle',
    'border-selected-pressed',
  ]) {
    assert.match(css, new RegExp(`--semantic-${name}:`))
  }

  assert.equal(tokens.semantic.status.informative, 'var(--semantic-status-informative)')
  assert.equal(tokens.semantic.status.positive, 'var(--semantic-status-positive)')
  assert.equal(tokens.semantic.border.statusNegative, 'var(--semantic-border-status-negative)')
  assert.equal(tokens.semantic.text.informative, undefined)
  assert.equal(tokens.semantic.icon.positive, undefined)
  assert.equal(tokens.semantic.border.negative, undefined)
  assert.equal(tokens.semantic.accent, undefined)
  assert.equal(tokens.semantic.control.neutral.text, undefined)
  assert.equal(tokens.semantic.control.neutral.border, undefined)

  assert.doesNotMatch(css, /--semantic-(?:text|icon)-(?:informative|positive|notice|negative):/)
  assert.doesNotMatch(css, /--semantic-border-(?:informative|positive|notice|negative)(?:-subtle)?:/)
  assert.doesNotMatch(css, /--semantic-accent-/)
  assert.doesNotMatch(css, /--semantic-control-neutral-(?:text|border):/)
  assert.doesNotMatch(css, /--tint-control-neutral-border:/)

  assert.match(css, /--semantic-status-informative: var\(--color-blue-800\);/)
  assert.match(css, /--semantic-status-informative: var\(--color-blue-300\);/)
  assert.match(css, /--semantic-border-status-notice: var\(--color-yellow-900\);/)
  assert.match(css, /--semantic-border-status-notice: var\(--color-yellow-300\);/)
  assert.match(css, /--semantic-border-status-negative-subtle: var\(--color-red-200\);/)
  assert.match(css, /--semantic-border-status-negative-subtle: var\(--color-red-800\);/)
  assert.match(css, /--semantic-border-selected-pressed: var\(--color-gray-950\);/)
  assert.match(css, /--semantic-border-selected-pressed: var\(--color-gray-100\);/)
  assert.match(css, /--semantic-control-neutral-solid-pressed: var\(--color-gray-950\);/)
  assert.match(css, /--semantic-control-neutral-solid-pressed: var\(--color-gray-100\);/)
})

test('preview shows shared status colors and target-specific exceptions', () => {
  const preview = `${previewHtml}\n${previewCss}`

  assert.doesNotMatch(preview, /--semantic-(?:text|icon)-(?:informative|positive|notice|negative)/)
  assert.doesNotMatch(preview, /--semantic-border-(?:informative|positive|notice|negative)(?:-subtle)?/)
  assert.doesNotMatch(preview, /--semantic-control-neutral-(?:text|border)/)

  assert.match(previewHtml, /text: \[[^\]]*'accent'/)
  assert.match(previewHtml, /status: \[[^\]]*'informative'/)
  assert.match(previewHtml, /border: \[[^\]]*'selected-pressed'/)
  assert.match(previewHtml, /border: \[[^\]]*'status-informative-subtle'/)
  assert.match(previewCss, /--semantic-status-informative/)
  assert.match(previewCss, /--semantic-border-status-informative-subtle/)
})

test('every TypeScript token reference has a CSS declaration and every public default token has a reference', () => {
  const references = new Set()
  const collect = (value) => {
    for (const child of Object.values(value)) {
      if (typeof child === 'string') {
        assert.match(child, /^var\(--[^)]+\)$/)
        references.add(child.slice(4, -1))
      } else collect(child)
    }
  }
  collect(tokens)
  const declared = new Set([...css.matchAll(/^\s*(--[^:]+):/gm)].map((match) => match[1]))
  assert.deepEqual([...references].filter((name) => !declared.has(name)), [], 'TypeScript references without CSS')
  const root = css.match(/:root \{([\s\S]*?)\n\}/)[1]
  const publicDefaults = [...root.matchAll(/^\s*(--[^:]+):/gm)]
    .map((match) => match[1])
    .filter((name) => !name.startsWith('--tint-'))
  assert.deepEqual(publicDefaults.filter((name) => !references.has(name)), [], 'CSS defaults missing from TypeScript')
})
