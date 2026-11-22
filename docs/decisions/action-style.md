---
id: action-style
status: adopted
verified: 2026-11-23
navigation: architecture
navigationOrder: 4
---
# Action style

## Context

Button과 IconButton의 스타일 축은 세 번 바뀌었다.

- 2026-10-14: Chakra에서 가져온 Figma를 기준으로 `variant`(면 처리)와 `intent`(의미색)를 나눴다. 같은 축을 Badge, Tag, Alert, Progress도 썼다.
- 2026-11-15: React Button은 `primary`, `secondary`, `quiet`, `destructive` 한 목록으로 구현됐다.
- 2026-11-22: 공통 계약이 `variant`(`solid`, `subtle`, `ghost`)와 `tone`(`accent`, `negative`)으로 다시 나뉘었다.

두 축을 곱하면 `subtle + accent`처럼 쓰임을 설명할 수 없는 조합이 생기고, 허용 조합 목록을 따로 관리해야 했다.

## Decision

1. 동작 컴포넌트(Button, IconButton)는 `variant` 하나로 고른다. 값은 현재 React 이름 그대로 `primary`, `secondary`, `quiet`, `destructive`이고 기본값은 `variant=secondary`, `size=lg`다.
2. `primary`는 한 영역에 하나만 둔다. IconButton은 `destructive`를 두지 않는다. 아이콘만 있는 위험 동작은 잘못 누르기 쉬워서 label이 있는 Button을 쓴다.
3. 상태 표시 컴포넌트(Badge, Tag, Alert)는 `variant`와 `tone`을 함께 쓴다.
4. 색이 의미를 갖지 않는 컴포넌트(Checkbox, Radio, Switch)에는 색 축을 두지 않는다.
5. 새 값은 실제 화면 사례가 생겼을 때만 추가한다. 예: `success`
6. 이름은 바꾸지 않는다. `ghost`, `danger` 같은 다른 시스템의 흔한 이름으로 바꿀 근거가 약하고, 기존 코드를 깨지 않기 위해서다.

2026-11-22의 "화면 위계는 prop 값으로 고정하지 않는다" 원칙은 동작 컴포넌트에 한해 철회한다.

## Consequences and constraints

- React는 variant 이름을 유지하고 기본값만 `secondary`, `lg`로 바꿨다. IconButton 기본값도 `quiet`에서 `secondary`로 바꿨다(2026-11-23 반영).
- Figma Button과 IconButton은 2026-11-23에 `tone`을 없애고 다시 묶었다. Button은 네 variant, IconButton은 `destructive`를 뺀 세 variant다.
- React IconButton은 아직 `destructive`를 받는다. 타입에서 빼는 작업이 남아 있다.
- 처음 두 축을 둔 이유인 "의미색과 면 처리의 독립 조합"은 상태 표시 컴포넌트에서 유지한다.

## Revisit when

1. 동작 컴포넌트에서 같은 스타일에 의미색만 다른 사례가 둘 이상 생긴다.
2. 한 영역에 `primary`를 둘 이상 둬야 하는 화면이 반복된다.
