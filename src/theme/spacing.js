/**
 * Spacing System for Inhabit Realties
 * 
 * This file defines all spacing tokens used throughout the application.
 * Spacing is based on a 4px base unit for consistency.
 */

// Base spacing unit (4px)
const baseUnit = 4;

// Generate spacing scale
const generateSpacing = () => {
  const spacing = {};
  for (let i = 0; i <= 96; i++) {
    spacing[i] = `${i * baseUnit}px`;
  }
  return spacing;
};

// Spacing Scale
export const spacing = {
  ...generateSpacing(),
  
  // Common spacing values with semantic names
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
  '6xl': '192px',
  '7xl': '256px',
  '8xl': '384px',
};

// Border Radius
export const borderRadius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

// Border Width
export const borderWidth = {
  none: '0px',
  thin: '1px',
  base: '2px',
  thick: '3px',
  thicker: '4px',
};

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Layout Spacing
export const layout = {
  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Section spacing
  section: {
    sm: spacing.lg,    // 24px
    md: spacing.xl,    // 32px
    lg: spacing['2xl'], // 48px
    xl: spacing['3xl'], // 64px
  },
  
  // Component spacing
  component: {
    xs: spacing.xs,    // 4px
    sm: spacing.sm,    // 8px
    md: spacing.md,    // 16px
    lg: spacing.lg,    // 24px
    xl: spacing.xl,    // 32px
  },
  
  // Content spacing
  content: {
    xs: spacing.sm,    // 8px
    sm: spacing.md,    // 16px
    md: spacing.lg,    // 24px
    lg: spacing.xl,    // 32px
    xl: spacing['2xl'], // 48px
  },
};

// Export all spacing tokens
export const spacingTokens = {
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  zIndex,
  layout,
};

export default spacingTokens; 