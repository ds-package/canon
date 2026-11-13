import { constants, promises as fs } from 'fs'
import path from 'path'
import { createRequire } from 'module'
import pc from 'picocolors'

const BUILD_CONTENT = `import { buildTokens } from '@canon/tokens/build'
import StyleDictionary from 'style-dictionary'
import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const local = (relative) => fileURLToPath(new URL(relative, import.meta.url))

// Build outputs stay in canon/dist; only the stylesheet is copied into the app source.
await buildTokens({ source: local('./tokens/**/*.json'), outDir: local('./dist/'), StyleDictionary })
await mkdir(local('../src/styles/'), { recursive: true })
await copyFile(local('./dist/css/variables.css'), local('../src/styles/canon-variables.css'))
`

export async function eject(_args: string[]) {
  const cwd = process.cwd()
  const targetDir = path.join(cwd, 'canon/tokens')
  console.log(pc.bold(pc.cyan('\n  Canon Design System — Eject\n')))

  let tokensSourceDir: string
  try {
    // npx installs the CLI elsewhere; resolve the tokens installed by this project.
    const require = createRequire(path.join(cwd, 'package.json'))
    tokensSourceDir = path.dirname(require.resolve('@canon/tokens/tokens/color.json'))
  } catch {
    return fail('@canon/tokens 패키지를 찾을 수 없습니다. 먼저 pnpm add @canon/tokens를 실행하세요.')
  }

  const files = (await fs.readdir(tokensSourceDir)).filter((file) => file.endsWith('.json'))
  if (!files.length) return fail('@canon/tokens 원본 JSON 파일이 없습니다.')
  const tokensPackage = JSON.parse(await fs.readFile(path.join(tokensSourceDir, '../package.json'), 'utf-8'))
  const styleDictionary = `style-dictionary@${tokensPackage.peerDependencies['style-dictionary']}`
  await fs.mkdir(targetDir, { recursive: true })

  for (const file of files) {
    const dest = path.join(targetDir, file)
    try {
      await fs.copyFile(path.join(tokensSourceDir, file), dest, constants.COPYFILE_EXCL)
      console.log(`  ${pc.green('✓')} canon/tokens/${file} 복사`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      console.log(`  ${pc.yellow('!')} canon/tokens/${file} 이미 존재합니다. 건너뜀.`)
    }
  }

  try {
    await fs.writeFile(path.join(cwd, 'canon/build.mjs'), BUILD_CONTENT, { flag: 'wx' })
    console.log(`  ${pc.green('✓')} canon/build.mjs 생성`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    console.log(`  ${pc.yellow('!')} canon/build.mjs 이미 존재합니다. 건너뜀.`)
  }

  console.log(`
  ${pc.bold('Eject 완료!')}

  1. 빌드 도구 설치:
     pnpm add -D '${styleDictionary}'

  2. 토큰 빌드:
     node canon/build.mjs

  3. canon/tokens/ 안의 JSON 파일을 수정하고 다시 빌드하세요.
     CSS: src/styles/canon-variables.css (빌드 산출물: canon/dist/)
     이 CSS를 프로젝트 엔트리에서 임포트하세요.
     공유 빌드 도구를 사용하므로 @canon/tokens는 계속 설치해 두세요.
  `)
}

// Expected user-facing failures: message only, non-zero exit. Unexpected errors keep their stack.
function fail(message: string) {
  console.error(`  ${pc.red('✗')} ${message}`)
  process.exitCode = 1
}
