import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { syncComments } from './sync-comments.mjs'

const SCRIPT = fileURLToPath(new URL('./sync-comments.mjs', import.meta.url))

const FIELD_DOC = [
  '# Field',
  '',
  '## 기본 사용',
  '',
  '본문이다.',
  '',
  '## 선택',
  '',
  '### 언제 쓰나',
  '',
  '- 한 줄을 입력할 때 쓴다.',
  '',
  '### 쓰지 않는 경우',
  '',
  '- 목록에서 고르면 [Picker](./picker.md)를 쓴다.',
  '- 다른 위치로 이동하면 Link를 쓴다(Canon에 아직 없다).',
  '',
  '## 접근성',
  '',
  '- 목록이 아니다.',
  '',
].join('\n')

const FIELD_SOURCE = [
  '/**',
  ' * 필드다.',
  ' *',
  ' * <!-- canon:selection source=docs/components/field.md -->',
  ' * <!-- /canon:selection -->',
  ' *',
  ' * ### 제약',
  ' * - 손으로 쓴다.',
  ' */',
  'export function Field() { return null }',
  '',
].join('\n')

const FIELD_GENERATED = [
  '/**',
  ' * 필드다.',
  ' *',
  ' * <!-- canon:selection source=docs/components/field.md -->',
  ' * ### 언제 쓰나',
  ' * - 한 줄을 입력할 때 쓴다.',
  ' *',
  ' * ### 쓰지 않는 경우',
  ' * - 목록에서 고르면 {@link Picker}를 쓴다.',
  ' * - 다른 위치로 이동하면 Link를 쓴다(Canon에 아직 없다).',
  ' * <!-- /canon:selection -->',
  ' *',
  ' * ### 제약',
  ' * - 손으로 쓴다.',
  ' */',
  'export function Field() { return null }',
  '',
].join('\n')

// 링크 label을 대조할 공개 export다. fixture가 `index.ts`를 직접 주면 그것을 쓴다.
const INDEX = "export { Field, Picker, Action, IconAction, Empty, Gone, Unclosed, Plain } from './Field'\nexport type { FieldProps } from './Field'\n"

async function fixture(t, files) {
  const root = await mkdtemp(path.join(tmpdir(), 'canon-sync-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'docs/components'), { recursive: true })
  await mkdir(path.join(root, 'packages/react/src'), { recursive: true })
  for (const [file, content] of Object.entries({ 'packages/react/src/index.ts': INDEX, ...files })) await writeFile(path.join(root, file), content)
  return root
}

const read = (root, file) => readFile(path.join(root, file), 'utf8')

test('generates the selection region from the doc and converts component links', async (t) => {
  const root = await fixture(t, {
    'docs/components/field.md': FIELD_DOC,
    'packages/react/src/Field.tsx': FIELD_SOURCE,
    'packages/react/src/Field.test.tsx': FIELD_SOURCE,
  })

  assert.deepEqual(await syncComments(root), {
    errors: [],
    stale: ['packages/react/src/Field.tsx: Field selection comment differs from docs/components/field.md'],
  })
  assert.equal(await read(root, 'packages/react/src/Field.tsx'), FIELD_GENERATED)
  assert.equal(await read(root, 'packages/react/src/Field.test.tsx'), FIELD_SOURCE)
  assert.deepEqual(await syncComments(root, { check: true }), { errors: [], stale: [] })
})

test('check mode reports stale regions without writing and exits 1', async (t) => {
  const root = await fixture(t, {
    'docs/components/field.md': FIELD_DOC,
    'packages/react/src/Field.tsx': FIELD_GENERATED,
  })
  const run = (args) => promisify(execFile)(process.execPath, [SCRIPT, ...args], { cwd: root })

  assert.match((await run(['--check'])).stdout, /Selection comments are up to date/)

  await writeFile(path.join(root, 'docs/components/field.md'), FIELD_DOC.replace('한 줄을 입력할 때', '한 줄 텍스트를 입력할 때'))
  await assert.rejects(run(['--check']), (error) => {
    assert.equal(error.code, 1)
    assert.match(error.stderr, /packages\/react\/src\/Field\.tsx: Field selection comment differs from docs\/components\/field\.md/)
    return true
  })
  assert.equal(await read(root, 'packages/react/src/Field.tsx'), FIELD_GENERATED)

  await run([])
  assert.match(await read(root, 'packages/react/src/Field.tsx'), / \* - 한 줄 텍스트를 입력할 때 쓴다\./)
})

test('reads the doc of each component when one file declares two components', async (t) => {
  const doc = (name, when, link) =>
    [`# ${name}`, '', '## 선택', '', '공통 설명은 생성하지 않는다.', '', '### 언제 쓰나', '', `- ${when}`, '', '### 쓰지 않는 경우', '', `- ${link}`, ''].join('\n')
  const region = (name, source) =>
    `/**\n * ${name}다.\n *\n * <!-- canon:selection source=${source} -->\n * <!-- /canon:selection -->\n */\nexport function ${name}() { return null }\n`
  const root = await fixture(t, {
    'docs/components/action.md': doc('Action', '동작을 실행한다.', '아이콘만 보이면 [IconAction](./icon-action.md)을 쓴다.'),
    'docs/components/icon-action.md': doc('IconAction', '아이콘만 보인다.', '이름이 보여야 하면 [Action](./action.md)을 쓴다.'),
    'packages/react/src/Action.tsx':
      region('Action', 'docs/components/action.md') + region('IconAction', 'docs/components/icon-action.md'),
  })

  assert.deepEqual((await syncComments(root)).errors, [])
  const source = await read(root, 'packages/react/src/Action.tsx')
  assert.match(source, / \* ### 언제 쓰나\n \* - 동작을 실행한다\.\n \*\n \* ### 쓰지 않는 경우\n \* - 아이콘만 보이면 \{@link IconAction\}을 쓴다\./)
  assert.match(source, / \* ### 언제 쓰나\n \* - 아이콘만 보인다\.\n \*\n \* ### 쓰지 않는 경우\n \* - 이름이 보여야 하면 \{@link Action\}을 쓴다\./)
  assert.doesNotMatch(source, /공통 설명/)
})

test('reports missing markers, sections, and unsupported links without writing', async (t) => {
  const unclosed = FIELD_SOURCE.replace(' * <!-- /canon:selection -->\n', '')
  const root = await fixture(t, {
    'docs/components/field.md': FIELD_DOC.replace('[Picker](./picker.md)', '[목록 문서](./picker.md)').replace('Link를 쓴다', '[FieldProps](./field.md)나 [Picker](./picker.md#items)를 쓴다'),
    'docs/components/empty.md': '# Empty\n\n## 기본 사용\n',
    'packages/react/src/Field.tsx': FIELD_SOURCE,
    'packages/react/src/Unclosed.tsx': unclosed.replace('Field()', 'Unclosed()'),
    'packages/react/src/Empty.tsx': FIELD_SOURCE.replace('docs/components/field.md', 'docs/components/empty.md').replace('Field()', 'Empty()'),
    'packages/react/src/Gone.tsx': FIELD_SOURCE.replace('docs/components/field.md', 'docs/components/gone.md').replace('Field()', 'Gone()'),
    'packages/react/src/Plain.tsx': '/**\n * 표식이 없다.\n */\nexport function Plain() { return null }\n',
  })

  assert.deepEqual((await syncComments(root)).errors, [
    'docs/components/empty.md: missing ## 선택 section for Empty',
    'docs/components/field.md: Field ### 쓰지 않는 경우: link label 목록 문서 in [목록 문서](./picker.md) is not a public @canon/react export',
    'docs/components/field.md: Field ### 쓰지 않는 경우: link label FieldProps in [FieldProps](./field.md) is not a public @canon/react export',
    'docs/components/field.md: Field ### 쓰지 않는 경우: unsupported link [Picker](./picker.md#items), link only public components to their docs as [Name](./kebab-name.md)',
    'packages/react/src/Gone.tsx: Gone selection source docs/components/gone.md does not exist',
    'packages/react/src/Unclosed.tsx: Unclosed JSDoc needs exactly one <!-- canon:selection source=... --> and <!-- /canon:selection --> pair',
  ])
  assert.equal(await read(root, 'packages/react/src/Field.tsx'), FIELD_SOURCE)
})

test('rejects selection lists that are not one-line items', async (t) => {
  const root = await fixture(t, {
    'docs/components/field.md': FIELD_DOC.replace('- 한 줄을 입력할 때 쓴다.', '한 줄을 입력할 때 쓴다.'),
    'packages/react/src/Field.tsx': FIELD_SOURCE,
  })

  assert.deepEqual((await syncComments(root, { check: true })).errors, [
    'docs/components/field.md: Field ### 언제 쓰나 accepts one-line list items only: 한 줄을 입력할 때 쓴다.',
    'docs/components/field.md: Field ### 언제 쓰나 has no list items',
  ])
})

test('requires the selection source to be the doc of the component', async (t) => {
  const root = await fixture(t, {
    'docs/components/field.md': FIELD_DOC,
    'docs/components/picker.md': FIELD_DOC,
    'packages/react/src/Field.tsx': FIELD_SOURCE.replace('docs/components/field.md', 'docs/components/picker.md'),
  })

  assert.deepEqual((await syncComments(root, { check: true })).errors, [
    'packages/react/src/Field.tsx: Field selection source docs/components/picker.md must be docs/components/field.md, the doc of Field',
  ])
})

test('writes nothing and exits 1 when another file has an error, even if a stale file is valid', async (t) => {
  const root = await fixture(t, {
    'docs/components/field.md': FIELD_DOC,
    'packages/react/src/Field.tsx': FIELD_SOURCE,
    'packages/react/src/Gone.tsx': FIELD_SOURCE.replace('docs/components/field.md', 'docs/components/gone.md').replace('Field()', 'Gone()'),
  })

  assert.deepEqual(await syncComments(root), {
    errors: ['packages/react/src/Gone.tsx: Gone selection source docs/components/gone.md does not exist'],
    stale: ['packages/react/src/Field.tsx: Field selection comment differs from docs/components/field.md'],
  })
  assert.equal(await read(root, 'packages/react/src/Field.tsx'), FIELD_SOURCE)

  const run = (args) => promisify(execFile)(process.execPath, [SCRIPT, ...args], { cwd: root })
  await assert.rejects(run([]), (error) => {
    assert.equal(error.code, 1)
    assert.match(error.stderr, /Selection comment sync failed:\n- packages\/react\/src\/Gone\.tsx: Gone selection source docs\/components\/gone\.md does not exist/)
    return true
  })
  assert.equal(await read(root, 'packages/react/src/Field.tsx'), FIELD_SOURCE)
})
