import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const toKebab = (segment) =>
  String(segment)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[.\s]+/g, '-')
    .toLowerCase()

const cssPath = (pathSegments) => {
  const tokenPath = [...pathSegments]

  if (tokenPath[0] === 'semantic') {
    tokenPath.splice(1, 1)
  }

  if (tokenPath[0] === 'typography' && tokenPath.at(-1) === 'default') {
    tokenPath.pop()
  }

  return tokenPath.map(toKebab)
}

const cssName = (pathSegments) => `--${cssPath(pathSegments).join('-')}`

const cssValue = (value) => {
  if (typeof value === 'string') {
    const alias = value.match(/^\{(.+)\}$/)
    if (alias) return `var(${cssName(alias[1].split('.'))})`
  }

  return String(value)
}

const declaration = (token) =>
  `  ${cssName(token.path)}: ${cssValue(token.original.$value)};`

const typographyDeclarations = (token) => {
  const tokenPath = cssPath(token.path)

  return Object.entries(token.original.$value).map(
    ([property, value]) =>
      `  --${[...tokenPath, toKebab(property)].join('-')}: ${cssValue(value)};`,
  )
}

const setDeep = (target, pathSegments, value) => {
  let cursor = target

  pathSegments.forEach((segment, index) => {
    if (index === pathSegments.length - 1) {
      cursor[segment] = value
      return
    }

    cursor[segment] ??= {}
    cursor = cursor[segment]
  })
}

const formatCss = ({ dictionary }) => {
  const primitiveTokens = dictionary.allTokens.filter(
    (token) => token.path[0] !== 'semantic' && token.path[0] !== 'typography',
  )
  const typographyTokens = dictionary.allTokens.filter(
    (token) => token.path[0] === 'typography',
  )
  const lightTokens = dictionary.allTokens.filter(
    (token) => token.path[0] === 'semantic' && token.path[1] === 'light',
  )
  const darkTokens = dictionary.allTokens.filter(
    (token) => token.path[0] === 'semantic' && token.path[1] === 'dark',
  )

  const root = [
    ...primitiveTokens.map(declaration),
    ...typographyTokens.flatMap(typographyDeclarations),
    ...lightTokens.map(declaration),
  ].join('\n')
  const dark = darkTokens.map(declaration).join('\n')

  return [
    '/* Canon Design System CSS Variables */',
    '/* Auto-generated. Do not edit. */',
    '',
    ':root {',
    root,
    '}',
    '',
    '[data-theme="dark"] {',
    dark,
    '}',
    '',
    '@media (prefers-color-scheme: dark) {',
    '  :root:not([data-theme="light"]) {',
    dark.replace(/^/gm, '  '),
    '  }',
    '}',
    '',
  ].join('\n')
}

const formatJavascript = ({ dictionary }) => {
  const tokens = {}

  dictionary.allTokens
    .filter((token) => !(token.path[0] === 'semantic' && token.path[1] === 'dark'))
    .forEach((token) => {
      const tokenPath =
        token.path[0] === 'semantic' ? ['semantic', ...token.path.slice(2)] : token.path
      setDeep(tokens, tokenPath, token.value)
    })

  return [
    '/* Canon Design System tokens */',
    '/* Auto-generated. Do not edit. */',
    '',
    `export const tokens = ${JSON.stringify(tokens, null, 2)}`,
    '',
    'export default tokens',
    '',
  ].join('\n')
}

const formatTailwind = ({ dictionary }) => {
  const extend = {
    colors: {},
    spacing: {},
    borderRadius: {},
    boxShadow: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
  }

  dictionary.allTokens.forEach((token) => {
    const [category, second, ...rest] = token.path
    let target
    let tokenPath

    if (category === 'semantic' && second === 'light') {
      target = extend.colors
      tokenPath = ['semantic', ...rest]
    } else if (category === 'color') {
      target = extend.colors
      tokenPath = [second, ...rest]
    } else if (category === 'spacing') {
      target = extend.spacing
      tokenPath = [second, ...rest]
    } else if (category === 'radius') {
      target = extend.borderRadius
      tokenPath = [second, ...rest]
    } else if (category === 'shadow') {
      target = extend.boxShadow
      tokenPath = [second, ...rest]
    } else if (category === 'font' && second === 'family') {
      target = extend.fontFamily
      tokenPath = rest
    } else if (category === 'font' && second === 'size') {
      target = extend.fontSize
      tokenPath = rest
    } else if (category === 'font' && second === 'weight') {
      target = extend.fontWeight
      tokenPath = rest
    } else if (category === 'line-height') {
      target = extend.lineHeight
      tokenPath = [second, ...rest]
    } else if (category === 'letter-spacing') {
      target = extend.letterSpacing
      tokenPath = [second, ...rest]
    }

    if (target && tokenPath.length > 0) {
      setDeep(target, tokenPath, `var(${cssName(token.path)})`)
    }
  })

  return [
    '/* Canon Design System Tailwind v4 preset */',
    '/* Auto-generated. Do not edit. */',
    '',
    "/** @type {import('tailwindcss').Config} */",
    `export default ${JSON.stringify({ theme: { extend } }, null, 2)}`,
    '',
  ].join('\n')
}

const buildWithStyleDictionary = async (StyleDictionary) => {
  StyleDictionary.registerFormat({ name: 'canon/css-variables', format: formatCss })
  StyleDictionary.registerFormat({ name: 'canon/javascript-esm', format: formatJavascript })
  StyleDictionary.registerFormat({ name: 'canon/tailwind-preset', format: formatTailwind })

  const sd = new StyleDictionary({
    source: [path.join(ROOT, 'tokens/**/*.json')],
    platforms: {
      css: {
        buildPath: path.join(ROOT, 'dist/css/'),
        files: [{ destination: 'variables.css', format: 'canon/css-variables' }],
      },
      tailwind: {
        buildPath: path.join(ROOT, 'dist/tailwind/'),
        files: [{ destination: 'preset.js', format: 'canon/tailwind-preset' }],
      },
      js: {
        buildPath: path.join(ROOT, 'dist/js/'),
        files: [{ destination: 'tokens.js', format: 'canon/javascript-esm' }],
      },
    },
  })

  await sd.buildAllPlatforms()
}

const { default: StyleDictionary } = await import('style-dictionary')
await buildWithStyleDictionary(StyleDictionary)

console.log('\nCanon tokens built successfully')
