/**
 * Theme Context for Inhabit Realties
 * 
 * This context provides theme switching functionality and makes theme tokens
 * available throughout the application.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import colors from './colors';
import typographyTokens from './typography';
import spacingTokens from './spacing';

// Create theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeMode(savedTheme);
    }
    setIsLoaded(true);
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('theme-mode', themeMode);
    }
  }, [themeMode, isLoaded]);

  // Get current theme colors
  const getCurrentTheme = () => {
    return themeMode === 'light' ? colors.light : colors.dark;
  };

  // Toggle theme
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Set specific theme
  const setTheme = (mode) => {
    if (mode === 'light' || mode === 'dark') {
      setThemeMode(mode);
    }
  };

  // Theme context value
  const contextValue = {
    // Theme state
    themeMode,
    isLoaded,
    
    // Theme actions
    toggleTheme,
    setTheme,
    
    // Theme tokens
    colors: {
      ...colors,
      current: getCurrentTheme(),
    },
    typography: typographyTokens,
    spacing: spacingTokens,
    
    // Helper functions
    getCurrentTheme,
    isLight: themeMode === 'light',
    isDark: themeMode === 'dark',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get specific theme tokens
export const useThemeTokens = () => {
  const { colors, typography, spacing } = useTheme();
  return { colors, typography, spacing };
};

// Hook to get current theme colors
export const useCurrentTheme = () => {
  const { colors } = useTheme();
  return colors.current;
};

// Hook to get brand colors
export const useBrandColors = () => {
  const { colors } = useTheme();
  return colors.brand;
};

// Hook to get semantic colors
export const useSemanticColors = () => {
  const { colors } = useTheme();
  return colors.semantic;
};

export default ThemeContext; 