---
id: interaction-foundation
status: adopted
verified: 2026-11-01
---
# Interaction foundation

## 맥락

Canon에는 현재 `packages/tokens`와 `packages/cli`만 있고 runtime 컴포넌트 패키지는 없다. Figma variant와 component property는 설계 상태를 표현하지만, 브라우저의 focus, keyboard, dismissal, collection behavior를 실행하지 않는다.

Dialog, Select, ComboBox처럼 상호작용이 복잡한 컴포넌트의 행동 계층을 처음부터 직접 구현하면 focus 복귀, 중첩 overlay, typeahead, form 연동, 국제화와 보조 기술 동작을 Canon이 계속 유지해야 한다.

## 결정

Canon의 React runtime 컴포넌트는 `react-aria-components`를 interaction foundation으로 사용한다.

처음에는 낮은 수준의 `@react-aria/*`, `@react-stately/*` hook을 직접 조합하지 않는다. React Aria Components에서 표현할 수 없는 확인된 요구가 생겼을 때만 낮은 수준의 구현을 검토한다. 컴포넌트마다 Base UI, Radix, Ark UI를 섞지 않는다. 예외가 필요하면 이 결정의 재검토 조건과 근거를 먼저 기록한다.

## 책임 경계

| 주체 | 소유하는 것 |
| --- | --- |
| React Aria Components | focus와 keyboard interaction, ARIA 관계, 기본 overlay behavior, collection과 selection behavior, pointer와 touch 입력의 접근성 차이 |
| Canon | 공개 props와 variant, 노출할 part, 토큰과 스타일, motion, Figma와 코드의 대응, React Aria 고유 어휘를 감출 범위, foundation behavior를 보존하는 통합과 검증 |
| Canon을 사용하는 앱 | 데이터와 비즈니스 상태, 권한, 요청과 오류 처리, 제품별 콘텐츠 |

React Aria의 slot, collection, render prop을 Canon의 공개 interface에 자동으로 노출하지 않는다. 호출자가 알아야 할 이유가 확인된 항목만 Canon interface로 올린다.

## 검토한 대안

| 대안 | 선택하지 않은 이유 |
| --- | --- |
| Base UI | parts와 DOM state가 단순하지만, Canon이 장기적으로 다룰 collection, 국제화, 복잡한 입력 범위에서는 React Aria가 더 많은 행동을 맡는다. |
| Radix Primitives | 성숙한 primitive이지만 컴포넌트별 package와 API를 조합해야 하고, React Aria보다 collection과 국제화 범위가 좁다. |
| Ark UI와 Zag | 명시적인 finite state machine이 장점이지만 현재 Canon에 필요한 것보다 계층과 interface가 크고, React 외 framework adapter가 필요하지 않다. |
| 브라우저 primitive 직접 구현 | 의존성은 줄지만 focus, dismissal, roving focus, typeahead, ARIA와 브라우저 차이의 구현·검증 책임이 Canon으로 이동한다. |

## 결과와 제약

- Canon은 상호작용 동작을 복제하지 않고 공개 interface와 시각 계약에 집중할 수 있다.
- React Aria Components의 접근성·collection 모델을 사용하지만 Canon 문서와 props가 해당 라이브러리의 복사본이 되지 않게 유지해야 한다.
- 첫 runtime 검증 대상은 overlay와 focus를 확인하는 Dialog, collection과 form behavior를 확인하는 Select다.
- 채택만으로 접근성이 보장되지는 않는다. Canon wrapper의 DOM, label, error, motion을 실제 keyboard와 보조 기술로 검증해야 한다.

## 재검토 조건

다음 중 하나가 실제 구현이나 검증에서 발생하면 이 결정을 다시 검토한다.

1. 필요한 DOM이나 part 구성을 React Aria Components로 표현할 수 없다.
2. Canon interface를 유지하기 위해 React Aria의 focus, keyboard, ARIA behavior를 반복해서 우회한다.
3. SSR, hydration, bundle, portal 또는 중첩 overlay 문제가 Canon의 지원 환경에서 재현된다.
4. React 이외의 runtime 구현을 같은 interaction model로 제공해야 한다.
5. Dialog와 Select의 keyboard·screen reader 검증에서 foundation 수준의 결함이 반복된다.

## 근거

- [React Aria Components](https://react-aria.adobe.com/): 접근성, 국제화, adaptive interaction과 unstyled component 범위
- [Modal](https://react-aria.adobe.com/Modal): controlled state, focus containment, dismissal behavior
- [Select](https://react-aria.adobe.com/Select): collection, keyboard, form과 validation behavior
- [Base UI](https://base-ui.com/react/overview/about), [Radix Primitives](https://www.radix-ui.com/primitives), [Ark UI](https://ark-ui.com/docs/overview/about): 비교한 headless foundation의 공식 문서
- Canon의 현재 배포 package: [`packages/tokens`](../../packages/tokens/package.json), [`packages/cli`](../../packages/cli/package.json)
