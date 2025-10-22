import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  ProgressBar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { BadgeProgress } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { SDCard } from '../../components/SDCard';
import { SDButton } from '../../components/SDButton';
import { SDStatusChip } from '../../components/SDStatusChip';

type BadgeTab = 'earned' | 'in-progress' | 'locked';

const BadgesScreen: React.FC = () => {
  const { user } = useAuth();
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<BadgeTab>('earned');

  const loadBadgeProgress = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await apiService.getBadgeProgress(user.id);
      if (response.success && response.data) {
        setBadgeProgress(response.data.badgeProgress);
        setTotalHours(response.data.totalHours);
      }
    } catch (error) {
      console.error('Error loading badge progress:', error);
      Alert.alert('Error', 'Failed to load badge progress');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBadgeProgress();
    setRefreshing(false);
  }, [loadBadgeProgress]);

  useEffect(() => {
    loadBadgeProgress();
  }, [loadBadgeProgress]);

  const getProgressPercentage = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100);
  };

  const getEarnedBadgesCount = () => {
    return badgeProgress.filter(badge => badge.isEarned).length;
  };

  const getInProgressBadgesCount = () => {
    return badgeProgress.filter(badge => !badge.isEarned && badge.currentHours > 0).length;
  };

  const getLockedBadgesCount = () => {
    return badgeProgress.filter(badge => !badge.isEarned && badge.currentHours === 0).length;
  };

  const getNextBadge = () => {
    return badgeProgress.find(badge => !badge.isEarned);
  };

  const getFilteredBadges = () => {
    switch (activeTab) {
      case 'earned':
        return badgeProgress.filter(badge => badge.isEarned);
      case 'in-progress':
        return badgeProgress.filter(badge => !badge.isEarned && badge.currentHours > 0);
      case 'locked':
        return badgeProgress.filter(badge => !badge.isEarned && badge.currentHours === 0);
      default:
        return badgeProgress;
    }
  };

  const getTabLabel = (tab: BadgeTab) => {
    switch (tab) {
      case 'earned': return 'Earned';
      case 'in-progress': return 'In Progress';
      case 'locked': return 'Locked';
      default: return 'Earned';
    }
  };

  const renderBadgeItem = ({ item }: { item: BadgeProgress }) => (
    <SDCard padding="md" style={styles.badgeCard}>
      <View style={styles.badgeHeader}>
        <View style={styles.badgeIconContainer}>
          <Ionicons 
            name={item.isEarned ? "trophy" : "trophy-outline"} 
            size={32} 
            color={item.isEarned ? colors.accept : colors.textMuted} 
          />
        </View>
        <View style={styles.badgeInfo}>
          <Text style={styles.badgeName}>{item.badgeName}</Text>
          <Text style={styles.badgeDescription}>{item.badgeDescription}</Text>
          <View style={styles.badgeMeta}>
            <Text style={styles.badgeHours}>{item.requiredHours}h required</Text>
            {item.isEarned && (
              <SDStatusChip status="approved" size="sm" />
            )}
          </View>
        </View>
      </View>

      {!item.isEarned && (
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {item.currentHours}/{item.requiredHours} hours
            </Text>
            <Text style={styles.progressPercentage}>
              {Math.round(getProgressPercentage(item.currentHours, item.requiredHours))}%
            </Text>
          </View>
          <ProgressBar
            progress={getProgressPercentage(item.currentHours, item.requiredHours) / 100}
            color={colors.primary}
            style={styles.progressBar}
          />
          {item.currentHours > 0 && (
            <Text style={styles.hoursRemaining}>
              {item.requiredHours - item.currentHours} hours remaining
            </Text>
          )}
        </View>
      )}
    </SDCard>
  );

  const renderEmptyState = () => (
    <SDCard padding="lg" style={styles.emptyCard}>
      <View style={styles.emptyContent}>
        <Ionicons 
          name={activeTab === 'earned' ? 'trophy-outline' : 'lock-closed-outline'} 
          size={64} 
          color={colors.textMuted} 
        />
        <Text style={styles.emptyTitle}>
          {activeTab === 'earned' ? 'No Badges Earned Yet' : 
           activeTab === 'in-progress' ? 'No Badges In Progress' : 
           'No Locked Badges'}
        </Text>
        <Text style={styles.emptyText}>
          {activeTab === 'earned' ? 'Start logging volunteer hours to earn your first badge!' :
           activeTab === 'in-progress' ? 'Complete some volunteer hours to see progress on badges.' :
           'All badges are available to work towards!'}
        </Text>
      </View>
    </SDCard>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading badge progress...</Text>
      </View>
    );
  }

  const earnedCount = getEarnedBadgesCount();
  const inProgressCount = getInProgressBadgesCount();
  const lockedCount = getLockedBadgesCount();
  const nextBadge = getNextBadge();
  const filteredBadges = getFilteredBadges();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Badges</Text>
            <Text style={styles.subtitle}>Track your volunteer achievements</Text>
          </View>

          {/* Stats Overview */}
          <SDCard padding="lg" style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalHours}</Text>
                <Text style={styles.statLabel}>Total Hours</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{earnedCount}</Text>
                <Text style={styles.statLabel}>Earned</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{inProgressCount}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{lockedCount}</Text>
                <Text style={styles.statLabel}>Locked</Text>
              </View>
            </View>
          </SDCard>

          {/* Next Badge Progress */}
          {nextBadge && (
            <SDCard padding="lg" style={styles.nextBadgeCard}>
              <View style={styles.nextBadgeHeader}>
                <View style={styles.nextBadgeIconContainer}>
                  <Ionicons name="trophy-outline" size={24} color={colors.secondary} />
                </View>
                <View style={styles.nextBadgeInfo}>
                  <Text style={styles.nextBadgeTitle}>Next Badge</Text>
                  <Text style={styles.nextBadgeName}>{nextBadge.badgeName}</Text>
                </View>
              </View>
              <View style={styles.nextBadgeProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {nextBadge.currentHours}/{nextBadge.requiredHours} hours
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round(getProgressPercentage(nextBadge.currentHours, nextBadge.requiredHours))}%
                  </Text>
                </View>
                <ProgressBar
                  progress={getProgressPercentage(nextBadge.currentHours, nextBadge.requiredHours) / 100}
                  color={colors.secondary}
                  style={styles.progressBar}
                />
                <Text style={styles.hoursRemaining}>
                  {nextBadge.requiredHours - nextBadge.currentHours} hours remaining
                </Text>
              </View>
            </SDCard>
          )}

          {/* Tab Selector */}
          <SDCard padding="md" style={styles.tabCard}>
            <View style={styles.tabContainer}>
              {(['earned', 'in-progress', 'locked'] as BadgeTab[]).map((tab) => (
                <SDButton
                  key={tab}
                  variant={activeTab === tab ? 'primary-filled' : 'ghost'}
                  size="sm"
                  onPress={() => setActiveTab(tab)}
                  style={styles.tabButton}
                >
                  {getTabLabel(tab)}
                </SDButton>
              ))}
            </View>
          </SDCard>

          {/* Badges List */}
          {filteredBadges.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredBadges}
              renderItem={renderBadgeItem}
              keyExtractor={(item) => item.badgeId}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
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
    textAlign: 'center',
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
    minWidth: 70,
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
    textAlign: 'center',
  },
  nextBadgeCard: {
    marginBottom: spacing.lg,
    backgroundColor: `${colors.secondary}10`,
  },
  nextBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  nextBadgeIconContainer: {
    padding: spacing.sm,
    backgroundColor: `${colors.secondary}20`,
    borderRadius: borderRadius.round,
    marginRight: spacing.md,
  },
  nextBadgeInfo: {
    flex: 1,
  },
  nextBadgeTitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  nextBadgeName: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
  },
  nextBadgeProgress: {
    marginTop: spacing.sm,
  },
  tabCard: {
    marginBottom: spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
  badgeCard: {
    marginBottom: spacing.md,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  badgeIconContainer: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.round,
    marginRight: spacing.md,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  badgeDescription: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  badgeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeHours: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: typography.caption.fontSize,
    color: colors.textDark,
  },
  progressPercentage: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  hoursRemaining: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    textAlign: 'right',
  },
  emptyCard: {
    marginTop: spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default BadgesScreen;
