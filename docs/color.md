---
verified: 2026-11-16
navigation: foundation
navigationOrder: 1
---
# 컬러

Canon의 색 이름과 값의 기준은 Figma 변수다. `packages/tokens`는 Figma를 따라 코드로 배포하는 사본이다.

Figma 변수는 다섯 컬렉션이다.

| 컬렉션 | 맡는 것 | 모드 |
| --- | --- | --- |
| `primitive` | 색 램프와 크기 원값 | 하나 |
| `semantic` | 컴포넌트가 쓰는 역할 이름 | `light`, `dark` |
| `tint` | 중립 면의 색조 | `cool`, `warm` |
| `brand` | 브랜드 색 램프 | `default` |
| `shape` | 모서리 단계 | `default`, `sharp`, `soft` |

컴포넌트는 `semantic`만 쓴다. `tint`, `brand`, `shape`는 light·dark와 상관없이 따로 바꾸는 테마 축이다.

코드가 Figma와 일부러 다르게 둔 값이 있다. 「5. Figma와 다른 값」에 모아 두었다. 그 밖의 차이는 동기화 누락으로 본다.

## 1. 프리미티브 램프

### 구조

- 색은 10개다.
  - `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `indigo`, `purple`, `pink`
- 단계는 12개다.
  - `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000`
- `gray`와 `warm`은 중립색이고 별도 램프다.
  - `gray`는 색조가 없는 중립 회색이다.
  - 다크 배경용으로 `gray/1100`(`#1a1a1a`)을 하나 더 둔다.
- 각 색에 알파 토큰 `alpha-100`, `alpha-200`, `alpha-300`이 있다.
  - 값은 해당 색 `600`에 불투명도 8%, 16%, 24%를 준 것이다.
- `blackAlpha`와 `whiteAlpha`는 `50`부터 `900`까지 있다.
  - 두 램프의 낮은 단계 불투명도는 서로 다르다. `blackAlpha/50`은 3%, `whiteAlpha/50`은 4%다.
- `amber`는 두지 않는다.
  - orange와 yellow 사이가 14~17도밖에 안 떨어져서 구분이 안 됐다.

### 만드는 규칙

10색 램프는 [tools/ramps.py](./tools/ramps.py)로 만든다. 값을 바꾸려면 이 스크립트의 기준점을 고치고 다시 실행한 뒤, 결과를 Figma `primitive`에 반영한다. `gray`, `warm`, 알파 램프는 이 스크립트 밖에서 Figma에서 직접 정한다.

1. **색마다 500 기준점(명도 L, 채도 C, hue H)을 따로 잡는다.**
   - 이유: 같은 명도 곡선에서는 red가 살구색, yellow가 올리브, indigo가 연보라가 된다. 색마다 "그 색으로 읽히는 명도"가 다르다.
2. **채도 피크는 500이 아니라 600이다.**
   - 밝은 쪽은 기준점까지 올라간다.
   - 어두운 쪽은 600에서 최대치(기준점의 1.08배)를 찍은 뒤 내려간다.
   - 채도는 sRGB 최대치의 96%를 넘지 않게 자른다.
3. **양 끝은 색이 남게 한다.**
   - 50은 명도 0.975에 색조를 남긴다.
   - 1000은 명도 0.25에 채도를 남긴다. 검정이 아니라 짙은 그 색으로 읽힌다.
4. **램프 안에서 hue가 움직인다.**
   - 밝은 끝과 어두운 끝에서 기준 hue가 조금씩 이동한다.
   - 예: yellow는 어두워질수록 -16도, red는 밝은 쪽이 분홍 방향이다.
5. **yellow는 흰 배경 글자로 쓰지 않는다.**
   - yellow 700은 3.8:1, 800은 6.3:1이다. 텍스트와 아이콘에는 800 이상을 쓴다.
   - 나머지 색은 700에서 4.9~8.9:1이다.

### 기준점

| 색 | 500 (L, C, H) | 밝은 끝 / 어두운 끝 hue 이동 | 500 | 600 | 700 |
| --- | --- | --- | --- | --- | --- |
| red | 0.64, 0.21, 25 | -10 / +3 | `#f14445` | `#dc1727` | `#b5111c` |
| orange | 0.72, 0.18, 52 | +4 / -6 | `#f87e1a` | `#d46814` | `#ac520e` |
| yellow | 0.83, 0.165, 92 | +8 / -16 | `#edc322` | `#caa11b` | `#a37d13` |
| green | 0.70, 0.17, 148 | +3 / -6 | `#41ba5d` | `#17a13e` | `#11822a` |
| teal | 0.68, 0.125, 182 | 0 / -9 | `#1caf9e` | `#169584` | `#107968` |
| cyan | 0.70, 0.12, 215 | 0 / +2 | `#1db0cc` | `#1795ae` | `#10788c` |
| blue | 0.62, 0.19, 257 | +5 / -3 | `#2b83f5` | `#0f6fdb` | `#0a5bb3` |
| indigo | 0.54, 0.21, 276 | +7 / -4 | `#5457e5` | `#4541dc` | `#372fc4` |
| purple | 0.60, 0.22, 308 | +5 / -3 | `#a54de2` | `#932ed5` | `#7c13ba` |
| pink | 0.66, 0.20, 352 | -9 / +9 | `#e8519f` | `#d42a86` | `#b21169` |

전체 값은 `python3 docs/tools/ramps.py --table`로 본다.

## 2. 시멘틱 이름 규칙

시멘틱 이름은 `그룹/역할` 또는 `그룹/의미/강도`다. 그룹은 무엇에 칠하는지, 역할과 강도는 얼마나 드러나는지를 말한다.

### 그룹

| 그룹 | 칠하는 곳 | 토큰 |
| --- | --- | --- |
| `background` | 맨 뒤 바탕 | `default`, `low`, `inverse` |
| `surface` | 바탕 위에 얹는 면 | `default`, `raised`, `overlay`, `tinted` |
| `control` | 컨트롤의 채움 | `neutral`, `accent`, `selected`, `selected-hover`, `selected-pressed`, `inverse`, `disabled` |
| `text` | 글자 | `default`, `low`, `lowest`, `placeholder`, `helper`, `link`, `disabled`, `inverse`, `on-status` |
| `icon` | 아이콘 | `default`, `low`, `disabled`, `inverse` |
| `border` | 테두리 | `default`, `emphasis`, `focus`, `disabled` |
| `status` | 상태 의미의 글자·채움·면 | `{의미}/emphasis`, `{의미}/default`, `{의미}/low` |
| `overlay` | 상태 변화를 얹는 반투명 층 | `hover`, `pressed`, `hover-inverse`, `pressed-inverse`, `scrim` |
| `static` | 모드와 상관없는 고정색 | `white`, `black` |

쌓는 순서는 `background` → `surface` → `control`이다. 글자, 아이콘, 테두리는 어느 층 위에든 놓인다.

### 강도 어휘

강도는 한 줄의 단계다. 그룹마다 필요한 단계만 쓴다.

| 단계 | 뜻 | 쓰는 곳 |
| --- | --- | --- |
| `emphasis` | 기본보다 강하게 드러냄 | `border/emphasis`, `status/{의미}/emphasis` |
| `default` | 그 그룹의 기본 | 모든 그룹 |
| `low` | 한 단계 물러남 | `background/low`, `text/low`, `icon/low`, `status/{의미}/low` |
| `lowest` | 두 단계 물러남 | `text/lowest` |

- `primary`, `secondary`, `subtle`, `muted` 같은 다른 강도 이름을 새로 만들지 않는다.
- `inverse`는 강도가 아니라 반전이다. 반대 명도의 바탕 위에 놓일 때 쓴다.

### 규칙

1. **상태 의미는 `status/{의미}/{강도}` 하나로 쓴다.**
   - 의미는 `informative`, `positive`, `notice`, `negative` 넷이다.
   - `emphasis`는 상태 글자와 아이콘용이다.
   - `default`는 상태 채움과 테두리에 쓴다.
   - 상태 콜아웃의 면은 `low`가 맡는다.
   - 칠하는 대상별로 `text/status-*`, `border/status-*` 같은 토큰을 따로 만들지 않는다.
2. **brand는 별도 축이다.**
   - `control/accent`, `border/focus`, `text/link`가 brand를 따른다. 기본 brand는 blue다.
   - 정보 의미는 `status/informative/*`가 따로 맡는다. brand를 바꿔도 정보 색은 움직이지 않는다.
3. **hover와 pressed는 overlay를 얹어서 만든다.**
   - 채움 토큰 위에 `overlay/hover` 또는 `overlay/pressed`를 한 겹 더한다.
   - 진한 채움(`control/accent`, `control/selected`, `status/{의미}/default`) 위에는 `overlay/hover-inverse`, `overlay/pressed-inverse`를 쓴다.
   - 예외는 `control/selected`다. 선택된 중립 채움은 `control/selected-hover`, `control/selected-pressed` 전용 토큰을 쓴다.
   - 이유: overlay는 어떤 바탕 위에서도 동작해서 hover·pressed 토큰을 색마다 만들 필요가 없다.
4. **채움 위 글자는 채움에 맞춰 고른다.**
   - `status/{의미}/default`, `control/accent` 위 글자는 `text/on-status`(흰색)다.
   - `control/selected`, `background/inverse` 위 글자는 `text/inverse`다.
   - `status/notice/default`(yellow) 위 글자만 `static/black`이다. 노란 바탕에 흰 글자는 대비가 부족하다.
5. **disabled는 칠하는 곳으로 고른다.**
   - 글자 `text/disabled`, 아이콘 `icon/disabled`, 테두리 `border/disabled`, 채움 `control/disabled`다.
   - 색조를 남긴 흐린 색을 따로 만들지 않는다.
6. **선택은 `control/selected`다.**
   - 체크된 Checkbox, 켜진 Switch처럼 선택 상태의 중립 채움에 쓴다.
   - 선택 상태의 테두리를 따로 만들지 않는다.

### 테마 축과 연결

- `tint`는 중립 면의 색조를 바꾼다.
  - `cool`은 중립 회색, `warm`은 따뜻한 회색이다.
  - 영향을 받는 토큰: `background/low`, `surface/*`, `border/default`·`emphasis`·`disabled`, `control/neutral`, `control/disabled`
- `brand`는 `brand/50`~`brand/1000` 램프다. 기본값은 blue 램프와 같다.
- `shape`는 모서리 단계를 바꾼다. 「4. 크기 토큰」에 있다.

## 3. 시멘틱 값

light 값은 `tint=cool` 기준이다. `*` 표시는 「5. Figma와 다른 값」에 있는 코드 예외다.

| 토큰 | light | dark |
| --- | --- | --- |
| `background/default` | white | gray/1000 |
| `background/low` | gray/50 | gray/1100 |
| `background/inverse` | gray/1100 | white |
| `surface/default` | white | gray/1000 |
| `surface/raised` | white | gray/950 |
| `surface/overlay` | white | gray/900 |
| `surface/tinted` | gray/50 | gray/950 |
| `control/neutral` | gray/50 | gray/950 |
| `control/accent` | brand/600 | brand/600 |
| `control/selected` | gray/1000 | gray/50 |
| `control/selected-hover` | gray/950 | gray/100 |
| `control/selected-pressed` | gray/950 | gray/100 |
| `control/inverse` | gray/1100 | white |
| `control/disabled` | gray/50 | gray/1000 |

| 토큰 | light | dark |
| --- | --- | --- |
| `text/default` | gray/1000 | white |
| `text/low` | gray/800 | gray/300 * |
| `text/lowest` | gray/700 | gray/600 |
| `text/placeholder` | gray/800 * | gray/600 |
| `text/helper` | gray/800 * | gray/500 |
| `text/link` | brand/600 | brand/400 |
| `text/disabled` | gray/500 | gray/800 |
| `text/inverse` | white | gray/1000 |
| `text/on-status` | white | white |
| `icon/default` | gray/1000 | gray/100 |
| `icon/low` | gray/800 | gray/500 |
| `icon/disabled` | gray/500 | gray/800 |
| `icon/inverse` | white | black |

| 토큰 | light | dark |
| --- | --- | --- |
| `border/default` | gray/200 | gray/950 |
| `border/emphasis` | gray/400 | gray/800 |
| `border/focus` | brand/600 | brand/300 * |
| `border/disabled` | gray/100 | gray/1000 |
| `overlay/hover` | blackAlpha/50 | whiteAlpha/50 |
| `overlay/pressed` | blackAlpha/50 | whiteAlpha/50 |
| `overlay/hover-inverse` | whiteAlpha/50 | blackAlpha/50 |
| `overlay/pressed-inverse` | whiteAlpha/50 | blackAlpha/50 |
| `overlay/scrim` | blackAlpha/500 | blackAlpha/700 |
| `static/white` | white | white |
| `static/black` | black | black |

상태 의미는 같은 단계 구조를 쓴다. 색은 informative blue, positive green, notice yellow, negative red다.

| 토큰 | light | dark |
| --- | --- | --- |
| `status/{의미}/emphasis` | 800 (notice는 900) | 300 |
| `status/{의미}/default` | blue/600, green/700, yellow/500, red/600 | light와 같음 |
| `status/{의미}/low` | 50 | 950 |

## 4. 크기 토큰

Figma `semantic`에는 색 말고 크기 토큰도 있다. 코드 CSS 변수에는 `semantic` 접두사를 붙이지 않는다.

| 토큰 | 값 | CSS 변수 예 |
| --- | --- | --- |
| `spacing/{단계}` | `025`=2, `050`=4, `075`=6, `100`=8, `150`=12, `200`=16, `250`=20, `300`=24, `400`=32, `500`=40, `600`=48, `800`=64, `1000`=80, `1200`=96 (px) | `--spacing-100` |
| `control/height/{크기}` | `xs`=24, `sm`=32, `md`=40, `lg`=48 | `--control-height-md` |
| `icon/size/{px}` | 10, 11, 12, 13, 14, 16, 18, 20, 24, 32, 56 | `--icon-size-16` |
| `border/width/{역할}` | `default`=1, `focus`·`selected`·`strong`=2 | `--border-width-default` |
| `radius/{단계}` | `shape` 모드를 따름 | `--radius-md` |

- `spacing` 단계 이름은 8px을 `100`으로 둔 배수다. `150`은 8px의 1.5배인 12px이다.
- 모서리는 `shape` 컬렉션의 모드로 바꾼다.

| `radius` | default | sharp | soft |
| --- | --- | --- | --- |
| `none` | 0 | 0 | 0 |
| `xs` | 2 | 0 | 4 |
| `sm` | 4 | 0 | 6 |
| `md` | 6 | 2 | 8 |
| `lg` | 8 | 4 | 10 |
| `xl` | 10 | 6 | 12 |
| `2xl` | 12 | 8 | 16 |
| `3xl` | 16 | 10 | 24 |
| `4xl` | 24 | 12 | 24 |
| `full` | 9999 | 9999 | 9999 |

## 5. Figma와 다른 값

코드가 Figma와 일부러 다르게 둔 값이다. Figma에 반영하면 이 절에서 지운다.

| 토큰 | 코드 | Figma | 이유 |
| --- | --- | --- | --- |
| `text/placeholder` light | gray/800 | gray/700 | 2026-11-15 대비 계약(지원 글자 4.5:1) |
| `text/helper` light | gray/800 | gray/700 | 같음 |
| `text/low` dark | gray/300 | gray/400 | 같음 |
| `border/focus` dark | brand/300 | brand/400 | focus 표시 3:1 |
| `surface/accent` | brand/50, brand/950 | 없음 | SelectItem 선택 배경과 docs 내비 활성 배경이 쓴다 |
| notice 채움 위 글자 | `static/black` | `text/on-status`(흰색) | 노란 바탕 흰 글자 대비 부족 |

## 6. Figma에서 확인할 것

Figma 원문에서 의도인지 실수인지 판단이 필요한 값이다. 2026-11-16 확인.

dark 값은 light를 기준으로 나중에 보정한다(2026-11-16 결정). 아래 dark 항목은 그 보정 때 함께 본다.

- dark에서 `background/default`와 `surface/default`가 같은 `gray/1000`이다.
  - 면이 바탕과 구분되지 않는다.
- dark 면 단계가 가파르다. `surface/default` `#2d2d2d`에서 `surface/overlay` `#595959`까지 올라간다.
- `surface/tinted`를 `gray/50`으로 내리면서 `background/low`, `control/neutral`과 같은 값이 됐다(2026-11-16 결정).

- `gray/700`(`#767676`)과 `gray/800`(`#717171`)이 거의 같은 색이다.
  - 그래서 `text/lowest`와 `text/low`가 눈으로 구분되지 않는다.
- `overlay/hover`와 `overlay/pressed` 값이 같다(`blackAlpha/50`, 3%).
  - hover와 pressed가 구분되지 않는다.
  - 진한 채움 위의 hover도 거의 보이지 않는다.
- `border/disabled` dark 값이 `surface/default` dark와 같은 `gray/1000`이다.
  - dark 모드에서 disabled 테두리가 보이지 않는다.
- `control/neutral`이 `background/low`와 같은 `gray/50`이다.
  - 꺼진 Switch 트랙이 바탕과 구분되지 않는다.
- `tint=warm`에서 보조 글자 대비가 4.5:1에 못 미친다.
  - `text/low`, `text/placeholder`, `text/helper`(gray/800)는 `warm/50` 위에서 4.48:1이다.
  - `text/lowest`(gray/700)는 4.17:1이다.
  - 코드 테스트는 이 네 조합을 알려진 미달로 두고 현재 값을 하한으로 고정한다.
- `primitive`에 `space/*`와 따로 떨어진 `spacing/7`(28px)이 함께 있다.

## 7. 컴포넌트 바인딩

- fill, stroke, 텍스트 모두 `semantic` 토큰으로 바인딩한다.
- 투명도는 토큰이 가진다. paint의 opacity는 1로 둔다.
- 인스턴스 안에서 덮어쓴 색(오버라이드)도 같은 규칙이다.
  - 인스턴스 내부까지 확인하지 않으면 옛 변수가 남는다([workflow.md](./workflow.md)).

## 8. 변수 이름 표기

- Figma 변수 이름에는 `.`을 쓸 수 없다. 소수는 `_`로 쓴다(`line-height/4_5`).
- CSS 변수는 Figma 경로의 `/`를 `-`로 바꾼다.
  - 색은 `--semantic-` 접두사를 붙인다. 예: `text/default` → `--semantic-text-default`
  - 크기는 접두사 없이 쓴다. 예: `spacing/100` → `--spacing-100`
- 상태 의미 이름은 feedback 컴포넌트에서 검토할 `status` prop 값과 같은 어휘를 쓴다.
