import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { Sizes } from '../constants/Sizes';

/**
 * Stone Dragon Theme
 * Based on brand colors: Deep Purple (#58398B) and Golden (#FFD60A)
 */

// Stone Dragon color palette for React Native Paper
const stoneColors = {
  primary: Colors.deepPurple,
  primaryVariant: Colors.mediumPurple,
  secondary: Colors.golden,
  secondaryVariant: Colors.orange,
  background: Colors.background,
  surface: Colors.card,
  error: Colors.red,
  onPrimary: Colors.light,
  onSecondary: Colors.dark,
  onBackground: Colors.dark,
  onSurface: Colors.dark,
  onError: Colors.light,
  outline: Colors.border,
  surfaceVariant: Colors.cardBg,
  onSurfaceVariant: Colors.textSecondary,
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...stoneColors,
  },
  roundness: Sizes.radiusMd,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.deepPurple,
    primaryContainer: Colors.mediumPurple,
    secondary: Colors.golden,
    secondaryContainer: Colors.orange,
    background: '#121212',
    surface: '#1E1E1E',
    error: Colors.red,
    onPrimary: Colors.light,
    onSecondary: Colors.dark,
    onBackground: Colors.light,
    onSurface: Colors.light,
    onError: Colors.light,
    outline: '#666666',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#CCCCCC',
  },
  roundness: Sizes.radiusMd,
};

// Typography (mapped from Stone Dragon tokens)
export const typography = {
  h1: {
    fontSize: Sizes.fontXl,      // 24
    fontWeight: '600' as const,
    lineHeight: Sizes.fontXl * 1.3,
  },
  h2: {
    fontSize: Sizes.fontLg,      // 20
    fontWeight: '600' as const,
    lineHeight: Sizes.fontLg * 1.3,
  },
  subhead: {
    fontSize: Sizes.fontMd,      // 16
    fontWeight: '500' as const,
    lineHeight: Sizes.fontMd * 1.4,
  },
  body: {
    fontSize: Sizes.fontSm,      // 14
    fontWeight: '400' as const,
    lineHeight: Sizes.fontSm * 1.5,
  },
  caption: {
    fontSize: Sizes.fontXs,      // 12
    fontWeight: '400' as const,
    lineHeight: Sizes.fontXs * 1.4,
  },
};

// Spacing
export const spacing = {
  xs: Sizes.xs,
  sm: Sizes.sm,
  md: Sizes.md,
  lg: Sizes.lg,
  xl: Sizes.xl,
  xxl: Sizes.xxl,
};

// Border radius
export const borderRadius = {
  sm: Sizes.radiusSm,
  md: Sizes.radiusMd,
  lg: Sizes.radiusLg,
  xl: Sizes.radiusXl,
  round: Sizes.radiusFull,
};

// Shadow presets
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
