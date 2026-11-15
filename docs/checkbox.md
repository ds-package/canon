---
verified: 2026-11-15
navigation: component
---
# Checkbox

> Status: Preview. form 동작과 접근성 계약을 먼저 검증하며 세밀한 시각 디자인과 Figma 동기화는 뒤에서 진행한다.

Checkbox는 독립적인 동의 여부를 받거나 목록에서 여러 항목을 선택할 때 사용한다. 화면에 보이는 label을 `children`으로 제공한다.

## 기본 사용

```tsx
<Checkbox name="terms" value="accepted" required>
  Accept the terms
</Checkbox>
```

form 안에서 선택되면 `name=value`가 제출된다. 초기값은 `defaultChecked`, 외부 상태로 제어할 때는 `checked`와 `onCheckedChange`를 함께 사용한다.

## 사용과 회피

- 약관 동의처럼 하나의 독립적인 결정을 받거나 여러 항목을 각각 선택할 때 사용한다.
- 하나의 선택만 허용하는 목록에는 RadioGroup을 사용한다.
- 즉시 켜고 끄는 설정에는 Switch를 사용한다.
- 작업 실행, 화면 이동, 메뉴 선택에 Checkbox를 사용하지 않는다.

## form과 접근성

- `children`은 화면에 보이는 구체적인 label이어야 한다.
- `description`은 선택의 결과나 조건을 미리 설명한다.
- `invalid`와 `errorMessage`는 사용자가 해결할 수 있는 검증 실패를 함께 전달한다.
- `required`, `disabled`, `readOnly`, keyboard 동작과 form 제출은 Checkbox 계약으로 전달된다.
- `indeterminate`는 하위 항목이 일부만 선택된 혼합 상태를 나타낸다. 세 번째 form value가 아니다. 소비자는 `onCheckedChange`가 전달한 다음 값으로 하위 선택 상태를 갱신하고 `indeterminate`를 해제한다.

## AI 사용 규칙

1. 보이지 않는 label이나 주변 문맥만으로 목적을 추측하게 만들지 않는다.
2. 단일 선택 목록, 즉시 실행되는 설정, 버튼 동작에 Checkbox를 사용하지 않는다.
3. `readOnly`가 아닌 상태에서 `checked`를 쓰면 `onCheckedChange`도 함께 제공한다.
4. `invalid`를 쓰면 사용자가 해결할 수 있는 `errorMessage`도 제공한다.
5. 전체 선택에서만 `indeterminate`를 사용하며 별도의 선택 값으로 저장하지 않는다.
