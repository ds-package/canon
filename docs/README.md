---
verified: 2026-11-01
---
# Canon 제작 가이드

Canon의 컬러, 타이포, 컴포넌트를 만들고 고칠 때 따르는 문서다. [DESIGN.md](../DESIGN.md)는 작업 질문을 해당 정본으로 연결하고, 이 문서는 각 문서의 현재 역할과 정본 경계를 기록한다.

| 문서 | 현재 역할 | 정본 경계 |
| --- | --- | --- |
| [color.md](./color.md) | 컬러 foundation과 현재 토큰 계약 | Figma 변수는 설계 값과 이름의 정본이고 `packages/tokens`는 코드 배포 정본이다. 이 문서는 둘의 대응과 선택 규칙을 설명한다. |
| [typography.md](./typography.md) | 타이포 foundation과 Figma 바인딩 규칙 | Figma 텍스트 스타일은 설계 정본이고 `packages/tokens`는 코드 토큰 정본이다. |
| [components.md](./components.md) | Figma 컴포넌트 프로퍼티 규칙과 현재 상태의 스냅샷 | 현재 runtime 컴포넌트 패키지는 없다. 이 문서는 미래 React API의 정본이 아니다. |
| [icons.md](./icons.md) | 아이콘 foundation, Phosphor 채택 결정, Figma 적용 현황 | Phosphor 원본과 Canon Figma 컴포넌트가 현재 근거다. 코드 icon package 계약은 아직 없다. |
| [workflow.md](./workflow.md) | Figma contributing 절차 | Figma MCP 제약과 실제 마이그레이션에서 검증한 순서를 기록한다. |
| [decisions/interaction-foundation.md](./decisions/interaction-foundation.md) | React Aria Components 채택 결정 | interaction foundation의 이유, 책임 경계, 재검토 조건의 정본이다. |
| [guides/README.md](./guides/README.md) | 컴포넌트 선택 가이드의 범위와 작성 기준 | 실제 선택 가이드는 아직 없다. 확인되지 않은 선택을 Canon 규칙으로 만들지 않는다. |
| [references.md](./references.md) | 외부 시스템을 참고한 근거 | 가져온 것과 가져오지 않은 것을 구분하는 증거다. Canon 규칙 자체의 정본은 아니다. |
| [tools/](./tools/) | 문서를 실제 값과 Figma에 연결하는 도구 | 생성된 결과가 아니라 스크립트와 플러그인 소스가 정본이다. |

현재 문서는 foundation, 규칙, 현황이 일부 섞여 있다. 기존 URL을 보존하기 위해 지금은 이동하지 않는다. runtime 컴포넌트와 실제 선택 근거가 생기면 package-local rules와 component guide로 필요한 내용만 분리한다.

문서의 `verified`는 본문을 실제 Figma, 코드, 공식 원천과 다시 대조한 날짜다. 일부만 바꿨다면 전체 문서의 `verified`를 갱신하지 않는다.

`pnpm test:docs`는 `DESIGN.md`와 이 index의 로컬 링크, decision metadata와 ID 중복을 검사한다. CI도 같은 명령을 실행한다.

## 원칙

1. **Figma가 설계 정본이다.** `packages/tokens`는 Figma를 따라가며, 아래 동기화 상태를 함께 관리한다.
2. **컴포넌트는 시멘틱 토큰만 바인딩한다.** 프리미티브(`color/gray/200`)를 컴포넌트에 직접 연결하지 않는다. 직접 연결하면 다크 모드가 안 된다.
3. **이름은 쓰임새로 고른다.** `blue/bold/bold`나 `text-md/lineHeight-6/font-bold`가 아니라 `control/informative/solid`, `Label/16 Strong`처럼 용도를 말하는 이름을 쓴다.
4. **참고는 선별한다.** 다른 시스템의 규칙은 근거가 코드나 표준에 있는 것만 가져오고, 통째로 따르지 않는다. 기준은 [references.md](./references.md)에 있다.
5. **바꿀 때는 추가, 재바인딩, 검증, 삭제 순서로 한다.** 옛것을 먼저 지우지 않는다. 자세한 절차는 [workflow.md](./workflow.md)에 있다.

## 코드 토큰과 Figma 동기화 상태

2026-11-01 기준으로 `packages/tokens`를 Figma 정본에 맞췄다.

| 영역 | 동기화 결과 |
| --- | --- |
| 시멘틱 컬러 | `semantic` 컬러를 적용 대상 중심의 `background`, `surface`, `control`, `text`, `icon`, `border`, `status`, `overlay`, `static` 구조로 제공한다. `status/*`는 글자·아이콘이 함께 쓰는 의미색이고, 대상별 값이나 역할이 다를 때만 `border/status-*`처럼 대상 그룹에 예외를 둔다. light와 dark가 같은 CSS 변수명을 공유한다. |
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
| `color/text/brand`, `danger`, `success` | `text/link`, `text/accent` 또는 해당 `status/*` 의미색 |
| `color/border/base*`, `faint`, `disabled` | `border/default`, `border/emphasis`, `border/disabled` |
| `color/border/danger*` | `border/status-negative`, `border/status-negative-subtle` 또는 상태 오버레이 |
