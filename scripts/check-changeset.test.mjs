import assert from 'node:assert/strict'
import test from 'node:test'

import { findMissingChangesets, parseChangesetPackages } from './check-changeset.mjs'

const packages = [
  { name: '@canon/tokens', dir: 'packages/tokens' },
  { name: '@canon/react', dir: 'packages/react' },
]

test('reads the packages named in a changeset frontmatter', () => {
  assert.deepEqual(parseChangesetPackages('---\n"@canon/tokens": minor\n\'@canon/react\': patch\n---\n\nAdd a token.\n'), [
    '@canon/tokens',
    '@canon/react',
  ])
  assert.deepEqual(parseChangesetPackages('# Changesets\n'), [])
  assert.deepEqual(parseChangesetPackages('---\n---\n\nEmpty changeset.\n'), [])
})

test('requires a changeset for each published package whose shipped files changed', () => {
  const changedFiles = ['packages/tokens/tokens/semantic.json', 'packages/react/styles.css', 'docs/color.md']

  assert.deepEqual(
    findMissingChangesets({ packages, changedFiles, changesets: [] }).map(({ name }) => name),
    ['@canon/tokens', '@canon/react'],
  )
  assert.deepEqual(
    findMissingChangesets({ packages, changedFiles, changesets: [{ file: '.changeset/a.md', packages: ['@canon/tokens'] }] }).map(
      ({ name }) => name,
    ),
    ['@canon/react'],
  )
  assert.deepEqual(
    findMissingChangesets({
      packages,
      changedFiles,
      changesets: [{ file: '.changeset/a.md', packages: ['@canon/tokens', '@canon/react'] }],
    }),
    [],
  )
})

test('does not require a changeset for tests, previews, changelogs, or files outside published packages', () => {
  const changedFiles = [
    'packages/react/src/Dialog.test.tsx',
    'packages/react/src/test-setup.ts',
    'packages/react/vitest.config.ts',
    'packages/tokens/scripts/build.test.js',
    'packages/tokens/preview/index.html',
    'packages/tokens/CHANGELOG.md',
    'apps/docs/lib/search.mjs',
    'docs/dialog.md',
  ]

  assert.deepEqual(findMissingChangesets({ packages, changedFiles, changesets: [] }), [])
})

test('reports the shipped files that triggered the requirement', () => {
  const [missing] = findMissingChangesets({
    packages,
    changedFiles: ['packages/tokens/src/index.ts', 'packages/tokens/scripts/build.test.js'],
    changesets: [],
  })

  assert.deepEqual(missing, { name: '@canon/tokens', files: ['packages/tokens/src/index.ts'] })
})
