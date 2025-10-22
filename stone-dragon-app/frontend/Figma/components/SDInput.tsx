import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../../src/theme/theme';

interface SDInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'email' | 'password' | 'name' | 'tel';
  right?: React.ReactNode;
  left?: React.ReactNode;
  style?: ViewStyle;
}

export const SDInput: React.FC<SDInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  hint,
  required = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  autoComplete = 'off',
  right,
  left,
  style,
}) => {
  const getLabelStyle = (): TextStyle => ({
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.xs,
  });

  const getInputStyle = (): ViewStyle => ({
    backgroundColor: colors.surface,
    minHeight: 44, // Accessibility requirement
  });

  const getContentStyle = (): TextStyle => ({
    fontSize: typography.body.fontSize,
    color: colors.textDark,
  });

  const getErrorStyle = (): TextStyle => ({
    fontSize: typography.caption.fontSize,
    color: colors.error,
    marginTop: spacing.xs,
  });

  const getHintStyle = (): TextStyle => ({
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  });

  return (
    <>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}
      
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        disabled={disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        style={getInputStyle()}
        contentStyle={getContentStyle()}
        outlineColor={error ? colors.error : colors.outline}
        activeOutlineColor={error ? colors.error : colors.primary}
        right={right}
        left={left}
        theme={{
          colors: {
            primary: colors.primary,
            error: colors.error,
            onSurface: colors.textDark,
            onSurfaceVariant: colors.textMuted,
            surface: colors.surface,
            outline: colors.outline,
          },
        }}
      />
      {error && <Text style={getErrorStyle()}>{error}</Text>}
      {hint && <Text style={getHintStyle()}>{hint}</Text>}
    </>
  );
};