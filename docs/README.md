---
verified: 2026-11-15
navigation: getting-started
navigationOrder: 1
---
# Getting started with Canon

Canon은 개인과 작은 팀이 쓰는 디자인 시스템입니다. React 컴포넌트와 디자인 토큰으로 화면의 기본 스타일을 구성합니다.

## Design guidelines

색은 쓰임에 맞는 토큰을 고릅니다. 본문에는 `text/default`, 콘텐츠를 담는 면에는 `surface/default`를 사용합니다. 글자 스타일도 제목과 본문처럼 용도에 맞춰 선택합니다.

## Using with React

프로젝트의 전역 CSS에서 토큰과 컴포넌트 스타일을 불러옵니다.

```css
@import '@canon/tokens/css';
@import '@canon/react/styles.css';
```

`Button`으로 동작을 실행할 수 있습니다.

```jsx
import { Button } from '@canon/react'

export function SaveButton({ onSave }) {
  return <Button variant="primary" onPress={onSave}>저장</Button>
}
```

## Local verification

Canon을 수정하려면 Node.js와 pnpm이 필요합니다. 레포 루트에서 의존성을 설치한 뒤 빌드합니다.

```sh
pnpm install
pnpm build
pnpm dev
```

개발 서버는 `pnpm dev`로 실행합니다. 문서를 수정하면 `pnpm test:docs`로 링크와 문서 빌드를 확인합니다.
