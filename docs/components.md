---
verified: 2026-11-15
navigation: component
---
# 컴포넌트 프로퍼티 모델

Canon의 프로퍼티는 사용자가 코드에 쓰는 React interface를 중심으로 설계한다. Figma 편집 property, 브라우저에서 파생되는 상태, 문서 playground의 제어값은 React props와 목적이 다르므로 같은 이름이나 축을 강제하지 않는다.

> 확인 범위: 2026-11-15의 runtime 코드, 공식 시스템 문서와 Prism 규칙을 대조했다. Canon Figma의 현재 property inventory는 이번 변경에서 다시 읽지 않았으므로, Figma 절은 앞으로 적용할 authoring 원칙이며 실제 migration 범위는 미확인이다.

## 1. 네 가지 표면

| 표면 | 사용하는 사람 | 역할 | 정본 |
| --- | --- | --- | --- |
| React public interface | 개발자와 AI | 제품 코드에서 콘텐츠, 선택, 동작을 선언한다. | `@canon/react`의 TypeScript |
| Runtime-derived state | 브라우저와 React Aria | hover, press, focus와 현재 값에서 상태를 계산한다. | 실제 DOM과 interaction test |
| Figma authoring interface | 디자이너 | variant를 비교하고 레이어와 instance를 편집한다. | Canon Figma component property |
| Playground state | 문서 사용자 | 예제를 바꾸고 복사할 JSX를 만든다. | `apps/docs`의 playground model |

한 표면의 이름을 다른 표면에 자동으로 복사하지 않는다. 같은 개념은 mapping으로 연결한다. 예를 들어 Figma의 `showLeadingIcon=true`와 icon instance는 React의 `leadingIcon` 콘텐츠에 대응하지만, React에 `showLeadingIcon` prop을 만들지 않는다.

## 2. React public interface

React props는 호출자가 내려야 하는 결정만 노출한다. 토큰 이름, CSS 면 처리, hover 같은 구현 상태를 고르게 하지 않는다.

| 종류 | 이름 | 규칙 |
| --- | --- | --- |
| 컴포넌트별 선택 | `variant` | 함께 움직여야 하는 사용 목적과 표현을 닫힌 union 하나로 제공한다. 범용 variant 목록은 만들지 않는다. |
| 피드백 의미 | `status` | Badge, Alert처럼 상태를 전달하는 컴포넌트에서만 `informative`, `positive`, `notice`, `negative`를 검토한다. |
| 크기 | `size` | 물리적 크기와 밀도만 표현한다. icon 전용 형태나 의미를 size 값에 넣지 않는다. |
| 조건 | `disabled`, `pending`, `readOnly`, `required`, `invalid`, `indeterminate` | 호출자가 정하는 조건만 boolean으로 받는다. `is` 접두사를 붙이지 않는다. |
| 콘텐츠 | `children`, `label`, `description`, `leadingIcon`, `trailingIcon` | 콘텐츠가 있으면 보이고 없으면 숨는다. 별도 `show*` prop을 함께 만들지 않는다. |
| 구조 | composition 또는 명시적 prop | 큰 영역은 `DialogFooter`처럼 조합하고, 작은 고정 슬롯만 이름 있는 prop으로 받는다. |
| 변경 알림 | `on<Value>Change` | 어떤 값이 바뀌는지 event 이름에 쓴다. 범용 `onChange`는 Canon field interface로 노출하지 않는다. |

`variant`는 모든 컴포넌트가 공유하는 시각 축이 아니다. Button의 `primary`, `secondary`, `quiet`, `destructive`처럼 그 컴포넌트를 올바르게 쓰기 위한 완성된 preset이다. `destructive`는 피드백 상태가 아니라 되돌리기 어려운 행동의 결과이므로 Button variant에 남긴다.

`intent`는 공개 축으로 사용하지 않는다. 작성자의 목적, 행동 결과, 상태색을 모두 뜻할 수 있어 값의 범위가 불명확하기 때문이다. 피드백 의미가 실제로 필요한 컴포넌트에서만 더 좁은 `status`를 검토한다.

## 3. Controlled와 uncontrolled

상태의 명사를 기준으로 세 가지 문법만 사용한다.

| 상태 | Controlled | Uncontrolled | 변경 알림 |
| --- | --- | --- | --- |
| 일반 값 | `value` | `defaultValue` | `onValueChange` |
| 선택 여부 | `checked` | `defaultChecked` | `onCheckedChange` |
| 열림 여부 | `open` | `defaultOpen` | `onOpenChange` |

1. controlled 값과 default 값은 함께 받지 않는다.
2. controlled 값에는 변경 알림을 필수로 둔다. 읽기 전용 field만 `readOnly`와 함께 변경 알림을 생략할 수 있다.
3. React Aria의 `selectedKey`, `isSelected`, `isOpen`, `onSelectionChange`는 구현에서 번역하고 Canon 호출자에게 자동 노출하지 않는다.
4. React Aria props 전체를 상속하지 않는다. Canon이 지원하고 검증하는 동작만 public interface에 명시한다.

## 4. Runtime-derived state

아래 상태는 호출자가 `state` prop으로 고르지 않는다.

| 상태 | 결정 주체 | 코드 표현 |
| --- | --- | --- |
| hover, pressed, focus-visible | 브라우저와 React Aria | React Aria가 만든 `data-hovered`, `data-pressed`, `data-focus-visible` |
| selected, checked, open | controlled 또는 uncontrolled 현재 값 | 각 상태의 명사형 props와 React Aria state |
| filled | field의 현재 값 | 값의 유무에서 파생 |
| invalid | validation 결과 또는 명시적 `invalid` | `aria-invalid`와 React Aria state |
| disabled, read-only | 명시적 조건 | public boolean을 React Aria의 `is*` prop으로 번역 |

`default`, `hover`, `pressed`, `focus`, `filled`를 하나의 public `state` union으로 만들지 않는다. CSS의 `data-*`는 스타일 구현 계약이며 React public interface가 아니다.

## 5. Figma authoring interface

Figma property는 설계자가 상태와 구조를 편집하고 시각적으로 검수하기 위한 schema다.

| Figma property | 역할 | React 대응 |
| --- | --- | --- |
| `interaction=default|hover|pressed|focus` | interaction 시각 검수. `focus`는 keyboard `focus-visible` 표현을 검수한다. | runtime에서 파생되며 public prop은 없다. |
| `showLeadingIcon`, `showFooter` 같은 BOOLEAN | 레이어 표시와 variant 수 관리 | 콘텐츠나 composition의 존재로 결정한다. |
| icon INSTANCE_SWAP | 편집기에서 아이콘을 교체한다. | `leadingIcon`, `trailingIcon` 같은 제한된 콘텐츠 prop에 대응한다. |
| Figma variant | 설계 조합을 탐색하고 검수한다. | 같은 사용자 결정을 나타낼 때만 React `variant`와 이름을 맞춘다. |
| `.variant`, `.size` 같은 점 접두사 | Figma 내부 property임을 표시한다. | JavaScript 이름 규칙으로 가져오지 않는다. |

Figma에는 component set을 완성하기 위한 `default` 값이 필요하지만 React에서는 기본값을 생략할 수 있다. Figma의 보임 BOOLEAN과 instance swap이 한 쌍이어도 React는 콘텐츠 prop 하나만 제공한다.

filled 모습은 실제 value 콘텐츠를 넣은 example로 검수한다. 값이 있을 때 구조 자체가 달라지는 컴포넌트가 생기면 해당 Figma 컴포넌트에서만 content 상태를 추가로 결정하며, 범용 `state=filled` 축은 만들지 않는다.

## 6. 이름 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| React 컴포넌트 | PascalCase | `InputGroup`, `DialogContent` |
| React prop | camelCase | `leadingIcon`, `readOnly`, `onValueChange` |
| 문자열 값 | 소문자 kebab-case | `soft-rounded`, `left-accent` |
| 위치 | `leading`, `trailing` | `leadingIcon`, `trailingIcon` |
| Figma 보임 BOOLEAN | `show` 접두사 | `showLeadingIcon`, `showFooter` |
| Figma 내부 property | `.` 접두사 | `.variant`, `.size` |

React boolean에는 `is` 접두사를 붙이지 않는다. React Aria의 `isDisabled`는 Canon의 `disabled`로 번역한다. 위치에는 쓰기 방향을 지원하는 `leading`, `trailing`을 쓰고 `left`, `right`를 쓰지 않는다.

## 7. 현재 runtime interface

미구현 컴포넌트의 예상 props는 정본에 미리 넣지 않는다.

| 컴포넌트 | 주요 선택 | 상태 문법 |
| --- | --- | --- |
| Button | `variant=primary|secondary|quiet|destructive`, `size=xs|sm|md|lg` | `pending`, `disabled` |
| IconButton | Button 선택 + `shape=square|round` | Button과 같음 |
| Checkbox | `indeterminate` | `checked/defaultChecked/onCheckedChange` |
| Switch | 없음 | `checked/defaultChecked/onCheckedChange` |
| RadioGroup | `orientation=horizontal|vertical` | `value/defaultValue/onValueChange` |
| Select | `size=sm|md|lg` | `value/defaultValue/onValueChange` |
| TextField, TextArea | `size=sm|md|lg` | `value/defaultValue/onValueChange` |
| NumberField | `size=sm|md|lg`, 범위와 format | `value/defaultValue/onValueChange` |
| Dialog | anatomy composition | `open/defaultOpen/onOpenChange` |

## 8. 구현할 때 결정할 것

- InputGroup의 `leading`, `trailing` 구조는 실제 runtime 사용 사례와 함께 결정한다. Figma variant 수만 보고 React props를 만들지 않는다.
- Alert의 accent 위치는 feedback vertical slice에서 `variant`, 구조 prop, composition을 다시 비교한다.
- Badge, Tag, Alert의 의미 축은 실제 콘텐츠와 접근성 계약을 만든 뒤 `status`로 확정한다.
- `className` 같은 escape hatch는 공통 prop으로 가정하지 않는다. 실제 소비처 요구와 커스터마이징 계약이 생길 때 지원 범위를 정한다.
- Figma의 기존 `state`를 `interaction`으로 바꾸는 migration은 instance 영향을 확인하고 별도로 진행한다.

## 9. 폐기한 모델

- Button의 `solid|outline|subtle + intent` 조합은 2026-11-15의 semantic action variant로 대체했다.
- Radio, Checkbox, Switch, Tabs에 색상 선택 prop을 두지 않는다.
- `state=filled`는 값에서 파생하므로 public prop이나 Figma의 지속 상태 축으로 만들지 않는다.
- Chakra의 범용 `colorScheme`과 컴포넌트 전체에 적용하는 `intent` matrix를 가져오지 않는다.

## 근거

- [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html): interaction과 accessibility behavior를 구현하고 상태를 DOM `data-*`로 제공한다.
- [Spectrum 2 Button](https://react-spectrum.adobe.com/Button): 행동의 위계와 위험도를 Button 선택으로 제공하지만 Canon은 조합 축을 더 늘리지 않는다.
- [SEED Text Button](https://v2.seed-design.io/component/text-button/style/): 제품 중요도를 기준으로 Button을 선택하는 설명을 참고했다.
- [shadcn/ui Button](https://ui.shadcn.com/docs/components/base/button): 작은 interface는 참고했지만 `link`와 면 처리와 위험도를 한 범용 목록에 섞는 방식은 가져오지 않았다.
- [Astryx API conventions](https://github.com/meta/astryx/wiki/API-Conventions/): prop 이름, 기본값, agent가 읽을 수 있는 문서 계약을 참고했다.
- Prism `packages/liner-prism/rules/`: Figma와 runtime 분리, controlled 문법, slot 존재로 보임을 정하는 규칙을 교차검토했다.
