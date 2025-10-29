/**
 * @fileoverview Stone Dragon button component with multiple variants.
 * Supports different sizes, loading states, and styling options.
 * 
 * @module components/ui/SDButton
 * @requires react
 * @requires react-native
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

/**
 * Props for SDButton component.
 * 
 * @interface SDButtonProps
 * @property {'primary-filled' | 'primary-on-light' | 'accept' | 'reject' | 'ghost' | 'secondary'} [variant='primary-filled'] - Button visual variant
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Button size
 * @property {boolean} [fullWidth=false] - Whether button should take full width
 * @property {boolean} [loading=false] - Show loading indicator
 * @property {boolean} [disabled=false] - Disable button interaction
 * @property {React.ReactNode} children - Button content/text
 * @property {function} [onPress] - Function to handle button press
 * @property {ViewStyle} [style] - Additional view styles
 * @property {TextStyle} [textStyle] - Additional text styles
 */
interface SDButtonProps {
  variant?: 'primary-filled' | 'primary-on-light' | 'accept' | 'reject' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Stone Dragon styled button component.
 * Supports multiple variants matching Figma design with accessibility.
 * 
 * @component
 * @param {SDButtonProps} props - Component properties
 * @returns {JSX.Element} Styled button component
 * 
 * @example
 * <SDButton variant="primary-filled" size="md" onPress={handlePress}>
 *   Click Me
 * </SDButton>
 */
export default function SDButton({
  variant = 'primary-filled',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onPress,
  style,
  textStyle,
}: SDButtonProps) {
  const variantStyles: Record<string, {
    backgroundColor: string;
    textColor: string;
    borderColor?: string;
    borderWidth?: number;
  }> = {
    'primary-filled': {
      backgroundColor: Colors.deepPurple,
      textColor: Colors.light,
    },
    'primary-on-light': {
      backgroundColor: Colors.golden,
      textColor: Colors.dark,
    },
    accept: {
      backgroundColor: Colors.golden,
      textColor: Colors.dark,
    },
    reject: {
      backgroundColor: Colors.red,
      textColor: Colors.light,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: Colors.deepPurple,
      borderColor: Colors.deepPurple,
      borderWidth: 2,
    },
    secondary: {
      backgroundColor: Colors.mediumPurple,
      textColor: Colors.light,
    },
  };

  const sizeStyles = {
    sm: {
      height: Sizes.buttonHeightSm,
      paddingHorizontal: 12,
      fontSize: Sizes.fontSm,
    },
    md: {
      height: Sizes.buttonHeight,
      paddingHorizontal: 16,
      fontSize: Sizes.fontMd,
    },
    lg: {
      height: Sizes.buttonHeightLg,
      paddingHorizontal: 24,
      fontSize: Sizes.fontLg,
    },
  };

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: variantStyle.backgroundColor,
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        variantStyle.borderWidth && {
          borderWidth: variantStyle.borderWidth,
          borderColor: variantStyle.borderColor,
        },
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.textColor} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: variantStyle.textColor,
              fontSize: sizeStyle.fontSize,
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Sizes.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

/* End of file components/ui/SDButton.tsx */
