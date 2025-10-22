import React from 'react';
import { Chip, Text } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../theme/theme';

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
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          backgroundColor: '#FFF3E0',
          textColor: colors.pending,
          iconName: 'time-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'approved':
        return {
          label: 'Approved',
          backgroundColor: '#FFF8E1',
          textColor: colors.accept,
          iconName: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          backgroundColor: '#FFEBEE',
          textColor: colors.reject,
          iconName: 'close-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'uploading':
        return {
          label: 'Uploading',
          backgroundColor: '#F3E5F5',
          textColor: colors.primary,
          iconName: 'cloud-upload-outline' as keyof typeof Ionicons.glyphMap,
        };
      default:
        return {
          label: 'Unknown',
          backgroundColor: colors.surfaceSecondary,
          textColor: colors.textMuted,
          iconName: 'help-outline' as keyof typeof Ionicons.glyphMap,
        };
    }
  };

  const config = getStatusConfig(status);
  const iconSize = size === 'sm' ? 12 : 16;

  const getChipStyle = (): ViewStyle => {
    return {
      backgroundColor: config.backgroundColor,
      borderRadius: borderRadius.chip,
      minHeight: size === 'sm' ? 24 : 32,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      ...style,
    };
  };

  const getTextStyle = () => {
    return {
      fontSize: size === 'sm' ? typography.caption.fontSize : typography.body.fontSize,
      fontWeight: '500' as const,
      color: config.textColor,
    };
  };

  return (
    <Chip
      style={getChipStyle()}
      textStyle={getTextStyle()}
      icon={showIcon ? () => (
        <Ionicons 
          name={config.iconName} 
          size={iconSize} 
          color={config.textColor} 
        />
      ) : undefined}
    >
      {config.label}
    </Chip>
  );
};

// SDStatChip component for displaying statistics
interface SDStatChipProps {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
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
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: `${colors.primary}10`,
          borderColor: `${colors.primary}20`,
          textColor: colors.primary,
        };
      case 'accent':
        return {
          backgroundColor: `${colors.secondary}10`,
          borderColor: `${colors.secondary}20`,
          textColor: colors.secondary,
        };
      default:
        return {
          backgroundColor: colors.surfaceSecondary,
          borderColor: colors.outline,
          textColor: colors.textDark,
        };
    }
  };

  const variantStyle = getVariantStyle();
  const iconSize = 16;

  const getChipStyle = (): ViewStyle => {
    return {
      backgroundColor: variantStyle.backgroundColor,
      borderWidth: 1,
      borderColor: variantStyle.borderColor,
      borderRadius: borderRadius.button,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      ...style,
    };
  };

  const getTextStyle = () => {
    return {
      fontSize: typography.body.fontSize,
      fontWeight: '600' as const,
      color: variantStyle.textColor,
    };
  };

  const getLabelStyle = () => {
    return {
      fontSize: typography.caption.fontSize,
      color: colors.textMuted,
    };
  };

  return (
    <Chip
      style={getChipStyle()}
      icon={icon ? () => (
        <Ionicons 
          name={icon} 
          size={iconSize} 
          color={variantStyle.textColor} 
        />
      ) : undefined}
    >
      <Text style={getTextStyle()}>{value}</Text>
      <Text style={getLabelStyle()}>{label}</Text>
    </Chip>
  );
};

const styles = StyleSheet.create({
  // Additional styles if needed
});

export default SDStatusChip;
