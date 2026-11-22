import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// 공개 컴포넌트 JSDoc 안의 생성 영역 표식이다. Markdown HTML 주석이라 렌더링된 hover에서는 보이지 않고,
// 배포된 .d.ts를 읽는 사람과 에이전트에게는 정본 문서 경로를 알려 준다.
export const SELECTION_START_PREFIX = '<!-- canon:selection source='
export const SELECTION_END = '<!-- /canon:selection -->'
const SOURCE_DIR = 'packages/react/src'
const DOCS_DIR = 'docs/components'
const SELECTION_HEADING = '## 선택'
const SELECTION_LISTS = ['언제 쓰나', '쓰지 않는 경우']

const INDEX_FILE = `${SOURCE_DIR}/index.ts`

const START_LINE = /^(\s*\*)\s?<!-- canon:selection source=(\S+) -->\s*$/
const END_LINE = /^\s*\*\s?<!-- \/canon:selection -->\s*$/
const DOC_LINK_TARGET = /^\.\/[a-z\d]+(?:-[a-z\d]+)*\.md$/

// `IconButton` → `docs/components/icon-button.md`. 컴포넌트 이름과 선택 기준 정본 문서를 잇는 규칙이다.
export const selectionDocPath = (component) =>
  `${DOCS_DIR}/${component.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()}.md`

// `index.ts`가 값으로 export하는 이름이다. 타입만 export하는 이름은 링크할 컴포넌트가 아니다.
function publicExports(text) {
  const sourceFile = ts.createSourceFile('index.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const names = new Set()
  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) continue
    if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) continue
    for (const element of statement.exportClause.elements) if (!element.isTypeOnly) names.add(element.name.text)
  }
  return names
}

// 문서 목록의 Markdown 링크를 JSDoc 문법으로 옮긴다. `[공개 컴포넌트](./kebab-name.md)` 링크만 `{@link Name}`이 된다.
function toJSDocText(text, where, exports, errors) {
  if (text.includes('*/')) errors.push(`${where}: selection text must not contain */`)
  return text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (link, label, target) => {
    if (!DOC_LINK_TARGET.test(target)) {
      errors.push(`${where}: unsupported link ${link}, link only public components to their docs as [Name](./kebab-name.md)`)
      return label
    }
    if (!exports.has(label)) {
      errors.push(`${where}: link label ${label} in ${link} is not a public @canon/react export`)
      return label
    }
    return `{@link ${label}}`
  })
}

// `## 선택` 절에서 `### 언제 쓰나`, `### 쓰지 않는 경우` 두 목록을 읽는다. 문서 하나는 컴포넌트 하나를 다룬다.
function readSelection(source, docPath, component, exports, errors) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const start = lines.findIndex((line) => line.trim() === SELECTION_HEADING)
  if (start === -1) {
    errors.push(`${docPath}: missing ${SELECTION_HEADING} section for ${component}`)
    return null
  }
  const after = lines.slice(start + 1)
  const sectionEnd = after.findIndex((line) => /^#{1,2}\s/.test(line))
  const scope = sectionEnd === -1 ? after : after.slice(0, sectionEnd)

  const lists = []
  for (const title of SELECTION_LISTS) {
    const where = `${docPath}: ${component} ### ${title}`
    const listStart = scope.findIndex((line) => line.trim() === `### ${title}`)
    if (listStart === -1) {
      errors.push(`${docPath}: ${component} selection is missing ### ${title}`)
      return null
    }
    const rest = scope.slice(listStart + 1)
    const listEnd = rest.findIndex((line) => /^#{1,6}\s/.test(line))
    const items = []
    // shortcut: reads one-line `- ` items only, use a Markdown parser when items wrap or nest.
    for (const line of listEnd === -1 ? rest : rest.slice(0, listEnd)) {
      if (!line.trim()) continue
      if (!line.startsWith('- ')) {
        errors.push(`${where} accepts one-line list items only: ${line.trim()}`)
        continue
      }
      items.push(toJSDocText(line.slice(2).trim(), where, exports, errors))
    }
    if (!items.length) errors.push(`${where} has no list items`)
    lists.push([title, items])
  }
  return lists
}

function renderSelection(prefix, lists) {
  const blank = prefix
  const lines = []
  for (const [title, items] of lists) {
    if (lines.length) lines.push(blank)
    lines.push(`${prefix} ### ${title}`, ...items.map((item) => `${prefix} - ${item}`))
  }
  return lines
}

function exportedFunctions(sourceFile) {
  return sourceFile.statements.filter(
    (statement) =>
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
  )
}

/**
 * `packages/react/src`의 공개 함수 컴포넌트 JSDoc 생성 영역을 `docs/components/<component>.md`의 `## 선택` 절로 다시 쓴다.
 * @param {string} root 저장소 루트
 * @param {{ check?: boolean }} [options] `check`이면 파일을 쓰지 않고 다른 영역만 보고한다.
 * @returns {Promise<{ errors: string[], stale: string[] }>}
 */
export async function syncComments(root, { check = false } = {}) {
  const errors = []
  const stale = []
  const docs = new Map()
  const writes = []
  const sourceDir = path.join(root, SOURCE_DIR)
  let entries
  try {
    entries = await readdir(sourceDir)
  } catch {
    return { errors: [`${SOURCE_DIR}: missing directory`], stale }
  }
  let exports = new Set()
  try {
    exports = publicExports(await readFile(path.join(root, INDEX_FILE), 'utf8'))
  } catch {
    errors.push(`${INDEX_FILE}: missing file, cannot check selection link labels`)
  }

  for (const name of entries.filter((entry) => entry.endsWith('.tsx') && !entry.endsWith('.test.tsx')).sort()) {
    const relativeFile = `${SOURCE_DIR}/${name}`
    const text = await readFile(path.join(sourceDir, name), 'utf8')
    const sourceFile = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    const replacements = []

    for (const declaration of exportedFunctions(sourceFile)) {
      const component = declaration.name.text
      const jsDoc = ts.getJSDocCommentsAndTags(declaration).filter(ts.isJSDoc).at(-1)
      if (!jsDoc) continue
      const comment = text.slice(jsDoc.pos, jsDoc.end)
      const lines = comment.split('\n')
      const starts = lines.flatMap((line, index) => (START_LINE.test(line) ? [index] : []))
      const ends = lines.flatMap((line, index) => (END_LINE.test(line) ? [index] : []))
      if (!starts.length && !ends.length) continue
      if (starts.length !== 1 || ends.length !== 1 || ends[0] < starts[0]) {
        errors.push(`${relativeFile}: ${component} JSDoc needs exactly one ${SELECTION_START_PREFIX}... --> and ${SELECTION_END} pair`)
        continue
      }

      const [, prefix, docPath] = lines[starts[0]].match(START_LINE)
      // 생성 영역의 정본은 그 컴포넌트의 문서다(`Button.tsx`의 IconButton → `docs/components/icon-button.md`).
      const expectedDoc = selectionDocPath(component)
      if (docPath !== expectedDoc) {
        errors.push(`${relativeFile}: ${component} selection source ${docPath} must be ${expectedDoc}, the doc of ${component}`)
        continue
      }
      if (!docs.has(docPath)) {
        docs.set(docPath, await readFile(path.join(root, docPath), 'utf8').catch(() => null))
      }
      const docSource = docs.get(docPath)
      if (docSource === null) {
        errors.push(`${relativeFile}: ${component} selection source ${docPath} does not exist`)
        continue
      }
      const selection = readSelection(docSource, docPath, component, exports, errors)
      if (!selection) continue

      const generated = [
        ...lines.slice(0, starts[0] + 1),
        ...renderSelection(prefix, selection),
        ...lines.slice(ends[0]),
      ].join('\n')
      if (generated !== comment) {
        stale.push(`${relativeFile}: ${component} selection comment differs from ${docPath}`)
        replacements.push([jsDoc.pos, jsDoc.end, generated])
      }
    }

    if (replacements.length) {
      let updated = text
      for (const [start, end, generated] of replacements.reverse()) {
        updated = updated.slice(0, start) + generated + updated.slice(end)
      }
      writes.push([path.join(sourceDir, name), updated])
    }
  }

  // 오류가 하나라도 있으면 일부만 생성된 상태를 남기지 않도록 아무 파일도 쓰지 않는다.
  if (!check && !errors.length) {
    for (const [file, updated] of writes) await writeFile(file, updated)
  }
  return { errors, stale }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check')
  const { errors, stale } = await syncComments(process.cwd(), { check })
  if (errors.length) {
    console.error(`Selection comment sync failed:\n${errors.map((error) => `- ${error}`).join('\n')}`)
    process.exitCode = 1
  } else if (check && stale.length) {
    console.error(
      `Selection comments are out of date, run pnpm sync:comments:\n${stale.map((entry) => `- ${entry}`).join('\n')}`,
    )
    process.exitCode = 1
  } else if (stale.length) {
    console.log(`Updated selection comments:\n${stale.map((entry) => `- ${entry}`).join('\n')}`)
  } else {
    console.log('Selection comments are up to date')
  }
}
