import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Plus,
  Clock,
  Award,
  Eye,
  Bell,
  Settings,
} from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  SDCard,
  SDStatusChip,
  GlassmorphicCard,
} from '../../components/ui';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography, shadows } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';

/**
 * DashboardScreen - Main student dashboard
 * Shows stats, recent activity, badges progress, and quick actions
 */
export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const stats = {
    totalHours: user?.totalHours || 24,
    currentStreak: user?.currentStreak || 7,
    totalPoints: user?.totalPoints || 480,
  };

  const recentLogs = [
    {
      id: '1',
      hours: 3,
      status: 'approved' as const,
      submittedAt: '2 days ago',
      notes: 'Helped serve meals at community kitchen',
    },
    {
      id: '2',
      hours: 2.5,
      status: 'pending' as const,
      submittedAt: '5 hours ago',
      notes: 'Beach cleanup at Camps Bay',
    },
    {
      id: '3',
      hours: 4,
      status: 'approved' as const,
      submittedAt: '1 week ago',
      notes: 'Reading program at local library',
    },
  ];

  const nextBadgeProgress = 75;
  const canLogHours = true; // Update based on user consent status

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch fresh data here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Friend';

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Fixed Header with Blur */}
        <BlurView intensity={60} tint="light" style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings' as never)}
              style={styles.headerButton}
            >
              <Settings color={Colors.deepPurple} size={20} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.greeting}>
                {getGreeting()}, {firstName}
              </Text>
              <Text style={styles.headerSubtitle}>Ready to make a difference today?</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications' as never)}
              style={styles.headerButton}
            >
              <Bell color={Colors.deepPurple} size={20} />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <GlassmorphicCard intensity={80} style={styles.mainCard}>
            {/* Stats Overview */}
            <SDCard variant="elevated" padding="lg" style={styles.statsCard}>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.deepPurple }]}>
                    {stats.totalHours}
                  </Text>
                  <Text style={styles.statLabel}>Total Hours</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.golden }]}>
                    {stats.currentStreak}
                  </Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.mediumPurple }]}>
                    {stats.totalPoints}
                  </Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
              </View>
            </SDCard>

            {/* Next Badge Progress */}
            <SDCard padding="md" style={styles.badgeCard}>
              <View style={styles.badgeContent}>
                <View style={styles.badgeIcon}>
                  <Award color={Colors.golden} size={20} />
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeTitle}>Community Champion</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${nextBadgeProgress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{nextBadgeProgress}%</Text>
                  </View>
                  <Text style={styles.badgeHint}>5 more hours to unlock</Text>
                </View>
              </View>
            </SDCard>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <SDButton
                variant="primary-filled"
                fullWidth
                onPress={() => navigation.navigate('LogHours' as never)}
                disabled={!canLogHours}
                style={styles.actionButton}
              >
                <Plus color={Colors.light} size={20} />
                <Text style={styles.actionButtonText}>Log Hours</Text>
              </SDButton>

              <SDButton
                variant="ghost"
                fullWidth
                onPress={() => navigation.navigate('Badges' as never)}
                style={styles.actionButton}
              >
                <Award color={Colors.deepPurple} size={20} />
                <Text style={[styles.actionButtonText, { color: Colors.deepPurple }]}>
                  My Badges
                </Text>
              </SDButton>
            </View>

            {/* Period Selector */}
            <View style={styles.periodSelector}>
              {(['week', 'month', 'year'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.periodButtonTextActive,
                    ]}
                  >
                    This {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent Activity */}
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('MyLogs' as never)}
                  style={styles.viewAllButton}
                >
                  <Eye color={Colors.deepPurple} size={16} />
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>

              {recentLogs.length > 0 ? (
                <View style={styles.logsList}>
                  {recentLogs.map((log) => (
                    <SDCard key={log.id} variant="elevated" padding="md" style={styles.logCard}>
                      <View style={styles.logHeader}>
                        <Text style={styles.logHours}>{log.hours}h</Text>
                        <SDStatusChip status={log.status} size="sm" />
                      </View>
                      <Text style={styles.logNotes} numberOfLines={2}>
                        {log.notes}
                      </Text>
                      <Text style={styles.logTime}>{log.submittedAt}</Text>
                    </SDCard>
                  ))}
                </View>
              ) : (
                <SDCard padding="lg" style={styles.emptyState}>
                  <Clock color={Colors.textSecondary} size={48} />
                  <Text style={styles.emptyTitle}>No activity yet</Text>
                  <Text style={styles.emptyDescription}>
                    Start logging your volunteer hours to see your impact!
                  </Text>
                  <SDButton
                    variant="primary-filled"
                    onPress={() => navigation.navigate('LogHours' as never)}
                    disabled={!canLogHours}
                  >
                    Log Your First Hours
                  </SDButton>
                </SDCard>
              )}
            </View>
          </GlassmorphicCard>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    backgroundColor: Colors.glassLight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: Sizes.radiusFull,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    ...typography.h2,
    color: Colors.deepPurple,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  mainCard: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badgeCard: {
    backgroundColor: `${Colors.golden}1A`,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badgeIcon: {
    padding: spacing.sm,
    backgroundColor: `${Colors.golden}33`,
    borderRadius: Sizes.radiusFull,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Sizes.radiusFull,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.golden,
    borderRadius: Sizes.radiusFull,
  },
  progressText: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  badgeHint: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    height: 64,
    flexDirection: 'column',
    gap: spacing.xs,
  },
  actionButtonText: {
    fontSize: Sizes.fontSm,
    marginTop: spacing.xs,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
  },
  periodButtonActive: {
    backgroundColor: Colors.deepPurple,
  },
  periodButtonText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  periodButtonTextActive: {
    color: Colors.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    textDecorationLine: 'underline',
  },
  logsList: {
    gap: spacing.md,
  },
  logCard: {
    backgroundColor: Colors.card,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logHours: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.deepPurple,
  },
  logNotes: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  logTime: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyDescription: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
