import StyleDictionary from 'style-dictionary'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ── CSS Variables 포맷 ─────────────────────────────────────────────────────
StyleDictionary.registerFormat({
  name: 'canon/css-variables',
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .map((token) => `  ${token.name}: ${token.$value ?? token.value};`)
      .join('\n')
    return `/* Canon Design System — CSS Variables */\n/* Auto-generated. Do not edit. */\n\n:root {\n${vars}\n}\n`
  },
})

// ── Tailwind v4 preset 포맷 ────────────────────────────────────────────────
StyleDictionary.registerFormat({
  name: 'canon/tailwind-preset',
  format: ({ dictionary }) => {
    const tokens = {}
    for (const token of dictionary.allTokens) {
      // "--color-primary-500" 형태의 CSS 변수 참조로 매핑
      const key = token.name.replace(/^--/, '')
      tokens[key] = `var(${token.name})`
    }

    return [
      `/* Canon Design System — Tailwind v4 Preset */`,
      `/* Auto-generated. Do not edit. */`,
      ``,
      `/** @type {import('tailwindcss').Config} */`,
      `export default ${JSON.stringify({ theme: { extend: tokens } }, null, 2)}`,
      ``,
    ].join('\n')
  },
})

// ── CSS 변수명 변환 (--color-bg-strong 형태, default 세그먼트 제거) ───────────
StyleDictionary.registerTransform({
  name: 'canon/css-variable-name',
  type: 'name',
  transform: (token) => {
    const path = token.path.filter((segment) => segment !== 'default')
    return '--' + path.join('-').replace(/\./g, '-')
  },
})

StyleDictionary.registerTransformGroup({
  name: 'canon/css',
  transforms: ['canon/css-variable-name'],
})

// ── 메인 빌드 ─────────────────────────────────────────────────────────────
const sd = new StyleDictionary({
  source: [path.join(ROOT, 'tokens/**/*.json')],
  platforms: {
    css: {
      transformGroup: 'canon/css',
      buildPath: path.join(ROOT, 'dist/css/'),
      files: [
        {
          destination: 'variables.css',
          format: 'canon/css-variables',
        },
      ],
    },
    tailwind: {
      transformGroup: 'canon/css',
      buildPath: path.join(ROOT, 'dist/tailwind/'),
      files: [
        {
          destination: 'preset.js',
          format: 'canon/tailwind-preset',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: path.join(ROOT, 'dist/js/'),
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm',
        },
      ],
    },
  },
})

await sd.buildAllPlatforms()
console.log('\n✓ Canon tokens built successfully')
