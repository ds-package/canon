---
verified: 2026-11-15
navigation: component
---
# TextField

> Status: Preview. 동작과 form 계약을 먼저 검증하며 세밀한 시각 디자인과 Figma 동기화는 뒤에서 진행한다.

TextField는 사용자가 한 줄의 텍스트를 직접 입력하는 form field다. 코드의 `TextField`는 Figma의 `Input` 컴포넌트에 대응한다.

## 기본 사용

```tsx
<TextField
  label="Email"
  name="email"
  type="email"
  autoComplete="email"
  required
/>
```

`label`은 화면에 보이며 필수다. `md`가 기본 크기이고 `sm`, `lg`를 제공한다. `description`은 입력 조건을 미리 설명하고, `invalid`와 `errorMessage`는 사용자가 해결할 수 있는 오류를 함께 전달한다.

초기값은 `defaultValue`, 외부 상태로 제어할 때는 `value`와 `onValueChange`를 함께 사용한다. `readOnly`로 값을 표시할 때는 callback을 생략할 수 있다.

## 선택

- 정해진 목록에서 하나를 고르면 Select를 사용한다.
- 검색 결과나 추천 목록에서 고르면 ComboBox를 사용한다.
- 여러 줄 입력은 TextArea, 숫자 증감과 범위 검증은 NumberField가 맡는다.
- prefix, suffix, clear button, password reveal은 현재 TextField interface에 포함하지 않는다.

## form과 접근성

- `name`, `value`, `defaultValue`, `required`, `disabled`, `readOnly`, `autoComplete`는 native input 계약으로 전달된다.
- `disabled`는 입력과 form 제출을 막는다. `readOnly`는 focus와 form 제출을 유지한다.
- `description`과 `errorMessage`는 input에 연결된다.
- `invalid`를 직접 제공하면 사용자가 해결할 수 있는 `errorMessage`도 제공한다.

## AI 사용 규칙

1. label을 placeholder로 대신하지 않는다.
2. 숫자 입력에 `type="number"`를 만들지 않고 NumberField를 선택한다.
3. 여러 줄 입력에 TextField를 사용하지 않는다.
4. prefix·suffix가 필요하다고 임의 wrapper를 만들지 않고 아직 미지원임을 알린다.
5. `readOnly`가 아닌 상태에서 `value`를 쓰면 `onValueChange`도 함께 제공한다.
