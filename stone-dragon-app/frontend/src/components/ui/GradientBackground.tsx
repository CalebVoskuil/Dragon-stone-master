/**
 * @fileoverview Purple/White gradient background component.
 * Uses an image background for consistent branding across screens.
 * 
 * @module components/ui/GradientBackground
 * @requires react
 * @requires react-native
 */

import React from 'react';
import { StyleSheet, ViewStyle, ImageBackground } from 'react-native';

/**
 * Props for GradientBackground component.
 * 
 * @interface GradientBackgroundProps
 * @property {React.ReactNode} children - Content to render on background
 * @property {ViewStyle} [style] - Additional styles
 */
interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Purple/White gradient background component.
 * Uses an image background for consistent branding across all screens.
 * 
 * @component
 * @param {GradientBackgroundProps} props - Component properties
 * @returns {JSX.Element} Gradient background component
 */
export default function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <ImageBackground
      source={require('../../assets/Background-White-Purple.jpg')}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

/* End of file components/ui/GradientBackground.tsx */