/**
 *
 */

/**
 *
 */
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
  Modal,
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
  FileText,
  X,
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
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
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
    // Show Claims option only for Student Coordinators
    ...(user?.role === 'STUDENT_COORDINATOR' ? [{
      icon: FileText,
      label: 'Claims',
      onPress: () => (navigation as any).navigate('StudentCoordinatorClaims'),
    }] : []),
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
      onPress: () => setPrivacyPolicyVisible(true),
    },
  ];

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
                {user?.role === 'STUDENT' ? 'Student' : user?.role === 'STUDENT_COORDINATOR' ? 'Student Coordinator' : user?.role}
              </Text>

              <View style={styles.userDetails}>
                <View style={styles.userDetail}>
                  <View style={styles.detailIcon}>
                    <Mail color={Colors.textSecondary} size={16} />
                  </View>
                  <Text style={styles.userDetailText}>{user?.email || 'No email'}</Text>
                </View>

                <View style={styles.userDetail}>
                  <View style={styles.detailIcon}>
                    <School color={Colors.textSecondary} size={16} />
                  </View>
                  <Text style={styles.userDetailText}>
                    {typeof user?.school === 'string' 
                      ? user.school 
                      : (user?.school as any)?.name || 'No school'}
                  </Text>
                </View>
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
              <View style={styles.logoutTextContainer}>
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            </SDButton>

            <Text style={styles.version}>Version 1.0.0</Text>
          </GlassmorphicCard>
          )}
        </ScrollView>

        {/* Privacy Policy Modal */}
        <Modal
          visible={privacyPolicyVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setPrivacyPolicyVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <GlassmorphicCard intensity={95} style={styles.modalCard}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Shield color={Colors.deepPurple} size={24} />
                  <Text style={styles.modalTitle}>Privacy Policy</Text>
                  <TouchableOpacity 
                    onPress={() => setPrivacyPolicyVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <X color={Colors.textSecondary} size={24} />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView 
                  style={styles.modalContent}
                  showsVerticalScrollIndicator={true}
                  indicatorStyle="default"
                >
                  <Text style={styles.policyTitle}>Stone Dragon App – POPIA Privacy Policy</Text>
                  <Text style={styles.policyDate}>Effective Date: 28 October 2025</Text>
                  <Text style={styles.policyDate}>Last Updated: 28 October 2025</Text>

                  <Text style={styles.sectionHeading}>1. Introduction</Text>
                  <Text style={styles.policyText}>
                    Stone Dragon ("we", "our", or "us") is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA), Act No. 4 of 2013.
                  </Text>
                  <Text style={styles.policyText}>
                    This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the Stone Dragon App and related services.
                  </Text>
                  <Text style={styles.policyText}>
                    By using our app, you agree to the terms of this Privacy Policy.
                  </Text>

                  <Text style={styles.sectionHeading}>2. Information We Collect</Text>
                  <Text style={styles.policySubheading}>2.1 Personal Information:</Text>
                  <Text style={styles.policyText}>
                    Full name, email address, mobile number, profile photo (optional), organization or community affiliation.
                  </Text>
                  <Text style={styles.policySubheading}>2.2 Usage and Technical Information:</Text>
                  <Text style={styles.policyText}>
                    Device type, operating system, IP address, app performance data, in-app interactions and preferences.
                  </Text>
                  <Text style={styles.policySubheading}>2.3 Optional Data (with consent):</Text>
                  <Text style={styles.policyText}>
                    Location data for event mapping or camp directions, and media uploads (photos/videos shared through the app).
                  </Text>

                  <Text style={styles.sectionHeading}>3. How We Use Your Information</Text>
                  <Text style={styles.policyText}>
                    We use collected information to register users, manage profiles, facilitate events, process donations, communicate updates, and improve app security. We will never sell, rent, or trade your information.
                  </Text>

                  <Text style={styles.sectionHeading}>4. Data Storage and Protection</Text>
                  <Text style={styles.policyText}>
                    Your information is stored securely on encrypted servers. Access is restricted to authorized Stone Dragon personnel and trusted service providers. Data is retained only as long as necessary or required by law.
                  </Text>

                  <Text style={styles.sectionHeading}>5. Sharing of Information</Text>
                  <Text style={styles.policyText}>
                    We may share limited data with trusted service providers for functionality or as required by law. All partners are bound by confidentiality and data-protection agreements consistent with POPIA.
                  </Text>

                  <Text style={styles.sectionHeading}>6. Your Rights Under POPIA</Text>
                  <Text style={styles.policyText}>
                    You have the right to access, correct, delete, or withdraw consent regarding your information. You can also object to processing and lodge complaints with the Information Regulator of South Africa.
                  </Text>
                  <Text style={styles.policyText}>
                    Contact: complaints.IR@justice.gov.za | Website: https://www.justice.gov.za/inforeg/
                  </Text>

                  <Text style={styles.sectionHeading}>7. Children's Privacy</Text>
                  <Text style={styles.policyText}>
                    The Stone Dragon App may include youth programs. We do not knowingly collect personal information from children under 13 without parental consent.
                  </Text>

                  <Text style={styles.sectionHeading}>8. Policy Updates</Text>
                  <Text style={styles.policyText}>
                    We may update this policy periodically to reflect changes in our practices or legal requirements.
                  </Text>

                  <Text style={styles.sectionHeading}>9. Contact Us</Text>
                  <Text style={styles.policyText}>Stone Dragon (Non-Profit Organisation)</Text>
                  <Text style={styles.policyText}>• Cape Town, South Africa</Text>
                  <Text style={styles.policyText}>• privacy@stonedragon.org.za</Text>
                  <Text style={styles.policyText}>• +27 21 555 9083</Text>
                </ScrollView>

                {/* Close Button */}
                <SDButton
                  variant="primary-filled"
                  onPress={() => setPrivacyPolicyVisible(false)}
                  style={styles.modalButton}
                >
                  Close
                </SDButton>
              </GlassmorphicCard>
            </View>
          </View>
        </Modal>
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
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
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
    alignItems: 'flex-start',
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailIcon: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetailText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  logoutTextContainer: {
    transform: [{ translateY: -2 }], // Raise text to align with icon
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
  },
  modalCard: {
    padding: spacing.xl,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.h2,
    color: Colors.text,
    flex: 1,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  modalContent: {
    maxHeight: 500,
    marginBottom: spacing.lg,
  },
  policyTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  policyDate: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sectionHeading: {
    fontSize: Sizes.fontMd,
    fontWeight: '700',
    color: Colors.deepPurple,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  policySubheading: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  policyText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    lineHeight: Sizes.fontSm * 1.6,
    marginBottom: spacing.sm,
  },
  modalButton: {
    marginTop: spacing.md,
  },
});
