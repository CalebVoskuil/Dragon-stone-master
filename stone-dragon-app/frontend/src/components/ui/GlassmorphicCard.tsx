import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * GlassmorphicCard - Card component with blur effect
 * Creates the signature glassmorphic/frosted glass appearance
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

