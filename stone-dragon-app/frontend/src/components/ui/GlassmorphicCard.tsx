/**
 * @fileoverview Glassmorphic card component with blur effect.
 * Creates frosted glass appearance using BlurView.
 * 
 * @module components/ui/GlassmorphicCard
 * @requires react
 * @requires react-native
 * @requires expo-blur
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

/**
 * Props for GlassmorphicCard component.
 * 
 * @interface GlassmorphicCardProps
 * @property {React.ReactNode} children - Card content
 * @property {number} [intensity=80] - Blur intensity
 * @property {'light' | 'dark' | 'default'} [tint='light'] - Blur tint
 * @property {ViewStyle} [style] - Additional styles
 * @property {'none' | 'sm' | 'md' | 'lg'} [padding='md'] - Internal padding
 */
interface GlassmorphicCardProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component with glassmorphic blur effect.
 * Creates signature frosted glass appearance for modern UI design.
 * 
 * @component
 * @param {GlassmorphicCardProps} props - Component properties
 * @returns {JSX.Element} Glassmorphic card component
 */
export default function GlassmorphicCard({
  children,
  intensity = 80,
  tint = 'light',
  style,
  padding = 'md',
}: GlassmorphicCardProps) {
  const paddingValue = {
    none: 0,
    sm: Sizes.sm,
    md: Sizes.md,
    lg: Sizes.lg,
  }[padding];

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[
        styles.card,
        { padding: paddingValue },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassLight,
    borderRadius: Sizes.radiusLg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
});

/* End of file components/ui/GlassmorphicCard.tsx */