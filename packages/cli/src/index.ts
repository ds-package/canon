import { init } from './commands/init.js'
import { eject } from './commands/eject.js'

const [, , command, ...args] = process.argv

const commands: Record<string, (args: string[]) => Promise<void>> = {
  init,
  eject,
}

async function main() {
  if (!command || command === '--help' || command === '-h') {
    printHelp()
    process.exit(0)
  }

  const handler = commands[command]
  if (!handler) {
    console.error(`알 수 없는 명령어: ${command}`)
    printHelp()
    process.exit(1)
  }

  await handler(args)
}

function printHelp() {
  console.log(`
  Canon CLI

  사용법:
    npx @canon/cli <command>

  명령어:
    init      프로젝트에 Canon 설정 초기화
    eject     Canon 토큰 파일을 프로젝트로 복사 (완전 커스텀)
  `)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
