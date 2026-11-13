import assert from 'node:assert/strict'
import { tmpdir } from 'node:os'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { buildTokens } from '@canon/tokens/build'

const tempDir = async (t) => {
  const temp = await mkdtemp(path.join(tmpdir(), 'canon-collision-'))
  t.after(() => rm(temp, { recursive: true, force: true }))
  return temp
}

test('the public builder rejects different token paths that flatten to the same CSS name', async (t) => {
  const temp = await tempDir(t)
  const source = path.join(temp, 'tokens.json')
  await writeFile(source, JSON.stringify({
    color: {
      'foo-bar': { $type: 'color', $value: '#ffffff' },
      fooBar: { $type: 'color', $value: '#000000' },
    },
  }))
  await assert.rejects(buildTokens({ source, outDir: temp }), /Duplicate CSS variable --color-foo-bar/)
})

test('the public builder rejects tokens that overwrite a Tailwind preset entry', async (t) => {
  const temp = await tempDir(t)
  const source = path.join(temp, 'tokens.json')
  await writeFile(source, JSON.stringify({
    color: { semantic: { text: { primary: { $type: 'color', $value: '#ffffff' } } } },
    semantic: { light: { text: { primary: { $type: 'color', $value: '#000000' } } } },
  }))
  await assert.rejects(buildTokens({ source, outDir: temp }), /Duplicate Tailwind token semantic.text.primary/)
})

test('the public builder keeps object-method names as own Tailwind keys without touching prototypes', async (t) => {
  const temp = await tempDir(t)
  await writeFile(path.join(temp, 'package.json'), '{"type":"module"}')
  const source = path.join(temp, 'tokens.json')
  await writeFile(source, '{"color":{"constructor":{"$type":"color","$value":"#222222"},"__proto__":{"polluted":{"$type":"color","$value":"#111111"}}}}')
  await buildTokens({ source, outDir: temp })
  const { default: preset } = await import(path.join(temp, 'tailwind/preset.js'))
  const colors = preset.theme.extend.colors
  assert.equal(Object.getPrototypeOf(colors), Object.prototype)
  assert.deepEqual(Object.keys(colors), ['constructor'])
  assert.equal(colors.constructor, 'var(--color-constructor)')
  assert.equal({}.polluted, undefined)
})
