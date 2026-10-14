---
verified: 2026-10-14
---
# 참고한 디자인 시스템

다른 디자인 시스템은 통째로 따르지 않았다. 가져온 것과 가져오지 않은 것을 함께 기록한다.

| 시스템과 출처 | 가져온 것 | 가져오지 않은 것 |
| --- | --- | --- |
| Chakra UI | Canon의 출발점으로 컴포넌트 이름과 variant, size 어휘를 가져왔다. | `colorScheme`, `text-md/lineHeight-6` 같은 스타일 이름, `bold/subtle/subtler`로 색상과 강도를 조합하는 시멘틱을 버렸다. |
| LINE Design System, LDSG v1.9.0 Rainbow Colors, 17색 x 300~900 | 채도 피크가 500이 아니라 600~700에 있는 점, 램프 안에서 hue가 움직이는 점, 어두운 끝에도 채도가 남는 점만 참고했다. 새 120개 값 중 21개가 LINE 색과 OKLab 거리 0.02 미만으로 우연히 가깝다. 예시는 red/200, teal/800, indigo/300과 400, pink/300과 800이며 이 정도는 허용하기로 했다. | hex 값은 복사하지 않았다. |
| Spectrum, `@adobe/spectrum-tokens` 15.5.0과 [spectrum.adobe.com](https://spectrum.adobe.com/) | 의미 단위의 시멘틱 구조인 accent, neutral, negative, informative, positive, notice를 참고했다. 의미마다 default, hover, down 같은 동일한 틀을 두는 방식, 배경 레이어, 한글과 CJK 행간을 영문보다 키우는 관점을 가져왔다. 문서 기준 heading은 영문 1.3, 중문 1.5이고 본문 CJK는 1.7이다. | Spectrum 전체를 통째로 따르지 않았다. |
| Astryx, [typography](https://astryx.atmeta.com/docs/typography), [color](https://astryx.atmeta.com/docs/color) | 쓰임새 중심 토큰인 background, text, icon, border를 참고했다. hover 5%, pressed 10% 반투명 오버레이, 역할에 고정한 굵기인 Body 400, Label 500, 제목 600, 14개 역할 스타일, 크기 구간별 행간 규칙인 20px 미만 1.5, 20~31px 1.4, 32px 이상 1.25와 4px 단위, 토큰마다 light와 dark 쌍을 두는 방식을 가져왔다. | Astryx 전체를 통째로 따르지 않았다. |
| Polaris, `@shopify/polaris-tokens` | 비교 대상으로만 참고했다. | 굵기를 prop으로 덮어쓰는 방식은 Figma에 해당 기능이 없어 가져오지 않았다. 11~14px에 variant 7개가 몰려 크기로 구분되지 않는 크기 tier도 가져오지 않았다. |
| Prism, `~/Projects/Liner/web/packages/liner-prism/rules/`, `~/Projects/Liner/frontend-packages/tools/prism-mate/conventions/` | `rules/naming.md`의 boolean에 `is` 접두사를 붙이지 않는 규칙, `rules/slots.md`와 Figma 컨벤션 §4의 `leading`과 `trailing`, `show` 접두사 보임 토글, Figma 컨벤션 §3.1의 텍스트 콘텐츠 `children`, §6의 순수 보임과 숨김을 BOOLEAN으로 두는 규칙, 상태 축과 의미 축 분리를 가져왔다. Prism의 `error`는 `aria-invalid` 기준에 맞춰 `invalid`로 고쳤고, Prism의 `interaction` 대신 `state`를 유지했으며, `disabled`는 별도 boolean으로 합쳤다. | Liner 브랜드 맥락인 `tone` 축과 `brand`, `caution` 값, variant 값 `strong`, `extra-small` 같은 풀네임 크기, `interaction` 이름, `context` 축은 가져오지 않았다. Prism은 Liner에 맞춘 시스템이고 정본도 아직 흔들린다. Figma 컨벤션 문서는 `state`와 `initial` 값을 적지만 결정은 `interaction`이다. |

앞으로도 근거가 표준이나 코드에 있는 규칙만 선별해 가져온다. 무엇을 가져왔고 무엇을 버렸는지는 이 문서에 남긴다.
