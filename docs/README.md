---
verified: 2026-10-14
---
# Canon 제작 가이드

Canon의 컬러, 타이포, 컴포넌트를 만들고 고칠 때 따르는 규칙이다. 규칙마다 한 줄 이유를 붙였다. 이유가 더는 맞지 않으면 규칙을 고친다.

| 문서 | 다루는 것 |
| --- | --- |
| [color.md](./color.md) | 프리미티브 램프, 시멘틱 토큰 구조, 라이트/다크 값, 바인딩 규칙 |
| [typography.md](./typography.md) | 역할 기반 텍스트 스타일 25개, 한글 우선 행간, 변수 바인딩 |
| [components.md](./components.md) | 컴포넌트 프로퍼티 이름과 값, boolean과 variant 구분, 열린 결정 |
| [workflow.md](./workflow.md) | Figma 작업 방식, 마이그레이션 순서, 도구의 제약과 함정 |
| [references.md](./references.md) | 참고한 디자인 시스템과 가져온 것, 가져오지 않은 것 |
| [tools/](./tools/) | 램프 생성기(`ramps.py`), 텍스트 스타일 생성 Figma 플러그인 |

## 원칙

1. **Figma가 설계 정본이다.** `packages/tokens`는 Figma를 따라가는 동기화 대상이다. 지금은 맞지 않는다(아래 표).
2. **컴포넌트는 시멘틱 토큰만 바인딩한다.** 프리미티브(`color/gray/200`)를 컴포넌트에 직접 연결하지 않는다. 직접 연결하면 다크 모드가 안 된다.
3. **이름은 쓰임새로 고른다.** `blue/bold/bold`나 `text-md/lineHeight-6/font-bold`가 아니라 `status/informative/solid`, `Label/16 Strong`처럼 용도를 말하는 이름을 쓴다.
4. **참고는 선별한다.** 다른 시스템의 규칙은 근거가 코드나 표준에 있는 것만 가져오고, 통째로 따르지 않는다. 기준은 [references.md](./references.md)에 있다.
5. **바꿀 때는 추가, 재바인딩, 검증, 삭제 순서로 한다.** 옛것을 먼저 지우지 않는다. 자세한 절차는 [workflow.md](./workflow.md)에 있다.

## 코드 토큰과 Figma의 차이 (미동기화)

2026-10-14 기준으로 Figma를 새로 정리했고 `packages/tokens`는 아직 그대로다. 코드 쪽을 Figma에 맞추는 일은 별도 작업이다.

| 영역 | Figma (정본) | `packages/tokens` (현재) |
| --- | --- | --- |
| 시멘틱 컬러 | `semantic` 60개. `surface`, `text`, `icon`, `border`, `neutral`, `overlay`, `static`, `status/*`. light와 dark 두 모드 | `semantic.json` 30개. `color/{bg,text,border}` x `strong/base/faint`. 단일 모드 |
| 프리미티브 컬러 | 10색 x 12단계(50~1000), gray, warm, alpha. OKLCH 기준점으로 생성 | `color.json` 51개. gray, blue, red, green 등 100~1000 단계 |
| 폰트 | Pretendard Variable | Inter, JetBrains Mono |
| 텍스트 | 역할 기반 스타일 25개(Display, Heading, Body, Label, Caption) | 크기, 행간, 굵기, 자간 토큰(`xs`~`7xl`) |
