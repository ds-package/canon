import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8')
const css = readFileSync(new URL('../dist/css/variables.css', import.meta.url), 'utf8')

class Element {
  constructor() {
    this.children = []
    this.dataset = {}
    this.style = {}
    this.textContent = ''
    this.listeners = {}
  }
  append(...children) { this.children.push(...children) }
  appendChild(child) { this.append(child) }
  replaceChildren(...children) { this.children = children }
  addEventListener(event, listener) { this.listeners[event] = listener }
  setAttribute() {}
  removeAttribute(name) { delete this.dataset[name.replace('data-', '')] }
}

function openPreview(stylesheet) {
  const root = new Element()
  const elements = new Map()
  const themeButtons = ['light', 'dark', 'system'].map((themeOption) => {
    const button = new Element()
    button.dataset.themeOption = themeOption
    return button
  })
  // Model computed custom properties at the DOM boundary; browser cascade is not under test.
  const parseDeclarations = (block) => Object.fromEntries(
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)]
      .map(([, name, value]) => [name, value]),
  )
  const light = parseDeclarations(stylesheet.split('}')[0])
  const dark = parseDeclarations(stylesheet.match(/\[data-theme="dark"\] \{([^}]+)\}/)[1])
  const resolve = (name) => {
    const declarations = root.dataset.theme === 'dark' ? { ...light, ...dark } : light
    return (declarations[name] || '').replace(/var\((--[\w-]+)\)/g, (_, variable) => resolve(variable))
  }
  vm.runInNewContext(html.split('<script>')[1].split('</script>')[0], {
    document: {
      documentElement: root,
      createElement: () => new Element(),
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, new Element())
        return elements.get(id)
      },
      querySelectorAll: (selector) => selector === '[data-theme-option]' ? themeButtons : [],
    },
    getComputedStyle: () => ({ getPropertyValue: resolve }),
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    location: { hash: '' },
  })
  return {
    comparison: () => elements.get('color-comparison').children,
    setTheme: (theme) => themeButtons.find((button) => button.dataset.themeOption === theme).listeners.click(),
  }
}

test('code comparison displays the loaded semantic CSS value after a token changes', () => {
  const changed = css.replace('--semantic-control-disabled: var(--color-gray-100);', '--semantic-control-disabled: #123456;')
  assert.notEqual(changed, css, 'fixture must change an actual generated CSS declaration')
  const preview = openPreview(changed)
  const card = preview.comparison().find((item) => item.children[0].textContent === 'control/disabled')
  assert.equal(card.children[2].children[1].textContent, '코드 · #123456')
  assert.equal(card.children[2].children[0].style.backgroundColor, 'var(--semantic-control-disabled)')
})

test('theme controls refresh code values and show the dated Figma alias for that mode', () => {
  const changed = css.replaceAll('--semantic-control-disabled: var(--color-gray-950);', '--semantic-control-disabled: #654321;')
  assert.notEqual(changed, css)
  const preview = openPreview(changed)
  preview.setTheme('dark')
  const card = preview.comparison().find((item) => item.children[0].textContent === 'control/disabled')
  assert.equal(card.children[1].children[0].textContent, 'Figma (2026-11-01) · gray/950')
  assert.equal(card.children[2].children[1].textContent, '코드 · #654321')
  preview.setTheme('light')
  const lightCard = preview.comparison().find((item) => item.children[0].textContent === 'control/disabled')
  assert.equal(lightCard.children[2].children[1].textContent, '코드 · #e9eaec')
})

test('every comparison card shows a code value in light and dark', () => {
  const emptyCodeCards = (preview) => preview.comparison()
    .filter((card) => card.children[2].children.at(-1).textContent.trim() === '코드 ·')
    .map((card) => card.children[0].textContent)
  const preview = openPreview(css)
  for (const theme of ['light', 'dark']) {
    preview.setTheme(theme)
    assert.equal(preview.comparison().length, 3)
    assert.deepEqual(emptyCodeCards(preview), [], `${theme} comparison values`)
  }
  // Positive control: a renamed CSS variable must surface as an empty card.
  const renamed = openPreview(css.replaceAll('--semantic-overlay-pressed:', '--semantic-overlay-renamed:'))
  for (const theme of ['light', 'dark']) {
    renamed.setTheme(theme)
    assert.deepEqual(emptyCodeCards(renamed), ['overlay/pressed'], theme)
  }
})
