import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  style?: ViewStyle;
}

function Badge({ children, variant = 'default', className, style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minHeight: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  default: {
    backgroundColor: '#58398B',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  defaultText: {
    color: '#fff',
  },
  secondary: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  secondaryText: {
    color: '#475569',
  },
  destructive: {
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: 'transparent',
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
});

export { Badge };