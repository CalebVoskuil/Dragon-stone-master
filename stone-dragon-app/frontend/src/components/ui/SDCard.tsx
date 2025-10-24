import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { shadows } from '../../theme/theme';

interface SDCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
}

/**
 * SDCard - Standard card component
 * Supports different variants and padding options
 */
export default function SDCard({
  children,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
}: SDCardProps) {
  const paddingValue = {
    none: 0,
    sm: Sizes.sm,
    md: Sizes.md,
    lg: Sizes.lg,
  }[padding];

  const cardStyle = [
    styles.card,
    { padding: paddingValue },
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'default' && styles.default,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Sizes.radiusLg,
    backgroundColor: Colors.card,
  },
  default: {
    borderWidth: 0,
  },
  elevated: {
    borderWidth: 0,
    ...shadows.medium,
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

