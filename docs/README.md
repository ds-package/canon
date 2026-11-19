---
verified: 2026-11-15
navigation: getting-started
navigationOrder: 1
---
# Canon 시작하기

Canon은 개인과 작은 팀을 위한 디자인 시스템입니다. 버튼과 입력 필드처럼 자주 쓰는 React 컴포넌트에 기본 스타일을 제공합니다. 화면의 색, 간격, 글자 스타일은 디자인 토큰으로 관리합니다.

## 디자인 기준

색은 화면에서 맡는 역할에 따라 고릅니다. 일반 본문에는 `text/default`를, 콘텐츠를 담는 면에는 `surface/default`를 씁니다. 글자 스타일도 제목, 본문, 버튼 라벨처럼 쓰임에 맞춰 고릅니다.

## React에서 사용하기

Canon 패키지를 연결한 프로젝트의 전역 CSS에서 토큰과 컴포넌트 스타일을 불러옵니다.

```css
@import '@canon/tokens/css';
@import '@canon/react/styles.css';
```

저장처럼 화면의 대표 동작에는 기본 `Button`을 사용합니다.

```jsx
import { Button } from '@canon/react'

export function SaveButton({ onSave }) {
  return <Button onPress={onSave}>저장</Button>
}
```

## 로컬 검증

Canon을 수정하려면 Node.js와 pnpm이 필요합니다. 레포 루트에서 아래 명령을 실행합니다.

```sh
pnpm install
pnpm build
pnpm dev
```

문서를 수정한 뒤에는 `pnpm test:docs`로 링크와 문서 빌드를 확인합니다.
