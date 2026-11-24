---
verified: 2026-11-23
---
# Referenced design systems

다른 디자인 시스템은 통째로 따르지 않았다. 가져온 것과 가져오지 않은 것을 함께 기록한다.

| 시스템과 출처                                                                                                                       | 가져온 것                                                                                                                                                                                                                                                                                                                                          | 가져오지 않은 것                                                                                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chakra UI                                                                                                                     | Canon의 출발점으로 컴포넌트 이름과 variant, size 어휘를 가져왔다.                                                                                                                                                                                                                                                                                                  | `colorScheme`, `text-md/lineHeight-6` 같은 스타일 이름, `bold/subtle/subtler`로 색상과 강도를 조합하는 시멘틱을 버렸다.                                                                                                                                       |
| Spectrum, `@adobe/spectrum-tokens` 15.5.0과 [spectrum.adobe.com](https://spectrum.adobe.com/)                                  | 의미 단위의 시멘틱 구조인 accent, neutral, negative, informative, positive, notice를 참고했다. 의미마다 default, hover, down 같은 동일한 틀을 두는 방식, 배경 레이어, 한글과 CJK 행간을 영문보다 키우는 관점을 가져왔다. 문서 기준 heading은 영문 1.3, 중문 1.5이고 본문 CJK는 1.7이다.                                                                                                                                | Spectrum 전체를 통째로 따르지 않았다.                                                                                                                                                                                                            |
| Astryx, [typography](https://astryx.atmeta.com/docs/typography), [color](https://astryx.atmeta.com/docs/color)                | 쓰임새 중심 토큰인 background, text, icon, border를 참고했다. hover 5%, pressed 10% 반투명 오버레이, 역할에 고정한 굵기인 Body 400, Label 500, 제목 600, 14개 역할 스타일, 크기 구간별 행간 규칙인 20px 미만 1.5, 20\~31px 1.4, 32px 이상 1.25와 4px 단위, 토큰마다 light와 dark 쌍을 두는 방식을 가져왔다.                                                                                                          | Astryx 전체를 통째로 따르지 않았다.                                                                                                                                                                                                              |
| Polaris, `@shopify/polaris-tokens`                                                                                            | 비교 대상으로만 참고했다.                                                                                                                                                                                                                                                                                                                                 | 굵기를 prop으로 덮어쓰는 방식은 Figma에 해당 기능이 없어 가져오지 않았다. 11\~14px에 variant 7개가 몰려 크기로 구분되지 않는 크기 tier도 가져오지 않았다.                                                                                                                               |
| Prism, `~/Projects/Liner/web/packages/liner-prism/rules/`, `~/Projects/Liner/web/packages/design-token/rules/` | Figma authoring property와 runtime props를 분리하는 규칙, runtime slot은 콘텐츠 존재로 보임을 정하는 규칙, `value/defaultValue/onValueChange` controlled 문법, `leading`과 `trailing`, React boolean에서 `is`를 생략하는 규칙을 가져왔다. `interaction`은 Figma 시각 검수에만 쓰고 runtime hover·press·focus는 파생 상태로 둔다. | Liner 전용 `tone`, `context`, modal action object, 풀네임 size와 Radix `data-state` 규약은 가져오지 않았다. Canon은 React Aria가 실제로 제공하는 state와 `xs/sm/md/lg/xl`을 유지한다. Canon의 `tone`은 Liner `tone`을 가져온 것이 아니며 상태 표시 컴포넌트에만 둔다. |

앞으로도 근거가 표준이나 코드에 있는 규칙만 선별해 가져온다. 무엇을 가져왔고 무엇을 버렸는지는 이 문서에 남긴다.

## Component roadmap sources

2026-11-23에 공개 컴포넌트 목록을 대조해 [Components](../components/README.md)의 후보 행을 골랐다. 세 시스템 중 둘 이상에 있는 개념을 먼저 두었다. 이름과 구조는 가져오지 않고 개념만 참고한다.

출처:
- Primer: https://primer.style/product/components/, https://primer.style/product/ui-patterns/
- SEED Design: https://seed-design.io/components, https://seed-design.io/patterns
- Astryx: https://astryx.atmeta.com/components (전체 목록은 CLI로만 제공되어 미확인)

| Canon 후보 | Primer | SEED Design | Astryx |
| --- | --- | --- | --- |
| Field | FormControl | Field | Field |
| Menu | ActionMenu | Menu | Dropdown Menu |
| Tabs | UnderlineNav | Tabs | Tab List |
| SegmentedControl, Avatar, Skeleton | 있음 | 있음 | 있음 |
| Link, Tooltip, Popover, Card, Breadcrumbs | 있음 | 없음 | 있음 |
| Toast | 없음 | Snackbar | Toast |
| Banner | Banner | Page Banner, Callout | Banner |
| Badge | CounterLabel | Badge | Badge |
| Spinner, ProgressBar | Spinner, ProgressBar | Progress Circle | Spinner, Progress Bar |
| Divider, Drawer·BottomSheet, DatePicker | 없음 또는 internal | 있음 | 있음 |
| EmptyState | Blankslate | Result Section | Empty State |
| ComboBox | Autocomplete | 없음 | Typeahead |
| Table, Pagination, SideNav, AppShell | DataTable, Pagination, NavList, PageLayout | Pagination, Side Navigation | Table, Pagination, Side Nav, App Shell |
| CommandPalette | internal | 없음 | Command Palette |
| Chat, CodeBlock·Markdown | 없음 | 없음 | Chat 계열, Code Block, Markdown |

패턴 후보 중 Forms, Loading, Empty states, Notification messaging, Saving, Progressive disclosure, Navigation은 Primer UI patterns, Loading과 Mobile safe area는 SEED patterns에서 개념을 가져왔다. Destructive actions와 AI response states는 레퍼런스 패턴 목록에 없고 Canon 대상에 필요해 추가했다.
