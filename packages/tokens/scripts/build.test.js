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

test('semantic colors use Figma roles and remove obsolete target-specific tokens', () => {
  for (const intent of ['informative', 'positive', 'notice', 'negative']) {
    for (const level of ['low', 'default', 'emphasis']) {
      const name = `--semantic-status-${intent}-${level}`
      assert.ok(rootVariables.has(name))
      assert.ok(darkVariables.has(name))
      assert.equal(tokens.semantic.status[intent][level], `var(${name})`)
    }
  }
  assert.equal(tokens.semantic.surface.accent, 'var(--semantic-surface-accent)')
  assert.doesNotMatch(css, /--semantic-control-[\w-]+-(?:solid|on-solid)(?:-|:)/)
  assert.doesNotMatch(css, /--semantic-border-(?:status|selected|accent)/)
  assert.doesNotMatch(css, /--semantic-(?:text-accent|text-primary|background-base|surface-muted):/)
})

const composite = (variables, background, overlay) => {
  const base = resolveColor(variables, background)
  const rgba = resolveColor(variables, overlay).match(/^rgba\((\d+), (\d+), (\d+), ([\d.]+)\)$/)
  assert.ok(rgba, `Unsupported overlay ${overlay}`)
  const alpha = Number(rgba[4])
  return '#' + [1, 3, 5].map((offset, i) => {
    const channel = Number(rgba[i + 1]) * alpha + Number.parseInt(base.slice(offset, offset + 2), 16) * (1 - alpha)
    return Math.round(channel).toString(16).padStart(2, '0')
  }).join('')
}

test('solid labels meet WCAG AA on Figma fills with hover and pressed overlays', () => {
  for (const [theme, variables] of [['light', rootVariables], ['dark', darkVariables]]) {
    for (const intent of ['selected', 'accent', 'informative', 'positive', 'notice', 'negative']) {
      const foreground = intent === 'selected' ? '--semantic-text-inverse'
        : intent === 'notice' ? '--semantic-static-black' : '--semantic-text-on-status'
      const background = ['selected', 'accent'].includes(intent)
        ? `--semantic-control-${intent}` : `--semantic-status-${intent}-default`
      for (const state of ['default', 'hover', 'pressed']) {
        const values = new Map(variables)
        if (state !== 'default') {
          values.set('--composited-fill', composite(variables, background, `--semantic-overlay-${state}-inverse`))
        }
        assert.ok(
          contrastRatio(values, foreground, state === 'default' ? background : '--composited-fill') >= 4.5,
          `${theme} ${intent} ${state} label contrast is below 4.5:1`,
        )
      }
    }
  }
})

test('Figma gray and black alpha primitives retain their synchronized values', () => {
  const gray = { 50: '#f5f5f5', 100: '#efefef', 200: '#e7e7e7', 300: '#dcdcdc', 400: '#cbcbcb', 500: '#b7b7b7', 600: '#a1a1a1', 700: '#767676', 800: '#717171', 900: '#595959', 950: '#434343', 1000: '#2d2d2d', 1100: '#1a1a1a' }
  for (const [step, value] of Object.entries(gray)) {
    assert.equal(rootVariables.get(`--color-gray-${step}`), value)
  }
  for (const [step, alpha] of Object.entries({ 50: '0.03', 100: '0.05', 200: '0.06', 300: '0.14', 400: '0.20', 500: '0.32' })) {
    assert.equal(rootVariables.get(`--color-black-alpha-${step}`), `rgba(0, 0, 0, ${alpha})`)
  }
})

test('intentional contrast overrides stay pinned while Figma values are synchronized', () => {
  for (const name of ['placeholder', 'helper']) {
    assert.equal(rootVariables.get(`--semantic-text-${name}`), 'var(--color-gray-800)')
  }
  assert.equal(darkVariables.get('--semantic-text-low'), 'var(--color-gray-300)')
  assert.equal(darkVariables.get('--semantic-border-focus'), 'var(--brand-300)')
})

test('Figma dimensions use unprefixed paths and preserve every shape mode', () => {
  const spacing = { 0: 0, '025': 2, '050': 4, '075': 6, 100: 8, 150: 12, 200: 16, 250: 20, 300: 24, 400: 32, 500: 40, 600: 48, 800: 64, 1000: 80, 1200: 96 }
  assert.deepEqual(Object.keys(tokens.spacing).sort(), Object.keys(spacing).sort())
  for (const [name, value] of Object.entries(spacing)) {
    assert.equal(rootVariables.get(`--spacing-${name}`), `${value}px`)
  }
  for (const [name, size] of Object.entries({ xs: 24, sm: 32, md: 40, lg: 48 })) {
    assert.equal(rootVariables.get(`--control-height-${name}`), `var(--size-${size})`)
  }
  for (const size of [10, 11, 12, 13, 14, 16, 18, 20, 24, 32, 56]) {
    assert.equal(rootVariables.get(`--icon-size-${size}`), `var(--size-${size})`)
  }
  for (const [name, width] of Object.entries({ default: 1, strong: 2, selected: 2, focus: 2 })) {
    assert.equal(rootVariables.get(`--border-width-${name}`), `${width}px`)
  }
  const names = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full']
  for (const [mode, values] of Object.entries({
    default: [0, 2, 4, 6, 8, 10, 12, 16, 24, 9999],
    sharp: [0, 0, 0, 2, 4, 6, 8, 10, 12, 9999],
    soft: [0, 4, 6, 8, 10, 12, 16, 24, 24, 9999],
  })) {
    const variables = mode === 'default' ? rootVariables : declarationsFor(`[data-shape="${mode}"]`)
    names.forEach((name, index) => assert.equal(variables.get(`--radius-${name}`), `${values[index]}px`))
  }
  assert.doesNotMatch(css, /--semantic-(?:spacing|radius|control-height|icon-size|border-width)-/)
})

test('readable text meets WCAG AA on its supported surfaces', () => {
  const defaultSurfaceText = ['default', 'low', 'lowest', 'placeholder', 'helper']
  const cases = [
    ['light cool', rootVariables, defaultSurfaceText],
    ['light warm', warmVariables, ['default']],
    ['dark', darkVariables, defaultSurfaceText],
  ]

  for (const [theme, variables, textRoles] of cases) {
    for (const text of textRoles) {
      assert.ok(
        contrastRatio(variables, `--semantic-text-${text}`, '--semantic-surface-default') >= 4.5,
        `${theme} ${text} text contrast is below 4.5:1 on the default surface`,
      )
    }
  }

  for (const surface of ['raised', 'overlay', 'tinted']) {
    assert.ok(
      contrastRatio(darkVariables, '--semantic-text-low', `--semantic-surface-${surface}`) >= 4.5,
      `dark low text contrast is below 4.5:1 on the ${surface} surface`,
    )
  }
})

test('known AA shortfalls in warm tint retain their contrast floor (알려진 AA 미달)', () => {
  // Figma 확인 필요(warm tint 대비), docs/color.md 6절.
  const floors = { low: 4.482353, placeholder: 4.482353, helper: 4.482353, lowest: 4.171486 }
  for (const [text, floor] of Object.entries(floors)) {
    assert.ok(
      contrastRatio(warmVariables, `--semantic-text-${text}`, '--semantic-surface-default') >= floor,
      `light warm ${text} contrast regressed below the known AA shortfall floor ${floor}:1`,
    )
  }
})

test('focus border remains distinguishable on common component canvases', () => {
  const canvases = [
    '--semantic-background-default',
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

test('preview shows current Figma color roles and the retained accent surface', () => {
  const preview = `${previewHtml}\n${previewCss}`
  assert.doesNotMatch(preview, /--semantic-(?:text-primary|text-secondary|text-tertiary|text-accent|background-base|surface-muted)/)
  assert.doesNotMatch(preview, /--semantic-border-(?:status|selected|accent)/)
  assert.match(previewHtml, /text: \[[^\]]*'on-status'/)
  assert.match(previewHtml, /status: \[[^\]]*'informative\/default'/)
  assert.match(previewHtml, /surface: \[[^\]]*'accent'/)
  assert.match(previewHtml, /control: \[[^\]]*'selected-pressed'/)
  assert.match(previewCss, /--semantic-status-informative-emphasis/)
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
