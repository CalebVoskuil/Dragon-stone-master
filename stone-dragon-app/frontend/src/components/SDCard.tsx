import React from 'react';
import { Card } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../theme/theme';

interface SDCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  onPress?: () => void;
}

export const SDCard: React.FC<SDCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
  contentStyle,
  onPress,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.card,
      backgroundColor: colors.surface,
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: colors.surface,
        elevation: 0,
        shadowOpacity: 0,
      },
      elevated: {
        backgroundColor: colors.surface,
        ...shadows.sdShadow,
      },
      outlined: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outline,
        elevation: 0,
        shadowOpacity: 0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  const getContentStyle = (): ViewStyle => {
    const paddingStyles: Record<string, ViewStyle> = {
      sm: { padding: spacing.sm },
      md: { padding: spacing.md },
      lg: { padding: spacing.lg },
    };

    return {
      ...paddingStyles[padding],
      ...contentStyle,
    };
  };

  return (
    <Card
      style={getCardStyle()}
      contentStyle={getContentStyle()}
      onPress={onPress}
    >
      {children}
    </Card>
  );
};

// Specialized SDLogCard component for volunteer logs
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.pending;
      case 'approved':
        return colors.accept;
      case 'rejected':
        return colors.reject;
      default:
        return colors.textMuted;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFF3E0';
      case 'approved':
        return '#FFF8E1';
      case 'rejected':
        return '#FFEBEE';
      default:
        return colors.surfaceSecondary;
    }
  };

  return (
    <SDCard variant="elevated" padding="md" style={styles.logCard}>
      <SDCard.Content style={styles.logContent}>
        <SDCard.Title style={styles.logHeader}>
          <SDCard.Title style={styles.studentName}>{studentName}</SDCard.Title>
          <SDCard.Title style={[styles.statusChip, { backgroundColor: getStatusBackgroundColor(status) }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </SDCard.Title>
        </SDCard.Title>
        
        <SDCard.Content style={styles.logDetails}>
          <SDCard.Text style={styles.schoolText}>{school}</SDCard.Text>
          <SDCard.Text style={styles.hoursText}>{hours} hour{hours !== 1 ? 's' : ''}</SDCard.Text>
          <SDCard.Text style={styles.dateText}>{submittedAt}</SDCard.Text>
          {notes && <SDCard.Text style={styles.notesText}>"{notes}"</SDCard.Text>}
        </SDCard.Content>
        
        {showActions && status === 'pending' && (
          <SDCard.Content style={styles.actionButtons}>
            <SDButton
              variant="ghost"
              size="sm"
              onPress={onViewProof}
              style={styles.viewProofButton}
            >
              View Proof
            </SDButton>
            <SDCard.Content style={styles.approveRejectButtons}>
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
            </SDCard.Content>
          </SDCard.Content>
        )}
      </SDCard.Content>
    </SDCard>
  );
};

const styles = StyleSheet.create({
  logCard: {
    marginBottom: spacing.md,
  },
  logContent: {
    padding: 0,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    padding: 0,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    padding: 0,
  },
  statusChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.chip,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textDark,
  },
  logDetails: {
    padding: 0,
    marginBottom: spacing.sm,
  },
  schoolText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  hoursText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: 14,
    color: colors.textDark,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
  },
  viewProofButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  approveRejectButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: 0,
  },
  actionButton: {
    flex: 1,
  },
});

export default SDCard;
