import { promises as fs } from 'fs'
import path from 'path'
import pc from 'picocolors'

const CSS_CONTENT = `/* Canon Design System */
@import '@canon/tokens/css';

/* 여기서 CSS Variables를 오버라이드하세요 */
:root {
  /* 예시: 브랜드 컬러 변경
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  */
}
`

export async function init(_args: string[]) {
  const cwd = process.cwd()

  console.log(pc.bold(pc.cyan('\n  Canon Design System\n')))
  console.log(`  프로젝트 초기화 중... ${pc.dim(cwd)}\n`)

  const cssPath = path.join(cwd, 'canon.css')
  try {
    await fs.writeFile(cssPath, CSS_CONTENT, { flag: 'wx' })
    console.log(`  ${pc.green('✓')} ${pc.dim('canon.css')} 생성`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    console.log(`  ${pc.yellow('!')} ${pc.dim('canon.css')} 이미 존재합니다. 건너뜀.`)
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
