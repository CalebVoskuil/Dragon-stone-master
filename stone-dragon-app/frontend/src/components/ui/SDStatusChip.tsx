/**
 * @fileoverview Status and statistic chip components.
 * Displays status indicators and key metrics with icons.
 * 
 * @module components/ui/SDStatusChip
 * @requires react
 * @requires react-native
 * @requires lucide-react-native
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { CheckCircle, Clock, XCircle, Upload } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

/**
 * Status type definition.
 * @typedef {string} Status
 */
type Status = 'pending' | 'approved' | 'rejected' | 'uploading';

/**
 * Props for SDStatusChip component.
 * 
 * @interface SDStatusChipProps
 * @property {Status} status - Current status to display
 * @property {'sm' | 'md'} [size='md'] - Chip size
 * @property {boolean} [showIcon=true] - Show status icon
 * @property {ViewStyle} [style] - Additional styles
 */
interface SDStatusChipProps {
  status: Status;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  style?: ViewStyle;
}

/**
 * Status indicator chip with icon.
 * Displays volunteer log status and other item states with appropriate colors and icons.
 * 
 * @component
 * @param {SDStatusChipProps} props - Component properties
 * @returns {JSX.Element} Status chip component
 */
export default function SDStatusChip({
  status,
  size = 'md',
  showIcon = true,
  style,
}: SDStatusChipProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      backgroundColor: Colors.orange,
      textColor: Colors.dark,
      borderColor: '#D66A00',
      Icon: Clock,
    },
    approved: {
      label: 'Approved',
      backgroundColor: Colors.golden,
      textColor: Colors.dark,
      borderColor: '#E6B800',
      Icon: CheckCircle,
    },
    rejected: {
      label: 'Rejected',
      backgroundColor: Colors.red,
      textColor: Colors.light,
      borderColor: '#D32F3E',
      Icon: XCircle,
    },
    uploading: {
      label: 'Uploading',
      backgroundColor: Colors.mediumPurple,
      textColor: Colors.light,
      borderColor: '#6B3FA3',
      Icon: Upload,
    },
  };

  const config = statusConfig[status];
  const Icon = config.Icon;

  const sizeStyles = {
    sm: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      minHeight: 24,
      fontSize: Sizes.fontXs,
      iconSize: 12,
    },
    md: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      minHeight: 32,
      fontSize: Sizes.fontSm,
      iconSize: 16,
    },
  };

  const sizeStyle = sizeStyles[size];

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
          minHeight: sizeStyle.minHeight,
        },
        style,
      ]}
    >
      {showIcon && <Icon color={config.textColor} size={sizeStyle.iconSize} />}
      <Text
        style={[
          styles.text,
          {
            color: config.textColor,
            fontSize: sizeStyle.fontSize,
            marginLeft: showIcon ? 4 : 0,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

/**
 * Props for SDStatChip component.
 * 
 * @interface SDStatChipProps
 * @property {string} label - Statistic label
 * @property {string | number} value - Statistic value
 * @property {React.ComponentType} [icon] - Optional icon component
 * @property {'default' | 'primary' | 'accent'} [variant='default'] - Visual variant
 * @property {ViewStyle} [style] - Additional styles
 */
interface SDStatChipProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ color?: string; size?: number }>;
  variant?: 'default' | 'primary' | 'accent';
  style?: ViewStyle;
}

/**
 * Statistic display chip component.
 * Displays key metrics and statistics on dashboards with optional icons.
 * 
 * @component
 * @param {SDStatChipProps} props - Component properties
 * @returns {JSX.Element} Statistic chip component
 */
export function SDStatChip({
  label,
  value,
  icon: Icon,
  variant = 'default',
  style,
}: SDStatChipProps) {
  const variantStyles = {
    default: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderColor: Colors.border,
      textColor: Colors.text,
    },
    primary: {
      backgroundColor: `${Colors.deepPurple}1A`,
      borderColor: `${Colors.deepPurple}33`,
      textColor: Colors.deepPurple,
    },
    accent: {
      backgroundColor: `${Colors.golden}1A`,
      borderColor: `${Colors.golden}33`,
      textColor: Colors.orange,
    },
  };

  const variantStyle = variantStyles[variant];

  return (
    <View
      style={[
        styles.statChip,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
        },
        style,
      ]}
    >
      {Icon && (
        <Icon color={variantStyle.textColor} size={16} />
      )}
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: variantStyle.textColor }]}>
          {value}
        </Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Sizes.radiusSm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
});

/* End of file components/ui/SDStatusChip.tsx */