import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../../src/theme/theme';

interface SDStatusChipProps {
  status: 'pending' | 'approved' | 'rejected' | 'uploading';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  style?: ViewStyle;
}

export const SDStatusChip: React.FC<SDStatusChipProps> = ({
  status,
  size = 'md',
  showIcon = true,
  style,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          backgroundColor: colors.pending,
          textColor: colors.textDark,
          icon: 'time-outline' as const,
        };
      case 'approved':
        return {
          label: 'Approved',
          backgroundColor: colors.accept,
          textColor: colors.textDark,
          icon: 'checkmark-circle-outline' as const,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          backgroundColor: colors.reject,
          textColor: colors.textLight,
          icon: 'close-circle-outline' as const,
        };
      case 'uploading':
        return {
          label: 'Uploading',
          backgroundColor: colors.primary,
          textColor: colors.textLight,
          icon: 'cloud-upload-outline' as const,
        };
      default:
        return {
          label: 'Unknown',
          backgroundColor: colors.textMuted,
          textColor: colors.textLight,
          icon: 'help-circle-outline' as const,
        };
    }
  };

  const config = getStatusConfig();
  const iconSize = size === 'sm' ? 12 : 16;

  const getChipStyle = (): ViewStyle => ({
    backgroundColor: config.backgroundColor,
    borderRadius: borderRadius.chip,
    minHeight: size === 'sm' ? 24 : 32,
    paddingHorizontal: size === 'sm' ? spacing.xs : spacing.sm,
    paddingVertical: size === 'sm' ? spacing.xs : spacing.sm,
  });

  const getTextStyle = (): TextStyle => ({
    fontSize: size === 'sm' ? typography.caption.fontSize : typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: config.textColor,
  });

  return (
    <View style={[styles.container, getChipStyle(), style]}>
      <View style={styles.content}>
        {showIcon && (
          <Ionicons
            name={config.icon}
            size={iconSize}
            color={config.textColor}
            style={styles.icon}
          />
        )}
        <Text style={getTextStyle()}>
          {config.label}
        </Text>
      </View>
    </View>
  );
};

interface SDStatChipProps {
  label: string;
  value: string | number;
  icon?: string;
  variant?: 'default' | 'primary' | 'accent';
  style?: ViewStyle;
}

export const SDStatChip: React.FC<SDStatChipProps> = ({
  label,
  value,
  icon,
  variant = 'default',
  style,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: `${colors.primary}20`,
          borderColor: `${colors.primary}40`,
        };
      case 'accent':
        return {
          backgroundColor: `${colors.secondary}20`,
          borderColor: `${colors.secondary}40`,
        };
      default:
        return {
          backgroundColor: colors.surfaceSecondary,
          borderColor: colors.outline,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'accent':
        return colors.secondary;
      default:
        return colors.textDark;
    }
  };

  return (
    <View style={[styles.statChip, getVariantStyle(), style]}>
      <View style={styles.statContent}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={16}
            color={getTextColor()}
            style={styles.statIcon}
          />
        )}
        <View style={styles.statTextContainer}>
          <Text style={[styles.statValue, { color: getTextColor() }]}>
            {value}
          </Text>
          <Text style={styles.statLabel}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
  statChip: {
    borderRadius: borderRadius.card,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minWidth: 80,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    marginRight: spacing.sm,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});