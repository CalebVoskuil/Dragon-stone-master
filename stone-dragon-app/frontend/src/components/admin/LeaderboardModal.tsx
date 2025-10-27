import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { X, Trophy, Medal, Award } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  school: string;
  hours: number;
  points: number;
}

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * LeaderboardModal - Modal displaying student leaderboard
 * Shows top volunteers ranked by hours/points
 */
export default function LeaderboardModal({
  visible,
  onClose,
}: LeaderboardModalProps) {
  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', rank: 1, name: 'Michael Chen', school: 'Wynberg High School', hours: 62, points: 1240 },
    { id: '2', rank: 2, name: 'James Brown', school: 'Stellenbosch High School', hours: 51, points: 1020 },
    { id: '3', rank: 3, name: 'Alex Smith', school: 'Cape Town High School', hours: 42, points: 850 },
    { id: '4', rank: 4, name: 'Sarah Johnson', school: 'Wynberg Girls High', hours: 38, points: 920 },
    { id: '5', rank: 5, name: 'Emma Wilson', school: 'Cape Town High School', hours: 27, points: 540 },
  ];

  // Separate top 3 and rest
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy color={Colors.golden} size={24} />;
      case 2:
        return <Medal color="#A8A8A8" size={24} />;
      case 3:
        return <Medal color="#B87333" size={24} />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return Colors.golden;
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return Colors.deepPurple;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <Trophy color={Colors.golden} size={24} />
                </View>
                <Text style={styles.headerTitle}>Leaderboard</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            {/* Subtitle */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Top Volunteers</Text>
            </View>

            {/* Podium for Top 3 */}
            {topThree.length === 3 && (
              <View style={styles.podiumContainer}>
                {/* Bronze - 3rd Place - Left */}
                <View style={styles.podiumPosition}>
                  <View style={[styles.podiumAvatar, styles.podiumAvatarBronze]}>
                    <Text style={styles.podiumAvatarText}>{getInitials(topThree[2].name)}</Text>
                  </View>
                  <Medal color="#B87333" size={16} style={styles.podiumMedal} />
                  <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].name.split(' ')[0]}</Text>
                  <Text style={styles.podiumHours}>{topThree[2].hours}h</Text>
                  <View style={[styles.podiumBase, styles.podiumBronze]}>
                    <Text style={styles.podiumRank}>3</Text>
                  </View>
                </View>

                {/* Gold - 1st Place - Center */}
                <View style={[styles.podiumPosition, styles.podiumFirst]}>
                  <Trophy color={Colors.golden} size={22} style={styles.podiumTrophy} />
                  <View style={[styles.podiumAvatar, styles.podiumAvatarGold]}>
                    <Text style={styles.podiumAvatarText}>{getInitials(topThree[0].name)}</Text>
                  </View>
                  <Text style={styles.podiumName} numberOfLines={1}>{topThree[0].name.split(' ')[0]}</Text>
                  <Text style={styles.podiumHours}>{topThree[0].hours}h</Text>
                  <View style={[styles.podiumBase, styles.podiumGold]}>
                    <Text style={styles.podiumRank}>1</Text>
                  </View>
                </View>

                {/* Silver - 2nd Place - Right */}
                <View style={styles.podiumPosition}>
                  <View style={[styles.podiumAvatar, styles.podiumAvatarSilver]}>
                    <Text style={styles.podiumAvatarText}>{getInitials(topThree[1].name)}</Text>
                  </View>
                  <Medal color="#A8A8A8" size={16} style={styles.podiumMedal} />
                  <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].name.split(' ')[0]}</Text>
                  <Text style={styles.podiumHours}>{topThree[1].hours}h</Text>
                  <View style={[styles.podiumBase, styles.podiumSilver]}>
                    <Text style={styles.podiumRank}>2</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Rest of Leaderboard List */}
            {rest.length > 0 && (
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>Other Rankings</Text>
              </View>
            )}

            <ScrollView 
              style={styles.scrollView} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {rest.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryLeft}>
                    {/* Rank Badge */}
                    <View style={[styles.rankBadge, { backgroundColor: `${getRankColor(entry.rank)}20` }]}>
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <Text style={[styles.rankNumber, { color: getRankColor(entry.rank) }]}>
                          {entry.rank}
                        </Text>
                      )}
                    </View>

                    {/* Avatar */}
                    <View style={[styles.avatar, entry.rank === 1 && styles.avatarFirst]}>
                      <Text style={styles.avatarText}>{getInitials(entry.name)}</Text>
                    </View>

                    {/* Student Info */}
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName}>{entry.name}</Text>
                      <Text style={styles.studentSchool}>{entry.school}</Text>
                    </View>
                  </View>

                  {/* Stats */}
                  <View style={styles.entryRight}>
                    <View style={styles.statBadge}>
                      <Award color={Colors.deepPurple} size={14} />
                      <Text style={styles.statValue}>{entry.hours}h</Text>
                    </View>
                    <Text style={styles.pointsText}>{entry.points} pts</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', // No overlay effect above white panel
    zIndex: 5, // Behind banner (zIndex: 10) and nav bar
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    paddingTop: spacing.xxl,
    zIndex: 5,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Colors.card,
    borderTopLeftRadius: Sizes.radiusXl,
    borderTopRightRadius: Sizes.radiusXl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5, // Lower elevation to stay behind banner and nav
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: Colors.text,
  },
  closeButton: {
    padding: spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusFull,
  },
  subtitleContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: Colors.background,
  },
  subtitle: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.md,
    backgroundColor: Colors.background,
  },
  podiumPosition: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  podiumFirst: {
    // Removed marginBottom to align from bottom
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.deepPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  podiumAvatarGold: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.golden,
    borderWidth: 3,
    borderColor: Colors.golden,
  },
  podiumAvatarSilver: {
    backgroundColor: '#A8A8A8',
    borderColor: '#A8A8A8',
  },
  podiumAvatarBronze: {
    backgroundColor: '#B87333',
    borderColor: '#B87333',
  },
  podiumAvatarText: {
    fontSize: Sizes.fontSm,
    fontWeight: '700',
    color: Colors.light,
  },
  podiumMedal: {
    marginBottom: spacing.xs,
  },
  podiumTrophy: {
    marginBottom: spacing.xs,
    position: 'absolute',
    top: -spacing.md,
  },
  podiumName: {
    fontSize: Sizes.fontXs,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  podiumHours: {
    fontSize: Sizes.fontXs,
    fontWeight: '700',
    color: Colors.deepPurple,
    marginBottom: spacing.xs,
  },
  podiumBase: {
    width: '100%',
    borderTopLeftRadius: Sizes.radiusMd,
    borderTopRightRadius: Sizes.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  podiumGold: {
    height: 80,
    backgroundColor: Colors.golden,
  },
  podiumSilver: {
    height: 64,
    backgroundColor: '#C0C0C0',
  },
  podiumBronze: {
    height: 48,
    backgroundColor: '#CD7F32',
  },
  podiumRank: {
    fontSize: Sizes.fontXl,
    fontWeight: '700',
    color: Colors.light,
  },
  listHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  listHeaderText: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFirst: {
    backgroundColor: Colors.golden,
    borderWidth: 2,
    borderColor: Colors.golden,
  },
  avatarText: {
    fontSize: Sizes.fontSm,
    fontWeight: '700',
    color: Colors.deepPurple,
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
  studentSchool: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  entryRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${Colors.deepPurple}10`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: Sizes.radiusFull,
  },
  statValue: {
    fontSize: Sizes.fontSm,
    fontWeight: '700',
    color: Colors.deepPurple,
  },
  pointsText: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

