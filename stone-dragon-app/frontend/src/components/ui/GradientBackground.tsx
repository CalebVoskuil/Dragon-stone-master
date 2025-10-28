import React from 'react';
import { StyleSheet, ViewStyle, ImageBackground } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * GradientBackground - Purple/White background using JPG image
 * Used as the main background for screens
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

