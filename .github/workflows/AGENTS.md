# workflows

**Parent context:** `../AGENTS.md`
**Generated:** 2026-11-22 · **Updated:** 2026-11-22

## Purpose
GitHub Actions 워크플로 세 개를 담는다. PR과 main push의 전체 검증(`ci.yml`), main push마다 문서 사이트를 GitHub Pages로 배포(`docs.yml`), changesets로 버전 PR 생성과 npm 배포(`release.yml`)를 맡는다.

## Key Files

| File | Description |
|------|-------------|
| `ci.yml` | `CI`. `main` 대상 PR과 `main` push에서 `ubuntu-latest`로 `pnpm install --frozen-lockfile` 후 `pnpm check`를 실행한다. |
| `docs.yml` | `Docs`. `main` push와 수동 실행(`workflow_dispatch`)에서 `pnpm --filter @canon/docs... build` 후 `apps/docs/out`을 Pages artifact로 올려 배포한다. 권한은 `contents: read`, `pages: write`, `id-token: write`이고 `concurrency` 그룹 `pages`는 진행 중인 실행을 취소한다. |
| `release.yml` | `Release`. `main` push에서 `changesets/action@v1`을 `publish: pnpm release`로 실행한다. changeset이 있으면 `chore: version packages` PR을 만들고, 버전 PR이 머지되면 `pnpm release`(`pnpm check && changeset publish`)로 배포한다. 권한은 `contents: write`, `pull-requests: write`다. |

## For AI Agents

### Working In This Directory
- `ci.yml`, `docs.yml`, `release.yml`은 모두 pnpm 10(`pnpm/action-setup@v4`), Node 20(`actions/setup-node@v4`, pnpm 캐시)을 쓴다. 루트 `package.json`의 `engines`는 `node >=20.9.0`, `pnpm >=9.0.0`이다. 버전을 바꿀 때는 세 파일을 함께 고친다.
- `ci.yml`과 `release.yml`의 검증은 모두 `pnpm check`(`pnpm test && pnpm test:docs && pnpm typecheck`)다. `docs.yml`은 `pnpm check`를 실행하지 않고 빌드만 하므로, 문서 검증기를 통과하지 못한 `main`도 Pages에는 배포될 수 있다.
- `docs.yml`이 올리는 경로 `apps/docs/out`은 `apps/docs/next.config.mjs`의 `output: 'export'` 결과다. 이 설정이나 `basePath`(`/canon`)를 바꾸면 워크플로 경로도 확인한다.
- `release.yml`에 필요한 시크릿은 `NPM_TOKEN`(`NODE_AUTH_TOKEN`으로 전달)이며 `GITHUB_TOKEN`은 자동 제공된다. npm registry는 `https://registry.npmjs.org`다.
- 세 워크플로가 모두 `main` push에서 동시에 시작한다. `ci.yml`과 `docs.yml`에는 서로 의존하는 `needs`가 없다.
- 로컬에서 워크플로를 실행할 수 없다. 변경은 YAML 문법과 위 경로·스크립트 이름이 루트 `package.json`에 있는지로만 확인한다.

### Testing Requirements
- 워크플로 자체를 검증하는 테스트는 없다. 워크플로가 호출하는 `pnpm check`, `pnpm --filter @canon/docs... build`를 로컬에서 실행해 확인한다.

### Common Patterns
- 모든 job이 `actions/checkout@v4` → pnpm 설정 → Node 설정 → `pnpm install --frozen-lockfile` 순서다. 락파일을 바꾸면 CI가 실패하므로 의존성 변경은 `pnpm-lock.yaml`과 함께 커밋한다.

## Dependencies

### Internal
- 루트 `package.json`의 `check`, `release` 스크립트, `apps/docs`, `.changeset/`.

### External
- GitHub Actions: `actions/checkout@v4`, `pnpm/action-setup@v4`, `actions/setup-node@v4`, `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`, `changesets/action@v1`.

## Manual Notes

이 제목 아래의 내용은 사람이 작성하며 재생성 시 보존된다.
