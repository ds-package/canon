# apps

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
`apps/`에는 배포 대상 애플리케이션이 들어 있고 현재는 `docs/`(`@canon/docs`) 하나뿐이다. `apps/docs`는 Next.js App Router 정적 사이트로, 저장소 루트의 `DESIGN.md`와 `docs/**/*.md`(`docs/maintainers/` 제외)를 읽어 문서 web, 사이드바, 검색, Button·IconButton playground를 만든다. 이 파일이 `apps/docs` 하위 트리 전체의 유일한 설명 문서다.

## Key Files

| File | Description |
|------|-------------|
| `docs/package.json` | `@canon/docs`(private, ESM). 스크립트는 `dev`(`next dev`), `build`(`next build`), `test`(`node --test lib/docs.test.mjs`). `@canon/react`·`@canon/tokens`는 `workspace:*`, `next`·`react`·`react-dom`·`react-markdown`·`remark-gfm`은 정확한 버전으로 고정한다. |
| `docs/next.config.mjs` | `output: 'export'`, `trailingSlash: true`, `agentRules: false`. `basePath`는 `NODE_ENV === 'production'`일 때만 `/canon`(GitHub Pages 하위 경로)이다. |
| `docs/tsconfig.json` | `allowJs`, `checkJs: false`, `strict: false`. `app/**/*.jsx`, `components/**/*.jsx`, `lib/**/*.mjs`와 Next.js가 만드는 `.next/types/**/*.ts`, `.next/dev/types/**/*.ts`를 포함한다. |
| `docs/next-env.d.ts` | Next.js가 만드는 타입 참조 파일이다. 직접 고치지 않는다. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `docs/app/` | 라우트와 전역 CSS. 아래 `app/` 절 참고 |
| `docs/components/` | shell, 내비게이션, 검색, Markdown renderer, playground UI. 아래 `components/` 절 참고 |
| `docs/lib/` | 문서 색인, 내비게이션 그룹, 검색, playground 상태 모델과 테스트. 아래 `lib/` 절 참고 |

### app/
- `layout.jsx`: `globals.css`를 불러오고 `getDocumentIndex()`로 만든 색인을 `DocsShell`에 넘긴다. `<html lang="ko">`, 기본 title은 `Canon`이다.
- `page.jsx`: `getDocument('/')`, 즉 `DESIGN.md`를 `MarkdownPage`로 그린다.
- `docs/page.jsx`: `/docs` 라우트로 `docs/README.md`를 그린다.
- `docs/[...slug]/page.jsx`: 나머지 모든 `/docs/*`. `dynamicParams = false`이고 `generateStaticParams()`가 `route`가 `/docs/`로 시작하는 문서마다 한 페이지를 만든다. 색인에 없는 경로는 `notFound()`다.
- `docs/[...slug]/page.jsx`의 `playgrounds` 객체가 route → Playground 컴포넌트 매핑이다. 일치하는 route의 문서는 `MarkdownPage` 아래에 Playground가 붙는다. 현재 키는 `/docs/components/button`(`ButtonPlayground`)과 `/docs/components/icon-button`(`IconButtonPlayground`) 둘뿐이다. `/docs/components`와 `/docs/decisions/*`처럼 키가 없는 문서는 본문만 나온다.
- `globals.css`: `@canon/tokens/css`와 `@canon/react/styles.css`를 import하고 shell, markdown, search, `.playground-*` 스타일을 모두 담는다. 색은 `--semantic-*`, 반경은 `--radius-*` 토큰만 쓴다. 새 playground는 `.playground-<name>-stage` 클래스를 여기에 추가한다.

### components/
- `DocsShell.jsx`: 서버 컴포넌트. `groupNavigationDocuments`로 내비게이션을 한 번 만들어 상단바(`DocsAreaNavigation`, `Search`, GitHub 링크), `SidebarNavigation`, `<main>`을 배치한다.
- `DocsAreaNavigation.jsx`, `SidebarNavigation.jsx`: `'use client'`. `usePathname()`으로 모드(`home`/`docs`/`components`)를 구해 상단 Docs·Components 활성 표시와 사이드바 섹션을 바꾼다. component 모드에서는 일반 문서 섹션을 숨기고 `/docs/components`(`docs/components/README.md`)를 `Overview`로 표시한다. 모바일은 `<details>` disclosure다.
- `Search.jsx`: `'use client'`. 문서 색인을 props로 받아 `searchDocuments`로 걸러 상위 결과 링크를 보여 준다.
- `MarkdownPage.jsx`: `react-markdown` + `remark-gfm`. 링크는 `toWebHref(href, document.sourcePath)`로 바꿔 `/`로 시작하면 `next/link`, 아니면 `<a>`다.
- `ButtonPlayground.jsx`: `'use client'`. `ButtonPlayground`와 `IconButtonPlayground`(`initialComponent: 'icon'`) 두 export가 한 파일에 있다. `@canon/react`를 직접 import해 미리보기를 그리고, 상태 계산은 `lib/button-playground.mjs`에 위임한다. Checkbox, Dialog 같은 다른 컴포넌트의 playground는 문서와 함께 삭제되어 없다. 화면에는 control, Reset, `Copy JSX`, 미리보기, 복사용 JSX 코드가 나온다.

### lib/
- `docs.mjs`: `readDocuments()`가 `DESIGN.md`와 repo `docs/` 아래 모든 `.md`를 재귀로 읽되 `PRIVATE_DOCS_DIRECTORY`(`docs/maintainers`)는 건너뛴다. `sourceToRoute`는 `DESIGN.md` → `/`, `docs/README.md` → `/docs`처럼 매핑한다(`README`는 디렉터리 route). `toWebHref`는 상대 `.md` 링크를 web route로(`docs/maintainers/` 문서는 제외), 그 밖의 repo 경로와 `docs/maintainers/` 문서 링크를 `https://github.com/ds-package/canon/(blob|tree)/main/...`으로 바꾼다. `parseDocument`는 frontmatter의 `navigation`, `navigationOrder`, 첫 heading(title), headings, 검색용 body를 뽑는다. `getDocumentIndex()`는 `markdown` 본문을 뺀 색인이다.
- `navigation.mjs`: 사이드바 섹션 키는 `getting-started`, `foundation`, `architecture`, 컴포넌트는 `navigation: component`다. `navigationOrder`가 없으면 맨 뒤에서 title 순이다. `/docs/components`는 컴포넌트 목록 맨 앞으로 옮긴다.
- `search.mjs`: 모든 검색어가 title·headings·body 중 하나에 있어야 하고 점수는 title 3, headings 2, body 1이다. 기본 8건이다.
- `button-playground.mjs`: `initialButtonPlaygroundState`(동결 객체, 기본 `variant: 'secondary'`, `size: 'lg'`)와 `getButtonPlaygroundModel(state)`. 모델은 미리보기 props, theme, 복사용 `jsx` 문자열을 돌려주는 순수 함수다. `component`가 `'icon'`이면 IconButton 모델이고 `destructive` variant는 `secondary`로 바꾼다.
- `docs.test.mjs`: 아래 Testing Requirements 참고.

## For AI Agents

### Working In This Directory
- `apps/docs` 아래에 `AGENTS.md`, `README.md`를 포함한 어떤 Markdown도 만들지 않는다. `scripts/docs/validate.mjs`의 `validateDocsApp`이 `node_modules`, `.next`, `out`을 제외한 `.md`/`.mdx`를 모두 `authored docs prose must live outside apps/docs` 오류로 처리해 `pnpm test:docs`를 실패시킨다. 이 하위 트리의 설명은 이 파일에만 쓴다.
- repo `docs/` 아래에도 `AGENTS.md`를 두지 않는다. `readDocuments()`가 `docs/maintainers/`를 뺀 `docs/` 아래 모든 `.md`를 읽으므로 추가한 Markdown은 곧 공개 web 페이지와 검색 색인이 된다. `docs/maintainers/`의 Markdown은 route, 사이드바, 검색에 나오지 않는다.
- 원고는 repo 루트의 `DESIGN.md`와 `docs/`가 정본이다. 앱은 읽어서 보여 줄 뿐 복사하지 않는다.
- 앱은 `@canon/react`, `@canon/tokens`의 빌드 산출물(`dist`)을 쓴다. 컴포넌트를 고친 뒤에는 `pnpm --filter @canon/react build`를 다시 실행해야 playground에 반영된다(`@canon/react`에는 watch 스크립트가 없다).
- 새 컴포넌트 문서(`docs/components/<name>.md`, `navigation: component`)를 추가하면 함께 확인한다: 1) `lib/<name>-playground.mjs`와 `components/<Name>Playground.jsx`를 만들고 2) `app/docs/[...slug]/page.jsx`의 import와 `playgrounds` 키(`/docs/components/<name>`)를 추가하고 3) `globals.css`에 `.playground-<name>-stage`를 더하고 4) `lib/docs.test.mjs`의 컴포넌트 route 목록과 해당 playground 테스트를 갱신한다. playground 없이 문서만 추가하더라도 `docs.test.mjs`의 컴포넌트 route 목록은 갱신해야 한다.
- 문서 파일명·위치를 바꾸면 route가 바뀐다. `docs.test.mjs`의 route 기대값과 다른 문서의 상대 링크를 함께 확인한다.
- 사이드바 그룹은 문서 frontmatter가 정한다. 새 문서에 `navigation`(`getting-started`/`foundation`/`architecture`/`component`)이 없으면 사이드바에 나타나지 않고, 일반 문서의 순서는 `navigationOrder`가 정한다.
- `docs/components/README.md`(`/docs/components`)는 `navigation: component`지만 playground가 없는 Overview이며 `app/docs/[...slug]/page.jsx`의 `playgrounds`에도 없다.
- 검색 색인은 `layout.jsx`에서 클라이언트로 전달되는 전체 문서 본문 텍스트(`body`)를 포함한다. 비공개 내용은 `docs/`에 두지 않는다.
- 정적 export라서 서버 런타임 기능(route handler, 동적 데이터)을 쓰지 않는다. 개발 서버는 `basePath`가 빈 값이라 `http://localhost:3000/docs/components/button/`처럼 연다.

### Testing Requirements
- 단위 테스트: `pnpm --filter @canon/docs test`(`node --test lib/docs.test.mjs`).
- 정적 빌드 검증: `pnpm --filter @canon/docs... build`(`@canon/docs`와 의존 workspace 패키지를 먼저 빌드한 뒤 `next build`). 산출물은 `apps/docs/out`이다.
- 개발 서버: 루트에서 `pnpm build` 후 `pnpm dev`(`pnpm -r dev`)를 실행하고 `/docs/components/<컴포넌트>/`를 연다. 이 앱만 띄울 때는 `pnpm --filter @canon/docs dev`다.
- 전체: `pnpm test:docs`(validator 테스트, validator, 앱 테스트, 앱 빌드). `pnpm check`가 이를 포함한다.
- `docs.test.mjs`(테스트 8개)는 실제 `docs/` 말뭉치에 의존한다: 컴포넌트 route 전체 목록(`/docs/components/button`, `/docs/components/icon-button`, `/docs/components`), 사이드바 세 섹션의 route와 순서, `React Aria Components responsibility boundaries` 검색이 `/docs/decisions/interaction-foundation`을 1순위로 돌려주는지, Button·IconButton playground 모델의 props·JSX 문자열을 검증한다. 임시 디렉터리 fixture로 `docs/maintainers/`가 route, 내비게이션, 검색에서 빠지는지도 검사한다. 공개 문서를 추가·삭제·개명하면 이 테스트가 실패한다.

### Common Patterns
- 한 playground는 쌍이다: 순수 상태 모델(`lib/*.mjs`, 테스트 대상)과 그것을 그리는 `'use client'` 컴포넌트.
- 컴포넌트는 `useState(initial…State)`, `setOption`, `copyJsx`(`navigator.clipboard`, 상태 문구 `Copy JSX`/`Copied`/`Copy failed`)를 같은 형태로 쓴다. dark 옵션을 두고 `useEffect`로 `document.documentElement`의 `data-theme`을 바꾸고 정리 시 되돌린다.
- 컴포넌트와 lib는 `.jsx`/`.mjs`이며 import 경로에 확장자를 쓴다.
- 검색과 파서의 `shortcut:` 주석은 의도된 단순화다(어휘 검색만 지원).

## Dependencies

### Internal
- `@canon/react`, `@canon/tokens`(`workspace:*`): playground 렌더링과 CSS 토큰.
- 저장소 루트 `DESIGN.md`, `docs/**/*.md`: 런타임에 읽는 원고.
- `scripts/docs/validate.mjs`: 이 앱에 Markdown이 없음을 강제한다.

### External
- `next` 16.4.6, `react`/`react-dom` 19.3.1, `react-markdown` 10.1.0, `remark-gfm` 4.0.1.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
