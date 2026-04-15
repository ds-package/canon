import { promises as fs } from 'fs'
import path from 'path'
import pc from 'picocolors'

const CSS_CONTENT = `/* Canon Design System */
@import '@canon/tokens/css';

/* 여기서 CSS Variables를 오버라이드하세요 */
:root {
  /* 예시: 브랜드 컬러 변경
  --color-primary-500: #your-color;
  --color-primary-600: #your-color;
  */
}
`

const CONFIG_CONTENT = `{
  "$schema": "https://canon.design/schema/config.json",
  "version": "0.1.0"
}
`

export async function init(_args: string[]) {
  const cwd = process.cwd()

  console.log(pc.bold(pc.cyan('\n  Canon Design System\n')))
  console.log(`  프로젝트 초기화 중... ${pc.dim(cwd)}\n`)

  // canon.config.json 생성
  const configPath = path.join(cwd, 'canon.config.json')
  const configExists = await fileExists(configPath)

  if (configExists) {
    console.log(`  ${pc.yellow('!')} ${pc.dim('canon.config.json')} 이미 존재합니다. 건너뜀.`)
  } else {
    await fs.writeFile(configPath, CONFIG_CONTENT, 'utf-8')
    console.log(`  ${pc.green('✓')} ${pc.dim('canon.config.json')} 생성`)
  }

  // canon.css 생성
  const cssPath = path.join(cwd, 'canon.css')
  const cssExists = await fileExists(cssPath)

  if (cssExists) {
    console.log(`  ${pc.yellow('!')} ${pc.dim('canon.css')} 이미 존재합니다. 건너뜀.`)
  } else {
    await fs.writeFile(cssPath, CSS_CONTENT, 'utf-8')
    console.log(`  ${pc.green('✓')} ${pc.dim('canon.css')} 생성`)
  }

  console.log(`
  ${pc.bold('다음 단계:')}

  1. ${pc.cyan('@canon/tokens')} 설치:
     ${pc.dim('pnpm add @canon/tokens')}

  2. 프로젝트 엔트리에 CSS 임포트:
     ${pc.dim("import './canon.css'")}

  3. 원하는 토큰은 ${pc.dim('canon.css')}에서 오버라이드하세요.

  ${pc.dim('완전한 커스텀이 필요하면: npx @canon/cli eject')}
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
