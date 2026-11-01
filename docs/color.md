---
verified: 2026-11-02
---
# 컬러

Figma 컬러 변수는 `primitive`, `tint`, `semantic` 세 층이다. `primitive`는 원시 색, `tint`는 cool/warm 중립색, `semantic`은 쓰임새 이름과 라이트/다크 값을 가진다. 컴포넌트는 `semantic`만 쓴다.

## 1. 프리미티브 램프

### 구조

- 색은 `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `indigo`, `purple`, `pink` 10개다. 단계는 `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000`이다.
- `gray`와 `warm`은 중립색이고 별도 램프다. 다크 배경용으로 `gray/1100`(`#1a1a1a`)을 하나 더 둔다.
- 각 색에 알파 토큰 `alpha-100`, `alpha-200`, `alpha-300`이 있다. 값은 해당 색 `600`에 불투명도 8%, 16%, 24%를 얹은 것이다.
- `amber`는 두지 않는다. orange와 yellow 사이가 14~17도밖에 안 떨어져서 구분이 안 됐다.

### 만드는 규칙

색상 램프는 [tools/ramps.py](./tools/ramps.py)로 만든다. gray와 warm은 Figma에서 조정한 값을 코드에 직접 동기화한다.

1. **색마다 500 기준점(명도 L, 채도 C, hue H)을 따로 잡는다.** 모든 색에 같은 명도 곡선을 쓰지 않는다.
   - 이유: 같은 명도 곡선에서는 red가 살구색이 되고, yellow가 올리브가 되고, indigo가 연보라가 된다. 색마다 "그 색으로 읽히는 명도"가 다르다.
2. **채도 피크는 500이 아니라 600이다.** 밝은 쪽은 기준점으로 올라가고, 어두운 쪽은 600에서 최대치(기준점의 1.08배)를 찍은 뒤 내려간다. 채도는 sRGB 최대치의 96%를 넘지 않게 자른다.
3. **양 끝은 색이 남게 한다.** 50은 명도 0.975에 색조를 남기고, 1000은 명도 0.25에 채도를 남겨서 회색이나 검정이 아니라 짙은 그 색으로 읽히게 한다.
4. **램프 안에서 hue가 움직인다.** 밝은 끝과 어두운 끝에서 기준 hue에서 조금씩 이동한다(예: yellow는 어두워질수록 -16도, red는 밝은 쪽이 분홍 방향). 한 색 안에서도 깊이가 생긴다.
5. **yellow는 흰 배경 글자로 쓰지 않는다.** yellow는 700이 3.8:1, 800이 6.3:1이라 텍스트와 아이콘에는 800 이상을 쓴다. 나머지 색은 700에서 4.9~8.9:1이다.

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

## 2. Tint 토큰

`tint`는 light 모드의 중립색만 cool/warm으로 교체한다. 텍스트와 아이콘은 색조에 따라 움직이지 않는다.

| 토큰 | cool | warm |
| --- | --- | --- |
| `background/low` | gray/50 | warm/50 |
| `surface/default`, `raised`, `overlay` | white | warm/50 |
| `surface/tinted` | gray/100 | warm/100 |
| `border/default` | gray/200 | warm/200 |
| `border/emphasis` | gray/400 | warm/400 |
| `border/disabled` | gray/100 | warm/100 |
| `control/neutral`, `disabled` | gray/50 | warm/100 |

## 3. 시멘틱 토큰

### 그룹

| 그룹 | 토큰 | 쓰임 |
| --- | --- | --- |
| `background` | `default`, `low`, `inverse` | 페이지 바탕, 한 단계 낮은 바탕, 반전 바탕 |
| `surface` | `default`, `raised`, `overlay`, `tinted` | 배경 위에 얹는 면의 높이와 옅은 강조 |
| `text` | `default`, `low`, `lowest`, 역할 토큰 | 정보 위계와 placeholder, helper, disabled, inverse, link, on-status |
| `icon` | `default`, `low`, `disabled`, `inverse` | 독립 아이콘의 위계 |
| `border` | `default`, `emphasis`, `focus`, `disabled` | 테두리 역할 |
| `control` | `neutral`, `inverse`, `accent`, `disabled`, `selected*` | 컨트롤 채움과 선택 stroke |
| `status` | 네 intent의 `low`, `default`, `emphasis` | 적용 대상과 무관한 상태색 강도 |
| `overlay` | `hover`, `pressed`, `hover-inverse`, `pressed-inverse`, `scrim` | 상호작용 오버레이와 딤 |
| `static` | `white`, `black` | 모드와 상관없이 고정되는 색 |

### 규칙

1. 이름의 첫 단계는 적용 대상을 쓴다. 상태색만 대상과 무관하게 `status/{intent}/{strength}`를 공유한다.
2. `status/*/low`는 상태 배경, `default`는 일반 상태색 또는 solid fill, `emphasis`는 텍스트, 아이콘, 테두리와 강한 배경에 쓴다.
3. 상태색 위 흰 글자는 `text/on-status`를 쓴다. notice처럼 흰 글자의 대비가 부족하면 컴포넌트에서 `text/default`를 선택한다.
4. hover와 pressed는 기본 fill 위에 `overlay/*`를 얹는다. 반전 fill에는 `overlay/*-inverse`를 쓴다. 컴포넌트별 hover 색 토큰은 만들지 않는다.
5. disabled는 대상별 토큰을 고른다. 글자는 `text/disabled`, 아이콘은 `icon/disabled`, 테두리는 `border/disabled`, 채움은 `control/disabled`다.
6. shape와 outline, solid, ghost는 컬러 토큰 이름에 넣지 않고 컴포넌트 variant에서 조합한다.

### 값 (라이트 / 다크)

| 토큰 | 라이트 | 다크 |
| --- | --- | --- |
| `background/default` | white | gray/1000 |
| `background/low` | tint/background/low | gray/1100 |
| `background/inverse` | gray/1100 | white |
| `surface/default` | tint/surface/default | gray/1000 |
| `surface/raised` | tint/surface/raised | gray/950 |
| `surface/overlay` | tint/surface/overlay | gray/900 |
| `surface/tinted` | tint/surface/tinted | gray/950 |
| `text/default` | gray/1000 | white |
| `text/low` | gray/800 | gray/400 |
| `text/lowest` | gray/700 | gray/600 |
| `text/placeholder` | gray/700 | gray/600 |
| `text/helper` | gray/700 | gray/500 |
| `text/disabled` | gray/500 | gray/800 |
| `text/inverse` | white | gray/1000 |
| `text/link` | brand/600 | brand/400 |
| `text/on-status` | white | white |
| `icon/default` | gray/1000 | gray/100 |
| `icon/low` | gray/800 | gray/500 |
| `icon/disabled` | gray/500 | gray/800 |
| `icon/inverse` | white | black |
| `border/default` | tint/border/default | gray/950 |
| `border/emphasis` | tint/border/emphasis | gray/800 |
| `border/focus` | brand/600 | brand/400 |
| `border/disabled` | tint/border/disabled | gray/1000 |
| `control/neutral` | tint/control/neutral | gray/950 |
| `control/inverse` | gray/1100 | white |
| `control/accent` | brand/600 | brand/600 |
| `control/disabled` | tint/control/disabled | gray/1000 |
| `control/selected` | gray/1000 | gray/50 |
| `control/selected-hover`, `selected-pressed` | gray/950 | gray/100 |
| `overlay/hover`, `pressed` | blackAlpha/50 | whiteAlpha/50 |
| `overlay/hover-inverse`, `pressed-inverse` | whiteAlpha/50 | blackAlpha/50 |
| `overlay/scrim` | blackAlpha/500 | blackAlpha/700 |

네 intent는 informative blue, positive green, notice yellow, negative red다.

| strength | 라이트 | 다크 |
| --- | --- | --- |
| `low` | 각 색 50 | 각 색 950 |
| `default` | blue/600, green/700, yellow/500, red/600 | 라이트와 같음 |
| `emphasis` | blue/800, green/800, yellow/900, red/800 | 각 색 300 |

## 4. 컴포넌트 바인딩

- fill, stroke, 텍스트 모두 `semantic` 토큰으로 바인딩한다.
- 투명도는 토큰이 가진다. paint의 opacity는 1로 둔다.
- 인스턴스 안에서 덮어쓴 색(오버라이드)도 같은 규칙이다. 인스턴스 내부까지 확인하지 않으면 옛 변수가 남는다([workflow.md](./workflow.md)).

## 5. 변수 이름 규칙

- 변수 이름에 `.`을 쓸 수 없다. 소수는 `_`로 쓴다(`line-height/4_5`).
- 의미색 이름은 컴포넌트 `intent` 값과 같다. `intent=notice`는 역할에 따라 `status/notice/low`, `default`, `emphasis`를 쓴다.
