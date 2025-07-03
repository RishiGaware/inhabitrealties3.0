/**
 * Typography System for Inhabit Realties
 * 
 * This file defines all typography tokens used throughout the application.
 * Typography is organized by font families, sizes, weights, and line heights.
 */

// Font Families
export const fontFamilies = {
  heading: "'Roboto Slab', serif",
  body: "'Montserrat', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  display: "'Playfair Display', serif",
};

// Font Sizes
export const fontSizes = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
  '8xl': '6rem',      // 96px
  '9xl': '8rem',      // 128px
};

// Font Weights
export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// Line Heights
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// Letter Spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

// Typography Scale
export const typography = {
  // Display Styles
  display: {
    large: {
      fontSize: fontSizes['6xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.display,
    },
    medium: {
      fontSize: fontSizes['5xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.display,
    },
    small: {
      fontSize: fontSizes['4xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.display,
    },
  },

  // Heading Styles
  heading: {
    h1: {
      fontSize: fontSizes['4xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.heading,
    },
    h2: {
      fontSize: fontSizes['3xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.tight,
      letterSpacing: letterSpacing.tight,
      fontFamily: fontFamilies.heading,
    },
    h3: {
      fontSize: fontSizes['2xl'],
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.snug,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.heading,
    },
    h4: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.snug,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.heading,
    },
    h5: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.heading,
    },
    h6: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.heading,
    },
  },

  // Body Text Styles
  body: {
    large: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.relaxed,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.body,
    },
    medium: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.relaxed,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.body,
    },
    small: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.body,
    },
    xs: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.body,
    },
  },

  // Label Styles
  label: {
    large: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontFamilies.body,
    },
    medium: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontFamilies.body,
    },
    small: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.wide,
      fontFamily: fontFamilies.body,
    },
  },

  // Caption Styles
  caption: {
    large: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.body,
    },
    medium: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.body,
    },
  },

  // Code Styles
  code: {
    large: {
      fontSize: fontSizes.base,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono,
    },
    medium: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono,
    },
    small: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.normal,
      lineHeight: lineHeights.normal,
      letterSpacing: letterSpacing.normal,
      fontFamily: fontFamilies.mono,
    },
  },
};

// Export all typography tokens
export const typographyTokens = {
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  typography,
};

export default typographyTokens; 