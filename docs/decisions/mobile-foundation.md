---
id: mobile-foundation
status: adopted
verified: 2026-11-18
navigation: architecture
navigationOrder: 3
---
# Mobile foundation

## 맥락

Canon은 `@canon/react`에서 Preview Button, IconButton, Checkbox, Dialog, NumberField, RadioGroup, Select, Switch, TextArea, TextField를 제공한다. 모바일은 아직 구현과 public interface가 없다.

[Interaction foundation](./interaction-foundation.md)의 재검토 조건 4번은 React 이외의 runtime을 같은 interaction model로 제공해야 할 때다. 모바일은 React Aria를 쓰지 않으므로 이 결정은 React runtime에만 적용하고, 모바일의 기준은 이 문서에서 따로 정한다.

목표는 Figma와 코드가 같은 모양을 복제하는 것이 아니라 디자인과 각 플랫폼이 같은 의미를 공유하는 것이다. Web에서 먼저 만든 구조를 그대로 옮기지 않고 iOS와 Android의 native 관점에서 공통 언어를 다시 확인했다.

## 결정

| # | 질문 | 결정 |
| --- | --- | --- |
| 1 | 공통 정본 | [컴포넌트 프로퍼티 모델](../components.md)의 공통 계약이 정본이다. React, iOS, Android public interface와 Figma property는 모두 번역본이다. `@canon/react`의 TypeScript는 React 번역의 구현 근거다. |
| 2 | 상태와 form | 공통 계약은 현재 값과 변경 알림의 의미만 정한다. `default*` 초기값 쌍, controlled와 uncontrolled 규칙, `name`·`form`·`type` 같은 form 제출 연결은 React 번역 규칙이다. |
| 3 | 이름 충돌 | 제품 의미는 Canon 이름을 쓰고, 플랫폼 메커니즘은 플랫폼 관례 이름을 쓴다. `checked`, `value`, `open`, `invalid`, `variant`는 유지한다. `disabled`는 Compose에서 `enabled`, SwiftUI에서 `.disabled()`로 번역하고, `onPress`는 `onClick`과 action closure로 번역한다. |
| 4 | 지원 범위 | SwiftUI와 Jetpack Compose만 지원한다. 최소 버전은 iOS 16과 Android minSdk 26이다. UIKit과 View 화면은 `UIHostingController`와 `ComposeView` interop으로 사용한다. |
| 5 | Dialog와 AlertDialog | iOS `.alert`와 Compose Material3 `AlertDialog`는 Dialog의 모바일 번역이 아니라 별도 컴포넌트 `AlertDialog`에 대응한다. AlertDialog의 공통 계약은 후속으로 정한다. 기존 Dialog의 모바일 표현은 정하지 않았고, sheet는 별도 컴포넌트 후보로 둔다. |
| 6 | size와 터치 영역 | 모바일 `size`는 고정 높이가 아니라 밀도다. 높이는 최소값으로만 정하고, 보이는 크기와 관계없이 터치 영역은 iOS 44pt, Android 48dp 이상이다. |
| 7 | 토큰 | 모바일 토큰 출력을 컴포넌트 구현보다 먼저 정한다. |
| 8 | 저장소 | Swift Package와 Android library를 이 저장소에서 관리한다. Swift Package는 저장소 루트의 `Package.swift`로 배포한다. |

## 책임 경계

| 주체 | 소유하는 것 |
| --- | --- |
| 공통 계약 | 제품이 결정하는 상태와 콘텐츠의 의미, 필수 조건, variant 의미, 터치 영역 하한 |
| 플랫폼 번역 | 플랫폼 관례 이름과 타입, 상태 전달 방식, 표시 방식, 접근성 API 대응 |
| SwiftUI와 Compose | focus, pressed, 시스템 back과 dismiss, Dynamic Type과 글꼴 크기 계산, 보조 기술 동작 |
| Canon을 사용하는 앱 | 데이터와 비즈니스 상태, 권한, 요청과 오류 처리, 제품별 콘텐츠 |

## 결과와 제약

- iOS 16을 지원하므로 iOS 17 API에 의존하지 않는다. 상태 관리는 `@Observable` 대신 `ObservableObject`를 쓰고, Checkbox의 접근성은 `.isToggle` trait 대신 button trait과 `accessibilityValue`로 표현한다. `performAccessibilityAudit` 같은 접근성 감사는 최소 지원 버전과 별개로 iOS 17 이상 simulator에서 실행할 수 있다.
- 플랫폼 alert는 title, message, button만 담고 닫기는 alert button과 시스템 동작이 맡는다. 그래서 React Dialog의 `DialogBody` rich content, 아이콘만 있는 `DialogClose`, `closeOnInteractOutside`, `closeOnEscape`를 표현할 수 없다. 이 차이 때문에 alert를 Dialog의 번역으로 두지 않고 AlertDialog로 분리한다.
- 모바일에는 HTML form이 없으므로 form 제출 연결 prop을 만들지 않는다.
- 공통 계약의 `size` 값 중 모바일에서 `xs`를 제공할지는 Button 구현 때 정한다.
- 모바일 토큰 결정 문서는 Swift와 Kotlin 출력 형식, pt·dp·sp 단위와 행간·자간 변환, 다크 appearance, brand·tint 테마 전달, shadow와 elevation 대응, Pretendard 번들링과 Dynamic Type 스케일 곡선을 다룬다.
- SwiftPM은 저장소 루트의 `1.2.3` 또는 `v1.2.3` 형태 git tag로 버전을 읽는다. changesets의 `@canon/react@x.y.z` tag와 한 저장소에 공존하므로 iOS 버전을 JS와 독립적으로 올리는 방식은 첫 배포 전에 정한다.

## 미정

- AlertDialog의 공통 계약과 React 번역
- Dialog의 모바일 표현(full-screen cover, custom overlay 등 무엇에 대응할지). sheet는 별도 컴포넌트 후보로 따로 다룬다.
- 모바일 토큰 출력의 구체 형식과 생성 도구
- iOS 버전 tag 규칙과 Android Maven 배포 위치
- 모바일 Select 표시 방식(iOS `Menu`·`Picker`, Android dropdown·bottom sheet)
- 모바일 focus API(`@FocusState`, `FocusRequester`)의 공개 범위
- 공통 계약과 Swift·Kotlin public interface를 자동 대조하는 방법

## 재검토 조건

1. 실제 사용 앱이 iOS 16이나 minSdk 26보다 낮은 버전을 지원해야 한다.
2. UIKit이나 View 화면에서 interop으로 해결할 수 없는 사용 사례가 반복된다.
3. AlertDialog 공통 계약에 플랫폼 기본 alert로 표현할 수 없는 요구가 생긴다.
4. 루트 `Package.swift`와 changesets tag가 실제 배포에서 충돌한다.

## 근거

- 2026-11-16 Canon Mobile 협업 방향 검토에서 사용자가 확정한 결정
- [컴포넌트 프로퍼티 모델](../components.md), [Interaction foundation](./interaction-foundation.md)
- [Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): 최소 터치 영역 44pt
- [Android accessibility: touch target size](https://developer.android.com/guide/topics/ui/accessibility/apps#large-controls): 최소 터치 영역 48dp
- [Swift Package Manager: Package.swift](https://docs.swift.org/swiftpm/documentation/packagedescription/): 저장소 루트 manifest와 semantic version tag
