---
verified: 2026-11-01
---
# Canon 제작 가이드

Canon의 컬러, 타이포, 컴포넌트를 만들고 고칠 때 따르는 규칙이다. 규칙마다 한 줄 이유를 붙였다. 이유가 더는 맞지 않으면 규칙을 고친다.

| 문서 | 다루는 것 |
| --- | --- |
| [color.md](./color.md) | 프리미티브 램프, 시멘틱 토큰 구조, 라이트/다크 값, 바인딩 규칙 |
| [typography.md](./typography.md) | 역할 기반 텍스트 스타일 29개, 한글 우선 행간, 변수 바인딩 |
| [components.md](./components.md) | 컴포넌트 프로퍼티 이름과 값, boolean과 variant 구분, 열린 결정 |
| [icons.md](./icons.md) | Phosphor 채택 결정, 실측 규격, 크기와 weight 매핑, 사용 규칙 |
| [workflow.md](./workflow.md) | Figma 작업 방식, 마이그레이션 순서, 도구의 제약과 함정 |
| [references.md](./references.md) | 참고한 디자인 시스템과 가져온 것, 가져오지 않은 것 |
| [tools/](./tools/) | 램프 생성기(`ramps.py`), 텍스트 스타일 생성 Figma 플러그인 |

## 원칙

1. **Figma가 설계 정본이다.** `packages/tokens`는 Figma를 따라가며, 아래 동기화 상태를 함께 관리한다.
2. **컴포넌트의 컬러는 시멘틱 토큰만 바인딩한다.** 컬러 프리미티브(`color/gray/200`)를 컴포넌트에 직접 연결하지 않는다. 직접 연결하면 다크 모드가 안 된다. 간격·모서리·타이포그래피에는 해당 토큰을 사용한다.
3. **이름은 쓰임새로 고른다.** `blue/bold/bold`나 `text-md/lineHeight-6/font-bold`가 아니라 `control/informative/solid`, `Label/16 Strong`처럼 용도를 말하는 이름을 쓴다.
4. **참고는 선별한다.** 다른 시스템의 규칙은 근거가 코드나 표준에 있는 것만 가져오고, 통째로 따르지 않는다. 기준은 [references.md](./references.md)에 있다.
5. **바꿀 때는 추가, 재바인딩, 검증, 삭제 순서로 한다.** 옛것을 먼저 지우지 않는다. 자세한 절차는 [workflow.md](./workflow.md)에 있다.

## 코드 토큰과 Figma 동기화 상태

아래는 2026-11-01에 `packages/tokens`를 Figma 정본에 맞춘 기록이다. 이후 Figma 변경까지 자동 검증하는 상태 표가 아니다. 프리뷰의 비교값은 해당 시점의 문서 기록이며, 현재 Figma 값은 원문을 다시 확인해야 한다.

| 영역 | 동기화 결과 |
| --- | --- |
| 시멘틱 컬러 | `semantic` 컬러를 적용 대상 중심의 `background`, `surface`, `control`, `text`, `icon`, `border`, `status`, `overlay`, `static` 구조로 제공한다. `status/*`는 글자·아이콘이 함께 쓰는 의미색이고, 대상별 값이나 역할이 다를 때만 `border/status-*`처럼 대상 그룹에 예외를 둔다. light와 dark가 같은 CSS 변수명을 공유한다. |
| 프리미티브 컬러 | 10색 x 12단계와 색별 alpha 3단계, gray, warm, white, black, whiteAlpha, blackAlpha를 제공한다. 10색 값은 `ramps.py` 출력과 같다. |
| 폰트 | sans는 Pretendard Variable, mono는 JetBrains Mono다. |
| 텍스트 | 숫자형 크기, px 행간, 굵기, 자간 프리미티브와 역할 기반 스타일 29개를 제공한다. |
| 코드 전용 토큰 | spacing, radius, shadow는 이번 Figma 동기화 범위가 아니어서 기존 값을 유지한다. |

테마 속성은 문서 최상위 `html`에만 설정한다. 다크 모드는 `data-theme="dark"`에서 명시적으로 적용하고, 테마 속성이 없으면 `prefers-color-scheme: dark`를 따른다. `data-theme="light"`는 시스템 다크보다 우선한다.

`data-tint`, `data-brand`, `data-shape`도 같은 `html`에서 설정한다. 하위 영역에서 테마를 바꾸거나 부모의 테마를 기본값으로 되돌리는 중첩 테마는 지원하지 않는다. 현재 dark의 cool과 warm은 같은 중립색을 사용한다.

### 로컬 검증

`pnpm dev`는 토큰 JSON과 TypeScript 변경을 감시해 배포 파일을 갱신한다. 프리뷰는 `packages/tokens`를 정적 서버로 열어 `/preview/`에서 확인한다. 브라우저는 변경 뒤 새로고침한다.

`pnpm check`는 빌드, 토큰·프리뷰·타이포 회귀 테스트, 실제 패키지 묶음의 소비 검증과 타입 검사를 실행한다. CI와 npm 배포 명령은 같은 검증을 사용한다.

### 프로젝트 적용과 커스텀

`canon init`은 `@canon/tokens/css`를 가져오는 `canon.css`를 만든다. 브랜드색은 실제 `--brand-*` 변수를 오버라이드한다. 기존 파일은 덮어쓰지 않으며, 사용하지 않는 `canon.config.json`은 새로 만들지 않는다.

`canon eject`는 소비 프로젝트에 설치된 `@canon/tokens`에서 JSON을 `canon/tokens/`로 복사하고 `canon/build.mjs`를 만든다. `pnpm add -D 'style-dictionary@^4.1.4'` 후 `node canon/build.mjs`를 실행하면 빌드 산출물(CSS, Tailwind 프리셋)은 `canon/dist/`에 모이고, CSS만 `src/styles/canon-variables.css`로 복사된다. 이 CSS를 제품에서 가져온다. `src/styles`의 다른 파일은 건드리지 않는다.

복사한 JSON은 직접 수정한다. CSS 이름과 테마 규칙을 유지하기 위해 빌드 도구는 `@canon/tokens/build`를 계속 사용하므로 `@canon/tokens` 설치와 잠금 파일을 유지한다. 이전 CLI가 만든 `style-dictionary.config.json`은 새 빌드에 쓰지 않으며 자동 삭제하지 않는다.

### 옛 시멘틱 토큰 대응

옛 이름의 호환 별칭은 남기지 않았다. 사용 맥락에 따라 아래 새 토큰으로 옮긴다.

| 옛 그룹 | 새 토큰 |
| --- | --- |
| `color/bg/strong*` | `control/neutral/solid`, `control/neutral/solid-hover`, `control/neutral/solid-pressed` |
| `color/bg/base`, `base-hover`, `faint`, `disabled` | `surface/default`, `overlay/hover`, `surface/muted`, `control/disabled` |
| `color/bg/brand`, `danger`, `success`, `info` | `control/informative`, `control/negative`, `control/positive`의 `solid`와 `surface/*` 상태 면 |
| `color/text/strong`, `base`, `faint`, `disabled` | `text/primary`, `text/secondary`, `text/tertiary`, `text/disabled` |
| `color/text/brand`, `danger`, `success` | `text/link`, `text/accent` 또는 해당 `status/*` 의미색 |
| `color/border/base*`, `faint`, `disabled` | `border/default`, `border/emphasis`, `border/disabled` |
| `color/border/danger*` | `border/status-negative`, `border/status-negative-subtle` 또는 상태 오버레이 |
