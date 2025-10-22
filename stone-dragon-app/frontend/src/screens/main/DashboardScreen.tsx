import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { VolunteerLog, BadgeProgress } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { SDCard } from '../../components/SDCard';
import { SDButton } from '../../components/SDButton';
import { SDStatusChip, SDStatChip } from '../../components/SDStatusChip';
import { SDLogCard } from '../../components/SDLogCard';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [recentLogs, setRecentLogs] = useState<VolunteerLog[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load recent volunteer logs
      const logsResponse = await apiService.getVolunteerLogs({ limit: 5 });
      if (logsResponse.success && logsResponse.data) {
        setRecentLogs(logsResponse.data);
      }

      // Load badge progress
      const badgeResponse = await apiService.getBadgeProgress(user?.id || '');
      if (badgeResponse.success && badgeResponse.data) {
        setBadgeProgress(badgeResponse.data.badgeProgress);
        setTotalHours(badgeResponse.data.totalHours);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'VOLUNTEER': return 'Volunteer';
      case 'COORDINATOR': return 'Coordinator';
      case 'ADMIN': return 'Administrator';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.firstName}!
        </Text>
        <Text style={styles.roleText}>
          {getRoleDisplayName(user?.role || '')}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Stats Overview */}
        <SDCard variant="elevated" padding="lg" style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Progress</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalHours}</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {recentLogs.filter(log => log.status === 'approved').length}
              </Text>
              <Text style={styles.statLabel}>Approved Logs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {recentLogs.filter(log => log.status === 'pending').length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </SDCard>

        {/* Next Badge Progress */}
        {badgeProgress.length > 0 && (
          <SDCard padding="md" style={styles.badgeProgressCard}>
            <View style={styles.badgeProgressContent}>
              <View style={styles.badgeIconContainer}>
                <Ionicons name="trophy-outline" size={24} color={colors.secondary} />
              </View>
              <View style={styles.badgeProgressContainer}>
                <Text style={styles.badgeProgressTitle}>Community Champion</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[styles.progressBarFill, { width: '75%' }]}
                    />
                  </View>
                  <Text style={styles.progressText}>75%</Text>
                </View>
                <Text style={styles.badgeProgressSubtitle}>5 more hours to unlock</Text>
              </View>
            </View>
          </SDCard>
        )}

        {/* Quick Actions */}
        <SDCard padding="lg" style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <SDButton
              variant="primary-filled"
              size="lg"
              onPress={() => navigation.navigate('LogHours' as never)}
              style={styles.actionButton}
              icon="plus"
            >
              Log Hours
            </SDButton>
            <SDButton
              variant="ghost"
              size="lg"
              onPress={() => navigation.navigate('MyLogs' as never)}
              style={styles.actionButton}
              icon="format-list-bulleted"
            >
              View Logs
            </SDButton>
          </View>
        </SDCard>

        {/* Recent Logs */}
        {recentLogs.length > 0 && (
          <SDCard padding="lg" style={styles.recentCard}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Activity</Text>
              <SDButton
                variant="ghost"
                size="sm"
                onPress={() => navigation.navigate('MyLogs' as never)}
                icon="eye"
              >
                View All
              </SDButton>
            </View>
            {recentLogs.map((log) => (
              <SDLogCard
                key={log.id}
                studentName={`${user?.firstName} ${user?.lastName}`}
                school={log.school?.name || 'Unknown School'}
                hours={log.hours}
                status={log.status}
                submittedAt={new Date(log.date).toLocaleDateString()}
                notes={log.description}
              />
            ))}
          </SDCard>
        )}

        {/* Badge Progress */}
        {badgeProgress.length > 0 && (
          <SDCard padding="lg" style={styles.badgesCard}>
            <Text style={styles.badgesTitle}>Badge Progress</Text>
            {badgeProgress.slice(0, 3).map((badge) => (
              <View key={badge.badgeId} style={styles.badgeItem}>
                <View style={styles.badgeHeader}>
                  <Text style={styles.badgeName}>{badge.badgeName}</Text>
                  {badge.isEarned && (
                    <SDStatusChip status="approved" size="sm" />
                  )}
                </View>
                <Text style={styles.badgeProgressText}>
                  {badge.currentHours}/{badge.requiredHours} hours
                </Text>
              </View>
            ))}
            <SDButton
              variant="ghost"
              size="sm"
              onPress={() => navigation.navigate('Badges' as never)}
              style={styles.viewAllButton}
            >
              View All Badges
            </SDButton>
          </SDCard>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <SDStatChip
            label="This Month"
            value="12h"
            icon="trending-up"
            variant="primary"
          />
          <SDStatChip
            label="Volunteers"
            value="1,247"
            icon="people"
            variant="default"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingTop: spacing.xxl,
  },
  greeting: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  roleText: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    opacity: 0.9,
  },
  content: {
    padding: spacing.md,
    marginTop: -spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  badgeProgressCard: {
    marginBottom: spacing.lg,
    backgroundColor: `${colors.secondary}10`,
  },
  badgeProgressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badgeIconContainer: {
    padding: spacing.sm,
    backgroundColor: `${colors.secondary}20`,
    borderRadius: borderRadius.round,
  },
  badgeProgressContainer: {
    flex: 1,
  },
  badgeProgressTitle: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.sm,
  },
  progressText: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  badgeProgressSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  actionsCard: {
    marginBottom: spacing.lg,
  },
  actionsTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  recentCard: {
    marginBottom: spacing.lg,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recentTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
  },
  badgesCard: {
    marginBottom: spacing.lg,
  },
  badgesTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  badgeItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeName: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
  },
  badgeProgressText: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  viewAllButton: {
    marginTop: spacing.sm,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default DashboardScreen;
