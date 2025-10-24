import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Trophy, Medal, Award } from 'lucide-react-native';
import {
  GradientBackground,
  SDCard,
  GlassmorphicCard,
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  school: string;
  hours: number;
  badgesEarned: number;
}

/**
 * LeaderboardScreen - Top volunteers ranking
 * Shows students ranked by volunteer hours
 */
export default function LeaderboardScreen() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', rank: 1, name: 'Michael Chen', school: 'University of Cape Town', hours: 62, badgesEarned: 8 },
    { id: '2', rank: 2, name: 'James Brown', school: 'Stellenbosch University', hours: 51, badgesEarned: 7 },
    { id: '3', rank: 3, name: 'Alex Smith', school: 'Cape Town High School', hours: 45, badgesEarned: 6 },
    { id: '4', rank: 4, name: 'Sarah Johnson', school: 'Wynberg Girls High', hours: 38, badgesEarned: 5 },
    { id: '5', rank: 5, name: 'Emma Wilson', school: 'Cape Town High School', hours: 27, badgesEarned: 4 },
    { id: '6', rank: 6, name: 'Lisa Anderson', school: 'Rondebosch Girls High', hours: 24, badgesEarned: 3 },
    { id: '7', rank: 7, name: 'David Martinez', school: 'Stellenbosch University', hours: 21, badgesEarned: 3 },
    { id: '8', rank: 8, name: 'Sophie Taylor', school: 'University of Cape Town', hours: 19, badgesEarned: 2 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy color={Colors.golden} size={24} />;
    if (rank === 2) return <Medal color="#C0C0C0" size={24} />;
    if (rank === 3) return <Medal color="#CD7F32" size={24} />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return Colors.golden;
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return Colors.textSecondary;
  };

  const renderEntry = ({ item }: { item: LeaderboardEntry }) => (
    <SDCard variant="elevated" padding="md" style={styles.entryCard}>
      <View style={styles.entryContent}>
        <View style={styles.rankContainer}>
          {getRankIcon(item.rank) || (
            <Text style={[styles.rankNumber, { color: getRankColor(item.rank) }]}>
              #{item.rank}
            </Text>
          )}
        </View>

        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.schoolName}>{item.school}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.hoursValue}>{item.hours}h</Text>
            <Text style={styles.hoursLabel}>Hours</Text>
          </View>
          <View style={styles.badgesContainer}>
            <Award color={Colors.golden} size={16} />
            <Text style={styles.badgesCount}>{item.badgesEarned}</Text>
          </View>
        </View>
      </View>
    </SDCard>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          <View style={styles.header}>
            <Trophy color={Colors.deepPurple} size={32} />
            <Text style={styles.title}>Leaderboard</Text>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.periodButton, period === p && styles.periodButtonActive]}
              >
                <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                  This {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Top 3 Podium */}
          <View style={styles.podium}>
            {leaderboard.slice(0, 3).map((entry, index) => (
              <View
                key={entry.id}
                style={[
                  styles.podiumItem,
                  index === 0 && styles.podiumFirst,
                  index === 1 && styles.podiumSecond,
                  index === 2 && styles.podiumThird,
                ]}
              >
                {getRankIcon(entry.rank)}
                <Text style={styles.podiumName} numberOfLines={1}>
                  {entry.name.split(' ')[0]}
                </Text>
                <Text style={styles.podiumHours}>{entry.hours}h</Text>
              </View>
            ))}
          </View>

          {/* Full Leaderboard */}
          <FlatList
            data={leaderboard}
            renderItem={renderEntry}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </GlassmorphicCard>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    margin: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: Colors.text,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.deepPurple,
  },
  periodText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  periodTextActive: {
    color: Colors.light,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  podiumItem: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
    minWidth: 80,
  },
  podiumFirst: {
    backgroundColor: `${Colors.golden}1A`,
    transform: [{ scale: 1.1 }],
  },
  podiumSecond: {
    backgroundColor: 'rgba(192, 192, 192, 0.1)',
  },
  podiumThird: {
    backgroundColor: 'rgba(205, 127, 50, 0.1)',
  },
  podiumName: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.text,
    marginTop: spacing.xs,
  },
  podiumHours: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  entryCard: {
    marginBottom: spacing.sm,
    backgroundColor: Colors.card,
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  schoolName: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  stats: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  statItem: {
    alignItems: 'flex-end',
  },
  hoursValue: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.deepPurple,
  },
  hoursLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgesCount: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.text,
  },
});

