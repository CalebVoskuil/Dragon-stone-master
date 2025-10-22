import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../src/theme/theme';

interface SDButtonProps {
  children: React.ReactNode;
  variant?: 'primary-filled' | 'primary-on-light' | 'accept' | 'reject' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const SDButton: React.FC<SDButtonProps> = ({
  children,
  variant = 'primary-filled',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onPress,
  style,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[variant],
      ...styles[size],
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (isDisabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    return {
      ...styles.text,
      ...styles[`${variant}Text`],
      ...styles[`${size}Text`],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'ghost' ? colors.primary : colors.textLight} 
        />
      ) : (
        <Text style={getTextStyle()}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
    minHeight: 44, // Accessibility requirement
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.button,
  },
  text: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    textAlign: 'center',
  },
  
  // Variants
  'primary-filled': {
    backgroundColor: colors.primary,
  },
  'primary-filledText': {
    color: colors.textLight,
  },
  
  'primary-on-light': {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  'primary-on-lightText': {
    color: colors.primary,
  },
  
  'accept': {
    backgroundColor: colors.accept,
  },
  'acceptText': {
    color: colors.textDark,
  },
  
  'reject': {
    backgroundColor: colors.reject,
  },
  'rejectText': {
    color: colors.textLight,
  },
  
  'ghost': {
    backgroundColor: 'transparent',
  },
  'ghostText': {
    color: colors.primary,
  },
  
  'secondary': {
    backgroundColor: colors.surfaceSecondary,
  },
  'secondaryText': {
    color: colors.textDark,
  },
  
  // Sizes
  sm: {
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  smText: {
    fontSize: typography.caption.fontSize,
  },
  
  md: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mdText: {
    fontSize: typography.body.fontSize,
  },
  
  lg: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  lgText: {
    fontSize: typography.subhead.fontSize,
  },
});