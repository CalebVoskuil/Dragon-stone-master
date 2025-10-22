import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
  style?: ViewStyle;
}

function Input({ className, style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 36,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#1e293b',
  },
});

export { Input };