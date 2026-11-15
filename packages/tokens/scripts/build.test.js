import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../dist/css/variables.css', import.meta.url), 'utf8')
const previewHtml = await readFile(new URL('../preview/index.html', import.meta.url), 'utf8')
const previewCss = await readFile(new URL('../preview/styles.css', import.meta.url), 'utf8')
const { tokens } = await import('../dist/index.mjs')

const declarationsFor = (selector) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const block = css.match(new RegExp(`${escaped} \\{([\\s\\S]*?)\\n\\}`))?.[1]
  assert.ok(block, `Missing CSS selector ${selector}`)
  return new Map(
    [...block.matchAll(/^\s*(--[^:]+):\s*([^;]+);/gm)].map(([, name, value]) => [name, value]),
  )
}

const rootVariables = declarationsFor(':root')
const darkVariables = new Map([...rootVariables, ...declarationsFor('[data-theme="dark"]')])
const warmVariables = new Map([...rootVariables, ...declarationsFor('[data-tint="warm"]')])

const resolveColor = (variables, name, seen = new Set()) => {
  assert.ok(!seen.has(name), `Circular CSS variable reference at ${name}`)
  seen.add(name)
  const value = variables.get(name)
  assert.ok(value, `Missing CSS variable ${name}`)
  const reference = value.match(/^var\((--[^)]+)\)$/)?.[1]
  return reference ? resolveColor(variables, reference, seen) : value
}

const relativeLuminance = (hex) => {
  assert.match(hex, /^#[0-9a-f]{6}$/i)
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

const contrastRatio = (variables, foreground, background) => {
  const foregroundLuminance = relativeLuminance(resolveColor(variables, foreground))
  const backgroundLuminance = relativeLuminance(resolveColor(variables, background))
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
}

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

test('solid control labels meet WCAG AA in every interactive state', () => {
  for (const [theme, variables] of [['light', rootVariables], ['dark', darkVariables]]) {
    for (const intent of ['neutral', 'accent', 'informative', 'positive', 'notice', 'negative']) {
      const foreground = `--semantic-control-${intent}-on-solid`
      for (const state of ['solid', 'solid-hover', 'solid-pressed']) {
        const background = `--semantic-control-${intent}-${state}`
        assert.ok(
          contrastRatio(variables, foreground, background) >= 4.5,
          `${theme} ${intent} ${state} label contrast is below 4.5:1`,
        )
      }
    }
  }
})

test('readable text meets WCAG AA on its supported surfaces', () => {
  const defaultSurfaceText = ['primary', 'secondary', 'tertiary', 'placeholder', 'helper']
  const cases = [
    ['light cool', rootVariables],
    ['light warm', warmVariables],
    ['dark', darkVariables],
  ]

  for (const [theme, variables] of cases) {
    for (const text of defaultSurfaceText) {
      assert.ok(
        contrastRatio(variables, `--semantic-text-${text}`, '--semantic-surface-default') >= 4.5,
        `${theme} ${text} text contrast is below 4.5:1 on the default surface`,
      )
    }
  }

  for (const surface of ['raised', 'overlay', 'muted']) {
    assert.ok(
      contrastRatio(darkVariables, '--semantic-text-secondary', `--semantic-surface-${surface}`) >= 4.5,
      `dark secondary text contrast is below 4.5:1 on the ${surface} surface`,
    )
  }
})

test('focus border remains distinguishable on common component canvases', () => {
  const canvases = [
    '--semantic-background-base',
    '--semantic-surface-default',
    '--semantic-surface-overlay',
  ]

  for (const [theme, variables] of [
    ['light cool', rootVariables],
    ['light warm', warmVariables],
    ['dark', darkVariables],
  ]) {
    for (const canvas of canvases) {
      assert.ok(
        contrastRatio(variables, '--semantic-border-focus', canvas) >= 3,
        `${theme} focus border contrast is below 3:1 against ${canvas}`,
      )
    }
  }
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
