import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { validateDocs } from './validate.mjs'

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'canon-docs-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'docs/decisions'), { recursive: true })
  return root
}

test('accepts reachable routes and adopted decision metadata', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), '[Docs](./docs/README.md)\n[Decision](./docs/decisions/interaction.md)')
  await writeFile(path.join(root, 'docs/README.md'), '[Design route](../DESIGN.md)')
  await writeFile(
    path.join(root, 'docs/decisions/interaction.md'),
    '---\nid: interaction-foundation\nstatus: adopted\nverified: 2026-11-01\n---\n# Interaction foundation\n',
  )

  assert.deepEqual(await validateDocs(root), [])
})

test('reports broken routes, missing metadata, and duplicate decision ids', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), '[Missing](./docs/missing.md)')
  await writeFile(path.join(root, 'docs/README.md'), '[External](https://example.com)')
  await writeFile(
    path.join(root, 'docs/decisions/first.md'),
    '---\nid: shared-id\nstatus: adopted\n---\nSensitive document body must not appear in errors.\n',
  )
  await writeFile(
    path.join(root, 'docs/decisions/second.md'),
    '---\nid: shared-id\nstatus: unknown\nverified: 2026-11-01\n---\n# Second\n',
  )

  const errors = await validateDocs(root)
  assert.deepEqual(errors, [
    'DESIGN.md: missing local link ./docs/missing.md',
    'docs/decisions/first.md: missing frontmatter field verified',
    'docs/decisions/second.md: unsupported status unknown',
    'docs/decisions/second.md: duplicate decision id shared-id (first: docs/decisions/first.md)',
  ])
  assert.doesNotMatch(errors.join('\n'), /Sensitive document body/)
})

test('rejects local links outside the repository even when targets exist', async (t) => {
  const root = await fixture(t)
  const outside = path.join(path.dirname(root), `${path.basename(root)}-outside.md`)
  t.after(() => rm(outside, { force: true }))
  await writeFile(outside, '# Outside\n')
  await writeFile(
    path.join(root, 'DESIGN.md'),
    `[Parent](../${path.basename(outside)})\n[Absolute](<${outside}>)`,
  )
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')

  assert.deepEqual(await validateDocs(root), [
    `DESIGN.md: local link escapes repository ../${path.basename(outside)}`,
    `DESIGN.md: local link escapes repository ${outside}`,
  ])
})

test('rejects invalid decision dates', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), '# Design\n')
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')
  await writeFile(
    path.join(root, 'docs/decisions/interaction.md'),
    '---\nid: interaction-foundation\nstatus: adopted\nverified: 2026/11/01\n---\n# Interaction\n',
  )

  assert.deepEqual(await validateDocs(root), [
    'docs/decisions/interaction.md: verified must match YYYY-MM-DD',
  ])
})

test('reports missing route documents and decisions directory', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'canon-docs-missing-'))
  t.after(() => rm(root, { recursive: true, force: true }))

  assert.deepEqual(await validateDocs(root), [
    'DESIGN.md: missing route document',
    'docs/README.md: missing route document',
    'docs/decisions: missing directory',
  ])
})
