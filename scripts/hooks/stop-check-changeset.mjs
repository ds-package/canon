// Claude Code Stop 훅. 작업을 끝내려 할 때만 실행되므로 작업 중 판단에는 영향을 주지 않는다.
// 배포 패키지를 바꿨는데 changeset이 없으면 종료를 한 번 막고 무엇을 만들어야 하는지 알려 준다.
import { closeSync, openSync, readSync, statSync } from 'node:fs'
import path from 'node:path'
import { checkChangesets } from '../check-changeset.mjs'

let input = ''
for await (const chunk of process.stdin) input += chunk
const event = input ? JSON.parse(input) : {}

// 이미 한 번 막았으면 다시 막지 않는다. 무한 반복을 피한다.
if (event.stop_hook_active) process.exit(0)

const root = process.env.CLAUDE_PROJECT_DIR || event.cwd || process.cwd()

// 세션이 시작된 시각. transcript의 첫 timestamp를 쓴다. 알 수 없으면 null이다.
function sessionStart() {
  try {
    const fd = openSync(event.transcript_path, 'r')
    const buffer = Buffer.alloc(65536)
    const length = readSync(fd, buffer, 0, buffer.length, 0)
    closeSync(fd)
    const match = buffer.toString('utf8', 0, length).match(/"timestamp":"([^"]+)"/)
    return match ? Date.parse(match[1]) : null
  } catch {
    return null
  }
}

// 이 세션에서 고친 파일인지 본다. 지운 파일은 디렉터리의 수정 시각으로 판단한다.
function touchedSince(file, since) {
  for (const target of [path.join(root, file), path.dirname(path.join(root, file))]) {
    try {
      return statSync(target).mtimeMs >= since
    } catch {
      // 파일이 없으면 디렉터리를 본다.
    }
  }
  return false
}

// 세션 전에 사람이 고쳐 둔 변경만 있으면 막지 않는다. 질문만 한 세션에서 changeset을 만들지 않게 한다.
const since = sessionStart()
const missing = (await checkChangesets(root)).filter(
  ({ files }) => since === null || files.some((file) => touchedSince(file, since)),
)
if (missing.length > 0) {
  const lines = missing.map(({ name, files }) => `- ${name}: ${files.join(', ')}`).join('\n')
  process.stderr.write(
    `배포 패키지를 바꿨지만 changeset이 없습니다. 이대로 병합하면 아래 변경은 npm에 배포되지 않습니다.\n${lines}\n\n` +
      `.changeset/<짧은-이름>.md 파일을 직접 만들어 주세요(\`pnpm changeset\`은 대화형이라 쓰지 않습니다). 예:\n\n---\n"${missing[0].name}": patch\n---\n\n사용자가 알아야 할 변경 내용을 한두 문장으로 적는다.\n\n` +
      '새 기능은 minor, 버그 수정은 patch, 호환성이 깨지면 major입니다. changeset 외의 파일은 더 고치지 마세요.\n' +
      '최종 답변에는 이 안내에 대한 답만 적지 말고, 이번 작업 전체에서 무엇을 바꿨고 어떻게 확인했는지를 다시 적어 주세요.\n',
  )
  process.exit(2)
}
