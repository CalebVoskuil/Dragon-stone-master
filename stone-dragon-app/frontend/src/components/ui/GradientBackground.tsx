import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * GradientBackground - Purple gradient background mimicking Figma design
 * Used as the main background for screens
 */
export default function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={[
        Colors.gradientStart,      // #58398B - Deep Purple
        Colors.gradientMid1,       // #7B4CB3 - Medium Purple
        Colors.gradientMid2,       // #9D6FCC - Lighter Purple
        Colors.gradientEnd,        // #C4A7E7 - Very Light Purple
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

