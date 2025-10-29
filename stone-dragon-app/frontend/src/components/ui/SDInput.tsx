/**
 * @fileoverview Stone Dragon text input component with validation.
 * Supports labels, error messages, hints, and required field indication.
 * 
 * @module components/ui/SDInput
 * @requires react
 * @requires react-native
 * @requires lucide-react-native
 */

import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

/**
 * Props for SDInput component.
 * 
 * @interface SDInputProps
 * @extends {TextInputProps}
 * @property {string} [label] - Input field label
 * @property {string} [error] - Error message to display
 * @property {string} [hint] - Hint text to display
 * @property {boolean} [required=false] - Show required asterisk
 * @property {boolean} [fullWidth=true] - Take full width of container
 * @property {ViewStyle} [containerStyle] - Container view styles
 */
interface SDInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * Styled text input component with validation.
 * Supports labels, error messages, hints, and required field indication.
 * 
 * @component
 * @param {SDInputProps} props - Component properties
 * @returns {JSX.Element} Styled input component
 * 
 * @example
 * <SDInput
 *   label="Email"
 *   required
 *   error={errors.email}
 *   value={email}
 *   onChangeText={setEmail}
 * />
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

/* End of file components/ui/SDInput.tsx */