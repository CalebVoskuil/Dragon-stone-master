import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Card } from 'react-native-paper';
import { colors, borderRadius, spacing, typography, shadows } from '../../src/theme/theme';
import { SDStatusChip } from './SDStatusChip';
import { SDButton } from './SDButton';

interface SDCardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
  onPress?: () => void;
  style?: ViewStyle;
}

export const SDCard: React.FC<SDCardProps> = ({
  children,
  padding = 'md',
  variant = 'default',
  onPress,
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.card,
      marginVertical: spacing.xs,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...shadows.card,
          backgroundColor: colors.surface,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.outline,
          backgroundColor: colors.surface,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.surface,
        };
    }
  };

  const getPaddingStyle = (): ViewStyle => {
    switch (padding) {
      case 'sm':
        return { padding: spacing.sm };
      case 'lg':
        return { padding: spacing.lg };
      default:
        return { padding: spacing.md };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={getPaddingStyle()}>
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      <View style={getPaddingStyle()}>
        {children}
      </View>
    </View>
  );
};

interface SDLogCardProps {
  studentName: string;
  school: string;
  hours: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onViewProof?: () => void;
  showActions?: boolean;
}

export const SDLogCard: React.FC<SDLogCardProps> = ({
  studentName,
  school,
  hours,
  status,
  submittedAt,
  notes,
  onApprove,
  onReject,
  onViewProof,
  showActions = false,
}) => {
  return (
    <SDCard variant="elevated" style={styles.logCard}>
      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{studentName}</Text>
            <SDStatusChip status={status} size="sm" />
          </View>
          
          <View style={styles.logDetails}>
            <Text style={styles.detailText}>{school}</Text>
            <Text style={styles.detailText}>
              {hours} hour{hours !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.detailText}>{submittedAt}</Text>
            {notes && (
              <Text style={styles.notesText}>"{notes}"</Text>
            )}
          </View>
        </View>
        
        {showActions && status === 'pending' && (
          <View style={styles.actionsContainer}>
            <SDButton
              variant="ghost"
              size="sm"
              onPress={onViewProof}
              style={styles.viewProofButton}
            >
              View Proof
            </SDButton>
            
            <View style={styles.actionButtons}>
              <SDButton
                variant="accept"
                size="sm"
                onPress={onApprove}
                style={styles.actionButton}
              >
                Approve
              </SDButton>
              <SDButton
                variant="reject"
                size="sm"
                onPress={onReject}
                style={styles.actionButton}
              >
                Reject
              </SDButton>
            </View>
          </View>
        )}
      </View>
    </SDCard>
  );
};

const styles = StyleSheet.create({
  logCard: {
    marginBottom: spacing.md,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flex: 1,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  studentName: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    flex: 1,
  },
  logDetails: {
    gap: spacing.xs,
  },
  detailText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  notesText: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  actionsContainer: {
    marginTop: spacing.md,
    alignItems: 'flex-end',
  },
  viewProofButton: {
    marginBottom: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    minWidth: 80,
  },
});