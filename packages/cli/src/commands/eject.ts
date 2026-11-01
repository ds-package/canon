import { promises as fs } from 'fs'
import path from 'path'
import { createRequire } from 'module'
import pc from 'picocolors'

const TOKEN_FILES = [
  'color.json',
  'semantic.json',
  'tint.json',
  'brand.json',
  'shape.json',
  'spacing.json',
  'typography.json',
  'shadow.json',
]

export async function eject(_args: string[]) {
  const cwd = process.cwd()
  const targetDir = path.join(cwd, 'canon/tokens')

  console.log(pc.bold(pc.cyan('\n  Canon Design System — Eject\n')))
  console.log(`  토큰 파일을 프로젝트로 복사합니다.`)
  console.log(`  ${pc.dim('eject 후에는 @canon/tokens 업데이트가 자동 반영되지 않습니다.')}\n`)

  // 대상 디렉토리 생성
  await fs.mkdir(targetDir, { recursive: true })

  // @canon/tokens 패키지에서 토큰 파일 찾기
  let tokensSourceDir: string
  try {
    const require = createRequire(import.meta.url)
    const pkgPath = require.resolve('@canon/tokens/package.json')
    tokensSourceDir = path.join(path.dirname(pkgPath), 'tokens')
  } catch {
    console.error(`  ${pc.red('✗')} @canon/tokens 패키지를 찾을 수 없습니다.`)
    console.error(`  ${pc.dim('먼저 설치하세요: pnpm add @canon/tokens')}`)
    process.exit(1)
  }

  // 토큰 파일 복사
  for (const file of TOKEN_FILES) {
    const src = path.join(tokensSourceDir, file)
    const dest = path.join(targetDir, file)

    const destExists = await fileExists(dest)
    if (destExists) {
      console.log(`  ${pc.yellow('!')} ${pc.dim(`canon/tokens/${file}`)} 이미 존재합니다. 건너뜀.`)
      continue
    }

    try {
      await fs.copyFile(src, dest)
      console.log(`  ${pc.green('✓')} ${pc.dim(`canon/tokens/${file}`)} 복사`)
    } catch {
      console.log(`  ${pc.yellow('!')} ${pc.dim(file)} 소스를 찾을 수 없습니다. 건너뜀.`)
    }
  }

  // Style Dictionary 설정 파일 생성
  const sdConfigPath = path.join(cwd, 'style-dictionary.config.json')
  const sdConfigExists = await fileExists(sdConfigPath)

  if (!sdConfigExists) {
    const sdConfig = {
      source: ['canon/tokens/**/*.json'],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath: 'src/styles/',
          files: [{ destination: 'canon-variables.css', format: 'css/variables' }],
        },
      },
    }
    await fs.writeFile(sdConfigPath, JSON.stringify(sdConfig, null, 2), 'utf-8')
    console.log(`  ${pc.green('✓')} ${pc.dim('style-dictionary.config.json')} 생성`)
  }

  console.log(`
  ${pc.bold('Eject 완료!')}

  토큰 파일 위치: ${pc.cyan('canon/tokens/')}

  ${pc.bold('다음 단계:')}

  1. Style Dictionary 설치:
     ${pc.dim('pnpm add -D style-dictionary')}

  2. 토큰 빌드:
     ${pc.dim('npx style-dictionary build')}

  3. ${pc.dim('canon/tokens/')} 안의 JSON 파일을 자유롭게 수정하세요.
  `)
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
