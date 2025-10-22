import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

function Card({ children, className, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

function CardHeader({ children, className, style }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

function CardContent({ children, className, style }: CardContentProps) {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

function CardFooter({ children, className, style }: CardFooterProps) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: 16,
  },
});

export { Card, CardHeader, CardContent, CardFooter };