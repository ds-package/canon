---
verified: 2026-11-15
navigation: component
---
# Select

> Status: Preview. 현재는 outline 한 가지 표현만 제공하며 세밀한 시각 디자인과 Figma 동기화는 뒤에서 진행한다.

Select는 정해진 목록에서 하나를 고르는 form field다. 사용자가 값을 직접 입력해야 하거나 목록을 검색해야 하면 Select 대신 Input 또는 ComboBox를 사용한다.

## 기본 사용

```tsx
<Select label="Fruit" name="fruit" defaultValue="apple">
  <SelectItem id="apple">Apple</SelectItem>
  <SelectItem id="banana">Banana</SelectItem>
  <SelectItem id="orange" disabled>Orange</SelectItem>
</Select>
```

`label`은 화면에 보이며 필수다. `name`을 제공하면 선택한 `id`가 form value가 된다. 크기는 `md`가 기본이고 `sm`, `lg`만 추가로 제공한다.

초기값은 `defaultValue`, 외부 상태로 제어할 때는 `value`와 `onValueChange`를 함께 사용한다. 두 상태 방식을 동시에 사용하지 않는다.

## 상태와 접근성

- `description`은 선택에 필요한 도움말을 제공한다.
- `invalid`와 `errorMessage`는 검증 실패를 함께 표현한다.
- `required`, `disabled`, 선택 상태와 keyboard/typeahead 동작은 React Aria Components가 담당한다.
- 사용할 수 없는 option은 해당 `SelectItem`에 `disabled`를 제공한다.

## AI 사용 규칙

1. label을 placeholder로 대신하지 않는다.
2. option의 `id`는 form에 저장해도 되는 안정적인 값으로 쓴다.
3. 링크 이동, 여러 항목 선택, 검색 가능한 긴 목록에 Select를 쓰지 않는다.
4. `invalid`를 쓰면 사용자가 해결할 수 있는 `errorMessage`도 제공한다.
5. `value`로 제어하면 `onValueChange`도 함께 제공한다.
