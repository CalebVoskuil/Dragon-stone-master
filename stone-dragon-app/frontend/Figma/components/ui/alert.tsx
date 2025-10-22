import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
  style?: ViewStyle;
}

interface AlertTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

function Alert({ children, variant = 'default', className, style }: AlertProps) {
  return (
    <View style={[styles.alert, styles[variant], style]}>
      {children}
    </View>
  );
}

function AlertTitle({ children, className, style }: AlertTitleProps) {
  return (
    <Text style={[styles.title, style]}>
      {children}
    </Text>
  );
}

function AlertDescription({ children, className, style }: AlertDescriptionProps) {
  return (
    <Text style={[styles.description, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  alert: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  default: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  destructive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export { Alert, AlertTitle, AlertDescription };