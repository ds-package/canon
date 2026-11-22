# preview

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-28

## Purpose
빌드된 토큰 CSS를 눈으로 확인하는 정적 페이지다. 색상 조합, 프리미티브, 시멘틱, 타이포그래피, shape 스케일을 보여주고 Figma 별칭(2026-11-16 기록)과 코드 값을 나란히 비교한다. 패키지에 배포되지 않는다(`package.json`의 `files`에 없다).

## Key Files

| File | Description |
|------|-------------|
| `index.html` | 페이지 마크업과 인라인 `<script>`. `../dist/css/variables.css`와 `./styles.css`를 링크한다. 테마(`data-theme-option`)와 색조(`data-tint-option`) 버튼이 `document.documentElement`의 `data-theme`, `data-tint`를 바꾼다. |
| `styles.css` | 프리뷰 레이아웃 스타일. `--semantic-*`, `--font-family-*` 같은 생성된 변수를 직접 참조한다. |
| `preview.test.js` | `index.html`의 인라인 스크립트를 가짜 DOM의 `node:vm`에서 실행해 비교 카드의 코드 값을 검사한다. |

## For AI Agents

### Working In This Directory
- `dist/css/variables.css`가 먼저 있어야 한다. 프리뷰와 테스트가 모두 빌드 산출물을 읽는다.
- 확인: `packages/tokens`를 정적 서버로 열어 `/preview/`에 접속한다(레포 실행 명령은 `docs/README.md`의 「Local verification」). 변경 뒤 브라우저를 새로고침한다.
- `preview.test.js`는 CSS의 첫 `}` 이전을 라이트 값으로, `[data-theme="dark"] { ... }` 블록을 다크 값으로 파싱한다. `build.js`의 출력 순서를 바꾸면 이 테스트가 깨진다.
- 카드의 `control/disabled`, `overlay/pressed` 같은 이름과 `Figma (2026-11-16) · gray/1000`, `코드 · #f5f5f5` 같은 문구가 테스트에 박혀 있다. 비교 카드 데이터나 문구를 바꾸면 테스트를 함께 고친다.
- 옛 변수(`--semantic-text-primary`, `--semantic-text-secondary`, `--semantic-text-tertiary`, `--semantic-text-accent`, `--semantic-background-base`, `--semantic-surface-muted`, `--semantic-border-(status|selected|accent)*`)를 프리뷰 소스에 쓰면 `scripts/build.test.js`가 실패한다. 같은 테스트는 비교 데이터에 `text/on-status`, `status/informative/default`, `surface/accent`, `control/selected-pressed`가 있는지도 본다. `html`과 `styles.css`가 모두 검사 대상이다.
- 이 디렉터리의 `*.test.js`는 패키지 `test` 스크립트에 포함되지 않고 루트 `pnpm test`에서만 실행된다.

### Testing Requirements
- 루트에서 `pnpm test` 또는 `pnpm build`가 끝난 뒤 `node --test packages/tokens/preview/*.test.js`.

## Dependencies

### Internal
- `../dist/css/variables.css`(`../scripts/build.js` 산출물).

### External
- 없다. 런타임 라이브러리 없이 브라우저 API와 `node:vm`만 쓴다.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
