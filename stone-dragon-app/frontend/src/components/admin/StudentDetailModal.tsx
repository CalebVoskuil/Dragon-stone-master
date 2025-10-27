import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { X, User, School, Award, Clock, TrendingUp, Mail } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface StudentDetailModalProps {
  visible: boolean;
  onClose: () => void;
  student: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    school?: string;
    schoolId?: string;
    grade?: string;
    age?: number;
    lastActive?: string;
    totalHours: number;
    dayStreak?: number;
    points?: number;
    pendingHours?: number;
    approvedHours?: number;
    rejectedHours?: number;
    approvedLogs?: number;
    pendingLogs?: number;
  } | null;
}

/**
 * StudentDetailModal - Modal for viewing detailed student information
 * Shows personal info and volunteer statistics
 */
export default function StudentDetailModal({
  visible,
  onClose,
  student,
}: StudentDetailModalProps) {
  if (!student) return null;

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = student.name || `${student.firstName} ${student.lastName}` || 'Unknown Student';
  const displaySchool = student.school || student.schoolId || 'No school';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <ScrollView 
          style={styles.scrollView} 
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
              {/* Header with Avatar */}
              <View style={styles.header}>
                <View style={styles.avatarLarge}>
                  <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
                </View>
                <Text style={styles.studentName}>{displayName}</Text>
                <View style={styles.emailRow}>
                  <Mail color={Colors.textSecondary} size={14} />
                  <Text style={styles.studentEmail}>{student.email}</Text>
                </View>
              </View>

              {/* Personal Information Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <User color={Colors.deepPurple} size={18} />
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>

                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>School</Text>
                    <Text style={styles.infoValue}>{displaySchool}</Text>
                  </View>

                  {student.grade && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Grade</Text>
                      <Text style={styles.infoValue}>{student.grade}</Text>
                    </View>
                  )}

                  {student.age && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Age</Text>
                      <Text style={styles.infoValue}>{student.age} years old</Text>
                    </View>
                  )}

                  {student.lastActive && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Last Active</Text>
                      <Text style={styles.infoValue}>{student.lastActive}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Volunteer Statistics Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Award color={Colors.deepPurple} size={18} />
                  <Text style={styles.sectionTitle}>Volunteer Statistics</Text>
                </View>

                {/* Primary Stats */}
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: `${Colors.deepPurple}20` }]}>
                      <Clock color={Colors.deepPurple} size={24} />
                    </View>
                    <Text style={[styles.statValue, { color: Colors.deepPurple }]}>
                      {student.totalHours}
                    </Text>
                    <Text style={styles.statLabel}>Total Hours</Text>
                  </View>

                  {student.dayStreak !== undefined && (
                    <View style={styles.statCard}>
                      <View style={[styles.statIconContainer, { backgroundColor: `${Colors.golden}20` }]}>
                        <TrendingUp color={Colors.golden} size={24} />
                      </View>
                      <Text style={[styles.statValue, { color: Colors.golden }]}>
                        {student.dayStreak}
                      </Text>
                      <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                  )}

                  {student.points !== undefined && (
                    <View style={styles.statCard}>
                      <View style={[styles.statIconContainer, { backgroundColor: `${Colors.mediumPurple}20` }]}>
                        <Award color={Colors.mediumPurple} size={24} />
                      </View>
                      <Text style={[styles.statValue, { color: Colors.mediumPurple }]}>
                        {student.points}
                      </Text>
                      <Text style={styles.statLabel}>Points</Text>
                    </View>
                  )}
                </View>

                {/* Hours Breakdown */}
                <View style={styles.hoursBreakdown}>
                  {student.approvedLogs !== undefined && student.approvedLogs > 0 && (
                    <View style={styles.breakdownRow}>
                      <View style={styles.breakdownLeft}>
                        <View style={[styles.breakdownDot, { backgroundColor: Colors.green }]} />
                        <Text style={styles.breakdownLabel}>Approved Logs</Text>
                      </View>
                      <Text style={[styles.breakdownValue, { color: Colors.green }]}>
                        {student.approvedLogs}
                      </Text>
                    </View>
                  )}

                  {student.pendingLogs !== undefined && student.pendingLogs > 0 && (
                    <View style={styles.breakdownRow}>
                      <View style={styles.breakdownLeft}>
                        <View style={[styles.breakdownDot, { backgroundColor: Colors.orange }]} />
                        <Text style={styles.breakdownLabel}>Pending Logs</Text>
                      </View>
                      <Text style={[styles.breakdownValue, { color: Colors.orange }]}>
                        {student.pendingLogs}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // No overlay effect above white panel
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 140, // Space for banner
    paddingBottom: 100, // Space for nav bar
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusXl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5, // Lower elevation to stay behind banner and nav
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    padding: spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusFull,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.deepPurple,
  },
  studentName: {
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  studentEmail: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  hoursBreakdown: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: Sizes.fontSm,
    fontWeight: '700',
  },
});

