#!/usr/bin/env python3
"""Canon 컬러 램프 생성기 (OKLCH).

docs/color.md 의 규칙을 코드로 옮긴 것이다. 실행하면 10개 색의 50~1000 램프를 JSON으로 출력한다.
Figma `primitive` 컬렉션의 값이 정본이고, 이 스크립트는 같은 값을 재현하고 조정할 때 쓴다.

    python3 docs/tools/ramps.py            # JSON 출력
    python3 docs/tools/ramps.py --table    # 사람이 읽는 표
"""
import json
import math
import sys

STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000]

# 색별 500 기준점: (명도 L, 채도 C, hue H, 밝은 끝 hue 이동, 어두운 끝 hue 이동)
ANCHORS = {
    "red":    (0.64, 0.21,  25, -10,   3),
    "orange": (0.72, 0.18,  52,   4,  -6),
    "yellow": (0.83, 0.165, 92,   8, -16),
    "green":  (0.70, 0.17, 148,   3,  -6),
    "teal":   (0.68, 0.125, 182,  0,  -9),
    "cyan":   (0.70, 0.12, 215,   0,   2),
    "blue":   (0.62, 0.19, 257,   5,  -3),
    "indigo": (0.54, 0.21, 276,   7,  -4),
    "purple": (0.60, 0.22, 308,   5,  -3),
    "pink":   (0.66, 0.20, 352,  -9,   9),
}
L_LIGHT, L_DARK = 0.975, 0.25
# 50..500: 앵커 명도로 가는 진행 비율, 채도 비율
TINT_F = [0, 0.14, 0.30, 0.52, 0.76, 1.0]
TINT_C = [0.20, 0.34, 0.52, 0.72, 0.90, 1.0]
# 500..1000: 어두운 끝 명도로 가는 진행 비율, 채도 비율(피크는 600)
SHADE_F = [0, 0.18, 0.38, 0.58, 0.77, 0.90, 1.0]
SHADE_C = [1.0, 1.08, 1.04, 0.90, 0.72, 0.56, 0.42]
GAMUT_CLAMP = 0.96  # sRGB 최대 채도의 96%까지만 사용


def _s2l(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _l2s(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055


def oklch_to_linear_rgb(L, C, H):
    a = C * math.cos(math.radians(H))
    b = C * math.sin(math.radians(H))
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    ]


def max_chroma(L, H):
    lo, hi = 0.0, 0.4
    for _ in range(30):
        mid = (lo + hi) / 2
        if all(-1e-4 <= x <= 1 + 1e-4 for x in oklch_to_linear_rgb(L, mid, H)):
            lo = mid
        else:
            hi = mid
    return lo


def to_hex(rgb):
    return "#" + "".join("%02x" % round(max(0, min(1, _l2s(max(0, min(1, x))))) * 255) for x in rgb)


def build(name):
    l5, c5, h, light_shift, dark_shift = ANCHORS[name]
    points = []
    for i in range(6):  # 50..500
        points.append((L_LIGHT + (l5 - L_LIGHT) * TINT_F[i], c5 * TINT_C[i], h + light_shift * (1 - TINT_F[i])))
    for j in range(1, 7):  # 600..1000
        points.append((l5 + (L_DARK - l5) * SHADE_F[j], c5 * SHADE_C[j], h + dark_shift * SHADE_F[j]))
    return [to_hex(oklch_to_linear_rgb(L, min(C, GAMUT_CLAMP * max_chroma(L, H)), H)) for L, C, H in points]


def contrast_on_white(hex_color):
    r, g, b = [_s2l(int(hex_color[i:i + 2], 16) / 255) for i in (1, 3, 5)]
    return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05)


if __name__ == "__main__":
    ramps = {name: build(name) for name in ANCHORS}
    if "--table" in sys.argv:
        print("step  " + "  ".join(f"{n:8}" for n in ANCHORS))
        for i, s in enumerate(STEPS):
            print(f"{s:<5} " + "  ".join(f"{ramps[n][i]:8}" for n in ANCHORS))
        print("\n흰색 위 대비 (600 / 700 / 800)")
        for n in ANCHORS:
            print(f"  {n:7}", " / ".join("%.1f" % contrast_on_white(ramps[n][STEPS.index(s)]) for s in (600, 700, 800)))
    else:
        print(json.dumps({n: dict(zip(STEPS, r)) for n, r in ramps.items()}, indent=2))
