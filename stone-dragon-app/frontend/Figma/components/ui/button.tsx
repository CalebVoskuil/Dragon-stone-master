import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
}

function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  onPress, 
  disabled = false,
  className,
  style 
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant === 'default' ? 'defaultVariant' : variant],
        styles[size === 'default' ? 'defaultSize' : size],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        styles[variant === 'default' ? 'defaultVariantText' : `${variant}Text` as keyof typeof styles],
        styles[`${size}Text` as keyof typeof styles]
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    minHeight: 36,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Variants
  defaultVariant: {
    backgroundColor: '#58398B',
  },
  defaultVariantText: {
    color: '#fff',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  destructiveText: {
    color: '#fff',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  outlineText: {
    color: '#1e293b',
  },
  secondary: {
    backgroundColor: '#f1f5f9',
  },
  secondaryText: {
    color: '#475569',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#1e293b',
  },
  link: {
    backgroundColor: 'transparent',
  },
  linkText: {
    color: '#58398B',
    textDecorationLine: 'underline',
  },
  // Sizes
  sm: {
    minHeight: 32,
    paddingHorizontal: 12,
  },
  smText: {
    fontSize: 12,
  },
  defaultSize: {
    minHeight: 36,
    paddingHorizontal: 16,
  },
  defaultText: {
    fontSize: 14,
  },
  lg: {
    minHeight: 40,
    paddingHorizontal: 24,
  },
  lgText: {
    fontSize: 16,
  },
  icon: {
    minHeight: 36,
    minWidth: 36,
    paddingHorizontal: 0,
  },
  iconText: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Button };