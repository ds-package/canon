---
verified: 2026-10-14
---
# 컬러

Figma 변수는 두 컬렉션이다. `primitive`는 원시 색, `semantic`은 쓰임새 이름과 라이트/다크 값을 가진다. 컴포넌트는 `semantic`만 쓴다.

## 1. 프리미티브 램프

### 구조

- 색은 `red`, `orange`, `yellow`, `green`, `teal`, `cyan`, `blue`, `indigo`, `purple`, `pink` 10개다. 단계는 `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000`이다.
- `gray`와 `warm`은 중립색이고 별도 램프다. 다크 배경용으로 `gray/1100`(`#18191b`)을 하나 더 둔다.
- 각 색에 알파 토큰 `alpha-100`, `alpha-200`, `alpha-300`이 있다. 값은 해당 색 `600`에 불투명도 8%, 16%, 24%를 얹은 것이다.
- `amber`는 두지 않는다. orange와 yellow 사이가 14~17도밖에 안 떨어져서 구분이 안 됐다.

### 만드는 규칙

램프는 [tools/ramps.py](./tools/ramps.py)로 만든다. 값을 바꾸고 싶으면 이 스크립트의 기준점을 고치고 다시 실행한다.

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

## 2. 시멘틱 토큰

### 그룹

| 그룹 | 토큰 | 쓰임 |
| --- | --- | --- |
| `surface` | `body`, `default`, `raised`, `overlay`, `muted`, `inverse` | 면. `body`는 페이지 바탕, `default`는 기본 면, `raised`는 카드, `overlay`는 팝오버와 모달 |
| `text` | `primary`, `secondary`, `tertiary`, `disabled`, `inverse`, `link` | 글자 |
| `icon` | `primary`, `secondary`, `disabled`, `inverse` | 아이콘 |
| `border` | `default`, `emphasis`, `focus`, `disabled` | 테두리 |
| `neutral` | `solid`, `solid-hover`, `solid-pressed`, `subtle`, `on-solid`, `text`, `border` | 중립 강조(라이트에서 검정, 다크에서 흰색). 기본 버튼, 체크 상태, 선택된 탭 |
| `overlay` | `hover`, `pressed`, `scrim` | 반투명 상태 오버레이와 딤 |
| `status/informative` | `solid`, `solid-hover`, `solid-pressed`, `subtle`, `text`, `border`, `on-solid` | 정보. blue |
| `status/positive` | 위와 같음 | 성공. green |
| `status/notice` | 위와 같음 | 경고. yellow |
| `status/negative` | 위와 같음 | 오류, 파괴. red |
| `static` | `white`, `black` | 모드와 상관없이 고정되는 흰색과 검정 |

각 의미색(`neutral`, `status/*`)은 같은 7개 키를 가진다. 이름만 보고 `status/negative/subtle`, `neutral/solid-hover`를 예측할 수 있게 한다.

### 규칙

1. **brand 색을 두지 않는다.** accent는 중립(검정)이다. 파랑은 `status/informative`와 `text/link`, `border/focus`로만 쓴다.
   - 이유: Canon에는 브랜드 색이 없다. 파랑을 브랜드로 만들면 정보 색과 섞인다.
2. **hover와 pressed는 두 가지로 처리한다.**
   - 채워진 강조(`neutral/solid`, `status/*/solid`)는 전용 토큰을 쓴다(`solid-hover`, `solid-pressed`).
   - 투명하거나 옅은 면(아웃라인 버튼, 행, 메뉴 항목)은 `overlay/hover`, `overlay/pressed`를 얹는다. 회색 solid 버튼처럼 기본 면이 있는 경우에는 fill을 두 겹(`surface/muted` + `overlay`)으로 쓴다.
   - 이유: 오버레이는 어떤 바탕 위에서도 동작해서 토큰 수를 줄이고, 선명한 강조에는 색 이동이 필요하다.
3. **solid 위 글자는 `on-solid`다.** `status/notice/on-solid`만 어두운 글자(`gray/1000`)이고 나머지는 흰색이다. 노란 바탕에 흰 글자는 대비가 부족하다.
4. **disabled는 항목이 아니라 의미로 고른다.** 글자는 `text/disabled`, 아이콘은 `icon/disabled`, 테두리는 `border/disabled`, 면은 `surface/muted`로 간다. 색조를 유지한 흐린 색을 만들지 않는다.
5. **아이콘 색은 같은 컴포넌트의 라벨 글자와 같은 토큰에 묶는다.** Button과 Tag의 아이콘이 해당한다. 상태나 의도가 바뀔 때 아이콘이 따로 어긋나지 않게 한다.

### 값 (라이트 / 다크)

| 토큰 | 라이트 | 다크 |
| --- | --- | --- |
| `surface/body` | gray/50 | gray/1100 |
| `surface/default` | white | gray/1000 |
| `surface/raised`, `surface/overlay` | white | gray/950 |
| `surface/muted` | gray/100 | gray/950 |
| `surface/inverse` | gray/1000 | gray/50 |
| `text/primary` | gray/1000 | gray/50 |
| `text/secondary` | gray/800 | gray/400 |
| `text/tertiary` | gray/600 | gray/600 |
| `text/disabled` | gray/400 | gray/800 |
| `text/inverse` | white | gray/1000 |
| `text/link` | blue/600 | blue/400 |
| `icon/primary` | gray/900 | gray/100 |
| `icon/secondary` | gray/600 | gray/500 |
| `icon/disabled` | gray/400 | gray/800 |
| `icon/inverse` | white | gray/1000 |
| `border/default` | gray/200 | gray/950 |
| `border/emphasis` | gray/400 | gray/800 |
| `border/focus` | blue/600 | blue/400 |
| `border/disabled` | gray/100 | gray/1000 |
| `neutral/solid` | gray/1000 | gray/50 |
| `neutral/solid-hover` | gray/950 | gray/100 |
| `neutral/solid-pressed` | gray/900 | gray/200 |
| `neutral/subtle` | gray/100 | gray/950 |
| `neutral/on-solid` | white | gray/1000 |
| `neutral/text` | gray/1000 | gray/50 |
| `neutral/border` | gray/400 | gray/800 |
| `overlay/hover` | blackAlpha/100 | whiteAlpha/100 |
| `overlay/pressed` | blackAlpha/300 | whiteAlpha/300 |
| `overlay/scrim` | blackAlpha/500 | blackAlpha/700 |

`status/*`는 네 색이 같은 틀을 따른다. `{c}`는 informative blue, positive green, negative red이고 notice만 yellow다.

| 키 | 라이트 | 다크 |
| --- | --- | --- |
| `solid` | blue/600, green/700, yellow/500, red/600 | 라이트와 같음 |
| `solid-hover` | 한 단계 진하게(700, 800, 600, 700) | 한 단계 밝게(500, 600, 400, 500) |
| `solid-pressed` | 두 단계 진하게(800, 900, 700, 800) | 두 단계 밝게(400, 500, 300, 400) |
| `subtle` | 50 | 950 |
| `text` | 800 (yellow는 900) | 300 |
| `border` | 200 (yellow는 300) | 800 |
| `on-solid` | white (notice는 gray/1000) | 라이트와 같음 |

## 3. 컴포넌트 바인딩

- fill, stroke, 텍스트 모두 `semantic` 토큰으로 바인딩한다.
- 투명도는 토큰이 가진다. paint의 opacity는 1로 둔다.
- 인스턴스 안에서 덮어쓴 색(오버라이드)도 같은 규칙이다. 인스턴스 내부까지 확인하지 않으면 옛 변수가 남는다([workflow.md](./workflow.md)).

## 4. 변수 이름 규칙

- 변수 이름에 `.`을 쓸 수 없다. 소수는 `_`로 쓴다(`line-height/4_5`).
- 의미색 그룹의 값 이름은 컴포넌트 `intent` 값과 같다. `intent=notice`는 `status/notice/*`를 쓴다.
