import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REQUIRED_DECISION_FIELDS = ['id', 'status', 'verified']
const DECISION_STATUSES = new Set(['proposed', 'adopted', 'superseded', 'deprecated'])
const ROUTE_DOCUMENTS = ['DESIGN.md', 'docs/README.md']

const displayPath = (root, file) => path.relative(root, file).split(path.sep).join('/')

function isWithin(root, target) {
  const relative = path.relative(root, target)
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)
}

function readFrontmatter(source) {
  // shortcut: supports flat scalar metadata only, use a YAML parser when decisions need nested fields.
  if (!source.startsWith('---\n') && !source.startsWith('---\r\n')) return {}
  const lines = source.split(/\r?\n/)
  const end = lines.indexOf('---', 1)
  if (end === -1) return {}

  return Object.fromEntries(
    lines
      .slice(1, end)
      .map((line) => line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].replace(/^(['"])(.*)\1$/, '$2')]),
  )
}

function localLinks(source) {
  // shortcut: validates inline links only, use a Markdown parser when docs adopt reference-style links.
  const links = []
  const pattern = /!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g
  for (const match of source.matchAll(pattern)) links.push(match[1] ?? match[2])
  return links.filter((link) => !link.startsWith('#') && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(link))
}

async function validateRouteLinks(root, errors) {
  for (const relativeSource of ROUTE_DOCUMENTS) {
    const sourcePath = path.join(root, relativeSource)
    let source
    try {
      source = await readFile(sourcePath, 'utf8')
    } catch {
      errors.push(`${relativeSource}: missing route document`)
      continue
    }

    for (const rawLink of localLinks(source)) {
      const cleanLink = rawLink.split(/[?#]/, 1)[0]
      if (!cleanLink) continue
      let target
      try {
        target = path.resolve(path.dirname(sourcePath), decodeURIComponent(cleanLink))
        if (!isWithin(root, target)) {
          errors.push(`${relativeSource}: local link escapes repository ${rawLink}`)
          continue
        }
        await stat(target)
      } catch {
        errors.push(`${relativeSource}: missing local link ${rawLink}`)
      }
    }
  }
}

async function validateDecisions(root, errors) {
  const decisionsDir = path.join(root, 'docs/decisions')
  let files
  try {
    files = (await readdir(decisionsDir, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => path.join(decisionsDir, entry.name))
      .sort()
  } catch {
    errors.push('docs/decisions: missing directory')
    return
  }

  const ids = new Map()
  for (const file of files) {
    const relativeFile = displayPath(root, file)
    const metadata = readFrontmatter(await readFile(file, 'utf8'))
    for (const field of REQUIRED_DECISION_FIELDS) {
      if (!metadata[field]) errors.push(`${relativeFile}: missing frontmatter field ${field}`)
    }
    if (metadata.status && !DECISION_STATUSES.has(metadata.status)) {
      errors.push(`${relativeFile}: unsupported status ${metadata.status}`)
    }
    if (metadata.verified && !/^\d{4}-\d{2}-\d{2}$/.test(metadata.verified)) {
      errors.push(`${relativeFile}: verified must match YYYY-MM-DD`)
    }
    if (metadata.id) {
      const first = ids.get(metadata.id)
      if (first) errors.push(`${relativeFile}: duplicate decision id ${metadata.id} (first: ${first})`)
      else ids.set(metadata.id, relativeFile)
    }
  }
}

export async function validateDocs(root) {
  const errors = []
  await validateRouteLinks(root, errors)
  await validateDecisions(root, errors)
  return errors
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = await validateDocs(process.cwd())
  if (errors.length) {
    console.error(`Docs validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`)
    process.exitCode = 1
  } else {
    console.log('Docs validation passed')
  }
}
