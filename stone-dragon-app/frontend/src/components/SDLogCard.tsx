import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme/theme';
import { SDCard } from './SDCard';
import { SDStatusChip } from './SDStatusChip';
import { SDButton } from './SDButton';

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
  style?: ViewStyle;
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
  style,
}) => {
  return (
    <SDCard variant="elevated" padding="md" style={[styles.logCard, style]}>
      <View style={styles.logHeader}>
        <Text style={styles.studentName}>{studentName}</Text>
        <SDStatusChip status={status} size="sm" />
      </View>
      
      <View style={styles.logDetails}>
        <Text style={styles.schoolText}>{school}</Text>
        <Text style={styles.hoursText}>{hours} hour{hours !== 1 ? 's' : ''}</Text>
        <Text style={styles.dateText}>{submittedAt}</Text>
        {notes && <Text style={styles.notesText}>"{notes}"</Text>}
      </View>
      
      {showActions && status === 'pending' && (
        <View style={styles.actionButtons}>
          <SDButton
            variant="ghost"
            size="sm"
            onPress={onViewProof}
            style={styles.viewProofButton}
          >
            View Proof
          </SDButton>
          <View style={styles.approveRejectButtons}>
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
    </SDCard>
  );
};

const styles = StyleSheet.create({
  logCard: {
    marginBottom: spacing.md,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  studentName: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    flex: 1,
  },
  logDetails: {
    marginBottom: spacing.sm,
  },
  schoolText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  hoursText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewProofButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  approveRejectButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default SDLogCard;
