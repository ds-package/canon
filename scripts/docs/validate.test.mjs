import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { validateDocs } from './validate.mjs'

const REQUIRED_DESIGN = [
  '컬러 토큰의 이름을 정한다 [Color](./docs/color.md)',
  'Figma 변수, 스타일, 컴포넌트를 안전하게 변경한다 [Workflow](./docs/workflow.md)',
  'interaction foundation을 확인한다 [Interaction](./docs/decisions/interaction-foundation.md)',
  'docs web, search, playground의 구조를 정한다 [Docs platform](./docs/decisions/docs-platform.md)',
  '제품 상황에 맞는 컴포넌트를 고른다 [Selection](./docs/guides/README.md)',
  '문서화되지 않은 질문은 추정하지 않고 미확인으로 남긴다.',
].join('\n')

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'canon-docs-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'docs/decisions'), { recursive: true })
  await mkdir(path.join(root, 'docs/guides'), { recursive: true })
  await writeFile(path.join(root, 'docs/color.md'), '# Color\n')
  await writeFile(path.join(root, 'docs/workflow.md'), '# Workflow\n')
  await writeFile(path.join(root, 'docs/guides/README.md'), '# Guides\n')
  await writeFile(
    path.join(root, 'docs/decisions/interaction-foundation.md'),
    '---\nid: interaction-foundation\nstatus: adopted\nverified: 2026-11-01\n---\n# Interaction\n',
  )
  await writeFile(
    path.join(root, 'docs/decisions/docs-platform.md'),
    '---\nid: docs-platform\nstatus: adopted\nverified: 2026-11-01\n---\n# Docs platform\n',
  )
  return root
}

test('accepts reachable routes and adopted decision metadata', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), `${REQUIRED_DESIGN}\n[Docs](./docs/README.md)`)
  await writeFile(path.join(root, 'docs/README.md'), '[Design route](../DESIGN.md)')
  await writeFile(
    path.join(root, 'docs/decisions/interaction.md'),
    '---\nid: other-interaction\nstatus: adopted\nverified: 2026-11-01\n---\n# Interaction foundation\n',
  )

  assert.deepEqual(await validateDocs(root), [])
})

test('reports broken routes, missing metadata, and duplicate decision ids', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), `${REQUIRED_DESIGN}\n[Missing](./docs/missing.md)`)
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
    `${REQUIRED_DESIGN}\n[Parent](../${path.basename(outside)})\n[Absolute](<${outside}>)`,
  )
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')

  assert.deepEqual(await validateDocs(root), [
    `DESIGN.md: local link escapes repository ../${path.basename(outside)}`,
    `DESIGN.md: local link escapes repository ${outside}`,
  ])
})

test('rejects invalid decision dates', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), REQUIRED_DESIGN)
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')
  await writeFile(
    path.join(root, 'docs/decisions/interaction.md'),
    '---\nid: invalid-date\nstatus: adopted\nverified: 2026/11/01\n---\n# Interaction\n',
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

test('requires the six Canon design routing seams', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), '# Design\n')
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')

  assert.deepEqual(await validateDocs(root), [
    'DESIGN.md: missing token naming route ./docs/color.md',
    'DESIGN.md: missing Figma migration route ./docs/workflow.md',
    'DESIGN.md: missing interaction decision route ./docs/decisions/interaction-foundation.md',
    'DESIGN.md: missing docs platform decision route ./docs/decisions/docs-platform.md',
    'DESIGN.md: missing component selection route ./docs/guides/README.md',
    'DESIGN.md: missing unconfirmed-question fallback',
  ])
})

test('requires each design question and target on the same line', async (t) => {
  const root = await fixture(t)
  await writeFile(
    path.join(root, 'DESIGN.md'),
    [
      '| 컬러 토큰의 이름, 값, 계층, 바인딩을 정한다 | [Workflow](./docs/workflow.md) |',
      '| Figma 변수, 스타일, 컴포넌트를 안전하게 변경한다 | [Color](./docs/color.md) |',
      '| interaction foundation을 확인한다 | [Interaction](./docs/decisions/interaction-foundation.md) |',
      '| docs web, search, playground의 구조를 정한다 | [Docs platform](./docs/decisions/docs-platform.md) |',
      '| 제품 상황에 맞는 컴포넌트를 고른다 | [Selection](./docs/guides/README.md) |',
      '문서화되지 않은 질문은 추정하지 않고 미확인으로 남긴다.',
    ].join('\n'),
  )
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')

  assert.deepEqual(await validateDocs(root), [
    'DESIGN.md: missing token naming route ./docs/color.md',
    'DESIGN.md: missing Figma migration route ./docs/workflow.md',
  ])
})

test('rejects authored prose inside the docs app and ignores generated directories', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), REQUIRED_DESIGN)
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')
  await mkdir(path.join(root, 'apps/docs/content'), { recursive: true })
  await mkdir(path.join(root, 'apps/docs/node_modules/package'), { recursive: true })
  await mkdir(path.join(root, 'apps/docs/.next'), { recursive: true })
  await mkdir(path.join(root, 'apps/docs/out'), { recursive: true })
  await writeFile(path.join(root, 'apps/docs/content/overview.md'), '# Overview\n')
  await writeFile(path.join(root, 'apps/docs/content/dialog.mdx'), '# Dialog\n')
  await writeFile(path.join(root, 'apps/docs/node_modules/package/README.md'), '# Package\n')
  await writeFile(path.join(root, 'apps/docs/.next/generated.md'), '# Generated\n')
  await writeFile(path.join(root, 'apps/docs/out/exported.mdx'), '# Exported\n')

  assert.deepEqual(await validateDocs(root), [
    'apps/docs/content/dialog.mdx: authored docs prose must live outside apps/docs',
    'apps/docs/content/overview.md: authored docs prose must live outside apps/docs',
  ])
})
