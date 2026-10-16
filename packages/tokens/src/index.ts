/**
 * Canon Design System tokens
 *
 * import { tokens } from '@canon/tokens'
 * import '@canon/tokens/css'
 * import preset from '@canon/tokens/tailwind'
 */

export const cssVar = (name: string): string => `var(--${name})`

const chromaticScale = (name: string) => ({
  50: cssVar(`color-${name}-50`),
  100: cssVar(`color-${name}-100`),
  200: cssVar(`color-${name}-200`),
  300: cssVar(`color-${name}-300`),
  400: cssVar(`color-${name}-400`),
  500: cssVar(`color-${name}-500`),
  600: cssVar(`color-${name}-600`),
  700: cssVar(`color-${name}-700`),
  800: cssVar(`color-${name}-800`),
  900: cssVar(`color-${name}-900`),
  950: cssVar(`color-${name}-950`),
  1000: cssVar(`color-${name}-1000`),
  alpha100: cssVar(`color-${name}-alpha-100`),
  alpha200: cssVar(`color-${name}-alpha-200`),
  alpha300: cssVar(`color-${name}-alpha-300`),
})

const alphaScale = (name: string) => ({
  50: cssVar(`color-${name}-50`),
  100: cssVar(`color-${name}-100`),
  200: cssVar(`color-${name}-200`),
  300: cssVar(`color-${name}-300`),
  400: cssVar(`color-${name}-400`),
  500: cssVar(`color-${name}-500`),
  600: cssVar(`color-${name}-600`),
  700: cssVar(`color-${name}-700`),
  800: cssVar(`color-${name}-800`),
  900: cssVar(`color-${name}-900`),
})

const semanticStatus = (intent: string) => ({
  text: cssVar(`semantic-status-${intent}-text`),
  border: cssVar(`semantic-status-${intent}-border`),
})

const semanticControl = (name: string) => ({
  solid: cssVar(`semantic-control-${name}-solid`),
  solidHover: cssVar(`semantic-control-${name}-solid-hover`),
  solidPressed: cssVar(`semantic-control-${name}-solid-pressed`),
  onSolid: cssVar(`semantic-control-${name}-on-solid`),
})

const brandScale = () => ({
  50: cssVar('brand-50'),
  100: cssVar('brand-100'),
  200: cssVar('brand-200'),
  300: cssVar('brand-300'),
  400: cssVar('brand-400'),
  500: cssVar('brand-500'),
  600: cssVar('brand-600'),
  700: cssVar('brand-700'),
  800: cssVar('brand-800'),
  900: cssVar('brand-900'),
  950: cssVar('brand-950'),
  1000: cssVar('brand-1000'),
})

const typographyStyle = (name: string) => ({
  fontFamily: cssVar(`${name}-font-family`),
  fontSize: cssVar(`${name}-font-size`),
  fontWeight: cssVar(`${name}-font-weight`),
  letterSpacing: cssVar(`${name}-letter-spacing`),
  lineHeight: cssVar(`${name}-line-height`),
})

export const tokens = {
  color: {
    red: chromaticScale('red'),
    orange: chromaticScale('orange'),
    yellow: chromaticScale('yellow'),
    green: chromaticScale('green'),
    teal: chromaticScale('teal'),
    cyan: chromaticScale('cyan'),
    blue: chromaticScale('blue'),
    indigo: chromaticScale('indigo'),
    purple: chromaticScale('purple'),
    pink: chromaticScale('pink'),
    gray: {
      50: cssVar('color-gray-50'),
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
      1000: cssVar('color-gray-1000'),
      1100: cssVar('color-gray-1100'),
    },
    warm: {
      50: cssVar('color-warm-50'),
      100: cssVar('color-warm-100'),
      200: cssVar('color-warm-200'),
      300: cssVar('color-warm-300'),
      400: cssVar('color-warm-400'),
      500: cssVar('color-warm-500'),
      600: cssVar('color-warm-600'),
      700: cssVar('color-warm-700'),
      800: cssVar('color-warm-800'),
      900: cssVar('color-warm-900'),
      950: cssVar('color-warm-950'),
      1000: cssVar('color-warm-1000'),
    },
    white: cssVar('color-white'),
    black: cssVar('color-black'),
    whiteAlpha: alphaScale('white-alpha'),
    blackAlpha: alphaScale('black-alpha'),
  },
  brand: brandScale(),
  semantic: {
    background: {
      base: cssVar('semantic-background-base'),
      inverse: cssVar('semantic-background-inverse'),
    },
    surface: {
      default: cssVar('semantic-surface-default'),
      raised: cssVar('semantic-surface-raised'),
      overlay: cssVar('semantic-surface-overlay'),
      muted: cssVar('semantic-surface-muted'),
      informative: cssVar('semantic-surface-informative'),
      positive: cssVar('semantic-surface-positive'),
      notice: cssVar('semantic-surface-notice'),
      negative: cssVar('semantic-surface-negative'),
      accent: cssVar('semantic-surface-accent'),
    },
    text: {
      primary: cssVar('semantic-text-primary'),
      secondary: cssVar('semantic-text-secondary'),
      tertiary: cssVar('semantic-text-tertiary'),
      placeholder: cssVar('semantic-text-placeholder'),
      helper: cssVar('semantic-text-helper'),
      disabled: cssVar('semantic-text-disabled'),
      inverse: cssVar('semantic-text-inverse'),
      link: cssVar('semantic-text-link'),
    },
    icon: {
      primary: cssVar('semantic-icon-primary'),
      secondary: cssVar('semantic-icon-secondary'),
      disabled: cssVar('semantic-icon-disabled'),
      inverse: cssVar('semantic-icon-inverse'),
    },
    border: {
      default: cssVar('semantic-border-default'),
      emphasis: cssVar('semantic-border-emphasis'),
      focus: cssVar('semantic-border-focus'),
      disabled: cssVar('semantic-border-disabled'),
    },
    control: {
      neutral: {
        ...semanticControl('neutral'),
        subtle: cssVar('semantic-control-neutral-subtle'),
        text: cssVar('semantic-control-neutral-text'),
        border: cssVar('semantic-control-neutral-border'),
      },
      accent: semanticControl('accent'),
      informative: semanticControl('informative'),
      positive: semanticControl('positive'),
      notice: semanticControl('notice'),
      negative: semanticControl('negative'),
      disabled: cssVar('semantic-control-disabled'),
    },
    overlay: {
      hover: cssVar('semantic-overlay-hover'),
      pressed: cssVar('semantic-overlay-pressed'),
      scrim: cssVar('semantic-overlay-scrim'),
    },
    static: {
      white: cssVar('semantic-static-white'),
      black: cssVar('semantic-static-black'),
    },
    accent: {
      text: cssVar('semantic-accent-text'),
      border: cssVar('semantic-accent-border'),
    },
    status: {
      informative: semanticStatus('informative'),
      positive: semanticStatus('positive'),
      notice: semanticStatus('notice'),
      negative: semanticStatus('negative'),
    },
  },
  spacing: {
    0: cssVar('spacing-0'),
    px: cssVar('spacing-px'),
    0.5: cssVar('spacing-0-5'),
    1: cssVar('spacing-1'),
    1.5: cssVar('spacing-1-5'),
    2: cssVar('spacing-2'),
    2.5: cssVar('spacing-2-5'),
    3: cssVar('spacing-3'),
    3.5: cssVar('spacing-3-5'),
    4: cssVar('spacing-4'),
    5: cssVar('spacing-5'),
    6: cssVar('spacing-6'),
    7: cssVar('spacing-7'),
    8: cssVar('spacing-8'),
    9: cssVar('spacing-9'),
    10: cssVar('spacing-10'),
    12: cssVar('spacing-12'),
    14: cssVar('spacing-14'),
    16: cssVar('spacing-16'),
    20: cssVar('spacing-20'),
    24: cssVar('spacing-24'),
    32: cssVar('spacing-32'),
    40: cssVar('spacing-40'),
    48: cssVar('spacing-48'),
    56: cssVar('spacing-56'),
    64: cssVar('spacing-64'),
  },
  font: {
    family: {
      sans: cssVar('font-family-sans'),
      mono: cssVar('font-family-mono'),
    },
    size: {
      10: cssVar('font-size-10'),
      11: cssVar('font-size-11'),
      12: cssVar('font-size-12'),
      13: cssVar('font-size-13'),
      14: cssVar('font-size-14'),
      16: cssVar('font-size-16'),
      18: cssVar('font-size-18'),
      20: cssVar('font-size-20'),
      22: cssVar('font-size-22'),
      24: cssVar('font-size-24'),
      28: cssVar('font-size-28'),
      30: cssVar('font-size-30'),
      32: cssVar('font-size-32'),
      34: cssVar('font-size-34'),
      36: cssVar('font-size-36'),
      40: cssVar('font-size-40'),
      48: cssVar('font-size-48'),
      60: cssVar('font-size-60'),
    },
    weight: {
      regular: cssVar('font-weight-regular'),
      medium: cssVar('font-weight-medium'),
      semibold: cssVar('font-weight-semibold'),
      bold: cssVar('font-weight-bold'),
    },
  },
  lineHeight: {
    4: cssVar('line-height-4'),
    '4_5': cssVar('line-height-4_5'),
    5: cssVar('line-height-5'),
    '5_5': cssVar('line-height-5_5'),
    6: cssVar('line-height-6'),
    '6_5': cssVar('line-height-6_5'),
    7: cssVar('line-height-7'),
    8: cssVar('line-height-8'),
    9: cssVar('line-height-9'),
    10: cssVar('line-height-10'),
    12: cssVar('line-height-12'),
    15: cssVar('line-height-15'),
    18: cssVar('line-height-18'),
  },
  letterSpacing: {
    tight: cssVar('letter-spacing-tight'),
    snug: cssVar('letter-spacing-snug'),
    normal: cssVar('letter-spacing-normal'),
  },
  typography: {
    display: {
      60: typographyStyle('typography-display-60'),
      48: typographyStyle('typography-display-48'),
    },
    heading: {
      36: typographyStyle('typography-heading-36'),
      30: typographyStyle('typography-heading-30'),
      24: typographyStyle('typography-heading-24'),
      20: typographyStyle('typography-heading-20'),
    },
    body: {
      18: {
        default: typographyStyle('typography-body-18'),
        strong: typographyStyle('typography-body-18-strong'),
      },
      16: {
        default: typographyStyle('typography-body-16'),
        strong: typographyStyle('typography-body-16-strong'),
      },
      14: {
        default: typographyStyle('typography-body-14'),
        strong: typographyStyle('typography-body-14-strong'),
      },
      13: {
        default: typographyStyle('typography-body-13'),
        strong: typographyStyle('typography-body-13-strong'),
      },
    },
    label: {
      18: {
        default: typographyStyle('typography-label-18'),
        strong: typographyStyle('typography-label-18-strong'),
      },
      16: {
        default: typographyStyle('typography-label-16'),
        strong: typographyStyle('typography-label-16-strong'),
      },
      14: {
        default: typographyStyle('typography-label-14'),
        strong: typographyStyle('typography-label-14-strong'),
      },
      13: {
        default: typographyStyle('typography-label-13'),
        strong: typographyStyle('typography-label-13-strong'),
      },
      12: {
        default: typographyStyle('typography-label-12'),
        strong: typographyStyle('typography-label-12-strong'),
      },
      11: typographyStyle('typography-label-11'),
      10: typographyStyle('typography-label-10'),
    },
    caption: {
      12: typographyStyle('typography-caption-12'),
      11: typographyStyle('typography-caption-11'),
      10: typographyStyle('typography-caption-10'),
    },
  },
  radius: {
    none: cssVar('radius-none'),
    xs: cssVar('radius-xs'),
    sm: cssVar('radius-sm'),
    md: cssVar('radius-md'),
    lg: cssVar('radius-lg'),
    xl: cssVar('radius-xl'),
    '2xl': cssVar('radius-2xl'),
    '3xl': cssVar('radius-3xl'),
    full: cssVar('radius-full'),
  },
  shadow: {
    none: cssVar('shadow-none'),
    sm: cssVar('shadow-sm'),
    md: cssVar('shadow-md'),
    lg: cssVar('shadow-lg'),
    xl: cssVar('shadow-xl'),
    '2xl': cssVar('shadow-2xl'),
  },
} as const

export type Tokens = typeof tokens
