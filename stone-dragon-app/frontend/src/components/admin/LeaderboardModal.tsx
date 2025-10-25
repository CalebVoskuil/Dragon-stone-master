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
import { BlurView } from 'expo-blur';
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
        return <Medal color="#C0C0C0" size={24} />;
      case 3:
        return <Medal color="#CD7F32" size={24} />;
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
    >
      <BlurView intensity={60} tint="dark" style={styles.modalOverlay}>
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

            {/* Leaderboard List */}
            <ScrollView 
              style={styles.scrollView} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {leaderboard.map((entry) => (
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
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    paddingTop: spacing.xxl,
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
    elevation: 10,
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
    backgroundColor: `${Colors.golden}20`,
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
    backgroundColor: Colors.deepPurple,
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
    color: Colors.light,
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

