import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Trophy, Bell } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { SchoolIcon } from '../../assets/svgs';

interface GlassmorphicBannerProps {
  schoolName?: string;
  welcomeMessage?: string;
  subtitle?: string;
  notificationCount?: number;
  onLeaderboardPress?: () => void;
  onNotificationPress?: () => void;
  style?: ViewStyle;
  userRole?: string; // Accepts any role string (ADMIN, COORDINATOR, etc.)
}

/**
 * GlassmorphicBanner - Modern glassmorphic header banner
 * Features a frosted glass effect with school info, welcome message, and actions
 */
export default function GlassmorphicBanner({
  schoolName,
  welcomeMessage = 'Welcome back',
  subtitle,
  notificationCount = 0,
  onLeaderboardPress,
  onNotificationPress,
  style,
  userRole,
}: GlassmorphicBannerProps) {
  const [leaderboardPressed, setLeaderboardPressed] = useState(false);
  const [notificationPressed, setNotificationPressed] = useState(false);

  // Determine if we should show Admin badge or school name
  const showAdminBadge = userRole === 'admin' || userRole === 'ADMIN';

  return (
    <View style={[styles.outerContainer, style]}>
      <BlurView intensity={40} tint="default" style={styles.blurContainer}>
        <View style={styles.contentContainer}>
          {/* Top Row: Leaderboard, School/Admin Badge, Notifications */}
          <View style={styles.topRow}>
            {/* Leaderboard Icon */}
            <TouchableOpacity
              onPress={onLeaderboardPress}
              onPressIn={() => setLeaderboardPressed(true)}
              onPressOut={() => setLeaderboardPressed(false)}
              style={[styles.iconButton, leaderboardPressed && styles.iconButtonPressed]}
              accessibilityLabel="Leaderboard"
              activeOpacity={1}
            >
              <Trophy 
                size={20} 
                color={leaderboardPressed ? Colors.light : Colors.deepPurple} 
                strokeWidth={2.5}
              />
            </TouchableOpacity>

            {/* Admin Badge or School Name */}
            {showAdminBadge ? (
              <View style={styles.adminBadgeContainer}>
                <BlurView intensity={30} tint="light" style={styles.adminBadgeBlur}>
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </BlurView>
              </View>
            ) : schoolName ? (
              <View style={styles.schoolContainer}>
                <SchoolIcon size={16} color={Colors.deepPurple} />
                <Text style={styles.schoolName} numberOfLines={1}>
                  {schoolName}
                </Text>
              </View>
            ) : null}

            {/* Notification Bell */}
            <TouchableOpacity
              onPress={onNotificationPress}
              onPressIn={() => setNotificationPressed(true)}
              onPressOut={() => setNotificationPressed(false)}
              style={[styles.iconButton, notificationPressed && styles.iconButtonPressed]}
              accessibilityLabel={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
              activeOpacity={1}
            >
              <Bell 
                size={20} 
                color={notificationPressed ? Colors.light : Colors.deepPurple}
                strokeWidth={2.5}
              />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Welcome Message - Centered */}
          <Text style={styles.welcomeText}>{welcomeMessage}</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    overflow: 'hidden',
    // Expand to edges - no horizontal margin
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    // Minimal shadow for subtle depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  blurContainer: {
    // Pure blur effect - completely transparent until content passes behind
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl, // Increased padding to avoid system UI (status bar/notch)
    paddingBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg, // More space between top row and welcome text
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    // No background initially
    backgroundColor: 'transparent',
    borderRadius: 18,
    borderWidth: 0,
  },
  iconButtonPressed: {
    backgroundColor: Colors.deepPurple,
    borderWidth: 2,
    borderColor: Colors.deepPurple,
    // Add subtle shadow when pressed
    shadowColor: Colors.deepPurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  schoolContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
  },
  schoolName: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.deepPurple,
    opacity: 0.9,
  },
  adminBadgeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
  },
  adminBadgeBlur: {
    borderRadius: 20, // Circular/pill shape
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(128, 128, 128, 0.15)', // Grey tint for blur
    overflow: 'hidden',
  },
  adminBadgeText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.deepPurple,
    opacity: 0.85,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.orange,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light,
  },
  welcomeText: {
    fontSize: Sizes.fontMd, // Slightly smaller than before (was fontLg)
    fontWeight: '600',
    color: Colors.deepPurple,
    textAlign: 'center', // Centered
  },
  subtitle: {
    fontSize: Sizes.fontSm,
    fontWeight: '500',
    color: Colors.deepPurple,
    opacity: 0.75,
    textAlign: 'center',
  },
});

