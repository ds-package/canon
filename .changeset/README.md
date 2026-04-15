# Changesets

변경사항을 기록하고 버전을 관리하는 방법:

## 변경사항 기록

```bash
pnpm changeset
```

대화형 프롬프트에서:
1. 어떤 패키지가 변경되었는지 선택
2. 버전 변경 유형 선택 (major / minor / patch)
3. 변경 내용 설명 작성

## 버전 올리기

```bash
pnpm changeset version
```

기록된 changeset을 바탕으로 `package.json` 버전과 `CHANGELOG.md`를 자동 업데이트합니다.

## npm 배포

```bash
pnpm release
```

빌드 후 npm에 배포합니다. (GitHub Actions에서 자동 실행)
