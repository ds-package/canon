import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { parseDocument, readDocuments, sourceToRoute, toWebHref } from './docs.mjs'
import { getNavigationMode, getNavigationSections, groupNavigationDocuments } from './navigation.mjs'
import { searchDocuments } from './search.mjs'
import { getButtonPlaygroundModel, initialButtonPlaygroundState } from './button-playground.mjs'

test('builds focused documentation and component navigation from authored metadata', () => {
  const documents = [
    { route: '/', title: 'Canon' },
    { route: '/docs/button', title: 'Button', navigation: 'component' },
    { route: '/docs/color', title: 'Color', navigation: 'foundation', navigationOrder: 1 },
    { route: '/docs/components', title: 'Components', navigation: 'component' },
    { route: '/docs', title: 'Docs', navigation: 'getting-started', navigationOrder: 1 },
    { route: '/docs/decisions/platform', title: 'Platform', navigation: 'architecture', navigationOrder: 1 },
    { route: '/docs/text-field', title: 'TextField', navigation: 'component' },
  ]

  assert.deepEqual(groupNavigationDocuments(documents), {
    components: [documents[3], documents[1], documents[6]],
    sections: [
      { key: 'getting-started', title: 'Getting started', documents: [documents[4]] },
      { key: 'foundation', title: 'Foundations', documents: [documents[2]] },
      { key: 'architecture', title: 'Architecture', documents: [documents[5]] },
    ],
  })

  const navigation = groupNavigationDocuments(documents)
  assert.equal(getNavigationMode(navigation, '/docs/button/'), 'components')
  assert.equal(getNavigationMode(navigation, '/docs/color'), 'docs')
  assert.equal(getNavigationMode(navigation, '/'), 'home')
  assert.deepEqual(getNavigationSections(navigation, '/docs/button/'), [
    { key: 'components', title: 'Components', documents: navigation.components },
  ])
  assert.deepEqual(getNavigationSections(navigation, '/docs/color'), navigation.sections)
  assert.deepEqual(getNavigationSections(navigation, '/'), navigation.sections)
})

test('component navigation metadata covers the complete authored component corpus', async () => {
  const componentRoutes = (await readDocuments())
    .filter((document) => document.navigation === 'component')
    .map((document) => document.route)

  assert.deepEqual(componentRoutes, [
    '/docs/components/button',
    '/docs/components/icon-button',
    '/docs/components',
  ])
})

test('authored navigation metadata covers the complete left navigation corpus', async () => {
  const navigation = groupNavigationDocuments(await readDocuments())

  assert.deepEqual(
    navigation.sections.map((section) => ({
      key: section.key,
      routes: section.documents.map((document) => document.route),
    })),
    [
      { key: 'getting-started', routes: ['/docs', '/docs/guides'] },
      { key: 'foundation', routes: ['/docs/foundations/color', '/docs/foundations/typography', '/docs/foundations/icons', '/docs/foundations/properties'] },
      {
        key: 'architecture',
        routes: ['/docs/decisions/docs-platform', '/docs/decisions/interaction-foundation', '/docs/decisions/mobile-foundation', '/docs/decisions/action-style'],
      },
    ],
  )
})

test('maps authored source paths and relative Markdown links to stable web routes', () => {
  assert.equal(sourceToRoute('DESIGN.md'), '/')
  assert.equal(sourceToRoute('docs/README.md'), '/docs')
  assert.equal(sourceToRoute('docs/guides/README.md'), '/docs/guides')
  assert.equal(sourceToRoute('docs/color.md'), '/docs/color')
  assert.equal(toWebHref('./typography.md#roles', 'docs/color.md'), '/docs/typography#roles')
  assert.equal(toWebHref('../DESIGN.md', 'docs/README.md'), '/')
  assert.equal(toWebHref('./maintainers/figma-workflow.md#1-environment', 'docs/README.md'), 'https://github.com/ds-package/canon/blob/main/docs/maintainers/figma-workflow.md#1-environment')
  assert.equal(toWebHref('./tools/ramps.py', 'docs/color.md'), 'https://github.com/ds-package/canon/blob/main/docs/tools/ramps.py')
  assert.equal(toWebHref('./tools/figma-plugins/type-styles', 'docs/typography.md'), 'https://github.com/ds-package/canon/tree/main/docs/tools/figma-plugins/type-styles')
  assert.equal(toWebHref('https://react-aria.adobe.com/', 'docs/README.md'), 'https://react-aria.adobe.com/')
})

test('Button playground preview settings and copied JSX share the Canon public interface', () => {
  const model = getButtonPlaygroundModel(initialButtonPlaygroundState)
  assert.deepEqual(model.componentProps, {
    variant: 'secondary',
    size: 'lg',
    disabled: false,
    pending: false,
  })
  assert.equal(model.component, 'Button')
  assert.match(model.jsx, /<Button variant="secondary" size="lg">Save changes<\/Button>/)
  assert.doesNotMatch(model.jsx, /react-aria-components|className=|style=/)

  const icon = getButtonPlaygroundModel({
    ...initialButtonPlaygroundState,
    component: 'icon',
    variant: 'quiet',
    size: 'xl',
    disabled: true,
    pending: true,
    shape: 'round',
    dark: true,
  })
  assert.equal(icon.component, 'IconButton')
  assert.deepEqual(icon.componentProps, {
    variant: 'quiet',
    size: 'xl',
    disabled: true,
    pending: true,
    shape: 'round',
    'aria-label': 'Close',
  })
  assert.match(icon.jsx, /<IconButton/)
  assert.equal(getButtonPlaygroundModel({ ...initialButtonPlaygroundState, component: 'icon', variant: 'destructive' }).componentProps.variant, 'secondary')
  assert.match(icon.jsx, /icon=\{<XIcon \/>\}/)
  assert.match(icon.jsx, /size="xl"/)
  assert.match(icon.jsx, /aria-label="Close"/)
  assert.match(icon.jsx, /disabled/)
  assert.match(icon.jsx, /pending/)
  assert.equal(icon.theme, 'dark')
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
  assert.equal(searchDocuments(documents, 'React Aria Components responsibility boundaries')[0]?.route, '/docs/decisions/interaction-foundation')
})

test('excludes maintainer Markdown from routes, navigation, and search', async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), 'canon-private-docs-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  await mkdir(path.join(root, 'docs/maintainers/components'), { recursive: true })
  await writeFile(path.join(root, 'DESIGN.md'), '# Canon\n')
  await writeFile(path.join(root, 'docs/README.md'), '---\nnavigation: getting-started\n---\n# 시작\n')
  await writeFile(
    path.join(root, 'docs/maintainers/components/README.md'),
    '---\nnavigation: component\n---\n# 내부 컴포넌트 제작 규칙\n\n세트 정렬 내부 우선순위입니다.\n',
  )

  const documents = await readDocuments(root)
  assert.deepEqual(documents.map((document) => document.route), ['/', '/docs'])
  assert.deepEqual(groupNavigationDocuments(documents).components, [])
  assert.deepEqual(searchDocuments(documents, '세트 정렬 내부 우선순위'), [])
})
