/**
 *
 */

/**
 *
 */
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';

interface SDActionAcceptProps {
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * SDActionAccept - Accept/Approve action button
 * Golden circular button with check icon
 */
export function SDActionAccept({ onPress, style }: SDActionAcceptProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, styles.acceptButton, style]}
      activeOpacity={0.7}
      accessibilityLabel="Approve"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Check color={Colors.dark} size={20} />
    </TouchableOpacity>
  );
}

interface SDActionRejectProps {
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * SDActionReject - Reject/Decline action button
 * Red circular button with X icon
 */
export function SDActionReject({ onPress, style }: SDActionRejectProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, styles.rejectButton, style]}
      activeOpacity={0.7}
      accessibilityLabel="Reject"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <X color={Colors.light} size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptButton: {
    backgroundColor: Colors.golden,
  },
  rejectButton: {
    backgroundColor: Colors.red,
  },
});

