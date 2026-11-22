import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

import { SELECTION_END, SELECTION_START_PREFIX, selectionDocPath } from './sync-comments.mjs'

const REQUIRED_DECISION_FIELDS = ['id', 'status', 'verified']
const DECISION_STATUSES = new Set(['proposed', 'adopted', 'superseded', 'deprecated'])
const ROUTE_DOCUMENTS = ['DESIGN.md', 'docs/README.md']
const RUNTIME_STATUS_DOCUMENTS = [
  'docs/README.md',
  'docs/guides/README.md',
  'docs/decisions/interaction-foundation.md',
]
const RUNTIME_STATUS_COMPONENTS = ['Button', 'IconButton', 'Checkbox', 'Dialog', 'NumberField', 'RadioGroup', 'Select', 'Switch', 'TextField', 'TextArea']
const REQUIRED_DESIGN_ROUTES = [
  ['token naming', '컬러 토큰의 이름', './docs/foundations/color.md'],
  ['Figma migration', 'Figma 변수, 스타일, 컴포넌트를 안전하게 변경한다', './docs/maintainers/figma-workflow.md'],
  ['component property model', 'React props, runtime 상태, Figma property의 책임과 이름을 정한다', './docs/foundations/properties.md'],
  ['interaction decision', 'interaction foundation', './docs/decisions/interaction-foundation.md'],
  ['docs platform decision', 'docs web, search, playground', './docs/decisions/docs-platform.md'],
  ['component selection', '제품 상황에 맞는 컴포넌트를 고른다', './docs/guides/README.md'],
]
const GENERATED_DOCS_APP_DIRS = new Set(['node_modules', '.next', 'out'])

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

const isFile = (file) => stat(file).then((stats) => stats.isFile(), () => false)

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

    const links = localLinks(source)
    if (relativeSource === 'DESIGN.md') {
      const lines = source.split(/\r?\n/)
      for (const [name, question, target] of REQUIRED_DESIGN_ROUTES) {
        const paired = lines.some((line) => line.includes(question) && localLinks(line).includes(target))
        if (!paired) errors.push(`DESIGN.md: missing ${name} route ${target}`)
      }
      if (!source.includes('추정하지 않고 미확인으로 남긴다')) {
        errors.push('DESIGN.md: missing unconfirmed-question fallback')
      }
    }

    for (const rawLink of links) {
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

async function validateDocsApp(root, errors) {
  async function scan(directory) {
    let entries
    try {
      entries = await readdir(directory, { withFileTypes: true })
    } catch (error) {
      if (error.code === 'ENOENT') return
      throw error
    }

    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      if (entry.isDirectory()) {
        if (!GENERATED_DOCS_APP_DIRS.has(entry.name)) await scan(path.join(directory, entry.name))
      } else if (/\.mdx?$/.test(entry.name)) {
        const file = path.join(directory, entry.name)
        errors.push(`${displayPath(root, file)}: authored docs prose must live outside apps/docs`)
      }
    }
  }

  await scan(path.join(root, 'apps/docs'))
}

async function validateRuntimeStatus(root, errors) {
  try {
    await stat(path.join(root, 'packages/react/package.json'))
  } catch {
    return
  }

  for (const file of RUNTIME_STATUS_DOCUMENTS) {
    let source = ''
    try {
      source = await readFile(path.join(root, file), 'utf8')
    } catch {}
    if (!source.includes('@canon/react')) errors.push(`${file}: missing @canon/react runtime status`)
    // The getting-started guide shows one example. Runtime references list the full inventory.
    if (file === 'docs/README.md') continue
    for (const component of RUNTIME_STATUS_COMPONENTS) {
      if (!source.includes(component)) errors.push(`${file}: missing ${component} runtime status`)
    }
  }
}

const CONTRACT_NAME_COLUMN = '이름'

// Names a React public prop may use: backticked names in the 이름 column of the tables in `## Shared contract`
// and `### React`. Other columns hold types, defaults, and forbidden or adapter-internal names
// (`'md'`, `string | undefined`, `isOpen`). Prose and the iOS·Android table are not read.
function readContractNames(source, errors) {
  const sections = [
    source.match(/(?:^|\n)## Shared contract[ \t]*\n([\s\S]*?)(?=\n## |$)/)?.[1],
    source.match(/(?:^|\n)### React[ \t]*\n([\s\S]*?)(?=\n## |\n### |$)/)?.[1],
  ]
  if (sections.some((section) => section === undefined)) {
    errors.push('docs/foundations/properties.md: missing Shared contract or Platform translations React section')
    return null
  }

  const names = new Set()
  // shortcut: reads unindented pipe tables only, use a Markdown parser when tables move into lists or code fences.
  for (const section of sections) {
    for (const table of section.match(/(?:^\|.*\n?)+/gm) ?? []) {
      const [header, , ...rows] = table.trimEnd().split('\n').map((line) => line.split(/(?<!\\)\|/).slice(1, -1))
      const column = header.findIndex((cell) => cell.trim() === CONTRACT_NAME_COLUMN)
      if (column === -1) continue
      for (const cells of rows) {
        for (const name of (cells[column] ?? '').matchAll(/`([^`]+)`/g)) names.add(name[1])
      }
    }
  }
  if (!names.size) {
    errors.push('docs/foundations/properties.md: Shared contract and React translation tables name no props in an 이름 column')
    return null
  }
  return names
}

async function validatePropertyCoverage(root, errors) {
  const indexPath = path.join(root, 'packages/react/src/index.ts')
  const componentsPath = path.join(root, 'docs/components/README.md')
  let componentsSource
  try {
    await stat(indexPath)
    componentsSource = await readFile(componentsPath, 'utf8')
  } catch {
    return
  }

  const sourceFiles = ts.sys.readDirectory(path.dirname(indexPath), ['.ts', '.tsx'])
  const program = ts.createProgram(sourceFiles, {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ESNext,
  })
  const checker = program.getTypeChecker()
  const index = program.getSourceFile(indexPath)
  const module = index && checker.getSymbolAtLocation(index)
  if (!module) {
    errors.push('packages/react/src/index.ts: cannot read public exports')
    return
  }

  const documented = new Map()
  const rowPattern = /^\|[^\n|]+\|\s*`([^`]+Props)`\s*\|([^\n|]+)\|/gm
  for (const match of componentsSource.matchAll(rowPattern)) {
    documented.set(match[1], [...match[2].matchAll(/`([^`]+)`/g)].map((prop) => prop[1]).sort())
  }

  const publicProps = checker
    .getExportsOfModule(module)
    .filter((symbol) => symbol.name.endsWith('Props'))
    .map((symbol) => [
      symbol.name,
      checker.getPropertiesOfType(checker.getDeclaredTypeOfSymbol(symbol)).map((prop) => prop.name).sort(),
    ])

  const propertiesSource = await readFile(path.join(root, 'docs/foundations/properties.md'), 'utf8').catch(() => '')
  const contractNames = readContractNames(propertiesSource.replace(/\r\n/g, '\n'), errors)

  for (const [typeName, props] of publicProps) {
    if (contractNames) {
      for (const prop of props.filter((name) => !contractNames.has(name))) {
        errors.push(`docs/foundations/properties.md: ${typeName}.${prop} has no Shared contract or React translation entry`)
      }
    }
    const documentedProps = documented.get(typeName)
    if (!documentedProps) {
      errors.push(`docs/components/README.md: missing ${typeName} coverage`)
      continue
    }
    const missing = props.filter((prop) => !documentedProps.includes(prop))
    const extra = documentedProps.filter((prop) => !props.includes(prop))
    if (missing.length || extra.length) {
      const details = [
        missing.length && `missing: ${missing.join(', ')}`,
        extra.length && `undocumented: ${extra.join(', ')}`,
      ].filter(Boolean).join('; ')
      errors.push(`docs/components/README.md: ${typeName} property coverage mismatch (${details})`)
    }
    documented.delete(typeName)
  }

  for (const typeName of documented.keys()) {
    errors.push(`docs/components/README.md: ${typeName} is not a public @canon/react props export`)
  }

  const matrix = componentsSource.match(/## Implementation coverage matrix([\s\S]*?)(?=\n## |$)/)?.[1] ?? ''
  // First cell of each matrix row names the components, with or without a link to their doc.
  const documentedComponents = new Set(
    [...matrix.matchAll(/^\|([^|\n]+)\|([^|\n]*)\|/gm)]
      .filter((match) => match[2].trim() !== '-') // planned rows are not exports yet
      .map((match) => match[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim())
      .filter((cell) => cell && !/^-+$/.test(cell) && cell !== 'Component')
      .flatMap((cell) => cell.split(',').map((name) => name.trim())),
  )
  const componentSymbols = checker
    .getExportsOfModule(module)
    .map((symbol) => [symbol.name, symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol])
    .filter(([, target]) => target.declarations?.some((declaration) => ts.isFunctionDeclaration(declaration)))
  const publicComponents = componentSymbols.map(([name]) => name)

  for (const [component, target] of componentSymbols) {
    const documentation = ts.displayPartsToString(target.getDocumentationComment(checker))
    if (!documentation.trim()) {
      errors.push(`packages/react/src/index.ts: public component ${component} has no JSDoc`)
      continue
    }
    // 에이전트가 배포된 .d.ts에서 읽는 선택 기준이다. 문서가 있는 컴포넌트는 그 문서의 `## 선택`에서
    // 생성하는 영역 표식이 있어야 한다. 문서가 없는 컴포넌트는 요약과 제약만 둔다.
    // 영역 내용의 최신성은 `node scripts/docs/sync-comments.mjs --check`가 검사한다.
    const docPath = selectionDocPath(component)
    if (!(await isFile(path.join(root, docPath)))) continue
    const lines = documentation.split('\n').map((line) => line.trim())
    const marked =
      lines.some((line) => line.startsWith(SELECTION_START_PREFIX) && line.endsWith('-->')) &&
      lines.includes(SELECTION_END)
    if (!marked) {
      errors.push(`packages/react/src/index.ts: public component ${component} JSDoc is missing the ${SELECTION_START_PREFIX}${docPath} --> selection region`)
    }
  }

  for (const component of publicComponents) {
    if (!documentedComponents.delete(component)) {
      errors.push(`docs/components/README.md: missing public component ${component} coverage`)
    }
  }
  for (const component of documentedComponents) {
    errors.push(`docs/components/README.md: ${component} is not a public @canon/react component export`)
  }
}

export async function validateDocs(root) {
  const errors = []
  await validateRouteLinks(root, errors)
  await validateDecisions(root, errors)
  await validateDocsApp(root, errors)
  await validateRuntimeStatus(root, errors)
  await validatePropertyCoverage(root, errors)
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
