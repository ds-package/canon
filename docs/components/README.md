---
verified: 2026-11-23
navigation: component
---
# Components

Canon이 제공하는 React 컴포넌트와 공개 prop 목록입니다. prop의 공통 의미와 현재 React와 다른 계약은 [Component Properties](../foundations/properties.md)에서 확인합니다.

## Implementation coverage matrix

현재 React 컴포넌트와 앞으로 만들 후보를 한 표에 둡니다. Public type과 Public props가 있는 행은 React public interface의 전체 목록이며 validator가 TypeScript와 대조합니다. `-`인 행은 아직 구현하지 않은 후보이며 확정한 계획이 아닙니다.

상태:
- 문서 있음: 사용 문서와 Playground가 있습니다.
- 디자인 정리 필요: React 구현은 있지만 문서와 Figma가 없습니다.
- 예정: 기본은 먼저 만들 기본 컴포넌트, 화면·AI는 화면 단위와 AI 제품용 컴포넌트입니다.

| Component | Public type | Public props | 쓰임 | 상태 |
| --- | --- | --- | --- | --- |
| [Button](./button.md) | `ButtonProps` | `children`, `variant`, `size`, `leadingIcon`, `trailingIcon`, `disabled`, `pending`, `pendingLabel`, `className`, `id`, `form`, `name`, `value`, `type`, `autoFocus`, `onPress`, `aria-label`, `aria-labelledby`, `aria-describedby` | 현재 화면에서 동작을 실행합니다. | 디자인 정리 필요 |
| [IconButton](./icon-button.md) | `IconButtonProps` | `icon`, `aria-label`, `variant`, `shape`, `size`, `disabled`, `pending`, `pendingLabel`, `className`, `id`, `form`, `name`, `value`, `type`, `autoFocus`, `onPress`, `aria-labelledby`, `aria-describedby` | 아이콘만으로 동작을 실행합니다. | 디자인 정리 필요 |
| Checkbox | `CheckboxProps` | `children`, `description`, `errorMessage`, `indeterminate`, `disabled`, `required`, `invalid`, `name`, `value`, `form`, `checked`, `defaultChecked`, `onCheckedChange`, `readOnly` | 항목을 하나씩 선택하거나 해제합니다. | 디자인 정리 필요 |
| RadioGroup | `RadioGroupProps` | `children`, `label`, `description`, `errorMessage`, `orientation`, `disabled`, `required`, `invalid`, `name`, `form`, `value`, `defaultValue`, `onValueChange`, `readOnly` | 여러 선택지 중 하나를 고릅니다. | 디자인 정리 필요 |
| RadioOption | `RadioOptionProps` | `value`, `children`, `description`, `disabled` | RadioGroup의 선택지 하나입니다. | 디자인 정리 필요 |
| SelectItem | `SelectItemProps` | `id`, `children`, `textValue`, `disabled` | Select 목록의 항목 하나입니다. | 디자인 정리 필요 |
| Select | `SelectProps` | `children`, `label`, `description`, `errorMessage`, `placeholder`, `size`, `disabled`, `required`, `invalid`, `name`, `form`, `autoFocus`, `onFocus`, `onBlur`, `value`, `defaultValue`, `onValueChange` | 정해진 목록에서 하나를 고릅니다. | 디자인 정리 필요 |
| Switch | `SwitchProps` | `children`, `description`, `disabled`, `name`, `value`, `form`, `checked`, `defaultChecked`, `onCheckedChange`, `readOnly` | 설정을 즉시 켜고 끕니다. | 디자인 정리 필요 |
| TextField | `TextFieldProps` | `label`, `description`, `errorMessage`, `type`, `size`, `disabled`, `required`, `invalid`, `name`, `form`, `autoComplete`, `placeholder`, `autoFocus`, `onFocus`, `onBlur`, `inputMode`, `pattern`, `minLength`, `maxLength`, `value`, `defaultValue`, `onValueChange`, `readOnly` | 한 줄 텍스트를 입력합니다. | 디자인 정리 필요 |
| TextArea | `TextAreaProps` | `label`, `description`, `errorMessage`, `placeholder`, `rows`, `size`, `disabled`, `required`, `invalid`, `name`, `form`, `value`, `defaultValue`, `onValueChange`, `readOnly` | 여러 줄 텍스트를 입력합니다. | 디자인 정리 필요 |
| NumberField | `NumberFieldProps` | `label`, `description`, `errorMessage`, `size`, `minValue`, `maxValue`, `step`, `formatOptions`, `disabled`, `required`, `invalid`, `name`, `form`, `value`, `defaultValue`, `onValueChange`, `readOnly` | 숫자를 입력합니다. | 디자인 정리 필요 |
| DialogClose | `DialogCloseProps` | `children`, `aria-label` | Dialog를 닫습니다. | 디자인 정리 필요 |
| Dialog | `DialogProps` | `children`, `closeOnInteractOutside`, `closeOnEscape` | 화면 위에 열어 집중이 필요한 작업을 처리합니다. | 디자인 정리 필요 |
| DialogTrigger | `DialogTriggerProps` | `children`, `open`, `defaultOpen`, `onOpenChange` | 버튼과 Dialog를 연결합니다. | 디자인 정리 필요 |
| DialogTitle, DialogDescription, DialogBody, DialogFooter | 내부 공통 타입 | `children` | Dialog의 제목, 설명, 본문, 하단 action 영역을 구성합니다. | 디자인 정리 필요 |
| Link | - | - | 다른 위치로 이동합니다. | 예정: 기본 |
| Field | - | - | label, description, 오류 메시지를 form control에 공통으로 붙입니다. | 예정: 기본 |
| Menu | - | - | 더보기와 action 목록을 엽니다. | 예정: 기본 |
| Tabs | - | - | 같은 화면 안의 보기를 전환합니다. | 예정: 기본 |
| SegmentedControl | - | - | 적은 수의 보기나 값을 바로 고릅니다. | 예정: 기본 |
| Tooltip | - | - | IconButton처럼 짧은 이름을 보충합니다. | 예정: 기본 |
| Popover | - | - | 버튼에 연결된 작은 패널을 엽니다. | 예정: 기본 |
| Toast | - | - | 동작의 결과를 잠깐 알립니다. | 예정: 기본 |
| Banner | - | - | 페이지나 영역 단위의 상태를 알립니다. | 예정: 기본 |
| Badge | - | - | 상태와 개수를 표시합니다. | 예정: 기본 |
| Avatar | - | - | 사람이나 조직을 표시합니다. | 예정: 기본 |
| Spinner, ProgressBar | - | - | 진행 상태를 표시합니다. | 예정: 기본 |
| Skeleton | - | - | 콘텐츠 자리를 먼저 보여 줍니다. | 예정: 기본 |
| Card | - | - | 관련 콘텐츠를 한 단위로 묶습니다. | 예정: 기본 |
| Divider | - | - | 영역을 나눕니다. | 예정: 기본 |
| EmptyState | - | - | 데이터가 없을 때 다음 행동을 안내합니다. | 예정: 화면·AI |
| ComboBox | - | - | 목록을 검색해 고릅니다. | 예정: 화면·AI |
| Table, Pagination | - | - | 여러 행의 데이터를 보고 넘깁니다. | 예정: 화면·AI |
| SideNav, AppShell | - | - | 앱의 기본 화면 구조와 이동을 만듭니다. | 예정: 화면·AI |
| Breadcrumbs | - | - | 현재 위치의 상위 경로를 보여 줍니다. | 예정: 화면·AI |
| Drawer, BottomSheet | - | - | 화면 옆이나 아래에서 패널을 엽니다. | 예정: 화면·AI |
| DatePicker | - | - | 날짜를 고릅니다. | 예정: 화면·AI |
| CommandPalette | - | - | 키보드로 명령과 화면을 찾습니다. | 예정: 화면·AI |
| PromptInput, ChatMessage | - | - | AI에게 요청을 입력하고 응답을 표시합니다. | 예정: 화면·AI |
| CodeBlock, Markdown | - | - | AI 응답의 코드와 서식 텍스트를 표시합니다. | 예정: 화면·AI |

## Pattern roadmap

컴포넌트 하나로 끝나지 않는 화면 단위 규칙입니다. 확정한 계획이 아니라 후보입니다.

| 패턴 | 다룰 내용 |
| --- | --- |
| Forms | field 배치, 검증 시점, 오류 표시와 제출 |
| Loading | Skeleton, Spinner, ProgressBar 중 무엇을 쓸지 |
| Empty states | 첫 사용, 결과 없음, 오류 후 빈 화면 |
| Notification messaging | Toast, Banner, 인라인 메시지 중 무엇을 쓸지 |
| Saving | 자동 저장과 저장 버튼, 저장 결과 표시 |
| Destructive actions | 삭제 확인, `destructive` variant, 되돌리기 |
| Progressive disclosure | 고급 설정과 긴 내용을 나눠 보여 주기 |
| Navigation | 앱 구조, 현재 위치, 뒤로 가기 |
| AI response states | 생성 중, 중단, 오류, 재시도, 출처 표시 |
| Prompt shell | 입력창, 첨부, 제안 프롬프트, 전송과 중단, 모델·모드 선택을 한 영역에 배치 |
| Mobile safe area | 화면 가장자리와 하단 고정 요소 |
