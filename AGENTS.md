# canon

**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose

Canon 디자인 시스템의 pnpm monorepo다. 디자인 토큰(`@canon/tokens`), React 컴포넌트(`@canon/react`), 소비 프로젝트용 CLI(`@canon/cli`)를 npm에 배포하고, 저장소의 Markdown 문서를 그대로 읽어 정적 문서 사이트(`@canon/docs`)를 만든다. 설계 규칙의 정본은 `docs/`의 한국어 문서와 Figma이며, 코드는 그 정본을 따라간다.

## Key Files

| File | Description |
|------|-------------|
| `DESIGN.md` | 문서 입구. 제품 원칙과 "질문 → 먼저 읽을 문서" 표를 둔다. docs 사이트의 `/` 페이지가 되고 `scripts/docs/validate.mjs`가 필수 route 행을 검사한다. |
| `package.json` | 루트 스크립트(`build`, `dev`, `lint`, `test`, `test:package`, `test:docs`, `typecheck`, `check`, `changeset`, `version`, `release`, `sync:comments`)와 Node `>=20.9.0`, pnpm `>=9.0.0` 제약. |
| `pnpm-workspace.yaml` | workspace 범위는 `packages/*`와 `apps/*`다. |
| `tsconfig.base.json` | 각 패키지 `tsconfig.json`이 확장하는 공통 TypeScript 설정(`strict`, `moduleResolution: bundler`). |
| `.npmrc` | `auto-install-peers=true`, `strict-peer-dependencies=false`. |
| `pnpm-lock.yaml` | 잠금 파일. CI는 `pnpm install --frozen-lockfile`로 설치한다. |
| `primitive-color-palette.svg` | 프리미티브 컬러 팔레트를 그린 정적 이미지. 다른 파일이 참조하지 않는다. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `packages/` | 배포 패키지 `tokens`, `react`, `cli` (see `packages/AGENTS.md`) |
| `apps/` | docs 사이트 `apps/docs` (see `apps/AGENTS.md`. `apps/docs` 안에는 AGENTS.md를 둘 수 없어 이 파일이 전체를 설명한다) |
| `scripts/` | 패키지 소비 검증 테스트와 문서 검증기 (see `scripts/AGENTS.md`) |
| `.github/` | CI, docs 배포, 릴리스 workflow (see `.github/AGENTS.md`) |
| `docs/` | 설계 규칙과 결정의 정본 Markdown. AGENTS.md를 둘 수 없어 아래 "docs/"에서 설명한다. |
| `.changeset/` | 배포할 변경 기록. AGENTS.md를 둘 수 없어 아래 ".changeset/"에서 설명한다. |

## For AI Agents

### AGENTS.md를 두면 안 되는 디렉터리

아래 네 곳에는 AGENTS.md를 포함해 용도 밖의 Markdown을 추가하지 않는다. 설명은 가장 가까운 상위 AGENTS.md에 쓴다.

| 위치 | 이유 | 설명하는 곳 |
|------|------|-------------|
| `docs/**` | `apps/docs/lib/docs.mjs`가 `docs/maintainers/`를 뺀 `docs/` 아래 모든 `.md`를 재귀로 읽어 웹 페이지로 발행한다. `docs/maintainers/`는 loader가 제외하지만 같은 문서 트리이므로 AGENTS.md를 두지 않고 설명은 이 파일에 쓴다. `docs/decisions/`의 `.md`는 모두 `id`, `status`, `verified` frontmatter가 있어야 검증을 통과한다. | 이 파일 |
| `apps/docs/**` | `scripts/docs/validate.mjs`가 `apps/docs` 아래 `.md`, `.mdx`를 오류로 처리한다. 작성한 문서는 `apps/docs` 밖에 둔다는 규칙이다. | `apps/AGENTS.md` |
| `.changeset/` | changesets가 `README.md`를 뺀 모든 `.md`를 changeset으로 읽는다. | 이 파일 |
| `packages/tokens/tokens/` | `package.json`의 `files`가 디렉터리 전체를 npm에 배포한다. | `packages/tokens/AGENTS.md` |

### Working In This Directory

- 작업 전에 `DESIGN.md`의 표에서 질문에 맞는 정본 문서를 찾아 읽는다. 정본에 없는 선택은 일반 관행이나 외부 디자인 시스템으로 추정하지 않고 미확인으로 남긴다.
- 구현과 Figma가 다르면 한쪽을 임의로 정답으로 삼지 않고 차이를 기록한다. 현재 상태에 맞춰 정본을 바꾸지 않는다.
- 문서 본문은 한국어로 쓰고 같은 디렉터리 문서의 문체를 따른다(`docs/components/`, `docs/foundations/`, `docs/maintainers/`, `docs/README.md`는 `~합니다`, `DESIGN.md`와 `docs/decisions/`는 `~다`). 그리고 커밋 제목은 영어 Conventional Commits(`docs:`, `feat:`, `fix:`, `chore:`)를 쓴다. 코드 주석(JSDoc, DocC, KDoc 포함)은 한국어 평서문으로 쓴다. 식별자, 코드 예시, `@param` 같은 도구 태그는 그대로 둔다. 기존 영어 주석은 그 코드를 고칠 때 함께 옮긴다. changeset 본문은 영어다.
- `@canon/react`의 public prop이나 컴포넌트를 바꾸면 같은 변경에서 `docs/components/README.md`의 coverage matrix와 `docs/foundations/properties.md`의 계약 표를 고친다. 고치지 않으면 `pnpm test:docs`가 실패한다(자세한 규칙은 `scripts/docs/AGENTS.md`).
- 컴포넌트 JSDoc의 `<!-- canon:selection -->` 영역은 `docs/components/<kebab-case 컴포넌트 이름>.md`(IconButton → `docs/components/icon-button.md`)의 `## 선택`에서 생성한다. 문서 하나는 컴포넌트 하나를 다룬다. 영역 안을 손으로 고치지 않고 문서를 고친 뒤 `pnpm sync:comments`를 실행한다.
- 배포 패키지(`packages/*`)의 동작이 바뀌면 `pnpm changeset`으로 changeset을 추가한다.
- `main`에 push하면 `.github/workflows/release.yml`이 version PR을 만들거나 npm에 배포하고, `docs.yml`이 문서 사이트를 배포한다.

### Testing Requirements

- `pnpm check`: `pnpm test && pnpm test:docs && pnpm typecheck`. CI와 `pnpm release`가 같은 명령을 쓴다.
- `pnpm test`: `packages/*`를 빌드한 뒤 `@canon/react`의 vitest와 `node --test` 묶음(토큰 빌드·프리뷰, Figma 플러그인, 패키지 소비 검증)을 실행한다.
- `pnpm test:docs`: 문서 검증기와 선택 주석 생성기의 테스트, 문서 검증(`node scripts/docs/validate.mjs`), 선택 주석 최신성 검사(`node scripts/docs/sync-comments.mjs --check`), docs 앱 테스트, docs 정적 빌드를 차례로 실행한다. `docs/`, `DESIGN.md`, `apps/docs`, `packages/react/src`의 public interface를 바꿨다면 실행한다.
- `pnpm sync:comments`: `docs/components/<component>.md`의 `## 선택` 절로 `packages/react/src`의 JSDoc 생성 영역을 다시 쓴다.
- `pnpm typecheck`: 모든 workspace에서 `tsc --noEmit`을 실행한다.
- 로컬에서 컴포넌트를 볼 때는 `pnpm install`, `pnpm build` 뒤 `pnpm dev`로 `http://localhost:3000/docs/components/<컴포넌트>/`를 연다(playground는 `button`, `icon-button`에만 있다). `@canon/react`에는 watch가 없으므로 컴포넌트를 고친 뒤 `pnpm --filter @canon/react build`를 다시 실행한다.

### docs/

저장소의 설계 정본이다. 질문별 입구는 `DESIGN.md`의 표이고, 내부 문서의 구조 제안은 `docs/maintainers/repository-structure.md`가 기록한다. 새 문서를 추가하면 이 표와 `DESIGN.md`의 표에 행을 추가한다.

| 경로 | 내용 |
|------|------|
| `docs/README.md` | 공개 Getting started 페이지(`/docs`). 디자인 지침 요약, React 사용 예, 로컬 검증 명령. |
| `docs/foundations/color.md`, `typography.md`, `icons.md` | foundation. Figma 변수와 텍스트 스타일이 설계 정본이고 `packages/tokens`가 코드 배포 정본이다. 코드가 Figma와 일부러 다르게 둔 값은 `color.md`의 「5. Values that differ from Figma」에만 둔다. |
| `docs/foundations/properties.md` | 컴포넌트 프로퍼티 모델. `## Shared contract`가 property 의미의 정본이고 `## Platform translations`(`### React`, `#### React differences` 등)가 번역본이다. 검증기가 `@canon/react`의 public interface와 대조한다. |
| `docs/components/README.md` | 컴포넌트 목록. `## Implementation coverage matrix`가 `@canon/react` 공개 컴포넌트와 `*Props`를 문서화하는 표이고, 아직 만들지 않은 후보 행(`-`)도 둔다. 검증기가 TypeScript export와 대조한다. |
| `docs/components/button.md`, `icon-button.md` | 컴포넌트별 선택 기준, 접근성 계약, playground. 현재 문서가 있는 컴포넌트는 Button과 IconButton뿐이다. Checkbox, Dialog, NumberField, RadioGroup, Select, Switch, TextArea, TextField는 React 구현만 있고 문서와 playground는 다시 설계할 때까지 없다. `## 선택` 절이 선택 기준의 정본이고 `pnpm sync:comments`가 이 절로 JSDoc 영역을 생성한다. |
| `docs/maintainers/` | 웹 loader가 제외하는 내부 원고. `figma-workflow.md`(Figma 파일을 바꾸는 절차와 Figma MCP 제약), `references.md`(외부 디자인 시스템에서 가져온 것과 가져오지 않은 것, Canon 규칙의 정본은 아니다), `components/README.md`(컴포넌트 제작 규칙), `repository-structure.md`(디렉터리 책임과 구조 정리 제안). |
| `docs/guides/README.md` | 컴포넌트 선택 가이드의 범위와 작성 근거. 확정된 가이드는 아직 없다. |
| `docs/decisions/` | 결정 기록 `docs-platform`, `interaction-foundation`, `mobile-foundation`, `action-style`(모두 `adopted`). 새 결정 문서를 추가하면 `apps/docs/lib/docs.test.mjs`의 사이드바 route 목록도 고친다. |
| `docs/tools/ramps.py` | OKLCH 컬러 램프 생성기. `python3 docs/tools/ramps.py`(JSON), `--table`(표). |
| `docs/tools/figma-plugins/type-styles/` | Figma 텍스트 스타일을 만드는 플러그인(`code.js`의 `SPEC`, `manifest.json`)과 `code.test.js`. 테스트는 `pnpm test`에 포함된다. |
| `docs/tools/figma-plugins/component-set-layout/` | Figma 컴포넌트 세트의 variant 배치를 정렬하는 플러그인(`code.js`, `manifest.json`)과 `code.test.js`. 테스트는 `pnpm test`의 `docs/tools/figma-plugins/*/*.test.js` glob에 포함된다. |

- frontmatter: `verified`는 본문을 Figma, 코드, 공식 원천과 다시 대조한 날짜(`YYYY-MM-DD`)다. 일부만 고쳤다면 갱신하지 않는다. `navigation`(`getting-started`, `foundation`, `architecture`, `component`)과 `navigationOrder`는 docs 사이트의 사이드바 위치를 정한다.
- `docs/decisions/*.md`는 `id`(중복 금지), `status`(`proposed`, `adopted`, `superseded`, `deprecated`), `verified`가 필수다.
- 파일 경로가 곧 URL이다(`docs/components/button.md` → `/docs/components/button`, `docs/guides/README.md` → `/docs/guides`). 기존 URL을 보존하기 위해 문서를 옮기지 않는다.
- `docs/README.md`는 `@canon/react`를 언급해야 하고, `docs/guides/README.md`와 `docs/decisions/interaction-foundation.md`는 `@canon/react`와 `RUNTIME_STATUS_COMPONENTS`의 runtime 컴포넌트 이름을 모두 언급해야 검증을 통과한다.
- Props, 기본값, 토큰 값을 여러 문서에 복제하지 않고 정본을 링크한다.

### .changeset/

- `config.json`: `access: public`, `baseBranch: main`, `updateInternalDependencies: patch`.
- `README.md`: changesets 사용법.
- 나머지 `*.md`는 아직 배포되지 않은 changeset이다. frontmatter에 패키지와 bump 종류(`"@canon/react": minor`)를 쓰고 본문에 영어로 변경 내용을 쓴다. `pnpm changeset version`이 이 파일들을 소비해 각 패키지의 `CHANGELOG.md`와 버전을 갱신하므로 `CHANGELOG.md`를 직접 고치지 않는다.

### Common Patterns

- 패키지 빌드는 `tsup`, 테스트는 `@canon/react`만 vitest이고 나머지는 Node 내장 `node --test`다.
- 검증 스크립트와 테스트는 의도적으로 단순화한 지점을 `// shortcut:` 주석으로 표시하고 대체 조건을 적는다.
- 패키지 사이 의존은 `workspace:*`이고, docs 앱과 소비 검증 테스트는 소스가 아닌 빌드 산출물(`dist`)을 쓴다.

## Dependencies

### External

- pnpm workspace, TypeScript 5, tsup
- `@changesets/cli`: 버전과 릴리스 관리
- Style Dictionary 4(`@canon/tokens`), React 19와 React Aria Components(`@canon/react`), Next.js 16(`@canon/docs`)

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
