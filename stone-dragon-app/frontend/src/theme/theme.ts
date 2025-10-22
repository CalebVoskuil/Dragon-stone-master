import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Stone Dragon Design System Colors (from Figma tokens)
export const colors = {
  // Primary colors
  primary: '#58398B', // Deep purple
  primaryVariant: '#7B4CB3', // Medium purple
  secondary: '#FDCF25', // Golden yellow
  secondaryVariant: '#E6B800', // Darker gold
  
  // Status colors
  accept: '#FDCF25', // Golden yellow
  reject: '#E63946', // Red
  pending: '#F77F00', // Orange
  success: '#3BB273', // Green
  
  // Background colors
  background: '#FDFDFD', // Off-white background
  surface: '#FFFFFF', // Card surface
  surfaceSecondary: '#F5F5F5', // Secondary surface
  
  // Text colors
  textDark: '#2D2D2D', // Dark text
  textLight: '#FFFFFF', // Light text
  textMuted: '#666666', // Muted text
  
  // System colors
  error: '#E63946',
  warning: '#F77F00',
  info: '#58398B',
  
  // Legacy compatibility
  onPrimary: '#FFFFFF',
  onSecondary: '#2D2D2D',
  onBackground: '#2D2D2D',
  onSurface: '#2D2D2D',
  onError: '#FFFFFF',
  outline: '#BDBDBD',
  surfaceVariant: '#F5F5F5',
  onSurfaceVariant: '#666666',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  roundness: 12, // sd_radius_button from tokens
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    primaryContainer: colors.primaryVariant,
    secondary: colors.secondary,
    secondaryContainer: colors.secondaryVariant,
    background: '#121212',
    surface: '#1E1E1E',
    error: colors.error,
    onPrimary: colors.onPrimary,
    onSecondary: colors.onSecondary,
    onBackground: colors.textLight,
    onSurface: colors.textLight,
    onError: colors.onError,
    outline: '#666666',
    surfaceVariant: '#2C2C2C',
    onSurfaceVariant: '#CCCCCC',
  },
  roundness: 12,
};

// Typography (from Figma tokens)
export const typography = {
  h1: {
    fontSize: 24, // sd_h1
    fontWeight: '600' as const,
    lineHeight: 31.2, // 1.3 * fontSize
  },
  h2: {
    fontSize: 20, // sd_h2
    fontWeight: '600' as const,
    lineHeight: 26, // 1.3 * fontSize
  },
  subhead: {
    fontSize: 16, // sd_subhead
    fontWeight: '500' as const,
    lineHeight: 22.4, // 1.4 * fontSize
  },
  body: {
    fontSize: 14, // sd_body
    fontWeight: '400' as const,
    lineHeight: 21, // 1.5 * fontSize
  },
  caption: {
    fontSize: 12, // sd_caption
    fontWeight: '400' as const,
    lineHeight: 16.8, // 1.4 * fontSize
  },
};

// Spacing (from Figma tokens)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16, // base * 2
  lg: 24, // base * 3
  xl: 32, // base * 4
  xxl: 48, // base * 6
  // Specific spacing from tokens
  cardPadding: 16, // card_padding
  pageMargin: 16, // page_margin
};

// Border radius (from Figma tokens)
export const borderRadius = {
  page: 20, // sd_radius_page
  card: 16, // sd_radius_card
  button: 12, // sd_radius_button
  chip: 8, // sd_radius_chip
  // Legacy values for compatibility
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// Shadows (from Figma tokens)
export const shadows = {
  sdShadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  // Additional shadow variants
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};
