---
id: docs-platform
status: adopted
verified: 2026-11-15
navigation: architecture
navigationOrder: 1
---
# Docs platform

## 맥락

Canon 문서는 사람이 읽는 web, agent가 읽는 source, 앞으로 추가할 component playground와 search가 같은 사실을 소비해야 한다. 기존 `DESIGN.md`와 `docs/**/*.md`를 framework 전용 폴더로 복사하면 원고 정본이 둘이 된다.

## 결정

Canon은 Next.js App Router로 docs web의 shell, navigation, renderer를 직접 만든다. Docusaurus와 Starlight는 사용하지 않는다.

첫 document index는 기존 Markdown에서 title, headings, body text, route, source path와 authored frontmatter의 `navigation`, `navigationOrder` metadata를 추출한다. Navigation과 local lexical search는 이 index를 공유한다. 데스크톱은 viewport 높이의 left sidebar를 사용하고 모바일은 native disclosure로 접는다. Component route에서는 일반 문서 섹션을 숨기고 `/docs/components` Overview와 component 문서에 집중한다. Component registry는 Dialog와 Select에서 반복되는 필드가 확인되기 전에는 만들지 않는다.

## 책임 경계

| 주체 | 소유하는 것 |
| --- | --- |
| Authored corpus | `DESIGN.md`, `docs/**/*.md`의 원고와 결정 |
| Docs app | route, navigation, Markdown rendering, document index, search UI |
| Runtime package | component public API와 behavior |
| Component playground | runtime public API를 조절하는 control, preview, reset, copied JSX |

`apps/docs`에는 page 원고를 두지 않는다. Playground는 Dialog와 함께 추가하며 첫 버전에는 arbitrary code execution, Monaco, iframe sandbox, multi-file editor를 넣지 않는다. Search는 외부 서비스나 semantic ranking 없이 title, headings, body text만 찾는다.

## 근거

Astryx는 Next.js 기반 자체 docsite에서 monorepo source를 typed registry로 만들고 custom shell, renderer, playground, search가 함께 소비한다. Component route에서는 다른 영역을 숨기고 component 전용 left sidebar로 집중시킨다. Canon은 이 source-to-projection 원칙과 focused sidebar만 가져오고 Astryx의 package registry, component search, latest/canary pipeline, playground IDE는 현재 규모에 맞지 않아 가져오지 않는다.

## Storybook을 쓰지 않는 이유

2026-11-15 논의에서 Lou가 Storybook이 지금 꼭 필요한지 물었고, 당분간 쓰지 않는 방향으로 진행했다. 별도 결정 승인 발화는 없고, 이후 작업이 이 방향으로 이어졌다.

- 컴포넌트 상태를 모아 보는 역할을 `apps/docs` playground가 이미 맡는다. Storybook을 더하면 두 번째 preview 시스템이 된다.
- stories 파일을 따로 쓰면 docs, AI가 읽는 metadata와 TypeScript interface, test와 내용이 겹친다.
- 상태 검증은 Storybook이 아니라 interaction test와 접근성 test가 직접 맡는다. visual regression은 아직 없다.

외부 기여자가 모든 상태를 한 URL에서 검수해야 하거나 Chromatic 같은 시각 회귀 협업 흐름이 실제로 필요해지면 다시 판단한다. 그때도 Storybook은 정본이 아니라 adapter로 붙인다.

## 재검토 조건

1. Markdown마다 renderer 예외가 반복된다.
2. Local search가 현재 corpus 규모에서도 필요한 문서를 찾지 못한다.
3. Dialog와 Select playground가 control-driven preview로 표현되지 않는다.
4. Next.js static export가 선택한 hosting의 route 요구를 충족하지 못한다.
