import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Chip,
  ProgressBar,
  Surface,
} from 'react-native-paper';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { BadgeProgress } from '../../types';
import { theme, spacing } from '../../theme/theme';

const BadgesScreen: React.FC = () => {
  const { user } = useAuth();
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const getNextBadge = () => {
    return badgeProgress.find(badge => !badge.isEarned);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading badge progress...</Text>
      </View>
    );
  }

  const earnedCount = getEarnedBadgesCount();
  const nextBadge = getNextBadge();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Summary Card */}
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Title>Your Badge Progress</Title>
              <View style={styles.summaryRow}>
                <Surface style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{totalHours}</Text>
                  <Text style={styles.summaryLabel}>Total Hours</Text>
                </Surface>
                <Surface style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{earnedCount}</Text>
                  <Text style={styles.summaryLabel}>Badges Earned</Text>
                </Surface>
                <Surface style={styles.summaryItem}>
                  <Text style={styles.summaryNumber}>{badgeProgress.length}</Text>
                  <Text style={styles.summaryLabel}>Total Badges</Text>
                </Surface>
              </View>
            </Card.Content>
          </Card>

          {/* Next Badge Card */}
          {nextBadge && (
            <Card style={styles.nextBadgeCard}>
              <Card.Content>
                <Title style={styles.nextBadgeTitle}>Next Badge</Title>
                <Text style={styles.nextBadgeName}>{nextBadge.badgeName}</Text>
                <Paragraph style={styles.nextBadgeDescription}>
                  {nextBadge.badgeDescription}
                </Paragraph>
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
                    color={theme.colors.primary}
                    style={styles.progressBar}
                  />
                  <Text style={styles.hoursRemaining}>
                    {nextBadge.hoursRemaining} hours remaining
                  </Text>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* All Badges */}
          <Card style={styles.badgesCard}>
            <Card.Content>
              <Title>All Badges</Title>
              {badgeProgress.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Badges Available</Text>
                  <Paragraph style={styles.emptyText}>
                    Start logging volunteer hours to see available badges!
                  </Paragraph>
                </View>
              ) : (
                badgeProgress.map((badge) => (
                  <View key={badge.badgeId} style={styles.badgeItem}>
                    <View style={styles.badgeHeader}>
                      <View style={styles.badgeTitleContainer}>
                        <Text style={styles.badgeName}>{badge.badgeName}</Text>
                        {badge.isEarned && (
                          <Chip
                            mode="flat"
                            compact
                            style={styles.earnedChip}
                            textStyle={styles.earnedChipText}
                          >
                            Earned!
                          </Chip>
                        )}
                      </View>
                      <Text style={styles.badgeHours}>
                        {badge.requiredHours}h
                      </Text>
                    </View>

                    <Paragraph style={styles.badgeDescription}>
                      {badge.badgeDescription}
                    </Paragraph>

                    <View style={styles.badgeProgress}>
                      <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                          {badge.currentHours}/{badge.requiredHours} hours
                        </Text>
                        <Text style={styles.progressPercentage}>
                          {Math.round(getProgressPercentage(badge.currentHours, badge.requiredHours))}%
                        </Text>
                      </View>
                      <ProgressBar
                        progress={getProgressPercentage(badge.currentHours, badge.requiredHours) / 100}
                        color={badge.isEarned ? '#4CAF50' : theme.colors.primary}
                        style={styles.progressBar}
                      />
                      {!badge.isEarned && (
                        <Text style={styles.hoursRemaining}>
                          {badge.hoursRemaining} hours remaining
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              )}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: theme.colors.onSurfaceVariant,
  },
  summaryCard: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    elevation: 2,
    minWidth: 80,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  nextBadgeCard: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.primaryContainer,
  },
  nextBadgeTitle: {
    color: theme.colors.onPrimaryContainer,
    fontSize: 18,
  },
  nextBadgeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onPrimaryContainer,
    marginBottom: spacing.xs,
  },
  nextBadgeDescription: {
    color: theme.colors.onPrimaryContainer,
    marginBottom: spacing.md,
  },
  nextBadgeProgress: {
    marginTop: spacing.sm,
  },
  badgesCard: {
    marginBottom: spacing.md,
  },
  badgeItem: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  badgeTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginRight: spacing.sm,
  },
  earnedChip: {
    backgroundColor: '#4CAF50',
    height: 24,
  },
  earnedChipText: {
    color: 'white',
    fontSize: 12,
  },
  badgeHours: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  badgeDescription: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  badgeProgress: {
    marginTop: spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.xs,
  },
  hoursRemaining: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'right',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
});

export default BadgesScreen;
