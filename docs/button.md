---
verified: 2026-11-15
navigation: component
---
# Button

> Status: Preview. 코드와 로컬 playground는 검증 중이며 Figma의 `primary`, `secondary`, `destructive` 시각 정의는 아직 동기화되지 않았다.

Button은 현재 화면에서 동작을 실행한다. 다른 위치로 이동하는 동작에는 Link를 사용한다.

## 선택

| 목적 | 선택 |
| --- | --- |
| 화면의 대표 동작 | 기본 `Button`, 즉 `primary` |
| 대표 동작보다 낮은 위계 | `secondary` |
| 툴바처럼 배경 강조가 필요 없는 동작 | `quiet` |
| 삭제처럼 되돌리기 어려운 동작 | `destructive` |
| 아이콘만 보이는 익숙한 동작 | `IconButton`과 필수 `aria-label` |

색이나 의미 상태를 표현하기 위해 Button을 쓰지 않는다. 정보·성공·주의 상태는 해당 feedback 컴포넌트가 맡는다.

## 기본 사용

```tsx
<Button onPress={save}>Save changes</Button>

<Button variant="secondary" onPress={cancel}>Cancel</Button>

<Button variant="destructive" onPress={remove}>Delete</Button>

<IconButton icon={<XIcon />} aria-label="Close" />
```

`Button`의 기본값은 `variant="primary"`, `size="md"`, `type="button"`이다. form을 제출할 때만 `type="submit"`을 명시한다. `pending`은 동작을 막지만 focus와 기존 label을 유지하고 progressbar를 노출한다. 서비스 언어가 영어가 아니면 `pendingLabel`을 번역해 제공한다.

## 접근성 계약

- 텍스트 Button은 화면에 보이는 동작 이름을 children으로 제공한다.
- `IconButton`은 비어 있지 않은 `aria-label`을 반드시 제공한다.
- leading·trailing icon은 장식이다. 크기, `currentColor`, 보조 기술 노출은 Button이 통제한다.
- `disabled`와 `pending` 상태에서는 press가 실행되지 않는다.
- keyboard focus와 pointer·touch press 동작은 React Aria Components가 담당하고 Canon은 실제 DOM과 스타일을 검증한다.

## 크기

`md`가 기본이다. `lg`는 넓은 화면의 중요한 동작, `sm`과 `xs`는 밀도 높은 도구 영역에만 사용한다. 작은 크기를 모바일의 주 동작에 사용하지 않는다.

## AI 사용 규칙

1. 별도 지시가 없으면 `<Button>`을 사용한다.
2. 위험한 파괴 동작에만 `destructive`를 사용한다.
3. 아이콘만 있으면 `Button` 대신 `IconButton`을 사용하고 동작 이름을 `aria-label`에 쓴다.
4. 링크 이동, 상태 배지, 선택 가능한 toggle을 Button으로 만들지 않는다.
