import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  User,
  Mail,
  School,
  Calendar,
  Award,
  Clock,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  Shield,
} from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  SDCard,
  GlassmorphicCard,
} from '../../components/ui';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/api';

/**
 * ProfileScreen - User profile and settings
 * Displays user information and app settings
 */
export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    totalHours: 0,
    totalLogs: 0,
    approvedLogs: 0,
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserStats();
      if (response.success && response.data) {
        setUserStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserStats();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const stats = [
    {
      label: 'Total Hours',
      value: userStats.totalHours,
      icon: Clock,
      color: Colors.deepPurple,
    },
    {
      label: 'Total Logs',
      value: userStats.totalLogs,
      icon: Award,
      color: Colors.golden,
    },
    {
      label: 'Approved',
      value: userStats.approvedLogs,
      icon: Calendar,
      color: Colors.green,
    },
  ];

  const menuItems = [
    {
      icon: Settings,
      label: 'Account Settings',
      onPress: () => console.log('Settings'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      onPress: () => console.log('Notifications'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => console.log('Help'),
    },
    {
      icon: Shield,
      label: 'Privacy Policy',
      onPress: () => console.log('Privacy'),
    },
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.pageTitle}>Profile</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light} />
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : (
            <GlassmorphicCard intensity={80} style={styles.mainCard}>
              {/* User Info Card */}
              <SDCard variant="elevated" padding="lg" style={styles.userCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User color={Colors.light} size={40} />
                </View>
              </View>

              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userRole}>
                {user?.role === 'STUDENT' ? 'Student' : 'Volunteer'}
              </Text>

              <View style={styles.userDetails}>
                <View style={styles.userDetail}>
                  <Mail color={Colors.textSecondary} size={16} />
                  <Text style={styles.userDetailText}>{user?.email || 'No email'}</Text>
                </View>

                {user?.school && (
                  <View style={styles.userDetail}>
                    <School color={Colors.textSecondary} size={16} />
                    <Text style={styles.userDetailText}>{user.school}</Text>
                  </View>
                )}
              </View>
            </SDCard>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <SDCard key={index} variant="elevated" padding="md" style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: `${stat.color}1A` }]}>
                      <Icon color={stat.color} size={20} />
                    </View>
                    <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </SDCard>
                );
              })}
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionTitle}>Settings</Text>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    style={styles.menuItem}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuIcon}>
                        <Icon color={Colors.deepPurple} size={20} />
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <ChevronRight color={Colors.textSecondary} size={20} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Logout Button */}
            <SDButton
              variant="reject"
              fullWidth
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <LogOut color={Colors.light} size={20} />
              <Text style={styles.logoutText}>Logout</Text>
            </SDButton>

            <Text style={styles.version}>Version 1.0.0</Text>
          </GlassmorphicCard>
          )}
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
  userCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.deepPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    ...typography.h1,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  userRole: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginBottom: spacing.md,
  },
  userDetails: {
    width: '100%',
    gap: spacing.sm,
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  userDetailText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  menuSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusMd,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.deepPurple}1A`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  logoutText: {
    color: Colors.light,
    fontSize: Sizes.fontMd,
    fontWeight: '600',
  },
  version: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    textAlign: 'center',
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
});
