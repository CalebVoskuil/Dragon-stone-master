/**
 * @fileoverview Stone Dragon card component for content containers.
 * Supports different variants and padding options.
 * 
 * @module components/ui/SDCard
 * @requires react
 * @requires react-native
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import { shadows } from '../../theme/theme';

/**
 * Props for SDCard component.
 * 
 * @interface SDCardProps
 * @property {React.ReactNode} children - Card content
 * @property {'default' | 'elevated' | 'outlined'} [variant='default'] - Visual variant
 * @property {'none' | 'sm' | 'md' | 'lg'} [padding='md'] - Internal padding size
 * @property {ViewStyle} [style] - Additional styles
 * @property {function} [onPress] - Optional press handler (makes card touchable)
 */
interface SDCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  onPress?: () => void;
}

/**
 * Standard card component for content containers.
 * Supports different visual variants, padding options, and optional press interaction.
 * 
 * @component
 * @param {SDCardProps} props - Component properties
 * @returns {JSX.Element} Styled card component
 * 
 * @example
 * <SDCard variant="elevated" padding="md">
 *   <Text>Card content</Text>
 * </SDCard>
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

/* End of file components/ui/SDCard.tsx */
