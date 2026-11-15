---
verified: 2026-11-15
navigation: component
---
# TextArea

> Status: Preview. 다중행 입력과 form 계약을 먼저 검증하며 세밀한 시각 디자인과 Figma 동기화는 뒤에서 진행한다.

TextArea는 사용자가 여러 줄의 자유로운 텍스트를 입력하는 form field다.

## 기본 사용

```tsx
<TextArea label="Message" name="message" rows={4} required />
```

`label`은 화면에 보이며 필수다. `rows`는 처음 보이는 줄 수만 정하며 입력 길이를 제한하지 않는다. `description`은 입력 조건을 미리 설명하고, `invalid`와 `errorMessage`는 사용자가 해결할 수 있는 오류를 함께 전달한다.

## 선택

- 이름, 이메일, 검색어처럼 한 줄이면 TextField를 사용한다.
- 메시지, 메모, 설명처럼 줄바꿈이 필요한 자유 입력이면 TextArea를 사용한다.
- 정해진 목록에서 고르면 Select나 RadioGroup을 사용한다.
- 자동 높이, 글자 수 표시, Markdown 편집기는 현재 TextArea interface에 포함하지 않는다.

## form과 접근성

- `name`, `value`, `defaultValue`, `required`, `disabled`, `readOnly`, `rows`는 native textarea 계약으로 전달된다.
- `readOnly`가 아닌 상태에서 `value`로 제어하면 `onValueChange`도 함께 제공한다.
- `disabled`는 입력과 form 제출을 막는다. `readOnly`는 focus와 form 제출을 유지한다.
- `description`과 `errorMessage`는 textarea에 연결된다.
- `invalid`를 직접 제공하면 사용자가 해결할 수 있는 `errorMessage`도 제공한다.

## AI 사용 규칙

1. label을 placeholder로 대신하지 않는다.
2. 한 줄 입력에 TextArea를 사용하지 않는다.
3. `rows`를 입력 가능한 줄 수 제한으로 설명하지 않는다.
4. 자동 높이, 글자 수 표시, rich text 기능을 임의로 조합하지 않고 아직 미지원임을 알린다.
5. `readOnly`가 아닌 상태에서 `value`를 쓰면 `onValueChange`도 함께 제공한다.
