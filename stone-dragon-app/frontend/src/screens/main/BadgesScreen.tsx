import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Award, Lock } from 'lucide-react-native';
import {
  GradientBackground,
  SDCard,
  GlassmorphicCard,
  SDButton,
  GlassmorphicBanner,
} from '../../components/ui';
import { LeaderboardModal, NotificationCenterModal } from '../../components/admin';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';

interface Badge {
  id: string;
  name: string;
  description: string;
  requiredHours: number;
  currentHours: number;
  isEarned: boolean;
  iconUrl?: string;
}

/**
 * BadgesScreen - Display earned and available badges
 * Shows progress towards unlocking achievement badges
 */
export default function BadgesScreen() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    fetchBadgesData();
  }, [user?.id]);

  const fetchBadgesData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all badges and user progress in parallel
      const [allBadgesResponse, userProgressResponse] = await Promise.all([
        apiService.getBadges(),
        apiService.getBadgeProgress(user.id),
      ]);

      if (allBadgesResponse.success && userProgressResponse.success) {
        const allBadges = allBadgesResponse.data as any[];
        const progressData = userProgressResponse.data as any;
        const earnedBadgeIds = progressData.badgeProgress
          ?.filter((bp: any) => bp.isEarned)
          .map((bp: any) => bp.badgeId) || [];

        // Combine badges with progress data
        const badgesWithProgress = allBadges.map((badge) => ({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          requiredHours: badge.requiredHours,
          currentHours: progressData.totalHours || 0,
          isEarned: earnedBadgeIds.includes(badge.id),
          iconUrl: badge.iconUrl,
        }));

        setBadges(badgesWithProgress);
        setTotalHours(progressData.totalHours || 0);
      }
    } catch (err: any) {
      console.error('Error fetching badges:', err);
      setError(err.message || 'Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBadgesData();
    setRefreshing(false);
  };

  const earnedBadges = badges.filter((b) => b.isEarned);
  const lockedBadges = badges.filter((b) => !b.isEarned);

  const renderBadge = ({ item }: { item: Badge }) => {
    const progress = item.requiredHours > 0
      ? Math.min((item.currentHours / item.requiredHours) * 100, 100)
      : 0;

    return (
      <SDCard variant="elevated" padding="md" style={styles.badgeCard}>
        <View style={styles.badgeHeader}>
          <View
            style={[
              styles.badgeIcon,
              item.isEarned ? styles.badgeIconEarned : styles.badgeIconLocked,
            ]}
          >
            {item.isEarned ? (
              <Award color={Colors.golden} size={32} />
            ) : (
              <Lock color={Colors.textSecondary} size={32} />
            )}
          </View>
          <View style={styles.badgeInfo}>
            <Text
              style={[
                styles.badgeName,
                !item.isEarned && styles.badgeNameLocked,
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.badgeDescription}>{item.description}</Text>
          </View>
        </View>

        {!item.isEarned && item.requiredHours > 0 && (
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.currentHours}/{item.requiredHours} hours
            </Text>
          </View>
        )}

        {item.isEarned && (
          <View style={styles.earnedBadge}>
            <Text style={styles.earnedText}>✓ Earned</Text>
          </View>
        )}
      </SDCard>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.bannerSpacer} />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.deepPurple} />
              <Text style={styles.loadingText}>Loading badges...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <SDButton variant="primary-filled" size="md" onPress={fetchBadgesData}>
                Retry
              </SDButton>
            </View>
          ) : (
            <GlassmorphicCard intensity={80} style={styles.mainCard}>
              {/* Summary Stats */}
              <SDCard variant="elevated" padding="md" style={styles.statsCard}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{earnedBadges.length}</Text>
                    <Text style={styles.statLabel}>Earned</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{badges.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {badges.length > 0 ? Math.round((earnedBadges.length / badges.length) * 100) : 0}%
                    </Text>
                    <Text style={styles.statLabel}>Complete</Text>
                  </View>
                </View>
              </SDCard>

            {/* Earned Badges Section */}
            {earnedBadges.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Earned Badges</Text>
                {earnedBadges.map((badge) => (
                  <View key={badge.id}>{renderBadge({ item: badge })}</View>
                ))}
              </View>
            )}

            {/* Locked Badges Section */}
            {lockedBadges.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Locked Badges</Text>
                {lockedBadges.map((badge) => (
                  <View key={badge.id}>{renderBadge({ item: badge })}</View>
                ))}
              </View>
            )}
          </GlassmorphicCard>
          )}
        </ScrollView>

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : (user?.school as any)?.name || 'Stone Dragon NPO'}
            welcomeMessage="Your Badges"
            onLeaderboardPress={() => setLeaderboardVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
            userRole={user?.role}
          />
        </View>

        {/* Modals */}
        <LeaderboardModal
          visible={leaderboardVisible}
          onClose={() => setLeaderboardVisible(false)}
        />
        <NotificationCenterModal
          visible={notificationVisible}
          onClose={() => setNotificationVisible(false)}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bannerSpacer: {
    height: 130, // Space for the banner
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for nav bar
  },
  pageTitle: {
    ...typography.h1,
    color: Colors.light,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  mainCard: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.deepPurple,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
  },
  badgeCard: {
    backgroundColor: Colors.card,
  },
  badgeHeader: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIconEarned: {
    backgroundColor: `${Colors.golden}1A`,
  },
  badgeIconLocked: {
    backgroundColor: Colors.background,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  badgeNameLocked: {
    color: Colors.textSecondary,
  },
  badgeDescription: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    lineHeight: Sizes.fontSm * 1.4,
  },
  progressSection: {
    marginTop: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Sizes.radiusFull,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.deepPurple,
    borderRadius: Sizes.radiusFull,
  },
  progressText: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  earnedBadge: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: `${Colors.golden}1A`,
    borderRadius: Sizes.radiusFull,
    alignSelf: 'flex-start',
  },
  earnedText: {
    fontSize: Sizes.fontSm,
    color: Colors.golden,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },
  loadingText: {
    ...typography.body,
    color: Colors.light,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    minHeight: 300,
  },
  errorText: {
    ...typography.body,
    color: Colors.light,
    textAlign: 'center',
  },
});
