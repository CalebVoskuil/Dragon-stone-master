/**
 *
 */

/**
 *
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { shadows } from '../../theme/theme';

interface SDClaimCardProps {
  id: string;
  studentName: string;
  claimId: string;
  date: string;
  hours: number;
  description: string;
  status?: 'pending' | 'approved' | 'rejected';
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCardPress?: (id: string) => void;
  onLongPress?: (id: string) => void;
  selectionMode?: boolean;
}

/**
 * SDClaimCard - Volunteer hours claim card for coordinators
 * Displays claim information with approve/reject actions
 */
export default function SDClaimCard({
  id,
  studentName,
  claimId,
  date,
  hours,
  description,
  status = 'pending',
  isSelected = false,
  onSelect,
  onApprove,
  onReject,
  onCardPress,
  onLongPress,
  selectionMode = false,
}: SDClaimCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePress = () => {
    if (selectionMode) {
      onSelect?.(id, !isSelected);
    } else {
      onCardPress?.(id);
    }
  };

  const handleLongPress = () => {
    if (!selectionMode) {
      onLongPress?.(id);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
        isSelected && styles.cardSelected,
      ]}
    >
      <View style={styles.cardContent}>
        {/* Checkbox - only show in selection mode */}
        {selectionMode && (
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Check color={Colors.light} size={16} />}
          </View>
        )}

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(studentName)}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.studentName} numberOfLines={1}>
              {studentName}
            </Text>
            <View style={styles.headerRight}>
              {status === 'approved' && (
                <View style={[styles.statusBadge, styles.statusApproved]}>
                  <Text style={styles.statusText}>Approved</Text>
                </View>
              )}
              {status === 'rejected' && (
                <View style={[styles.statusBadge, styles.statusRejected]}>
                  <Text style={styles.statusText}>Rejected</Text>
                </View>
              )}
              <Text style={styles.hours}>{hours}h</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>

        {/* Action Buttons - only show when not in selection mode and status is pending */}
        {!selectionMode && status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => onApprove?.(id)}
              style={[styles.actionButton, styles.approveButton]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Check color={Colors.light} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onReject?.(id)}
              style={[styles.actionButton, styles.rejectButton]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X color={Colors.light} size={18} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusLg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardSelected: {
    backgroundColor: `${Colors.deepPurple}0D`,
    borderWidth: 2,
    borderColor: Colors.deepPurple,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.deepPurple,
    borderColor: Colors.deepPurple,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.deepPurple,
    fontSize: Sizes.fontXs,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  studentName: {
    flex: 1,
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: Sizes.radiusFull,
  },
  statusApproved: {
    backgroundColor: Colors.green,
  },
  statusRejected: {
    backgroundColor: Colors.red,
  },
  statusText: {
    fontSize: Sizes.fontXs,
    color: Colors.light,
    fontWeight: '600',
  },
  hours: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: Colors.golden,
  },
  rejectButton: {
    backgroundColor: Colors.red,
  },
});

