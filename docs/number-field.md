---
verified: 2026-11-15
---
# NumberField

> Status: Preview. locale-aware 숫자 입력과 form 계약을 먼저 검증하며 세밀한 시각 디자인과 Figma 동기화는 뒤에서 진행한다.

NumberField는 수량, 금액, 비율처럼 숫자로 계산하거나 범위를 검증하는 값을 입력할 때 사용한다.

## 기본 사용

```tsx
<NumberField
  label="Budget"
  name="budget"
  minValue={0}
  maxValue={10000}
  step={100}
  formatOptions={{ style: 'currency', currency: 'USD' }}
/>
```

보이는 문자열은 현재 locale과 `formatOptions`에 맞게 표시하지만, form에는 계산 가능한 숫자 값을 제출한다. 빈 값은 `null`로 표현한다.

## 선택

- 계산, 범위 제한, 증감 단위가 필요한 숫자에는 NumberField를 사용한다.
- 전화번호, 우편번호, 카드 번호처럼 숫자로 계산하지 않는 식별자는 TextField를 사용한다.
- 일반 TextField에 `type="number"`를 추가해 NumberField 동작을 흉내 내지 않는다.
- 연속 범위를 포인터로 빠르게 조절하는 입력은 별도 Slider가 필요하다.

## form과 접근성

- `minValue`, `maxValue`, `step`은 허용 범위와 증감 단위를 함께 정의한다.
- `formatOptions`는 `Intl.NumberFormatOptions`를 사용하며 locale별 구분자와 단위를 보존한다.
- 입력을 blur하거나 Enter로 확정하면 기본 snap 동작이 값을 범위 안으로 제한하고 `step` 단위에 맞춘다.
- 제어 중인 `value`도 화면 표시와 form 제출 전에 같은 snap 규칙이 적용되며, 외부 상태 자체는 Canon이 변경하지 않는다.
- 증감 버튼과 ArrowUp·ArrowDown은 같은 `step` 계약을 사용한다.
- `disabled`는 입력과 form 제출을 막는다. `readOnly`는 focus와 form 제출을 유지한다.
- `invalid`를 직접 제공하면 사용자가 해결할 수 있는 `errorMessage`도 제공한다.
- `readOnly`가 아닌 상태에서 `value`로 제어하면 `onValueChange`도 함께 제공한다.

## AI 사용 규칙

1. 숫자로 보이더라도 계산하지 않는 식별자에는 TextField를 사용한다.
2. native `type="number"`나 직접 만든 증감 버튼으로 NumberField를 대체하지 않는다.
3. 빈 값을 `0`으로 추정하지 않고 `null`로 유지한다.
4. 통화·단위·백분율 표시는 문자열을 직접 붙이지 않고 `formatOptions`를 사용한다.
5. `minValue`, `maxValue`, `step`의 제품 의미를 확인하지 못하면 임의로 정하지 않는다.
