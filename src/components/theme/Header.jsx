/**
 * Header Component with Theme Integration
 * 
 * This component demonstrates how to use the theme system for layout styling
 * with proper background and text colors.
 */

import React from 'react';
import { Box, Flex, Text, HStack } from '@chakra-ui/react';
import { useCurrentTheme, useBrandColors, useTheme } from '../../theme/ThemeContext';
import Button from './Button';

const Header = ({ title = "Inhabit Realties", showThemeToggle = true }) => {
  const currentTheme = useCurrentTheme();
  const brandColors = useBrandColors();
  const { themeMode, toggleTheme } = useTheme();

  const headerStyles = {
    backgroundColor: currentTheme.background.secondary,
    borderBottom: `1px solid ${currentTheme.border.primary}`,
    boxShadow: currentTheme.shadow.sm,
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const logoStyles = {
    fontSize: '24px',
    fontWeight: 700,
    color: brandColors.primary,
    fontFamily: "'Roboto Slab', serif",
  };

  const navStyles = {
    color: currentTheme.text.primary,
    fontSize: '16px',
    fontWeight: 500,
    _hover: {
      color: brandColors.accent,
    },
    transition: 'color 0.2s ease-in-out',
  };

  const themeToggleStyles = {
    backgroundColor: currentTheme.background.tertiary,
    border: `1px solid ${currentTheme.border.primary}`,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    color: currentTheme.text.primary,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    _hover: {
      backgroundColor: currentTheme.background.secondary,
      borderColor: currentTheme.border.secondary,
    },
  };

  return (
    <Box as="header" {...headerStyles}>
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo and Title */}
        <Flex align="center" gap="16px">
          <Text {...logoStyles}>
            {title}
          </Text>
          <Text 
            color={currentTheme.text.secondary}
            fontSize="14px"
            fontWeight={400}
          >
            Real Estate Management
          </Text>
        </Flex>

        {/* Navigation */}
        <HStack spacing="32px" align="center">
          <Text {...navStyles} cursor="pointer">
            Dashboard
          </Text>
          <Text {...navStyles} cursor="pointer">
            Properties
          </Text>
          <Text {...navStyles} cursor="pointer">
            Sales
          </Text>
          <Text {...navStyles} cursor="pointer">
            Reports
          </Text>
          
          {/* Theme Toggle */}
          {showThemeToggle && (
            <Box
              {...themeToggleStyles}
              onClick={toggleTheme}
            >
              {themeMode === 'light' ? '🌙' : '☀️'} {themeMode}
            </Box>
          )}

          {/* Action Buttons */}
          <HStack spacing="12px">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header; 