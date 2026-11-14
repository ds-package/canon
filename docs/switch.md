---
verified: 2026-11-15
---
# Switch

> Status: Preview. 동작과 접근성 계약을 먼저 검증하며 세밀한 시각 디자인과 Figma 동기화는 뒤에서 진행한다.

Switch는 변경 즉시 적용되는 설정을 켜거나 끌 때 사용한다. 화면에 보이는 label을 `children`으로 제공한다.

## 기본 사용

```tsx
<Switch name="notifications" value="enabled">
  Notifications
</Switch>
```

초기값은 `defaultChecked`, 외부 상태로 제어할 때는 `checked`와 `onCheckedChange`를 함께 사용한다. form 안에서 켜진 Switch는 `name=value`를 제출하지만, 제출 시 검증이 필요한 동의에는 Checkbox를 사용한다.

## 사용과 회피

- 저장 버튼 없이 즉시 적용되는 설정에 사용한다.
- 약관 동의, 필수 확인, 오류 메시지가 필요한 입력에는 Checkbox를 사용한다.
- 여러 선택지 중 하나를 고를 때는 RadioGroup이나 Select를 사용한다.
- 작업 실행이나 화면 이동에는 Button을 사용한다.

## 접근성

- `children`은 화면에 보이는 구체적인 label이어야 한다.
- `description`은 설정을 켰을 때 달라지는 결과를 설명한다.
- `disabled`는 사용할 수 없는 이유를 주변 문맥에서 설명한다.
- `readOnly`는 현재 값을 보여주지만 변경을 허용하지 않을 때만 사용한다.
- keyboard와 form 제출은 Switch 계약으로 전달된다.

## AI 사용 규칙

1. 변경이 즉시 적용되지 않으면 Switch를 선택하지 않는다.
2. 동의나 form validation을 Switch로 표현하지 않는다.
3. 보이지 않는 label이나 주변 문맥만으로 목적을 추측하게 만들지 않는다.
4. `readOnly`가 아닌 상태에서 `checked`를 쓰면 `onCheckedChange`도 함께 제공한다.
5. `description`에는 상태 이름을 반복하지 않고 변경 결과를 쓴다.
