import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

interface SDInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * SDInput - Styled text input component
 * Supports labels, errors, hints, and validation
 */
export default function SDInput({
  label,
  error,
  hint,
  required = false,
  fullWidth = true,
  containerStyle,
  style,
  ...props
}: SDInputProps) {
  const hasError = !!error;

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            hasError && styles.inputError,
            style,
          ]}
          placeholderTextColor={Colors.textSecondary}
          {...props}
        />
        {hasError && (
          <View style={styles.errorIcon}>
            <AlertCircle color={Colors.red} size={16} />
          </View>
        )}
      </View>

      {(hint || error) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error || hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.md,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    marginBottom: Sizes.xs,
    fontWeight: '500',
  },
  required: {
    color: Colors.red,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: Sizes.inputHeight,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: Sizes.md,
    fontSize: Sizes.fontMd,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.red,
  },
  errorIcon: {
    position: 'absolute',
    right: Sizes.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  helperText: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginTop: Sizes.xs,
  },
  errorText: {
    color: Colors.red,
  },
});

