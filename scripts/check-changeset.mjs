import { execFileSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 배포물에 영향을 주지 않는 파일. 이 파일만 바뀌었으면 changeset을 요구하지 않는다.
const NOT_SHIPPED = [
  /\.test\.[cm]?[jt]sx?$/,
  /(^|\/)test-setup\.[jt]s$/,
  /(^|\/)vitest\.config\.[jt]s$/,
  /(^|\/)AGENTS\.md$/,
  /(^|\/)CHANGELOG\.md$/,
  /^preview\//,
]

export function parseChangesetPackages(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return []
  return [...match[1].matchAll(/^\s*["']?([^"':\s]+)["']?\s*:\s*(?:major|minor|patch)\s*$/gm)].map((entry) => entry[1])
}

// packages: [{ name, dir }], changedFiles: 저장소 기준 경로, changesets: [{ file, packages }]
export function findMissingChangesets({ packages, changedFiles, changesets }) {
  const covered = new Set(changesets.flatMap((changeset) => changeset.packages))
  return packages
    .map(({ name, dir }) => ({
      name,
      files: changedFiles
        .filter((file) => file.startsWith(`${dir}/`))
        .filter((file) => !NOT_SHIPPED.some((pattern) => pattern.test(file.slice(dir.length + 1)))),
    }))
    .filter(({ name, files }) => files.length > 0 && !covered.has(name))
}

const git = (root, ...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()

function baseRef(root) {
  for (const ref of ['origin/main', 'main']) {
    try {
      return git(root, 'merge-base', 'HEAD', ref)
    } catch {
      // 해당 ref가 없으면 다음 후보로 넘어간다.
    }
  }
  return 'HEAD'
}

async function publishedPackages(root) {
  const packagesDir = path.join(root, 'packages')
  const entries = await readdir(packagesDir, { withFileTypes: true })
  const packages = []
  for (const entry of entries.filter((item) => item.isDirectory())) {
    try {
      const manifest = JSON.parse(await readFile(path.join(packagesDir, entry.name, 'package.json'), 'utf8'))
      if (!manifest.private) packages.push({ name: manifest.name, dir: `packages/${entry.name}` })
    } catch {
      // package.json이 없는 디렉터리는 패키지가 아니다.
    }
  }
  return packages
}

export async function checkChangesets(root) {
  const lines = (output) => output.split('\n').filter(Boolean)
  const changedFiles = [
    ...new Set([
      ...lines(git(root, 'diff', '--name-only', baseRef(root))),
      ...lines(git(root, 'ls-files', '--others', '--exclude-standard')),
    ]),
  ]
  const changesets = []
  for (const file of changedFiles.filter((item) => /^\.changeset\/(?!README\.md$)[^/]+\.md$/.test(item))) {
    try {
      changesets.push({ file, packages: parseChangesetPackages(await readFile(path.join(root, file), 'utf8')) })
    } catch {
      // 삭제된 changeset은 세지 않는다.
    }
  }
  return findMissingChangesets({ packages: await publishedPackages(root), changedFiles, changesets })
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const missing = await checkChangesets(process.cwd())
  if (missing.length === 0) {
    console.log('changeset 확인 통과')
  } else {
    console.error('changeset이 없습니다. 이대로 병합하면 아래 변경은 npm에 배포되지 않습니다.\n')
    for (const { name, files } of missing) console.error(`- ${name}: ${files.join(', ')}`)
    console.error(
      `\n.changeset/<짧은-이름>.md 파일을 만들어 주세요. 예:\n\n---\n"${missing[0].name}": patch\n---\n\n사용자가 알아야 할 변경 내용을 한두 문장으로 적는다.\n\n` +
        '새 기능은 minor, 버그 수정은 patch, 호환성이 깨지면 major입니다.',
    )
    process.exitCode = 1
  }
}
