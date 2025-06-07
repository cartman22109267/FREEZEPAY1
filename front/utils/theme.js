// utils/theme.js
import { useColorScheme } from 'react-native';

const palette = {
  brand: {
    primary: '#4A90E2',
    dark: '#357ABD',
    darker: '#2C5F8A',
  },
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',

  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
  },

  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
  },
};

const getTheme = (scheme) => {
  const isDark = scheme === 'dark';
  return {
    colors: {
      brand: palette.brand.primary,
      brandDark: palette.brand.dark,
      brandDarker: palette.brand.darker,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,

      background: isDark ? palette.dark.background : palette.light.background,
      surface: isDark ? palette.dark.surface : palette.light.surface,
      textPrimary: isDark ? palette.dark.textPrimary : palette.light.textPrimary,
      textSecondary: isDark ? palette.dark.textSecondary : palette.light.textSecondary,
    },
    isDark,
  };
};

export const useTheme = () => {
  const scheme = useColorScheme(); // 'light' | 'dark'
  return getTheme(scheme);
};
