/**
 * Global Theme System for Inhabit Realties
 * 
 * This file consolidates all theme tokens and creates a unified theme system.
 * It combines colors, typography, spacing, and component styles.
 */

import { extendTheme } from '@chakra-ui/react';
import { brandColors, semanticColors, neutralColors, lightTheme, realEstateColors } from './colors';
import { fontFamilies, fontSizes, fontWeights, lineHeights, letterSpacing, typography } from './typography';
import { spacing, borderRadius, borderWidth, shadows, zIndex } from './spacing';

// Create Chakra UI theme configuration
const theme = extendTheme({
  // Colors
  colors: {
    // Brand colors
    brand: {
      primary: brandColors.primary,
      secondary: brandColors.secondary,
      accent: brandColors.accent,
      tertiary: brandColors.tertiary,
    },
    
    // Semantic colors
    success: semanticColors.success,
    warning: semanticColors.warning,
    error: semanticColors.error,
    info: semanticColors.info,
    
    // Neutral colors
    gray: neutralColors.gray,
    white: neutralColors.white,
    black: neutralColors.black,
    
    // Light theme colors
    light: {
      background: lightTheme.background.primary,
      cardBackground: lightTheme.background.secondary,
      darkText: lightTheme.text.primary,
      text: lightTheme.text.secondary,
      mutedText: lightTheme.text.muted,
      success: semanticColors.success[600],
      danger: semanticColors.error[600],
      warning: semanticColors.warning[600],
      primary: semanticColors.info[600],
      secondary: brandColors.primary,
    },
    
    // Real estate specific colors
    realEstate: realEstateColors,
  },

  // Typography
  fonts: {
    heading: fontFamilies.heading,
    body: fontFamilies.body,
    mono: fontFamilies.mono,
    display: fontFamilies.display,
  },
  
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,

  // Spacing
  space: spacing,
  sizes: spacing,
  
  // Border radius
  radii: borderRadius,
  
  // Border width
  borderWidths: borderWidth,
  
  // Shadows
  shadows,
  
  // Z-index
  zIndices: zIndex,

  // Breakpoints
  breakpoints: {
    sm: '320px',
    md: '500px',
    lg: '720px',
    xl: '960px',
    '2xl': '1200px',
  },

  // Component styles
  components: {
    Button: {
      baseStyle: {
        fontWeight: fontWeights.semibold,
        borderRadius: borderRadius.lg,
        _focus: {
          boxShadow: `0 0 0 3px ${brandColors.primary}20`,
        },
      },
      sizes: {
        xs: {
          fontSize: fontSizes.xs,
          px: spacing.sm,
          py: spacing.xs,
        },
        sm: {
          fontSize: fontSizes.sm,
          px: spacing.md,
          py: spacing.sm,
        },
        md: {
          fontSize: fontSizes.base,
          px: spacing.lg,
          py: spacing.md,
        },
        lg: {
          fontSize: fontSizes.lg,
          px: spacing.xl,
          py: spacing.lg,
        },
        xl: {
          fontSize: fontSizes.xl,
          px: spacing['2xl'],
          py: spacing.xl,
        },
      },
      variants: {
        primary: {
          bg: brandColors.primary,
          color: neutralColors.white,
          _hover: {
            bg: brandColors.accent,
            transform: 'translateY(-1px)',
            boxShadow: shadows.md,
          },
          _active: {
            bg: brandColors.tertiary,
            transform: 'translateY(0)',
          },
          _disabled: {
            bg: neutralColors.gray[300],
            color: neutralColors.gray[500],
            cursor: 'not-allowed',
            _hover: {
              bg: neutralColors.gray[300],
              transform: 'none',
              boxShadow: 'none',
            },
          },
        },
        secondary: {
          bg: neutralColors.gray[100],
          color: lightTheme.text.primary,
          border: `1px solid ${lightTheme.border.primary}`,
          _hover: {
            bg: neutralColors.gray[200],
            borderColor: lightTheme.border.secondary,
          },
          _active: {
            bg: neutralColors.gray[300],
          },
        },
        outline: {
          bg: 'transparent',
          color: brandColors.primary,
          border: `2px solid ${brandColors.primary}`,
          _hover: {
            bg: brandColors.primary,
            color: neutralColors.white,
          },
        },
        ghost: {
          bg: 'transparent',
          color: brandColors.primary,
          _hover: {
            bg: `${brandColors.primary}10`,
          },
        },
        danger: {
          bg: semanticColors.error[600],
          color: neutralColors.white,
          _hover: {
            bg: semanticColors.error[700],
          },
        },
        success: {
          bg: semanticColors.success[600],
          color: neutralColors.white,
          _hover: {
            bg: semanticColors.success[700],
          },
        },
      },
      defaultProps: {
        size: 'md',
        variant: 'primary',
      },
    },

    Text: {
      baseStyle: {
        color: lightTheme.text.primary,
        fontFamily: fontFamilies.body,
      },
      variants: {
        display: {
          ...typography.display.large,
          color: lightTheme.text.primary,
        },
        heading: {
          ...typography.heading.h1,
          color: lightTheme.text.primary,
        },
        body: {
          ...typography.body.medium,
          color: lightTheme.text.primary,
        },
        caption: {
          ...typography.caption.medium,
          color: lightTheme.text.muted,
        },
        label: {
          ...typography.label.medium,
          color: lightTheme.text.secondary,
        },
        link: {
          color: brandColors.accent,
          textDecoration: 'underline',
          _hover: {
            color: brandColors.primary,
          },
        },
      },
      defaultProps: {
        variant: 'body',
      },
    },

    Heading: {
      baseStyle: {
        color: lightTheme.text.primary,
        fontFamily: fontFamilies.heading,
        fontWeight: fontWeights.bold,
      },
      variants: {
        h1: typography.heading.h1,
        h2: typography.heading.h2,
        h3: typography.heading.h3,
        h4: typography.heading.h4,
        h5: typography.heading.h5,
        h6: typography.heading.h6,
      },
      defaultProps: {
        variant: 'h1',
      },
    },

    Input: {
      baseStyle: {
        field: {
          bg: lightTheme.background.secondary,
          border: `1px solid ${lightTheme.border.primary}`,
          borderRadius: borderRadius.md,
          color: lightTheme.text.primary,
          _focus: {
            borderColor: brandColors.primary,
            boxShadow: `0 0 0 1px ${brandColors.primary}`,
          },
          _hover: {
            borderColor: lightTheme.border.secondary,
          },
          _placeholder: {
            color: lightTheme.text.muted,
          },
        },
      },
      sizes: {
        sm: {
          field: {
            fontSize: fontSizes.sm,
            px: spacing.sm,
            py: spacing.xs,
          },
        },
        md: {
          field: {
            fontSize: fontSizes.base,
            px: spacing.md,
            py: spacing.sm,
          },
        },
        lg: {
          field: {
            fontSize: fontSizes.lg,
            px: spacing.lg,
            py: spacing.md,
          },
        },
      },
      defaultProps: {
        size: 'md',
      },
    },

    Card: {
      baseStyle: {
        container: {
          bg: lightTheme.background.secondary,
          borderRadius: borderRadius.lg,
          boxShadow: shadows.sm,
          border: `1px solid ${lightTheme.border.primary}`,
        },
        header: {
          px: spacing.lg,
          py: spacing.md,
          borderBottom: `1px solid ${lightTheme.border.primary}`,
        },
        body: {
          px: spacing.lg,
          py: spacing.md,
        },
        footer: {
          px: spacing.lg,
          py: spacing.md,
          borderTop: `1px solid ${lightTheme.border.primary}`,
        },
      },
    },

    Table: {
      baseStyle: {
        table: {
          borderCollapse: 'collapse',
        },
        th: {
          bg: lightTheme.background.tertiary,
          color: lightTheme.text.primary,
          fontWeight: fontWeights.semibold,
          textAlign: 'left',
          py: spacing.md,
          px: spacing.lg,
          borderBottom: `1px solid ${lightTheme.border.primary}`,
        },
        td: {
          py: spacing.md,
          px: spacing.lg,
          borderBottom: `1px solid ${lightTheme.border.primary}`,
          color: lightTheme.text.primary,
        },
        tr: {
          _hover: {
            bg: lightTheme.background.tertiary,
          },
        },
      },
    },

    Badge: {
      baseStyle: {
        borderRadius: borderRadius.full,
        fontWeight: fontWeights.medium,
        textTransform: 'none',
        px: spacing.sm,
        py: spacing.xs,
      },
      variants: {
        solid: {
          bg: brandColors.primary,
          color: neutralColors.white,
        },
        outline: {
          bg: 'transparent',
          color: brandColors.primary,
          border: `1px solid ${brandColors.primary}`,
        },
        subtle: {
          bg: `${brandColors.primary}10`,
          color: brandColors.primary,
        },
      },
      defaultProps: {
        variant: 'solid',
      },
    },
  },

  // Global styles
  styles: {
    global: {
      body: {
        bg: lightTheme.background.primary,
        color: lightTheme.text.primary,
        fontFamily: fontFamilies.body,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.relaxed,
      },
      '*': {
        borderColor: lightTheme.border.primary,
      },
    },
  },

  // Custom theme tokens for easy access
  tokens: {
    colors: {
      brand: brandColors,
      semantic: semanticColors,
      neutral: neutralColors,
      light: lightTheme,
      realEstate: realEstateColors,
    },
    typography: {
      fonts: fontFamilies,
      sizes: fontSizes,
      weights: fontWeights,
      lineHeights,
      letterSpacing,
      styles: typography,
    },
    spacing: {
      space: spacing,
      borderRadius,
      borderWidth,
      shadows,
      zIndex,
    },
  },
});

export default theme; 