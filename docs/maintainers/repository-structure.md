---
verified: 2026-11-23
---
# Repository structure proposal

이 문서는 현재 실제 디렉터리와 책임을 기록하고, 남은 구조 정리의 목표와 이동 순서를 제안합니다. 2026-11-23에 공개 원고를 `docs/components/`와 `docs/foundations/`로, 내부 문서를 `docs/maintainers/`로 옮겼습니다.

## Current structure

| 위치 | 현재 책임 | 관찰 |
| --- | --- | --- |
| `DESIGN.md`, `docs/` | 공개 원고와 결정 문서 | `docs/maintainers/`를 뺀 `docs/**/*.md`가 웹 route, navigation, search source가 됩니다. `docs/` 루트에는 `README.md`, `decisions/`, `guides/`, `tools/`만 남습니다. |
| `docs/components/` | 컴포넌트 문서(`button.md`, `icon-button.md`)와 coverage Overview(`README.md`) | route는 `/docs/components/<name>`입니다. Button 계열 외의 컴포넌트 문서와 playground는 삭제했습니다. |
| `docs/foundations/` | 컬러, 타이포, 아이콘, Component Properties | 모든 컴포넌트에 걸리는 공통 규칙입니다. |
| `docs/decisions/`, `docs/guides/` | 공개 결정과 사용 안내 | `docs/` 안에서 역할이 구분되어 있습니다. |
| `docs/tools/` | token 생성 스크립트와 Figma plugin 코드·테스트 | `docs/`의 공개 원고 트리 안에 실행 도구가 함께 있어 이름과 책임이 섞입니다. |
| `docs/maintainers/` | 내부 제작 규칙, Figma 작업 절차(`figma-workflow.md`), 참고 시스템 기록(`references.md`), 구조 제안 | 웹 문서 loader에서 제외합니다. |
| `apps/docs/app/` | Next.js route와 page 구성 | 웹 앱의 진입점과 렌더링 경로를 소유합니다. |
| `apps/docs/components/` | navigation, search, Markdown 화면, Button playground UI | 웹 표현을 소유합니다. 제품 React 컴포넌트와 구분됩니다. |
| `apps/docs/lib/` | Markdown loader, route 변환, navigation, search, Button playground model | 공개 원고를 웹 입력으로 변환합니다. |
| `scripts/docs/` | 공개 route 문서의 링크와 결정 frontmatter, React prop coverage validator | 문서와 코드 사이의 일부 계약을 검사합니다. 웹 runtime 코드는 아닙니다. |
| `packages/react/` | 공개 React 컴포넌트와 CSS | 제품 runtime과 공개 export를 소유합니다. |
| `packages/tokens/` | token 원문, 생성기, preview, 공개 export | token 입력과 배포용 산출물을 한 package에서 관리합니다. |
| `packages/cli/` | 소비 프로젝트의 token 설치·eject CLI | 사용자가 실행하는 배포 도구입니다. |
| `scripts/`, `.changeset/` | 레포 공통 자동화와 release 변경 기록 | package 단위 코드와 별도 책임입니다. |

`apps/docs/lib`와 `scripts/docs`는 모두 docs라는 이름을 쓰지만 역할은 다릅니다. 앞은 웹에서 원고를 읽고 표시하는 runtime입니다. 뒤는 레포 상태를 검사하는 validator입니다. 현재 디렉터리를 나누어 옮길 필요는 없습니다.

## Target structure

```text
canon/
├─ DESIGN.md
├─ docs/                         # 공개 원고
│  ├─ README.md
│  ├─ components/                # /docs/components/<name>
│  ├─ foundations/               # color, typography, icons, properties
│  ├─ decisions/
│  ├─ guides/
│  └─ maintainers/               # 내부 Markdown, 웹 loader에서 제외
│     ├─ components/README.md
│     ├─ figma-workflow.md
│     ├─ references.md
│     └─ repository-structure.md
├─ tools/                         # Figma와 token 저작 도구 (후속 이동 제안)
│  ├─ figma-plugins/
│  └─ tokens/
├─ apps/docs/                     # 문서 웹 앱
│  ├─ app/
│  ├─ components/
│  └─ lib/
├─ packages/                      # 배포 가능한 제품 package
│  ├─ react/
│  ├─ tokens/
│  └─ cli/
└─ scripts/                       # 레포 검사와 자동화
   └─ docs/
```

`docs/`는 사람이 읽는 공개 원고와 결정을 둡니다. 내부 Markdown은 `docs/maintainers/`에 두고 웹 loader가 명시적으로 제외합니다. 웹 renderer와 검색은 `apps/docs`에 둡니다. 배포되는 React, token, CLI 코드는 각각 `packages/`에 둡니다. Figma authoring plugin과 token 생성 보조 도구는 공개 문서 원고와 분리된 `tools/`로 모으는 편이 책임을 읽기 쉽습니다.

## Migration priority

1. 완료(2026-11-23): 컴포넌트 문서를 `docs/components/`, 공통 규칙을 `docs/foundations/`로 옮겼습니다. 컴포넌트 route는 `/docs/components/<name>`으로 바뀌었습니다.
2. 완료(2026-11-23): 내부 문서를 `docs/maintainers/`로 옮기고 웹 loader에서 제외했습니다. `docs/workflow.md`는 `figma-workflow.md`, `docs/references.md`는 `references.md`가 되어 웹 route가 없어졌습니다.
3. 다음 구조 정리 때 `docs/tools/figma-plugins/`와 `docs/tools/ramps.py`를 `tools/` 아래로 옮기는 안을 검토합니다. 아직 이동하지 않았습니다.
4. `apps/docs/lib/`와 `scripts/docs/`는 그대로 둡니다. runtime loader와 정적 검증기는 호출 시점과 책임이 다르며 현재 구조에 중복 구현이 없습니다.

## Impact and risks of later moves

- **URL:** `docs/tools/` 안의 Markdown이 현재 없어서 도구 파일 이동만으로 route는 바뀌지 않습니다. 문서에서 도구를 가리키는 링크는 GitHub 경로를 다시 지정해야 합니다.
- **Import와 실행 경로:** `docs/tools/ramps.py`의 사용 예와 `docs/foundations/color.md`, `docs/maintainers/figma-workflow.md`의 링크를 새 경로에 맞춰 바꿔야 합니다. 현재 Figma plugin code는 레포 내부 모듈을 import하지 않으며, manifest의 `main`은 같은 폴더의 `code.js`를 가리킵니다.
- **Build와 테스트:** root `package.json`의 Figma plugin test glob을 `tools/figma-plugins/`로 바꿔야 합니다. plugin 테스트는 해당 파일 경로를 읽으므로 함께 이동해야 합니다. token builder와 package export 경로는 별도로 영향을 받지 않습니다.
- **Validator:** 현재 validator는 `DESIGN.md`와 `docs/README.md`의 링크, 결정 frontmatter, 앱 안 원고 유입, public prop coverage를 확인합니다. 다른 Markdown의 링크는 검사하지 않으므로 도구 이동과 함께 검사 범위를 보완해야 합니다. private Markdown도 링크와 문서 형식 검사를 유지할지 별도 규칙으로 정합니다.
- **회귀 위험:** 테스트 glob 누락은 plugin 검증을 조용히 건너뜁니다. 상대 링크 누락은 웹에서 저장소 경로를 잘못 표시할 수 있습니다. route가 바뀌는 원고 이동은 검색, navigation, metadata, 정적 export URL까지 함께 영향을 줍니다.

## Public and internal docs policy

- `DESIGN.md`와 `docs/maintainers/` 밖의 `docs/` Markdown은 공개 route와 검색 source로 취급합니다.
- `docs/maintainers/**`는 내부 작성 문서입니다. loader에서 제외해 route, navigation, search index, document index에 넣지 않습니다.
- validator는 공개 문서 계약을 `docs/foundations/properties.md`에서, coverage 표를 `docs/components/README.md`에서 읽습니다. 내부 제작 절차를 public property coverage 표에 섞지 않습니다.
- 공개 문서가 내부 Markdown을 링크하면 웹에서는 GitHub 원문으로 연결합니다. agent는 같은 상대 경로로 원문을 읽습니다.

Figma 작업 절차는 `docs/maintainers/figma-workflow.md`, 참고 시스템 기록은 `docs/maintainers/references.md`로 옮겨 웹 route에서 뺐습니다. GitHub 저장소는 공개이므로 계정 정보의 공개 범위는 별도로 판단해야 합니다.
