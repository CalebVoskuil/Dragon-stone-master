/**
 *
 */

/**
 *
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Settings, Trophy } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { shadows } from '../../theme/theme';

interface SDTopPillProps {
  onSettingsPress?: () => void;
  onLeaderboardPress?: () => void;
}

/**
 * SDTopPill - Top navigation pill for coordinator screens
 * Contains settings and leaderboard quick access
 */
export default function SDTopPill({ onSettingsPress, onLeaderboardPress }: SDTopPillProps) {
  return (
    <View style={styles.container}>
      {/* Settings Button */}
      <TouchableOpacity
        onPress={onSettingsPress}
        style={styles.button}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Settings"
      >
        <Settings color={Colors.deepPurple} size={24} />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>SD</Text>
        </View>
        <Text style={styles.logoLabel}>Stone Dragon</Text>
      </View>

      {/* Leaderboard Button */}
      <TouchableOpacity
        onPress={onLeaderboardPress}
        style={styles.button}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Leaderboard"
      >
        <Trophy color={Colors.deepPurple} size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 56,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.deepPurple,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    ...shadows.medium,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.deepPurple,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.light,
    fontSize: Sizes.fontSm,
    fontWeight: '600',
  },
  logoLabel: {
    marginLeft: spacing.sm,
    color: Colors.deepPurple,
    fontSize: Sizes.fontMd,
    fontWeight: '600',
  },
});

