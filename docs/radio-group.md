---
verified: 2026-11-15
---
# RadioGroup

> Status: Preview. form 동작과 접근성 계약을 먼저 검증하며 세밀한 시각 디자인과 Figma 동기화는 뒤에서 진행한다.

RadioGroup은 서로 배타적인 선택지 중 하나를 고를 때 사용한다. group의 보이는 이름은 `label`, 각 선택지의 보이는 이름은 `RadioOption`의 `children`으로 제공한다.

## 기본 사용

```tsx
<RadioGroup label="Plan" name="plan" defaultValue="free">
  <RadioOption value="free">Free</RadioOption>
  <RadioOption value="pro">Pro</RadioOption>
</RadioGroup>
```

form 안에서 선택된 option의 `value`가 group의 `name`으로 제출된다. 초기값은 `defaultValue`, 외부 상태로 제어할 때는 `value`와 `onValueChange`를 함께 사용한다.

## 사용과 회피

- 사용자가 모든 선택지를 함께 비교해야 하고 하나만 고를 수 있을 때 사용한다.
- 선택지가 많거나 공간을 줄여야 하면 Select를 사용한다.
- 여러 항목을 동시에 고를 수 있으면 Checkbox를 사용한다.
- 켜짐과 꺼짐만 있는 즉시 적용 설정에는 Switch를 사용한다.

## form과 접근성

- `label`과 각 `RadioOption`의 `children`은 화면에 보여야 한다.
- `description`은 선택 기준이나 결과를 미리 설명한다.
- `invalid`와 `errorMessage`는 사용자가 해결할 수 있는 검증 실패를 함께 전달한다.
- `required`, `disabled`, `readOnly`, option별 `disabled`, keyboard 방향키 동작과 form 제출은 RadioGroup 계약으로 전달된다.
- `orientation`은 실제 배치와 방향키 탐색 방향을 함께 표현한다.

## AI 사용 규칙

1. 단일 선택 목록에만 RadioGroup을 사용한다.
2. group label이나 option label을 주변 문맥에서 추측하지 않는다.
3. `readOnly`가 아닌 상태에서 `value`를 쓰면 `onValueChange`도 함께 제공한다.
4. `invalid`를 쓰면 사용자가 해결할 수 있는 `errorMessage`도 제공한다.
5. 목록이 길거나 선택지를 한눈에 비교할 필요가 없으면 Select를 검토한다.
