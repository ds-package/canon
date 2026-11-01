---
verified: 2026-10-16
---
# 아이콘

Canon의 아이콘은 Phosphor를 쓴다. 직접 그리지 않는다.

## 1. 결정

| 항목 | 내용 |
| --- | --- |
| 라이브러리 | Phosphor Icons. 코드는 `@phosphor-icons/react`(확인 시점 2.1.10, MIT, React 16.8 이상), Figma는 공식 플러그인 `@phosphor-icons/figma` |
| 채택 이유 | 선택 상태를 `fill` weight로 표현할 수 있다. weight가 이산값이라 크기별 규칙을 표로 고정할 수 있다. `mirrored`, `alt`가 기본 제공이다. |
| 가져온 방식 | shadcn/ui처럼 컴포넌트가 아이콘을 슬롯으로 받고 크기를 제어한다. Astryx의 의미 이름 레지스트리와 테마별 아이콘 교체는 가져오지 않았다. |
| 가져오지 않은 이유 | 소비처가 하나라 세트를 교체할 일이 없고, 레지스트리는 유지 비용만 만든다. 교체가 필요해지면 `Icon` 래퍼 한 곳만 고친다. |

## 2. 실측 규격

`house` 아이콘의 6개 weight SVG를 직접 열어 확인했다.

- viewBox는 `0 0 256 256`이고 `fill="currentColor"`다. 선이 아니라 윤곽 path로 변환돼 있어서 `stroke-width`로 두께를 바꿀 수 없다. 두께를 바꾸려면 weight를 바꾼다.
- 선 두께는 256 격자 기준 thin 8, light 12, regular 16, bold 24다(`house`의 벽 두께로 측정). 아래는 크기별 px 환산이다.

| 크기 (`icon/size`) | thin | light | regular | bold |
| --- | --- | --- | --- | --- |
| xs 12 | 0.38 | 0.56 | 0.75 | 1.13 |
| sm 16 | 0.50 | 0.75 | 1.00 | 1.50 |
| md 20 | 0.63 | 0.94 | 1.25 | 1.88 |
| lg 24 | 0.75 | 1.13 | 1.50 | 2.25 |
| xl 32 | 1.00 | 1.50 | 2.00 | 3.00 |

24px 격자에서 2px 선을 쓰는 Lucide, Tabler와 비교하면 Phosphor regular는 24px에서 1.5px로 가볍다. 같은 화면에서 라이브러리를 섞지 않는다.

## 3. 적용 현황 (2026-10-16 Figma 기준)

Figma의 Phosphor 라이브러리(`Phosphor Icons (Community)`)를 팀 라이브러리로 연결해 쓴다. 컴포넌트 이름은 아이콘마다 `Format=Outline, Weight=...` variant를 가진다. `Format=Outline`은 윤곽 path이고 `Stroke`는 선 속성 vector다. Canon은 `Outline`만 쓴다.

| 컴포넌트 | 아이콘 | weight | 크기(px) |
| --- | --- | --- | --- |
| Button | `Plus`(기본값, `icon` 속성으로 교체) | bold | 12, 14, 16, 20 |
| Select | `CaretDown` | bold | 20, 22, 24, 26 |
| Tag | `X`, `Star` | bold | 14, 16, 20 |
| Close Button | `X` | bold | 20, 24, 32 |
| Checkbox | `Check` | bold | 10, 14, 18 |
| Input | `MagnifyingGlass`(자리표시자였던 `CkReact` 대체) | bold | 24 |
| Alert | `Info`, `Warning`, `CheckCircle` | fill | 24 |

- 컨트롤 안의 아이콘은 `bold`, 상태를 알리는 아이콘(Alert)은 원형과 삼각형이 자연스럽게 채워지는 `fill`이다.
- 아이콘 색은 같은 컴포넌트의 라벨 글자 토큰에 바인딩한다([color.md](./color.md) 규칙 5). Phosphor 인스턴스는 교체 직후 fill 바인딩이 초기화되므로 교체 뒤에 다시 바인딩한다.
- 크기 일부(10, 14, 18, 22, 26)는 `icon/size`(12, 16, 20, 24, 32)에 없다.

## 4. 규칙

1. **weight는 컴포넌트가 정하고 사용자에게 열지 않는다.** 위 표대로 고정한다. 컨트롤 안은 `bold`, 상태 아이콘(Alert)과 선택된 상태는 `fill`이다.
   - 이유: 한 화면에 weight가 섞이면 선 두께가 어긋나 일관성이 깨진다.
   - 예외: 모든 아이콘의 `fill`이 "채운 같은 모양"은 아니다. `x`, `check`, `minus`, `plus`의 `fill`은 모서리가 둥근 사각 박스 안에 기호를 뺀 모양이고, `caret-*`의 `fill`은 속이 찬 삼각형이다. 닫기, 체크, 확장 표시처럼 모양이 바뀌면 안 되는 곳에서는 `fill`을 쓰지 않는다. 원형(`info`, `warning`, `check-circle`, `x-circle`)과 `magnifying-glass`는 자연스럽게 채워진다.
2. **`thin`, `light`, `duotone`은 쓰지 않는다.**
   - 이유: 작은 크기에서 0.5px 아래로 내려가고, duotone은 면 색을 따로 정해야 해서 `icon/*` 토큰 구조와 맞지 않는다.
3. **색은 `currentColor`를 상속한다.** 라벨이 있는 컴포넌트의 아이콘은 라벨 글자와 같은 토큰을 쓰고([color.md](./color.md) 규칙 5), 독립 아이콘만 `icon/primary`, `icon/secondary`, `icon/disabled`, `icon/inverse`를 쓴다.
4. **크기는 `Icon` 래퍼가 `size` prop으로 명시해서 넘긴다.** `IconContext`로 일괄 지정하지 않는다.
   - 이유: SSR 엔트리(`/ssr`)의 아이콘은 Context를 쓰지 않아서 상속이 안 된다.
5. **아이콘은 개별 경로로 import한다**(`@phosphor-icons/react/dist/csr/<Name>` 또는 Next의 `optimizePackageImports`).
   - 이유: 메인 모듈을 import하면 9,000개 이상 모듈 때문에 일부 번들러에서 컴파일이 느리다.
6. **의미가 있는 아이콘은 `alt`나 `aria-label`을 둔다.** 라벨 옆의 장식 아이콘은 숨긴다.
7. **Figma의 아이콘은 컴포넌트 안에서 Instance Swap으로 교체한다.** 아이콘 색은 fill 변수로 바인딩한다.

## 5. Figma 구성

- 아이콘은 Phosphor 라이브러리 컴포넌트를 인스턴스로 쓴다. Canon 파일에 아이콘 컴포넌트를 따로 만들지 않는다.
- Button은 `icon` 인스턴스 스왑 속성으로 슬롯의 아이콘을 바꾼다. 좌우 슬롯(`.left-icon`, `.right-icon`)은 각각 `showLeadingIcon`, `showTrailingIcon`으로 보임을 제어하고, `icon` 속성에 `mainComponent`가 연결돼 있다. preferred values는 Phosphor `Outline, Bold` 아홉 개다.
- 라이브러리 컴포넌트의 vector는 fill이 바인딩돼 있지 않아서 인스턴스에서 변수를 직접 바인딩한다.
- 다른 컴포넌트(Select, Tag, Close Button, Checkbox, Input, Alert)는 아이콘을 고정 인스턴스로 두고, 필요하면 인스턴스에서 교체한다.

## 6. 열린 결정

- 범위 밖이라 `Ck*`가 남은 곳: NumberInput(`CkTriangleUp`, `CkTriangleDown` 80개), Modal(`CkAdd` 30개, Button 인스턴스에서 직접 지정된 것으로 보임), Card(`CkAtSign`, `CkStar`), Menu와 Input 일부(`CkReact`), Tag(`CkBell` 2개).
- 크기가 `icon/size` 스케일(12, 16, 20, 24, 32)에 없는 곳(10, 14, 18, 22, 26)을 스케일에 맞출지 정한다.
- 작은 크기(12px와 16px 이하)에서 `bold`가 충분한지 렌더로 확인한다.
- 코드에는 `icon/size` 토큰이 없다(Figma에만 있다). `packages/tokens`에 추가할지 정한다.
- 브랜드 고유 글리프(로고 등)를 어디에 둘지 정한다.
