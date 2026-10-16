---
verified: 2026-10-14
---
# Canon 제작 가이드

Canon의 컬러, 타이포, 컴포넌트를 만들고 고칠 때 따르는 규칙이다. 규칙마다 한 줄 이유를 붙였다. 이유가 더는 맞지 않으면 규칙을 고친다.

| 문서 | 다루는 것 |
| --- | --- |
| [color.md](./color.md) | 프리미티브 램프, 시멘틱 토큰 구조, 라이트/다크 값, 바인딩 규칙 |
| [typography.md](./typography.md) | 역할 기반 텍스트 스타일 29개, 한글 우선 행간, 변수 바인딩 |
| [components.md](./components.md) | 컴포넌트 프로퍼티 이름과 값, boolean과 variant 구분, 열린 결정 |
| [workflow.md](./workflow.md) | Figma 작업 방식, 마이그레이션 순서, 도구의 제약과 함정 |
| [references.md](./references.md) | 참고한 디자인 시스템과 가져온 것, 가져오지 않은 것 |
| [tools/](./tools/) | 램프 생성기(`ramps.py`), 텍스트 스타일 생성 Figma 플러그인 |

## 원칙

1. **Figma가 설계 정본이다.** `packages/tokens`는 Figma를 따라가며, 아래 동기화 상태를 함께 관리한다.
2. **컴포넌트는 시멘틱 토큰만 바인딩한다.** 프리미티브(`color/gray/200`)를 컴포넌트에 직접 연결하지 않는다. 직접 연결하면 다크 모드가 안 된다.
3. **이름은 쓰임새로 고른다.** `blue/bold/bold`나 `text-md/lineHeight-6/font-bold`가 아니라 `control/informative/solid`, `Label/16 Strong`처럼 용도를 말하는 이름을 쓴다.
4. **참고는 선별한다.** 다른 시스템의 규칙은 근거가 코드나 표준에 있는 것만 가져오고, 통째로 따르지 않는다. 기준은 [references.md](./references.md)에 있다.
5. **바꿀 때는 추가, 재바인딩, 검증, 삭제 순서로 한다.** 옛것을 먼저 지우지 않는다. 자세한 절차는 [workflow.md](./workflow.md)에 있다.

## 코드 토큰과 Figma 동기화 상태

2026-10-14 기준으로 `packages/tokens`를 Figma 정본에 맞췄다.

| 영역 | 동기화 결과 |
| --- | --- |
| 시멘틱 컬러 | `semantic` 컬러를 `background`, `surface`, `control`, `text`, `icon`, `border`, `overlay`, `static`, `accent`, `status/*` 구조로 제공한다. light와 dark가 같은 CSS 변수명을 공유한다. |
| 프리미티브 컬러 | 10색 x 12단계와 색별 alpha 3단계, gray, warm, white, black, whiteAlpha, blackAlpha를 제공한다. 10색 값은 `ramps.py` 출력과 같다. |
| 폰트 | sans는 Pretendard Variable, mono는 JetBrains Mono다. |
| 텍스트 | 숫자형 크기, px 행간, 굵기, 자간 프리미티브와 역할 기반 스타일 29개를 제공한다. |
| 코드 전용 토큰 | spacing, radius, shadow는 이번 Figma 동기화 범위가 아니어서 기존 값을 유지한다. |

다크 모드는 `[data-theme="dark"]`에서 명시적으로 적용하고, 테마 속성이 없으면 `prefers-color-scheme: dark`를 따른다. `data-theme="light"`는 시스템 다크보다 우선한다.

### 옛 시멘틱 토큰 대응

옛 이름의 호환 별칭은 남기지 않았다. 사용 맥락에 따라 아래 새 토큰으로 옮긴다.

| 옛 그룹 | 새 토큰 |
| --- | --- |
| `color/bg/strong*` | `control/neutral/solid`, `control/neutral/solid-hover`, `control/neutral/solid-pressed` |
| `color/bg/base`, `base-hover`, `faint`, `disabled` | `surface/default`, `overlay/hover`, `surface/muted`, `control/disabled` |
| `color/bg/brand`, `danger`, `success`, `info` | `control/informative`, `control/negative`, `control/positive`의 `solid`와 `surface/*` 상태 면 |
| `color/text/strong`, `base`, `faint`, `disabled` | `text/primary`, `text/secondary`, `text/tertiary`, `text/disabled` |
| `color/text/brand`, `danger`, `success` | `text/link` 또는 해당 `status/*/text` |
| `color/border/base*`, `faint`, `disabled` | `border/default`, `border/emphasis`, `border/disabled` |
| `color/border/danger*` | `status/negative/border` 또는 상태 오버레이 |
