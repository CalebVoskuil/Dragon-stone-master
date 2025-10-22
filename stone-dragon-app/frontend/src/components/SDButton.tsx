import React from 'react';
import { Button, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../theme/theme';

interface SDButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary-filled' | 'primary-on-light' | 'accept' | 'reject' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  labelStyle?: TextStyle;
  icon?: string;
  mode?: 'contained' | 'outlined' | 'text';
}

export const SDButton: React.FC<SDButtonProps> = ({
  children,
  onPress,
  variant = 'primary-filled',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  contentStyle,
  labelStyle,
  icon,
  mode = 'contained',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.button,
      minHeight: size === 'sm' ? 44 : size === 'md' ? 44 : 48, // Accessibility minimum
    };

    // Size-specific styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
      },
      md: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
      },
      lg: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
      },
    };

    // Variant-specific styles
    const variantStyles: Record<string, ViewStyle> = {
      'primary-filled': {
        backgroundColor: colors.primary,
        ...shadows.button,
      },
      'primary-on-light': {
        backgroundColor: colors.secondary,
        ...shadows.button,
      },
      'accept': {
        backgroundColor: colors.accept,
        ...shadows.button,
      },
      'reject': {
        backgroundColor: colors.reject,
        ...shadows.button,
      },
      'ghost': {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      },
      'secondary': {
        backgroundColor: colors.primaryVariant,
        ...shadows.button,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...style,
    };
  };

  const getLabelStyle = (): TextStyle => {
    const variantLabelStyles: Record<string, TextStyle> = {
      'primary-filled': { color: colors.textLight },
      'primary-on-light': { color: colors.textDark },
      'accept': { color: colors.textDark },
      'reject': { color: colors.textLight },
      'ghost': { color: colors.primary },
      'secondary': { color: colors.textLight },
    };

    return {
      ...variantLabelStyles[variant],
      ...labelStyle,
    };
  };

  const getContentStyle = (): ViewStyle => {
    return {
      ...contentStyle,
    };
  };

  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      contentStyle={getContentStyle()}
      labelStyle={getLabelStyle()}
      icon={icon}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary-on-light' || variant === 'accept' ? colors.textDark : colors.textLight} 
        />
      ) : (
        children
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});

export default SDButton;
