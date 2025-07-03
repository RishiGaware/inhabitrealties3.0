/**
 * Button Component with Theme Integration
 * 
 * This component demonstrates how to use the theme system for consistent styling.
 */

import React from 'react';
import { Box } from '@chakra-ui/react';
import { useBrandColors, useCurrentTheme } from '../../theme/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  ...props 
}) => {
  const brandColors = useBrandColors();
  const currentTheme = useCurrentTheme();

  // Base button styles
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    textDecoration: 'none',
    outline: 'none',
    _focus: {
      boxShadow: `0 0 0 3px ${brandColors.primary}20`,
    },
  };

  // Size variants
  const sizeStyles = {
    xs: {
      fontSize: '12px',
      padding: '4px 8px',
      minHeight: '24px',
    },
    sm: {
      fontSize: '14px',
      padding: '8px 16px',
      minHeight: '32px',
    },
    md: {
      fontSize: '16px',
      padding: '12px 24px',
      minHeight: '40px',
    },
    lg: {
      fontSize: '18px',
      padding: '16px 32px',
      minHeight: '48px',
    },
    xl: {
      fontSize: '20px',
      padding: '20px 40px',
      minHeight: '56px',
    },
  };

  // Variant styles
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: brandColors.primary,
        color: currentTheme.text.inverse,
        _hover: {
          backgroundColor: brandColors.accent,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        _active: {
          backgroundColor: brandColors.tertiary,
          transform: 'translateY(0)',
        },
        _disabled: {
          backgroundColor: currentTheme.border.primary,
          color: currentTheme.text.muted,
          cursor: 'not-allowed',
          _hover: {
            backgroundColor: currentTheme.border.primary,
            transform: 'none',
            boxShadow: 'none',
          },
        },
      },
      secondary: {
        backgroundColor: currentTheme.background.tertiary,
        color: currentTheme.text.primary,
        border: `1px solid ${currentTheme.border.primary}`,
        _hover: {
          backgroundColor: currentTheme.background.secondary,
          borderColor: currentTheme.border.secondary,
        },
        _active: {
          backgroundColor: currentTheme.border.primary,
        },
        _disabled: {
          backgroundColor: currentTheme.background.tertiary,
          color: currentTheme.text.muted,
          borderColor: currentTheme.border.primary,
          cursor: 'not-allowed',
          _hover: {
            backgroundColor: currentTheme.background.tertiary,
          },
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: brandColors.primary,
        border: `2px solid ${brandColors.primary}`,
        _hover: {
          backgroundColor: brandColors.primary,
          color: currentTheme.text.inverse,
        },
        _active: {
          backgroundColor: brandColors.tertiary,
        },
        _disabled: {
          backgroundColor: 'transparent',
          color: currentTheme.text.muted,
          borderColor: currentTheme.border.primary,
          cursor: 'not-allowed',
          _hover: {
            backgroundColor: 'transparent',
            color: currentTheme.text.muted,
          },
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: brandColors.primary,
        _hover: {
          backgroundColor: `${brandColors.primary}10`,
        },
        _active: {
          backgroundColor: `${brandColors.primary}20`,
        },
        _disabled: {
          backgroundColor: 'transparent',
          color: currentTheme.text.muted,
          cursor: 'not-allowed',
          _hover: {
            backgroundColor: 'transparent',
          },
        },
      },
    };

    return variants[variant] || variants.primary;
  };

  // Combine all styles
  const buttonStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...getVariantStyles(),
  };

  return (
    <Box
      as="button"
      {...buttonStyles}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Button; 