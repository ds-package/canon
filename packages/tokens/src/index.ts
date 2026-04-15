/**
 * Canon Design System — Tokens
 *
 * 사용법:
 *   import { tokens } from '@canon/tokens'
 *   import '@canon/tokens/css'        // CSS Variables
 *   import preset from '@canon/tokens/tailwind'  // Tailwind preset
 */

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

export const tokens = {
  color: {
    // ── Primitive ────────────────────────────────────────────────────────────
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
    brand: {
      50:  cssVar('color-brand-50'),
      100: cssVar('color-brand-100'),
      200: cssVar('color-brand-200'),
      300: cssVar('color-brand-300'),
      400: cssVar('color-brand-400'),
      500: cssVar('color-brand-500'),
      600: cssVar('color-brand-600'),
      700: cssVar('color-brand-700'),
      800: cssVar('color-brand-800'),
      900: cssVar('color-brand-900'),
      950: cssVar('color-brand-950'),
    },
    danger: {
      50:  cssVar('color-danger-50'),
      100: cssVar('color-danger-100'),
      200: cssVar('color-danger-200'),
      300: cssVar('color-danger-300'),
      400: cssVar('color-danger-400'),
      500: cssVar('color-danger-500'),
      600: cssVar('color-danger-600'),
      700: cssVar('color-danger-700'),
      800: cssVar('color-danger-800'),
      900: cssVar('color-danger-900'),
      950: cssVar('color-danger-950'),
    },
    success: {
      50:  cssVar('color-success-50'),
      100: cssVar('color-success-100'),
      200: cssVar('color-success-200'),
      300: cssVar('color-success-300'),
      400: cssVar('color-success-400'),
      500: cssVar('color-success-500'),
      600: cssVar('color-success-600'),
      700: cssVar('color-success-700'),
      800: cssVar('color-success-800'),
      900: cssVar('color-success-900'),
      950: cssVar('color-success-950'),
    },
    info: {
      50:  cssVar('color-info-50'),
      100: cssVar('color-info-100'),
      200: cssVar('color-info-200'),
      300: cssVar('color-info-300'),
      400: cssVar('color-info-400'),
      500: cssVar('color-info-500'),
      600: cssVar('color-info-600'),
      700: cssVar('color-info-700'),
      800: cssVar('color-info-800'),
      900: cssVar('color-info-900'),
      950: cssVar('color-info-950'),
    },

    // ── Semantic ─────────────────────────────────────────────────────────────
    bg: {
      // neutral
      strong:        cssVar('color-bg-strong'),
      strongHover:   cssVar('color-bg-strong-hover'),
      strongPressed: cssVar('color-bg-strong-pressed'),
      base:          cssVar('color-bg-base'),
      baseHover:     cssVar('color-bg-base-hover'),
      faint:         cssVar('color-bg-faint'),
      disabled:      cssVar('color-bg-disabled'),
      // intent
      brand:         cssVar('color-bg-brand'),
      brandHover:    cssVar('color-bg-brand-hover'),
      brandPressed:  cssVar('color-bg-brand-pressed'),
      danger:        cssVar('color-bg-danger'),
      dangerHover:   cssVar('color-bg-danger-hover'),
      dangerFaint:   cssVar('color-bg-danger-faint'),
      success:       cssVar('color-bg-success'),
      info:          cssVar('color-bg-info'),
    },
    text: {
      // neutral
      strong:      cssVar('color-text-strong'),
      strongHover: cssVar('color-text-strong-hover'),
      base:        cssVar('color-text-base'),
      faint:       cssVar('color-text-faint'),
      disabled:    cssVar('color-text-disabled'),
      // intent
      brand:       cssVar('color-text-brand'),
      brandHover:  cssVar('color-text-brand-hover'),
      danger:      cssVar('color-text-danger'),
      success:     cssVar('color-text-success'),
    },
    border: {
      // neutral
      base:        cssVar('color-border-base'),
      baseHover:   cssVar('color-border-base-hover'),
      faint:       cssVar('color-border-faint'),
      disabled:    cssVar('color-border-disabled'),
      // intent
      danger:      cssVar('color-border-danger'),
      dangerHover: cssVar('color-border-danger-hover'),
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
      xs:    cssVar('font-size-xs'),
      sm:    cssVar('font-size-sm'),
      base:  cssVar('font-size-base'),
      lg:    cssVar('font-size-lg'),
      xl:    cssVar('font-size-xl'),
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
