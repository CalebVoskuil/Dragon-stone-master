import React from 'react';
import { TextInput, Text } from 'react-native-paper';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme/theme';

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
  autoComplete?: 'off' | 'email' | 'password' | 'name';
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  labelStyle?: TextStyle;
  right?: React.ReactNode;
  left?: React.ReactNode;
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
  style,
  contentStyle,
  labelStyle,
  right,
  left,
}) => {
  const getInputStyle = (): ViewStyle => {
    return {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.button,
      minHeight: 44, // Accessibility minimum
      ...style,
    };
  };

  const getContentStyle = (): ViewStyle => {
    return {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...contentStyle,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      color: colors.textDark,
      marginBottom: spacing.xs,
      ...labelStyle,
    };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      fontSize: typography.caption.fontSize,
      color: colors.error,
      marginTop: spacing.xs,
    };
  };

  const getHintStyle = (): TextStyle => {
    return {
      fontSize: typography.caption.fontSize,
      color: colors.textMuted,
      marginTop: spacing.xs,
    };
  };

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
      
      {(error || hint) && (
        <Text style={error ? getErrorStyle() : getHintStyle()}>
          {error || hint}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});

export default SDInput;
