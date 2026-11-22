---
verified: 2026-11-23
---
# Component authoring rules

이 문서는 컴포넌트의 공통 의미를 코드와 Figma에 옮길 때 적용하는 내부 규칙입니다. 공개 사용 계약은 [컴포넌트 문서](../../foundations/properties.md)에 둡니다. 현재 React API와 목표 디자인 계약은 각자 원문을 확인하고 분리해 기록합니다.

## Property decisions

1. property 하나에는 의미 축 하나만 둡니다.
   - `variant`는 스타일을 정합니다. 동작 컴포넌트에서는 쓰임을, 상태 표시 컴포넌트에서는 면 처리를 뜻합니다.
   - `tone`은 상태 표시 컴포넌트의 의미색을 정합니다.
   - `size`는 밀도를 정합니다.
   - `shape`는 외곽 형태를 정합니다.
   - interaction 상태는 property로 만들지 않습니다.
2. property와 값을 추가하기 전에 제품 사용 사례와 각 값의 시각 차이를 확인합니다.
3. 기본값은 컴포넌트별로 정하고 모든 조합을 자동으로 만들지 않습니다.
4. 실제 디자인과 runtime에 있는 조합만 허용합니다.
   - Button과 IconButton은 `variant` 하나만 씁니다. 값은 `primary`, `secondary`, `quiet`, `destructive`이고 기본값은 `variant=secondary`, `size=lg`입니다.
   - 스타일 축 규칙은 [Component Properties](../../foundations/properties.md)를 따릅니다.
5. 콘텐츠의 존재 여부는 콘텐츠로 표현합니다. `showLeadingIcon`처럼 중복 boolean을 추가하지 않습니다.
6. hover, pressed, focus, filled는 runtime에서 파생합니다. public `state` prop으로 복사하지 않습니다.
7. React public API는 구현 파일, export, CSS, component 문서가 같은 값을 가리키는지 확인합니다. React Aria 전체 props를 상속하지 않습니다.

## Figma component set structure

- 가로축은 `size`이며 `xl`, `lg`, `md`, `sm`, `xs` 순으로 놓습니다.
- 세로축은 `default`, `hover`, `pressed`, `focus`, `disabled` 순입니다.
- disabled 행은 `interaction=default`, `disabled=true`로 둡니다. 나머지 interaction은 `disabled=false`입니다.
- 각 variant의 interaction 묶음을 마친 뒤 다음 variant를 놓습니다. Button 순서는 `primary`, `secondary`, `quiet`, `destructive`입니다.
- `tone`이 있는 상태 표시 컴포넌트는 tone을 variant 그룹 바깥에 둡니다.
- 실제 조합만 나열합니다. 빈 상태를 채우려고 존재하지 않는 variant를 만들지 않습니다.

## Component set alignment

[component-set-layout plugin](../../tools/figma-plugins/component-set-layout/)이 아래 규칙을 실행합니다. 손으로 정리할 때도 같은 규칙을 따릅니다.

### Scope

- component set 내부의 variant를 정리합니다.
- set 자체의 캔버스 위치는 바꾸지 않습니다.

### Padding

- 내부 variant 전체의 좌측 상단을 set 기준 `X=200`, `Y=200`에 맞춥니다.
- 오른쪽과 아래쪽도 variant 전체 영역의 끝에서 200px 여백을 둡니다.
- 200px은 variant 사이 간격이 아니라 set 안쪽 여백입니다.
- variant를 하나씩 (200, 200)에 놓지 않습니다. 전체 배치를 한 묶음으로 옮깁니다.

### Keep the internal layout

- 기존 행·열 순서와 크기별 정렬 방식을 유지합니다.
- variant 사이의 가로·세로 간격을 유지합니다.
- 스타일·상태·형태별 그룹 구분과 그룹 사이 간격을 유지합니다.
- 크기가 다른 variant를 일괄 상단 정렬하거나 등간격으로 다시 놓지 않습니다.

### Resize the set

- 이동한 뒤 variant 전체 영역에 맞춰 set 크기를 조정합니다.
  - set 너비 = 가장 오른쪽 variant의 끝 X + 200
  - set 높이 = 가장 아래쪽 variant의 끝 Y + 200
- 외곽의 불필요한 빈 공간은 없애고, 그룹 사이 여백은 유지합니다.

### Do not change

- 개별 variant의 크기, 디자인, 텍스트, 이름을 바꾸지 않습니다.
- variant property, component 연결, variable과 style binding을 유지합니다.
- variant를 추가·삭제하거나 연결을 끊지 않습니다.
- 정리 대상이 아닌 요소는 바꾸지 않습니다.

## Comparing code and Figma

1. 공개 계약은 [컴포넌트 문서](../../foundations/properties.md), 실제 React API는 `packages/react/src/`, 시각값은 `packages/react/styles.css`에서 확인합니다.
2. 토큰값은 `packages/tokens/tokens/` 원문과 빌드된 CSS 변수를 대조합니다.
3. Figma current 값과 제품 목표 계약을 구분해 기록합니다. Figma inventory를 React API의 근거로 쓰지 않습니다.
4. Figma component set의 property, 기본값, 실제 조합과 React의 prop, 기본값, CSS 상태를 항목별로 비교합니다.
5. light와 dark, enabled와 disabled, hover, pressed, focus의 결과를 확인합니다. 아이콘 크기와 label, 접근 가능한 이름도 검토합니다.
6. 공개 표의 React props와 exported TypeScript 타입은 docs validator가 대조합니다. 변경 후에는 관련 문서 검증과 component interaction 검증을 계획에 포함합니다.
7. 라이브러리 publish 전에는 instance와 override 영향, 외부 소비 파일의 미확인 범위를 별도로 확인합니다.
