/**
 * Card Component with Theme Integration
 * 
 * This component demonstrates how to use the theme system for content containers
 * with proper styling and text colors.
 */

import React from 'react';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { useCurrentTheme, useBrandColors } from '../../theme/ThemeContext';

const Card = ({ 
  children, 
  title, 
  subtitle,
  variant = 'default',
  padding = '24px',
  ...props 
}) => {
  const currentTheme = useCurrentTheme();
  const brandColors = useBrandColors();

  // Base card styles
  const baseStyles = {
    backgroundColor: currentTheme.background.secondary,
    borderRadius: '12px',
    border: `1px solid ${currentTheme.border.primary}`,
    boxShadow: currentTheme.shadow.sm,
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    _hover: {
      boxShadow: currentTheme.shadow.md,
      transform: 'translateY(-2px)',
    },
  };

  // Variant styles
  const getVariantStyles = () => {
    const variants = {
      default: {},
      elevated: {
        boxShadow: currentTheme.shadow.lg,
        _hover: {
          boxShadow: currentTheme.shadow.xl,
        },
      },
      outlined: {
        border: `2px solid ${currentTheme.border.secondary}`,
        backgroundColor: 'transparent',
      },
      primary: {
        border: `2px solid ${brandColors.primary}`,
        backgroundColor: `${brandColors.primary}05`,
      },
      success: {
        border: `2px solid ${currentTheme.success}`,
        backgroundColor: `${currentTheme.success}05`,
      },
      warning: {
        border: `2px solid ${currentTheme.warning}`,
        backgroundColor: `${currentTheme.warning}05`,
      },
      error: {
        border: `2px solid ${currentTheme.danger}`,
        backgroundColor: `${currentTheme.danger}05`,
      },
    };

    return variants[variant] || variants.default;
  };

  // Title styles
  const titleStyles = {
    fontSize: '20px',
    fontWeight: 600,
    color: currentTheme.text.primary,
    marginBottom: '8px',
    fontFamily: "'Roboto Slab', serif",
  };

  // Subtitle styles
  const subtitleStyles = {
    fontSize: '14px',
    color: currentTheme.text.secondary,
    marginBottom: '16px',
    fontWeight: 400,
  };

  // Content styles
  const contentStyles = {
    color: currentTheme.text.primary,
    fontSize: '16px',
    lineHeight: 1.6,
  };

  // Combine all styles
  const cardStyles = {
    ...baseStyles,
    ...getVariantStyles(),
    padding,
  };

  return (
    <Box {...cardStyles} {...props}>
      {/* Header */}
      {(title || subtitle) && (
        <Box borderBottom={`1px solid ${currentTheme.border.primary}`} padding="24px 24px 16px 24px">
          {title && <Text {...titleStyles}>{title}</Text>}
          {subtitle && <Text {...subtitleStyles}>{subtitle}</Text>}
        </Box>
      )}

      {/* Content */}
      <Box padding={title || subtitle ? "16px 24px 24px 24px" : padding}>
        <Box {...contentStyles}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

// Card Header component
const CardHeader = ({ children, ...props }) => {
  const currentTheme = useCurrentTheme();
  
  return (
    <Box
      borderBottom={`1px solid ${currentTheme.border.primary}`}
      padding="24px"
      {...props}
    >
      {children}
    </Box>
  );
};

// Card Body component
const CardBody = ({ children, ...props }) => {
  return (
    <Box padding="24px" {...props}>
      {children}
    </Box>
  );
};

// Card Footer component
const CardFooter = ({ children, ...props }) => {
  const currentTheme = useCurrentTheme();
  
  return (
    <Box
      borderTop={`1px solid ${currentTheme.border.primary}`}
      padding="24px"
      backgroundColor={currentTheme.background.tertiary}
      {...props}
    >
      {children}
    </Box>
  );
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card; 