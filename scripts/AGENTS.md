# scripts

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-22

## Purpose
`scripts/`는 저장소 수준 검증을 담는다. 직접 패키징한 `@canon/tokens`, `@canon/cli`, `@canon/react`가 소비 프로젝트에서 동작하는지 확인하는 테스트와, 문서 정합성을 검사하는 `docs/` 검증기가 있다. 패키지별 단위 테스트는 각 `packages/*` 안에 있고 여기에는 두지 않는다.

## Key Files

| File | Description |
|------|-------------|
| `package-smoke.test.js` | CommonJS. `npm pack`한 tokens·cli를 임시 consumer에 풀어 tokens의 배포 파일 목록 정확 일치, CJS/ESM/Tailwind/CSS import, TypeScript 타입, CLI `eject`·`init`, 실패 시 종료 코드와 메시지를 검증한다. |
| `package-consumption.test.mjs` | ESM. `pnpm --filter <pkg> pack`한 tokens·cli·react tarball을 `file:` 의존성으로 임시 consumer에 `pnpm install --ignore-scripts`한 뒤 import(ESM/CJS), `renderToString` 결과, `.d.ts` 내용, `pnpm exec canon eject`를 검증한다. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `docs/` | 문서 검증기와 그 fixture 테스트 (see `docs/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- 두 테스트는 `packages/*`의 빌드 산출물(`dist`)을 전제로 한다. 루트 `pnpm test`가 `pnpm --filter './packages/*' build`를 먼저 실행하므로 단독 실행 전에도 빌드가 필요하다.
- `package-smoke.test.js`는 네트워크를 쓰지 않는다. 설치된 `picocolors`와 `style-dictionary`를 `packages/cli/node_modules`, `packages/tokens/node_modules`에서 symlink하므로 먼저 `pnpm install`이 되어 있어야 한다.
- `package-consumption.test.mjs`는 consumer에서 `pnpm install`을 실행해 `react`, `react-dom`, `style-dictionary` 같은 외부 의존성을 registry에서 받는다. 네트워크가 없거나 registry 접근이 제한된 환경에서는 실패할 수 있다.
- 두 파일 모두 임시 디렉터리를 만들고 `t.after`에서 지운다. 저장소 안에 산출물을 남기지 않는다.
- 새 public 컴포넌트를 추가하면 `package-consumption.test.mjs`의 export 이름 검증과 렌더 검증에 포함할지 확인한다. 현재 목록은 Button, Checkbox, Dialog, NumberField, RadioGroup, RadioOption, Select, Switch, TextArea, TextField다.
- tokens 배포 파일 목록(`dist/...`, `tokens/*`, `scripts/build.js`, `package.json`)은 `package-smoke.test.js`에 정확히 박혀 있다. 배포 파일을 바꾸면 이 기대값도 바꾼다.

### Testing Requirements
- 루트 전체: `pnpm test`(`node --test ... scripts/*.test.js scripts/package-consumption.test.mjs`를 포함한다). `pnpm test:package`는 `pnpm test`의 별칭이다.
- 단독 실행: `node --test scripts/package-smoke.test.js`, `node --test scripts/package-consumption.test.mjs`(사전에 `pnpm build`).
- 문서 검증기 테스트는 `pnpm test:docs`가 실행한다. 루트 `pnpm test`의 glob `scripts/*.test.js`는 `scripts/docs/`를 포함하지 않는다.

### Common Patterns
- `execFileSync`로 `npm`, `pnpm`, `node`, `tar`를 `stdio: 'pipe'`로 실행하고 출력을 assert한다.
- consumer 검증은 `node --input-type=module -e`와 `node -e`로 ESM과 CJS 양쪽 진입점을 모두 확인한다.

## Dependencies

### Internal
- `packages/tokens`, `packages/cli`, `packages/react`의 빌드와 pack 결과.

### External
- Node 내장 `node:test`, `node:assert`, `npm`, `pnpm`, `tar`. 테스트가 `typescript`(`tsc`)를 실행한다.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
