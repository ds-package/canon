---
verified: 2026-10-14
---
# 작업 방식

Canon Figma 파일을 바꿀 때 필요한 계정, 폰트, 도구의 제약과 안전한 마이그레이션 순서다.

## 1. 환경

| 항목 | 값 |
| --- | --- |
| Canon Figma 파일 키 | `9GZgtyTnVbm2YfJoadmIjp` |
| 소유 계정 | `mini940511@gmail.com` 개인 계정 |
| 소유 팀 | MinHee |
| 쓰기용 Figma MCP 인증 | `mini940511@gmail.com` |
| 재인증 | Claude Code에서 `/mcp`를 열고 `plugin:figma:figma` 재인증 |

1. **Canon 파일에 쓸 때는 Figma MCP를 `mini940511@gmail.com` 계정으로 인증한다.**
   - 이유: linercorp 계정은 이 파일에서 View seat라 쓰기가 `Full seat 필요` 오류로 막힌다.
2. **Liner 파일을 작업할 때는 linercorp 계정으로 다시 인증한다.**
   - 이유: 작업 대상에 맞는 계정 권한을 써야 한다.

## 2. 폰트와 텍스트 스타일

Pretendard Variable은 npm `pretendard` 1.3.9의 `PretendardVariable.ttf`를 `~/Library/Fonts`에 설치했다. 설치 뒤에는 Figma를 재시작해야 했다. 팀원도 같은 폰트가 필요하다.

텍스트 스타일 플러그인은 [tools/figma-plugins/type-styles](./tools/figma-plugins/type-styles)에 있다. 일회성 이관에 쓴 `replace-text-styles` 플러그인은 2026-10-14에 실행했고 보관하지 않았다.

1. **Pretendard Variable을 설치한 뒤 Figma를 재시작한다.**
   - 이유: Figma가 새로 설치한 로컬 폰트를 읽어야 한다.
2. **텍스트 스타일 작업은 Figma 데스크톱 플러그인으로 한다.**
   - 이유: Figma MCP의 `use_figma` 런타임은 로컬 폰트를 읽지 못해 Pretendard Variable로 텍스트 스타일을 만들거나 교체할 수 없다.
3. **팀원도 같은 Pretendard Variable을 설치한다.**
   - 이유: Canon 파일에서 같은 로컬 폰트를 읽어야 한다.

## 3. Figma MCP 런타임 제약

| 제약 | 작업 방식 |
| --- | --- |
| `figma.loadAllPagesAsync` 미지원 | `page.loadAsync()`로 페이지를 하나씩 연다. |
| `figma.saveVersionHistoryAsync` 미지원 | `File > Save to version history` 또는 `Cmd+Option+S`로 직접 체크포인트를 남긴다. |

1. **되돌리기 어려운 작업 전에는 버전 히스토리에 직접 체크포인트를 남긴다.**
   - 이유: MCP 런타임에서 `figma.saveVersionHistoryAsync`를 쓸 수 없다.
2. **페이지는 `page.loadAsync()`로 하나씩 연다.**
   - 이유: MCP 런타임에서 `figma.loadAllPagesAsync`를 지원하지 않는다.

## 4. 함정

1. **변수 이름에 `.`을 쓰지 않는다.**
   - 이유: Figma 변수 이름에는 `.`을 쓸 수 없다.
2. **스캔과 재바인딩은 INSTANCE의 자식 오버라이드와 인스턴스 자신의 fill, stroke까지 내려간다.**
   - 이유: 내려가지 않으면 옛 변수가 남는다. 이번 작업에서는 인스턴스 자체 663개와 인스턴스 내부 2,664개가 첫 스캔에서 빠졌다.
3. **인스턴스의 variant 속성을 바꿀 때는 대상 노드를 먼저 모두 수집한 뒤 바꾼다.**
   - 이유: 바꾸는 도중에 대상을 찾으면 이미 바뀐 노드에서 중첩 id 오류가 난다.
4. **variant를 삭제하기 전에 그 variant를 쓰는 인스턴스를 옮기거나 지운다.**
   - 이유: variant를 먼저 지우면 인스턴스가 끊긴다.
5. **변수 이름 변경은 기존 바인딩을 다시 만들지 않고 진행한다.**
   - 이유: 바인딩은 이름이 아니라 id로 유지된다.
6. **variant 속성 이름과 값은 자식 컴포넌트 이름의 `prop=value, prop=value`를 고쳐서 바꾼다.**
   - 이유: variant 속성은 자식 컴포넌트 이름에서 정의된다.
7. **BOOLEAN, TEXT, INSTANCE_SWAP 프로퍼티는 `editComponentProperty`로 바꾼다.**
   - 이유: 이 프로퍼티들은 variant가 아니다.

## 5. variant를 BOOLEAN으로 바꾸는 절차

Tag에서 다음 절차를 검증했다.

1. 인스턴스의 현재 값을 기록한다.
2. 인스턴스를 모든 대상 레이어가 보이는 variant로 옮긴다.
3. 나머지 variant를 삭제하고 컴포넌트 이름에서 해당 프로퍼티 쌍을 뺀다.
4. BOOLEAN 프로퍼티를 추가하고 레이어의 `visible`에 `componentPropertyReferences`로 연결한다.
5. 기록해 둔 인스턴스 값을 복원한다.
6. 프로퍼티 값과 실제 레이어 표시가 같은지 모든 인스턴스에서 비교한다.

Tag 인스턴스 160개를 비교했고 불일치는 0개였다.

1. **인스턴스 값을 먼저 기록하고 마지막에 복원한다.**
   - 이유: variant를 줄여도 기존 인스턴스의 보임 상태를 유지해야 한다.
2. **복원 뒤에는 프로퍼티 값과 실제 레이어 표시를 전부 비교한다.**
   - 이유: BOOLEAN 값과 `visible` 연결이 같은 결과를 내는지 확인해야 한다.

## 6. 마이그레이션 순서

1. 새것을 추가한다.
2. 사용처를 새것으로 재바인딩한다.
3. 인스턴스 내부를 포함해 검증한다.
4. 옛것의 사용처가 0인지 확인한다.
5. 명시적으로 승인을 받은 뒤 옛것을 삭제한다.

1. **마이그레이션은 추가, 재바인딩, 검증, 삭제 순서로 한다.**
   - 이유: 옛것을 먼저 지우면 연결이 끊기고 누락된 사용처를 복구하기 어렵다.
2. **삭제는 사용처 0을 확인하고 명시적으로 승인받은 뒤 진행한다.**
   - 이유: 삭제는 되돌리기 어려운 작업이다.

## 7. 검증 체크리스트

| 검사 | 통과 조건 |
| --- | --- |
| 옛 변수 참조 | 0개 |
| 옛 텍스트 스타일 참조 | 인스턴스 내부를 포함해 0개 |
| 라이트와 다크 화면 | 두 모드의 스크린샷 비교 완료 |

다크 모드는 임시 페이지의 래퍼 프레임에 `setExplicitVariableModeForCollection`으로 지정한다. 비교가 끝나면 임시 페이지를 삭제한다.

1. **옛 변수와 옛 텍스트 스타일 참조는 인스턴스 내부까지 검사한다.**
   - 이유: 인스턴스 자식의 오버라이드에 옛 참조가 남을 수 있다.
2. **라이트와 다크를 스크린샷으로 비교한다.**
   - 이유: 두 모드의 실제 결과를 함께 확인한다.

## 8. 컬러 램프 변경

[tools/ramps.py](./tools/ramps.py)의 기준점을 고치고 실행한 뒤 값을 Figma `primitive`에 반영한다. alpha 토큰은 각 색의 `600`을 따라간다.

1. **컬러 램프는 `ramps.py`의 기준점에서 바꾼다.**
   - 이유: 생성 값과 Figma `primitive`를 같은 기준으로 유지한다.
2. **alpha 토큰은 `600` 값에 맞춘다.**
   - 이유: alpha 토큰의 기준색이 각 램프의 `600`이다.
