---
verified: 2026-10-14
---
# 타이포그래피

폰트는 Pretendard Variable이다. 텍스트 스타일은 역할과 실제 글자 크기로 이름을 붙인 29개다.

## 1. 텍스트 스타일

| 역할 | 스타일 | 크기 / 행간 | 굵기 | 자간 |
| --- | --- | --- | --- | --- |
| Display | `Display/60` | 60px / 72px | Bold | -2% |
| Display | `Display/48` | 48px / 60px | Bold | -2% |
| Heading | `Heading/36` | 36px / 48px | SemiBold | -1% |
| Heading | `Heading/30` | 30px / 40px | SemiBold | -1% |
| Heading | `Heading/24` | 24px / 32px | SemiBold | 0% |
| Heading | `Heading/20` | 20px / 28px | SemiBold | 0% |
| Body | `Body/18` | 18px / 28px | Regular | 0% |
| Body | `Body/18 Strong` | 18px / 28px | SemiBold | 0% |
| Body | `Body/16` | 16px / 26px | Regular | 0% |
| Body | `Body/16 Strong` | 16px / 26px | SemiBold | 0% |
| Body | `Body/14` | 14px / 22px | Regular | 0% |
| Body | `Body/14 Strong` | 14px / 22px | SemiBold | 0% |
| Body | `Body/13` | 13px / 20px | Regular | 0% |
| Body | `Body/13 Strong` | 13px / 20px | SemiBold | 0% |
| Label | `Label/18` | 18px / 28px | Medium | 0% |
| Label | `Label/18 Strong` | 18px / 28px | SemiBold | 0% |
| Label | `Label/16` | 16px / 24px | Medium | 0% |
| Label | `Label/16 Strong` | 16px / 24px | SemiBold | 0% |
| Label | `Label/14` | 14px / 20px | Medium | 0% |
| Label | `Label/14 Strong` | 14px / 20px | SemiBold | 0% |
| Label | `Label/13` | 13px / 18px | Medium | 0% |
| Label | `Label/13 Strong` | 13px / 18px | SemiBold | 0% |
| Label | `Label/12` | 12px / 16px | Medium | 0% |
| Label | `Label/12 Strong` | 12px / 16px | SemiBold | 0% |
| Label | `Label/11` | 11px / 16px | Medium | 0% |
| Label | `Label/10` | 10px / 16px | Medium | 0% |
| Caption | `Caption/12` | 12px / 20px | Regular | 0% |
| Caption | `Caption/11` | 11px / 18px | Regular | 0% |
| Caption | `Caption/10` | 10px / 16px | Regular | 0% |

## 2. 이름과 역할 규칙

1. **이름에는 `large`, `md` 같은 크기 단어 대신 실제 크기 숫자를 쓴다.**
   - 이유: 크기 단어는 몇 px인지 스타일을 열어 봐야 안다.
2. **굵기는 역할에 고정한다.** Display는 Bold, Heading은 SemiBold, Body는 Regular, Label은 Medium, Caption은 Regular다.
   - 이유: 같은 역할의 굵기를 스타일마다 다시 판단하지 않게 한다.
3. **강조는 Body와 Label에만 `Strong`으로 두고 SemiBold를 쓴다.**
   - 이유: 기본 스타일과 강조 스타일의 관계를 두 역할 안에서만 예측할 수 있게 한다.
4. **10px, 11px, 12px는 Label과 Caption에서 쓴다.** Label은 배지, 태그, 탭에 쓴다.
   - 이유: 작은 크기에서도 컨트롤용 글자와 보조 설명의 역할을 구분한다.

## 3. 행간 규칙

1. **행간은 한글을 우선해 영문 기준보다 넉넉하게 잡는다.** Body는 1.57~1.6, Heading은 약 1.33, Display는 1.2~1.25이고, 20px 미만은 대체로 1.5 이상이다.
   - 이유: 한글 가독성을 확보한다.
2. **행간은 4px 단위를 기본으로 한다.** Body는 한글 가독성을 위해 14px 글자에 22px, 16px 글자에 26px를 쓴다.
   - 이유: 기본 단위를 유지하면서 필요한 크기에서 한글 행간을 확보한다.
3. **Label의 행간은 고정값으로 둔다.**
   - 이유: Label이 들어가는 컨트롤 높이가 흔들리지 않게 한다.

## 4. 변수 바인딩

모든 스타일의 크기, 행간, 굵기를 변수에 바인딩한다.

| 속성 | 변수 | 값 규칙 |
| --- | --- | --- |
| 크기 | `font/size/*` | px 크기를 그대로 쓴다. 예: `font/size/30`, `font/size/36` |
| 행간 | `line-height/*` | px을 4로 나눈다. 소수점의 `.`은 `_`로 쓴다. 예: 18px은 `line-height/4_5`, 22px은 `line-height/5_5`, 26px은 `line-height/6_5`, 72px은 `line-height/18` |
| 굵기 | `font/weight/*` | regular 400, medium 500, semibold 600, bold 700 |

이번에 `font/size/30`, `font/size/36`과 행간 18px, 22px, 26px, 72px 변수를 추가했다.

1. **크기, 행간, 굵기는 값을 직접 넣지 않고 해당 변수에 바인딩한다.**
   - 이유: 텍스트 스타일과 변수의 값이 따로 어긋나지 않게 한다.
2. **행간 변수 이름의 소수점은 `_`로 쓴다.**
   - 이유: 변수 이름에는 `.`을 쓸 수 없다.

## 5. 바꾸는 법

1. [tools/figma-plugins/type-styles/code.js](./tools/figma-plugins/type-styles/code.js)의 `SPEC`을 고친다.
2. Pretendard Variable이 컴퓨터에 설치되어 있는지 확인한다.
3. Figma 데스크톱에서 Canon 파일을 연다.
4. 처음 한 번은 `Plugins > Development > Import plugin from manifest`로 플러그인을 가져온다.
5. `Canon Type Styles`를 실행한다.

플러그인은 같은 이름의 스타일이 있으면 업데이트하고, 없으면 만든다. 없는 크기와 행간 변수도 추가한다.

1. **텍스트 스타일 작업은 Figma 데스크톱 플러그인으로 한다.**
   - 이유: Figma MCP의 `use_figma`는 로컬 폰트를 읽지 못해 Pretendard Variable로 텍스트 스타일을 만들거나 교체할 수 없다.
2. **플러그인을 실행하기 전에 Pretendard Variable을 설치한다.**
   - 이유: 스타일을 만들 때 해당 로컬 폰트를 읽어야 한다.

## 6. 이력

Chakra에서 온 옛 스타일 96개는 새 스타일로 교체한 뒤 삭제했다. 옛 이름은 `text-md/lineHeight-6/font-bold`처럼 크기, 행간, 굵기를 이어 붙인 형태였다.
