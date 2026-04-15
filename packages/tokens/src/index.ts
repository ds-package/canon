/**
 * Canon Design System — Tokens
 *
 * 사용법:
 *   import { tokens } from '@canon/tokens'
 *   import '@canon/tokens/css'        // CSS Variables
 *   import preset from '@canon/tokens/tailwind'  // Tailwind preset
 */

// 토큰 카테고리별 타입 정의
export type ColorScale = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export type SpacingScale = Record<string, string>
export type FontSizeScale = Record<string, string>
export type RadiusScale = Record<string, string>

// CSS 변수 참조 헬퍼
export const cssVar = (name: string): string => `var(--${name})`

// 토큰 CSS 변수 상수 (타입 안전하게 사용)
export const tokens = {
  color: {
    gray: {
      0:   cssVar('color-gray-0'),
      50:  cssVar('color-gray-50'),
      100: cssVar('color-gray-100'),
      200: cssVar('color-gray-200'),
      300: cssVar('color-gray-300'),
      400: cssVar('color-gray-400'),
      500: cssVar('color-gray-500'),
      600: cssVar('color-gray-600'),
      700: cssVar('color-gray-700'),
      800: cssVar('color-gray-800'),
      900: cssVar('color-gray-900'),
      950: cssVar('color-gray-950'),
    },
    primary: {
      50:  cssVar('color-primary-50'),
      100: cssVar('color-primary-100'),
      200: cssVar('color-primary-200'),
      300: cssVar('color-primary-300'),
      400: cssVar('color-primary-400'),
      500: cssVar('color-primary-500'),
      600: cssVar('color-primary-600'),
      700: cssVar('color-primary-700'),
      800: cssVar('color-primary-800'),
      900: cssVar('color-primary-900'),
      950: cssVar('color-primary-950'),
    },
    danger: {
      50:  cssVar('color-danger-50'),
      500: cssVar('color-danger-500'),
      600: cssVar('color-danger-600'),
    },
    success: {
      50:  cssVar('color-success-50'),
      500: cssVar('color-success-500'),
      600: cssVar('color-success-600'),
    },
    warning: {
      50:  cssVar('color-warning-50'),
      500: cssVar('color-warning-500'),
    },
  },
  semantic: {
    background: {
      default: cssVar('semantic-color-background-default'),
      subtle:  cssVar('semantic-color-background-subtle'),
      muted:   cssVar('semantic-color-background-muted'),
    },
    foreground: {
      default:  cssVar('semantic-color-foreground-default'),
      subtle:   cssVar('semantic-color-foreground-subtle'),
      muted:    cssVar('semantic-color-foreground-muted'),
      inverted: cssVar('semantic-color-foreground-inverted'),
    },
    border: {
      default: cssVar('semantic-color-border-default'),
      strong:  cssVar('semantic-color-border-strong'),
    },
    primary: {
      default:    cssVar('semantic-color-primary-default'),
      hover:      cssVar('semantic-color-primary-hover'),
      foreground: cssVar('semantic-color-primary-foreground'),
    },
  },
  spacing: {
    0:    cssVar('spacing-0'),
    px:   cssVar('spacing-px'),
    0.5:  cssVar('spacing-0\\.5'),
    1:    cssVar('spacing-1'),
    2:    cssVar('spacing-2'),
    3:    cssVar('spacing-3'),
    4:    cssVar('spacing-4'),
    5:    cssVar('spacing-5'),
    6:    cssVar('spacing-6'),
    8:    cssVar('spacing-8'),
    10:   cssVar('spacing-10'),
    12:   cssVar('spacing-12'),
    16:   cssVar('spacing-16'),
    20:   cssVar('spacing-20'),
    24:   cssVar('spacing-24'),
  },
  font: {
    family: {
      sans: cssVar('font-family-sans'),
      mono: cssVar('font-family-mono'),
    },
    size: {
      xs:   cssVar('font-size-xs'),
      sm:   cssVar('font-size-sm'),
      base: cssVar('font-size-base'),
      lg:   cssVar('font-size-lg'),
      xl:   cssVar('font-size-xl'),
      '2xl': cssVar('font-size-2xl'),
      '3xl': cssVar('font-size-3xl'),
      '4xl': cssVar('font-size-4xl'),
    },
    weight: {
      regular:  cssVar('font-weight-regular'),
      medium:   cssVar('font-weight-medium'),
      semibold: cssVar('font-weight-semibold'),
      bold:     cssVar('font-weight-bold'),
    },
  },
  radius: {
    none: cssVar('radius-none'),
    sm:   cssVar('radius-sm'),
    md:   cssVar('radius-md'),
    lg:   cssVar('radius-lg'),
    xl:   cssVar('radius-xl'),
    full: cssVar('radius-full'),
  },
  shadow: {
    none: cssVar('shadow-none'),
    sm:   cssVar('shadow-sm'),
    md:   cssVar('shadow-md'),
    lg:   cssVar('shadow-lg'),
    xl:   cssVar('shadow-xl'),
  },
} as const

export type Tokens = typeof tokens
