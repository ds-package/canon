---
verified: 2026-10-14
---
# 컴포넌트

컴포넌트는 PascalCase, 프로퍼티는 camelCase, 값은 소문자 kebab-case로 이름을 붙인다. 의미, 상태, 보임 여부를 서로 다른 축으로 관리한다.

## 1. 프로퍼티 축

| 축 | 뜻 | 값과 적용 범위 |
| --- | --- | --- |
| `variant` | 면 처리나 구조 | 컴포넌트마다 필요한 값만 쓴다. |
| `intent` | 의미색 | 의미색이 필요한 컴포넌트에만 둔다. |
| `size` | 크기 | `xs, sm, md, lg, xl, 2xl` 중 필요한 값만 작은 것부터 쓴다. |
| `state` | 상호작용 상태 | `default, hover, pressed, focus`. Input, Select, NumberInput에는 `filled`도 남아 있다. |
| boolean | 참과 거짓 | `disabled, selected, checked, indeterminate, invalid, readOnly, fitted, striped` |

1. **`intent`와 `state`를 한 축에 섞지 않는다.**
   - 이유: 의미색과 상호작용 상태를 독립적으로 다루기 위해서다.
2. **`disabled`는 `state` 값이 아니라 별도 boolean으로 둔다.**
   - 이유: `state=disabled`와 `isDisabled`로 중복되어 있던 표현을 하나로 합친다.
3. **boolean에는 `is` 접두사를 붙이지 않는다.**
   - 이유: 같은 종류의 프로퍼티 이름을 `disabled`, `selected`, `checked`처럼 한 방식으로 맞춘다.

## 2. `variant`

| 컴포넌트 | 값 |
| --- | --- |
| Button | `solid, outline, subtle` |
| Badge, Tag | `solid, subtle, outline` |
| Alert | `subtle, left-accent, top-accent, solid` |
| Input, Select | `filled, flushed, outline, unstyled` |
| Tabs | `line, enclosed, soft-rounded, solid-rounded, unstyled` |
| Card | `elevated, outline, filled, unstyled` |

1. **variant는 색이나 구조가 실제로 달라지고 조합이 독립적이지 않을 때만 쓴다.**
   - 이유: 독립적인 조합을 variant로 만들면 경우의 수가 곱절로 늘어난다.
2. **순수 보임과 숨김은 variant가 아니라 BOOLEAN으로 둔다.**
   - 이유: Tag의 `showLeadingSlot`, `showTrailingSlot`을 variant에서 레이어 `visible`에 연결한 BOOLEAN으로 바꾸자 variant가 144개에서 36개로 줄었다.

## 3. `intent`

| 컴포넌트 | 값 |
| --- | --- |
| Button | `neutral, informative, positive, notice, negative` |
| Badge, Tag | `neutral, informative, positive, negative` |
| Progress | `neutral, informative, positive, negative, notice` |
| Alert | `informative, positive, notice, negative` |
| Radio, Checkbox, Switch, Tabs | 색 속성 없음. 항상 neutral 강조 사용 |

Button의 `neutral`은 `solid`에서 검정(`neutral/solid`), `subtle`에서 회색 면, `outline`에서 검정 테두리를 쓴다.

1. **`intent`는 의미색이 필요한 컴포넌트에만 둔다.**
   - 이유: Radio, Checkbox, Switch, Tabs는 항상 neutral 강조를 쓰므로 색 축이 필요하지 않다.
2. **Button의 neutral은 variant에 맞는 중립 표현을 쓴다.**
   - 이유: 같은 neutral이어도 `solid`, `subtle`, `outline`의 면 처리가 다르다.

## 4. 보임 토글과 슬롯

| 종류 | 이름 |
| --- | --- |
| 보임 토글 | `showLeadingSlot`, `showTrailingSlot`, `showLeadingIcon`, `showTrailingIcon`, `showTitle`, `showIcon`, `showBadge`, `showCommand`, `showCloseButton`, `showHeader`, `showBody`, `showFooter`, `showLeadingAddon`, `showTrailingAddon` |
| 인스턴스 교체 슬롯 | `leadingItemSlot`, `trailingItemSlot` |
| 텍스트 콘텐츠 | `children` |

1. **보임 토글에는 `show` 접두사를 붙인다.**
   - 이유: 레이어 표시를 바꾸는 boolean이라는 점을 이름에서 드러낸다.
2. **위치는 `leading`, `trailing`만 쓰고 `left`, `right`는 쓰지 않는다.**
   - 이유: 위치 프로퍼티의 어휘를 한 쌍으로 통일한다.
3. **InputGroup의 인스턴스 교체 슬롯은 `leadingItemSlot`, `trailingItemSlot`로 부른다.**
   - 이유: 같은 쪽의 element와 addon을 함께 다루는 슬롯 이름이다.
4. **텍스트 콘텐츠 프로퍼티는 `children`으로 부른다.**
   - 이유: 컴포넌트의 텍스트 콘텐츠 이름을 하나로 맞춘다.

## 5. 이름 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 | PascalCase | `InputGroup`, `ModalContent` |
| 프로퍼티 | camelCase | `showLeadingIcon`, `readOnly` |
| 값 | 소문자 kebab-case | `soft-rounded`, `left-accent` |
| 내부용 프로퍼티 | `.` 접두사 유지 | `.variant`, `.size`, `.type`, `.name?`, `.src?` |

1. **컴포넌트, 프로퍼티, 값은 각 대상의 표기 규칙을 지킨다.**
   - 이유: 이름만 보고 대상의 종류를 구분할 수 있게 한다.
2. **내부용 프로퍼티의 `.` 접두사는 유지한다.**
   - 이유: `.variant`, `.size`, `.type`, `.name?`, `.src?`를 외부 프로퍼티와 구분한다.

## 6. BOOLEAN으로 바꾸지 않은 것

| 대상 | 유지한 이유 |
| --- | --- |
| Avatar의 `.name?`, `.src?` | 세 가지 조합만 있고, 무엇을 보여 줄지를 고르는 성격이다. |
| ModalContent의 `showFooter` | variant가 두 개뿐이다. |
| InputGroup | 같은 쪽에서 element와 addon이 동시에 있을 수 없어 16개 중 9개 조합만 존재한다. 모든 레이어가 켜진 기준 variant도 없다. |

## 7. 열린 결정

| 대상 | 확인할 것 |
| --- | --- |
| InputGroup | `leading`, `trailing` 두 축으로 바꾸고 각 값을 `none, element, addon`으로 둘지 결정한다. variant 수는 같고 불가능한 조합은 사라진다. |
| Alert | `left-accent`, `top-accent`는 면 처리가 아니라 모양이므로 이름을 다시 정한다. |
| Input, Select, NumberInput | `state=filled`를 어떻게 다룰지 정한다. |
| Radio Control | BOOLEAN `isDisabled`와 variant `disabled`의 이름이 겹친다. BOOLEAN 이름은 그대로 둔 상태다. |
| Badge, Tag | neutral solid가 Button의 neutral과 맞는지 확인한다. |

## 8. 이력

Chakra의 `colorScheme`을 없앴다. blue는 informative, green은 positive, yellow는 notice, red는 negative, black은 neutral solid, gray는 neutral subtle로 옮겼다. teal, orange, pink, purple variant는 삭제했다. Radio, Checkbox, Switch, Tabs에서는 색 속성을 없앴다.
