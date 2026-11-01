import assert from 'node:assert/strict'
import test from 'node:test'

import { parseDocument, readDocuments, sourceToRoute, toWebHref } from './docs.mjs'
import { searchDocuments } from './search.mjs'
import { getDialogPlaygroundModel, initialDialogPlaygroundState } from './dialog-playground.mjs'

test('maps authored source paths and relative Markdown links to stable web routes', () => {
  assert.equal(sourceToRoute('DESIGN.md'), '/')
  assert.equal(sourceToRoute('docs/README.md'), '/docs')
  assert.equal(sourceToRoute('docs/guides/README.md'), '/docs/guides')
  assert.equal(sourceToRoute('docs/color.md'), '/docs/color')
  assert.equal(toWebHref('./typography.md#roles', 'docs/color.md'), '/docs/typography#roles')
  assert.equal(toWebHref('../DESIGN.md', 'docs/README.md'), '/')
  assert.equal(toWebHref('./tools/ramps.py', 'docs/color.md'), 'https://github.com/ds-package/canon/blob/main/docs/tools/ramps.py')
  assert.equal(toWebHref('./tools/figma-plugins/type-styles', 'docs/typography.md'), 'https://github.com/ds-package/canon/tree/main/docs/tools/figma-plugins/type-styles')
  assert.equal(toWebHref('https://react-aria.adobe.com/', 'docs/README.md'), 'https://react-aria.adobe.com/')
})

test('Dialog playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getDialogPlaygroundModel(initialDialogPlaygroundState)
  assert.deepEqual(model.dialogProps, { dismissable: true })
  assert.match(model.jsx, /<Dialog dismissable>/)
  assert.match(model.jsx, /<DialogClose aria-label="Close dialog" \/>/)
  assert.match(model.jsx, /<DialogDescription>/)
  assert.match(model.jsx, /<DialogFooter>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|ModalOverlay|slot=/)

  const reset = getDialogPlaygroundModel({
    dismissable: false,
    showCloseButton: false,
    showFooter: false,
  })
  assert.deepEqual(reset.dialogProps, { dismissable: false })
  assert.doesNotMatch(reset.jsx, /dismissable|DialogClose|DialogFooter/)
})

test('extracts the document index fields without creating another prose source', () => {
  const document = parseDocument('docs/example.md', '---\nverified: 2026-11-01\n---\n# Example\n\n## Details\n\nUse **tokens**.')
  assert.deepEqual(document.headings, ['Example', 'Details'])
  assert.equal(document.title, 'Example')
  assert.equal(document.body, 'Example Details Use tokens.')
})

test('indexes every Canon source and ranks title, headings, then body matches', async () => {
  const documents = await readDocuments()
  assert.ok(documents.some((document) => document.route === '/'))
  assert.ok(documents.some((document) => document.route === '/docs'))

  const fixtures = [
    { title: 'Body match', headings: [], body: 'React Aria를 사용한다.', route: '/body' },
    { title: 'Heading match', headings: ['React Aria'], body: '', route: '/heading' },
    { title: 'React Aria', headings: [], body: '', route: '/title' },
  ]
  assert.deepEqual(searchDocuments(fixtures, 'React Aria').map(({ route }) => route), ['/title', '/heading', '/body'])
  assert.equal(searchDocuments(documents, 'React Aria Components 책임 경계')[0]?.route, '/docs/decisions/interaction-foundation')
  assert.equal(searchDocuments(documents, 'keyboardDismissDisabled')[0]?.route, '/docs/dialog')
})
