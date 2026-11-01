import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../dist/css/variables.css', import.meta.url), 'utf8')

test('exports the canonical neutral ramps', () => {
  const ramps = {
    gray: {
      50: '#f5f5f5', 100: '#efefef', 200: '#e7e7e7', 300: '#dcdcdc',
      400: '#cbcbcb', 500: '#b7b7b7', 600: '#a1a1a1', 700: '#767676',
      800: '#717171', 900: '#595959', 950: '#434343', 1000: '#2d2d2d', 1100: '#1a1a1a',
    },
    warm: {
      50: '#f7f5f1', 100: '#f3efe8', 200: '#eee7da', 300: '#e2d9cf',
      400: '#d6ccc2', 500: '#c4b8ae', 600: '#afa198', 700: '#978980',
      800: '#7d7068', 900: '#645851', 950: '#4f453f', 1000: '#39312c',
    },
  }

  for (const [ramp, steps] of Object.entries(ramps)) {
    for (const [step, value] of Object.entries(steps)) {
      assert.match(css, new RegExp(`--color-${ramp}-${step}: ${value};`))
    }
  }
})

test('exports only the target-centered tint contract', () => {
  for (const name of [
    'background-low',
    'surface-default', 'surface-raised', 'surface-overlay', 'surface-tinted',
    'border-default', 'border-emphasis', 'border-disabled',
    'control-neutral', 'control-disabled',
  ]) {
    assert.match(css, new RegExp(`--tint-${name}:`))
  }

  assert.match(css, /--tint-background-low: var\(--color-gray-50\);/)
  assert.match(css, /--tint-surface-tinted: var\(--color-gray-100\);/)
  assert.match(css, /--tint-control-neutral: var\(--color-gray-50\);/)
  assert.match(css, /--tint-background-low: var\(--color-warm-50\);/)
  assert.match(css, /--tint-surface-tinted: var\(--color-warm-100\);/)
  assert.match(css, /--tint-control-neutral: var\(--color-warm-100\);/)
  assert.doesNotMatch(css, /--tint-(?:text|icon)-/)
  assert.doesNotMatch(css, /--tint-(?:background-base|surface-muted|control-neutral-subtle):/)
})

test('exports target-centered semantics without component state families', () => {
  for (const name of [
    'background-default', 'background-low', 'background-inverse',
    'surface-default', 'surface-raised', 'surface-overlay', 'surface-tinted',
    'text-default', 'text-low', 'text-lowest', 'text-on-status',
    'icon-default', 'icon-low',
    'border-default', 'border-emphasis', 'border-focus', 'border-disabled',
    'control-neutral', 'control-inverse', 'control-accent', 'control-disabled',
    'control-selected', 'control-selected-hover', 'control-selected-pressed',
    'overlay-hover', 'overlay-pressed', 'overlay-hover-inverse', 'overlay-pressed-inverse',
  ]) {
    assert.match(css, new RegExp(`--semantic-${name}:`))
  }

  for (const intent of ['informative', 'positive', 'notice', 'negative']) {
    for (const strength of ['low', 'default', 'emphasis']) {
      assert.match(css, new RegExp(`--semantic-status-${intent}-${strength}:`))
    }
  }

  assert.match(css, /--semantic-status-negative-low: var\(--color-red-50\);/)
  assert.match(css, /--semantic-status-negative-default: var\(--color-red-600\);/)
  assert.match(css, /--semantic-status-negative-emphasis: var\(--color-red-800\);/)
  assert.match(css, /--semantic-status-negative-low: var\(--color-red-950\);/)
  assert.match(css, /--semantic-status-negative-emphasis: var\(--color-red-300\);/)
  assert.match(css, /--semantic-overlay-hover: var\(--color-black-alpha-50\);/)
  assert.match(css, /--semantic-overlay-pressed: var\(--color-black-alpha-50\);/)
  assert.match(css, /--semantic-overlay-hover-inverse: var\(--color-white-alpha-50\);/)
  assert.match(css, /--semantic-overlay-pressed-inverse: var\(--color-white-alpha-50\);/)
  assert.doesNotMatch(css, /--semantic-(?:background-base|surface-muted|text-primary|text-secondary|text-tertiary|icon-primary|icon-secondary):/)
  assert.doesNotMatch(css, /--semantic-(?:surface|border)-(?:informative|positive|notice|negative)/)
  assert.doesNotMatch(css, /--semantic-control-[\w-]+-(?:solid|solid-hover|solid-pressed|on-solid|subtle):/)
})

test('exports the shared size scale and icon size aliases', () => {
  for (const size of [10, 11, 12, 13, 14, 16, 18, 20, 24, 32, 40, 48, 56]) {
    assert.match(css, new RegExp(`--size-${size}: ${size}px;`))
  }

  for (const size of [10, 11, 12, 13, 14, 16, 18, 20, 24, 32, 56]) {
    assert.match(css, new RegExp(`--icon-size-${size}: var\\(--size-${size}\\);`))
  }
})
