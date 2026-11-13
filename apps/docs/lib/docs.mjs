import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const repositoryUrl = 'https://github.com/ds-package/canon'
let documentsPromise

async function markdownFiles(directory, prefix) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relative = path.posix.join(prefix, entry.name)
    if (entry.isDirectory()) files.push(...await markdownFiles(path.join(directory, entry.name), relative))
    else if (entry.name.endsWith('.md')) files.push(relative)
  }
  return files
}

export function sourceToRoute(sourcePath) {
  if (sourcePath === 'DESIGN.md') return '/'
  const withoutExtension = sourcePath.replace(/\.md$/, '')
  const withoutReadme = withoutExtension.replace(/\/README$/, '')
  return `/${withoutReadme}`
}

export function toWebHref(href, sourcePath) {
  if (!href || href.startsWith('#') || href.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(href)) return href
  const match = href.match(/^([^?#]*)(.*)$/)
  if (!match?.[1]) return href
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), match[1]))
  if (target.endsWith('.md')) return `${sourceToRoute(target)}${match[2]}`
  const view = path.posix.extname(target) ? 'blob' : 'tree'
  return `${repositoryUrl}/${view}/main/${target}${match[2]}`
}

export function parseDocument(sourcePath, source) {
  const markdown = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  const headings = [...markdown.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => match[1].replace(/[*_`]/g, '').trim())
  const title = headings[0] ?? sourcePath
  // shortcut: lexical search only needs readable words, replace this when search requires Markdown-aware ranking.
  const body = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?(?:\[([^\]]*)\])\([^)]*\)/g, '$1')
    .replace(/<[^>]+>|[#>*_`|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,:;!?])/g, '$1')
    .trim()

  return { sourcePath, route: sourceToRoute(sourcePath), title, headings, body, markdown }
}

export async function readDocuments() {
  const sources = ['DESIGN.md', ...await markdownFiles(path.join(repoRoot, 'docs'), 'docs')]
  return Promise.all(sources.map(async (sourcePath) => parseDocument(sourcePath, await readFile(path.join(repoRoot, sourcePath), 'utf8'))))
}

export function getDocuments() {
  documentsPromise ??= readDocuments()
  return documentsPromise
}

export async function getDocument(route) {
  return (await getDocuments()).find((document) => document.route === route)
}

export async function getDocumentIndex() {
  return (await getDocuments()).map(({ markdown: _markdown, ...document }) => document)
}
