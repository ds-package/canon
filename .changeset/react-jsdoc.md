---
'@canon/react': patch
---

Document component selection guidance and constraints as JSDoc in the published type declarations. For components with a doc, the `### 언제 쓰나` and `### 쓰지 않는 경우` sections are generated from the `## 선택` section of `docs/components/<component>.md`, between `<!-- canon:selection -->` markers, so editors and agents read the same guidance as the docs site. Button and IconButton have these sections today.
