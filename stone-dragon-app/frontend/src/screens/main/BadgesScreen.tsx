import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Award, Lock } from 'lucide-react-native';
import {
  GradientBackground,
  SDCard,
  GlassmorphicCard,
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface Badge {
  id: string;
  name: string;
  description: string;
  requiredHours: number;
  currentHours: number;
  isEarned: boolean;
  icon?: string;
}

/**
 * BadgesScreen - Display earned and available badges
 * Shows progress towards unlocking achievement badges
 */
export default function BadgesScreen() {
  // Mock badge data - replace with actual API call
  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Log your first volunteer hour',
      requiredHours: 1,
      currentHours: 24,
      isEarned: true,
    },
    {
      id: '2',
      name: 'Dedicated Volunteer',
      description: 'Complete 10 hours of volunteering',
      requiredHours: 10,
      currentHours: 24,
      isEarned: true,
    },
    {
      id: '3',
      name: 'Community Champion',
      description: 'Complete 25 hours of volunteering',
      requiredHours: 25,
      currentHours: 24,
      isEarned: false,
    },
    {
      id: '4',
      name: 'Super Volunteer',
      description: 'Complete 50 hours of volunteering',
      requiredHours: 50,
      currentHours: 24,
      isEarned: false,
    },
    {
      id: '5',
      name: 'Hero of the Community',
      description: 'Complete 100 hours of volunteering',
      requiredHours: 100,
      currentHours: 24,
      isEarned: false,
    },
    {
      id: '6',
      name: 'Consistency King',
      description: 'Volunteer for 7 consecutive days',
      requiredHours: 0,
      currentHours: 0,
      isEarned: false,
    },
  ];

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
        >
          <Text style={styles.pageTitle}>Your Badges</Text>

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
                    {Math.round((earnedBadges.length / badges.length) * 100)}%
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
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
});
