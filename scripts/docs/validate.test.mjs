import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { validateDocs } from './validate.mjs'

const REQUIRED_DESIGN = [
  '컬러 토큰의 이름을 정한다 [Color](./docs/foundations/color.md)',
  'Figma 변수, 스타일, 컴포넌트를 안전하게 변경한다 [Workflow](./docs/maintainers/figma-workflow.md)',
  'React props, runtime 상태, Figma property의 책임과 이름을 정한다 [Properties](./docs/foundations/properties.md)',
  'interaction foundation을 확인한다 [Interaction](./docs/decisions/interaction-foundation.md)',
  'docs web, search, playground의 구조를 정한다 [Docs platform](./docs/decisions/docs-platform.md)',
  '제품 상황에 맞는 컴포넌트를 고른다 [Selection](./docs/guides/README.md)',
  '문서화되지 않은 질문은 추정하지 않고 미확인으로 남긴다.',
].join('\n')

const CONTRACT = [
  '## Shared contract\n',
  '| 이름 | 뜻과 값 | 사용하지 않는 조건 |',
  '| --- | --- | --- |',
  '| `label` | `ghostProp` 타입, 기본 `md` | `isOpen`을 만들지 않는다. |\n',
  '| 상태 | Controlled |',
  '| --- | --- |',
  '| 선택 여부 | `checked` |\n',
  '| 후보 | 결정 조건 |',
  '| --- | --- |',
  '| `status` | 구현될 때 정한다. |\n',
  '| 표시 이름 | 이름 |',
  '| --- | --- |',
  '| `wide` \\| `x` | `extra` |\n',
  '`onClick`은 노출하지 않는다.\n',
  '## Platform translations\n',
  '### React\n',
  '| 이름 | 지원 범위 |',
  '| --- | --- |',
  '| `value` | Field, `isOpen` 아님 |\n',
  '#### 초기값\n',
  '| 이름 | 짝 |',
  '| --- | --- |',
  '| `hint`, `note` | `value` |\n',
  '### iOS와 Android\n',
  '| 이름 | Compose |',
  '| --- | --- |',
  '| `onClick` | action |\n\n',
].join('\n')

const FIELD_JSDOC = '/**\n * 필드다.\n *\n * <!-- canon:selection source=docs/components/field.md -->\n * ### 언제 쓰나\n * - 값을 입력할 때 쓴다.\n *\n * ### 쓰지 않는 경우\n * - 목록에서 고르면 Select를 쓴다.\n * <!-- /canon:selection -->\n */\n'

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'canon-docs-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'docs/decisions'), { recursive: true })
  await mkdir(path.join(root, 'docs/guides'), { recursive: true })
  await mkdir(path.join(root, 'docs/foundations'), { recursive: true })
  await mkdir(path.join(root, 'docs/components'), { recursive: true })
  await mkdir(path.join(root, 'docs/maintainers'), { recursive: true })
  await writeFile(path.join(root, 'docs/foundations/color.md'), '# Color\n')
  await writeFile(path.join(root, 'docs/maintainers/figma-workflow.md'), '# Workflow\n')
  await writeFile(path.join(root, 'docs/components/README.md'), '# Components\n')
  await writeFile(path.join(root, 'docs/foundations/properties.md'), '# Properties\n')
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

test('requires runtime status docs to acknowledge the public React package', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), REQUIRED_DESIGN)
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n현재 runtime 컴포넌트 패키지는 없다.\n')
  await writeFile(path.join(root, 'docs/guides/README.md'), '# Guides\n현재 선택 가이드는 없다.\n')
  await mkdir(path.join(root, 'packages/react'), { recursive: true })
  await writeFile(path.join(root, 'packages/react/package.json'), '{"name":"@canon/react"}\n')

  assert.deepEqual(await validateDocs(root), [
    'docs/README.md: missing @canon/react runtime status',
    'docs/guides/README.md: missing @canon/react runtime status',
    'docs/guides/README.md: missing Button runtime status',
    'docs/guides/README.md: missing IconButton runtime status',
    'docs/guides/README.md: missing Checkbox runtime status',
    'docs/guides/README.md: missing Dialog runtime status',
    'docs/guides/README.md: missing NumberField runtime status',
    'docs/guides/README.md: missing RadioGroup runtime status',
    'docs/guides/README.md: missing Select runtime status',
    'docs/guides/README.md: missing Switch runtime status',
    'docs/guides/README.md: missing TextField runtime status',
    'docs/guides/README.md: missing TextArea runtime status',
    'docs/decisions/interaction-foundation.md: missing @canon/react runtime status',
    'docs/decisions/interaction-foundation.md: missing Button runtime status',
    'docs/decisions/interaction-foundation.md: missing IconButton runtime status',
    'docs/decisions/interaction-foundation.md: missing Checkbox runtime status',
    'docs/decisions/interaction-foundation.md: missing Dialog runtime status',
    'docs/decisions/interaction-foundation.md: missing NumberField runtime status',
    'docs/decisions/interaction-foundation.md: missing RadioGroup runtime status',
    'docs/decisions/interaction-foundation.md: missing Select runtime status',
    'docs/decisions/interaction-foundation.md: missing Switch runtime status',
    'docs/decisions/interaction-foundation.md: missing TextField runtime status',
    'docs/decisions/interaction-foundation.md: missing TextArea runtime status',
  ])
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
    'DESIGN.md: missing token naming route ./docs/foundations/color.md',
    'DESIGN.md: missing Figma migration route ./docs/maintainers/figma-workflow.md',
    'DESIGN.md: missing component property model route ./docs/foundations/properties.md',
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
      '| 컬러 토큰의 이름, 값, 계층, 바인딩을 정한다 | [Workflow](./docs/maintainers/figma-workflow.md) |',
      '| Figma 변수, 스타일, 컴포넌트를 안전하게 변경한다 | [Color](./docs/foundations/color.md) |',
      '| React props, runtime 상태, Figma property의 책임과 이름을 정한다 | [Properties](./docs/foundations/properties.md) |',
      '| interaction foundation을 확인한다 | [Interaction](./docs/decisions/interaction-foundation.md) |',
      '| docs web, search, playground의 구조를 정한다 | [Docs platform](./docs/decisions/docs-platform.md) |',
      '| 제품 상황에 맞는 컴포넌트를 고른다 | [Selection](./docs/guides/README.md) |',
      '문서화되지 않은 질문은 추정하지 않고 미확인으로 남긴다.',
    ].join('\n'),
  )
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')

  assert.deepEqual(await validateDocs(root), [
    'DESIGN.md: missing token naming route ./docs/foundations/color.md',
    'DESIGN.md: missing Figma migration route ./docs/maintainers/figma-workflow.md',
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

test('keeps documented property coverage aligned with public TypeScript props', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), REQUIRED_DESIGN)
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')
  await mkdir(path.join(root, 'packages/react/src'), { recursive: true })
  await writeFile(path.join(root, 'packages/react/src/index.ts'), "export { Field } from './Field'\nexport type { FieldProps } from './Field'\n")
  await writeFile(
    path.join(root, 'packages/react/src/Field.tsx'),
    'export interface FieldProps { label: string; value?: string }\n' + FIELD_JSDOC + 'export function Field(_props: FieldProps) { return null }\n',
  )
  await writeFile(path.join(root, 'docs/foundations/properties.md'), CONTRACT)
  await writeFile(
    path.join(root, 'docs/components/README.md'),
    `## Implementation coverage matrix\n\n| Component | Public type | Public props |\n| --- | --- | --- |\n| [Field](./field.md) | \`FieldProps\` | \`label\`, \`state\` |\n| Link | - | - |\n`,
  )

  assert.deepEqual(await validateDocs(root), [
    'docs/components/README.md: FieldProps property coverage mismatch (missing: value; undocumented: state)',
  ])
})

test('requires every public component export in the coverage matrix', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), REQUIRED_DESIGN)
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')
  await mkdir(path.join(root, 'packages/react/src'), { recursive: true })
  await writeFile(path.join(root, 'packages/react/src/index.ts'), "export { Field } from './Field'\nexport type { FieldProps } from './Field'\n")
  await writeFile(
    path.join(root, 'packages/react/src/Field.tsx'),
    'export interface FieldProps { label: string }\n' + FIELD_JSDOC + 'export function Field(_props: FieldProps) { return null }\n',
  )
  await writeFile(path.join(root, 'docs/foundations/properties.md'), CONTRACT)
  await writeFile(
    path.join(root, 'docs/components/README.md'),
    `## Implementation coverage matrix\n\n| Component | Public type | Public props |\n| --- | --- | --- |\n| Other | \`FieldProps\` | \`label\` |\n`,
  )

  assert.deepEqual(await validateDocs(root), [
    'docs/components/README.md: missing public component Field coverage',
    'docs/components/README.md: Other is not a public @canon/react component export',
  ])
})

test('accepts props only from the 이름 column of common contract and React translation tables', async (t) => {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), REQUIRED_DESIGN)
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')
  await mkdir(path.join(root, 'packages/react/src'), { recursive: true })
  await writeFile(path.join(root, 'packages/react/src/index.ts'), "export { Field } from './Field'\nexport type { FieldProps } from './Field'\n")
  await writeFile(
    path.join(root, 'packages/react/src/Field.tsx'),
    'export interface FieldProps { label: string; checked?: boolean; ghostProp?: string; isOpen?: boolean; md?: boolean; onClick?: () => void; status?: string; hint?: string; note?: string; wide?: string; extra?: string }\n' + FIELD_JSDOC + 'export function Field(_props: FieldProps) { return null }\n',
  )
  const matrix = '## Implementation coverage matrix\n\n| Component | Public type | Public props |\n| --- | --- | --- |\n| [Field](./field.md) | `FieldProps` | `label`, `checked`, `ghostProp`, `isOpen`, `md`, `onClick`, `status`, `hint`, `note`, `wide`, `extra` |\n'

  const rejected = [
    'docs/foundations/properties.md: FieldProps.checked has no Shared contract or React translation entry',
    'docs/foundations/properties.md: FieldProps.ghostProp has no Shared contract or React translation entry',
    'docs/foundations/properties.md: FieldProps.isOpen has no Shared contract or React translation entry',
    'docs/foundations/properties.md: FieldProps.md has no Shared contract or React translation entry',
    'docs/foundations/properties.md: FieldProps.onClick has no Shared contract or React translation entry',
    'docs/foundations/properties.md: FieldProps.status has no Shared contract or React translation entry',
    'docs/foundations/properties.md: FieldProps.wide has no Shared contract or React translation entry',
  ]
  await writeFile(path.join(root, 'docs/components/README.md'), matrix)
  await writeFile(path.join(root, 'docs/foundations/properties.md'), CONTRACT)
  assert.deepEqual(await validateDocs(root), rejected)

  await writeFile(path.join(root, 'docs/foundations/properties.md'), CONTRACT.replace(/\n/g, '\r\n'))
  assert.deepEqual(await validateDocs(root), rejected)

  for (const source of ['', CONTRACT.replace('### React\n', '### React 번역\n')]) {
    await writeFile(path.join(root, 'docs/foundations/properties.md'), source)
    assert.deepEqual(await validateDocs(root), [
      'docs/foundations/properties.md: missing Shared contract or Platform translations React section',
    ])
  }

  await writeFile(
    path.join(root, 'docs/foundations/properties.md'),
    `## Shared contract\n\n| 상태 | 값 |\n| --- | --- |\n| 선택 여부 | \`label\` |\n\n## Platform translations\n\n### React\n\n`,
  )
  assert.deepEqual(await validateDocs(root), [
    'docs/foundations/properties.md: Shared contract and React translation tables name no props in an 이름 column',
  ])
})

async function componentFixture(t, components, documented = []) {
  const root = await fixture(t)
  await writeFile(path.join(root, 'DESIGN.md'), REQUIRED_DESIGN)
  await writeFile(path.join(root, 'docs/README.md'), '# Docs\n')
  await mkdir(path.join(root, 'packages/react/src'), { recursive: true })
  const names = Object.keys(components)
  await writeFile(path.join(root, 'packages/react/src/index.ts'), `export { ${names.join(', ')} } from './Field'\n`)
  await writeFile(
    path.join(root, 'packages/react/src/Field.tsx'),
    Object.entries(components).map(([name, doc]) => `${doc}export function ${name}() { return null }\n`).join(''),
  )
  for (const doc of documented) await writeFile(path.join(root, `docs/components/${doc}.md`), `# ${doc}\n`)
  const rows = names.map((name) => `| ${name} | 내부 타입 | \`children\` |`).join('\n')
  await writeFile(
    path.join(root, 'docs/components/README.md'),
    `## Implementation coverage matrix\n\n| Component | Public type | Public props |\n| --- | --- | --- |\n${rows}\n`,
  )
  await writeFile(path.join(root, 'docs/foundations/properties.md'), CONTRACT)
  return root
}

test('requires the selection region only for components that have a doc', async (t) => {
  const root = await componentFixture(
    t,
    { Field: FIELD_JSDOC, SelectItem: '/**\n * 선택지 하나다.\n */\n' },
    ['field'],
  )

  assert.deepEqual(await validateDocs(root), [])
})

test('requires the selection region in the JSDoc of documented public components', async (t) => {
  const root = await componentFixture(
    t,
    {
      Field: '/**\n * 필드다.\n *\n * ### 언제 쓰나\n * - 값을 입력할 때 쓴다.\n */\n',
      IconField: '/**\n * 필드다.\n *\n * <!-- canon:selection source=docs/components/icon-field.md -->\n * ### 언제 쓰나\n * - 값을 입력할 때 쓴다.\n */\n',
      Other: '',
      SelectItem: '',
    },
    ['field', 'icon-field'],
  )

  const missing = (doc) => `JSDoc is missing the <!-- canon:selection source=docs/components/${doc}.md --> selection region`
  assert.deepEqual(await validateDocs(root), [
    `packages/react/src/index.ts: public component Field ${missing('field')}`,
    `packages/react/src/index.ts: public component IconField ${missing('icon-field')}`,
    'packages/react/src/index.ts: public component Other has no JSDoc',
    'packages/react/src/index.ts: public component SelectItem has no JSDoc',
  ])
})
