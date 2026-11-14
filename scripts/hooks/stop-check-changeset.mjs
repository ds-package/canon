// Claude Code Stop 훅. 작업을 끝내려 할 때만 실행되므로 작업 중 판단에는 영향을 주지 않는다.
// 배포 패키지를 바꿨는데 changeset이 없으면 종료를 한 번 막고 무엇을 만들어야 하는지 알려 준다.
import { checkChangesets } from '../check-changeset.mjs'

let input = ''
for await (const chunk of process.stdin) input += chunk
const event = input ? JSON.parse(input) : {}

// 이미 한 번 막았으면 다시 막지 않는다. 무한 반복을 피한다.
if (event.stop_hook_active) process.exit(0)

const missing = await checkChangesets(process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd())
if (missing.length > 0) {
  const lines = missing.map(({ name, files }) => `- ${name}: ${files.join(', ')}`).join('\n')
  process.stderr.write(
    `배포 패키지를 바꿨지만 changeset이 없습니다. 이대로 병합하면 아래 변경은 npm에 배포되지 않습니다.\n${lines}\n\n` +
      `.changeset/<짧은-이름>.md 파일을 직접 만들어 주세요(\`pnpm changeset\`은 대화형이라 쓰지 않습니다). 예:\n\n---\n"${missing[0].name}": patch\n---\n\n사용자가 알아야 할 변경 내용을 한두 문장으로 적는다.\n\n` +
      '새 기능은 minor, 버그 수정은 patch, 호환성이 깨지면 major입니다. changeset 외의 파일은 더 고치지 마세요.\n',
  )
  process.exit(2)
}
