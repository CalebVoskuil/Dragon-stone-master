/**
 * Stone Dragon Design System Sizes
 * Mapped from stone-dragon-tokens.json
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Spacing constants (can be imported separately)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 *
 */

/**
 *
 */
export const Sizes = {
  // Spacing (base 8px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Token-specific spacing
  base: 8,
  cardPadding: 16,
  pageMargin: 16,
  
  // Border Radius
  radiusSm: 8,         // sd_radius_chip
  radiusMd: 12,        // sd_radius_button
  radiusLg: 16,        // sd_radius_card
  radiusXl: 20,        // sd_radius_page
  radiusFull: 9999,
  
  // Screen Dimensions
  screenWidth: width,
  screenHeight: height,
  
  // Component Sizes
  buttonHeight: 44,    // Minimum touch target
  buttonHeightSm: 36,
  buttonHeightLg: 52,
  inputHeight: 56,
  iconSize: 24,
  iconSizeSm: 20,
  iconSizeLg: 28,
  avatarSize: 48,
  avatarSizeSm: 32,
  avatarSizeLg: 64,
  
  // Typography (from tokens)
  fontXs: 12,          // sd_caption
  fontSm: 14,          // sd_body
  fontMd: 16,          // sd_subhead
  fontLg: 20,          // sd_h2
  fontXl: 24,          // sd_h1
  fontXxl: 32,
  
  // Line Heights
  lineHeightTight: 1.3,
  lineHeightNormal: 1.4,
  lineHeightRelaxed: 1.5,
};

export default Sizes;

