---
verified: 2026-11-23
---
# Canon design docs

이 파일은 Canon을 만들거나 사용할 때 필요한 정본과 작업 규칙으로 연결하는 입구다. 제품 원칙만 여기에 두고, 나머지 내용은 다시 설명하지 않는다.

## Product principles

2026-11-15 방향 논의에서 확정한 내용이다.

- **대상 사용자**: 개발자, 디자이너, AI로 제품을 만드는 비IT 사용자 모두다. 전문가는 코드로 직접 쓰고, 비IT 사용자는 AI를 통해 쓴다. 첫 12개월은 개인과 작은 팀에 집중한다.
- **좋은 기본 디자인**: 무색무취한 headless 라이브러리가 아니라 설치 즉시 좋은 디자인이 보이는 시스템이다. 디자인은 부가 요소가 아니라 Canon의 기본 품질이다.
- **shadcn의 대안**: Canon은 shadcn 호환을 넓히는 것이 목표가 아니다. shadcn 외에 고를 수 있는 독립 디자인 시스템이다. shadcn에서는 좋은 아이디어만 참고하고, registry 포맷과 CLI 호환은 만들지 않는다.

미정: 사용자 유형별 진입 경로, 좋은 기본 디자인을 판정하는 구체 기준(시각 원칙, 검수 항목)은 아직 정하지 않았다.

[Getting started](./docs/README.md)의 「Local verification」에서 레포를 실행하는 명령을 확인할 수 있다.

## Using Canon

| 질문 | 먼저 읽을 문서 |
| --- | --- |
| Canon을 시작하거나 레포에서 실행한다 | [Getting started](./docs/README.md) |
| 제품 상황에 맞는 컴포넌트를 고른다 | [Component selection guide](./docs/guides/README.md) |
| 컴포넌트별 사용법과 현재 React prop을 확인한다 | [Components](./docs/components/README.md) |
| 플랫폼 공통 property 의미와 React props, runtime 상태, Figma property의 책임과 이름을 정한다 | [Component Properties](./docs/foundations/properties.md) |
| 컬러 토큰의 이름, 값, 계층, 바인딩을 정한다 | [Color](./docs/foundations/color.md) |
| 타이포 역할과 Figma 텍스트 스타일을 정한다 | [Typography](./docs/foundations/typography.md) |
| 아이콘 규격과 Phosphor 사용 방식을 정한다 | [Icons](./docs/foundations/icons.md) |

## Building Canon

아래 내부 문서는 웹 사이트에 노출하지 않고 GitHub 원문으로 연결한다.

| 질문 | 먼저 읽을 문서 |
| --- | --- |
| Figma 변수, 스타일, 컴포넌트를 안전하게 변경한다 | [Figma workflow](./docs/maintainers/figma-workflow.md) |
| 컴포넌트 property를 정하고 코드와 Figma에 옮긴다 | [Component authoring rules](./docs/maintainers/components/README.md) |
| 다른 디자인 시스템에서 가져온 근거와 제외한 항목을 확인한다 | [Referenced design systems](./docs/maintainers/references.md) |
| 모바일 지원 범위, 최소 버전, 플랫폼 번역 원칙을 확인한다 | [Mobile foundation 결정](./docs/decisions/mobile-foundation.md) |
| interaction foundation으로 React Aria Components를 선택한 이유와 책임 경계를 확인한다 | [Interaction foundation 결정](./docs/decisions/interaction-foundation.md) |
| docs web, search, playground의 구조와 범위를 정한다 | [Docs platform 결정](./docs/decisions/docs-platform.md) |
| Button과 IconButton의 스타일 축과 기본값을 정한 이유를 확인한다 | [Action style 결정](./docs/decisions/action-style.md) |

## When the docs do not answer

- 컴포넌트 선택 가이드는 아직 없다. 가이드에 없는 선택은 Canon 규칙으로 추정하지 않고 미확인으로 남긴다.
- 현재 React가 공통 계약과 다르면 [Component Properties](./docs/foundations/properties.md)의 「React differences」 표에 기록한다.
- 구현과 Figma가 다르면 어느 한쪽을 임의로 정답으로 삼지 말고 [Component authoring rules](./docs/maintainers/components/README.md)의 「Comparing code and Figma」 절차로 차이를 기록한다.
