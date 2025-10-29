/**
 *
 */

/**
 *
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  ArrowLeft,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  User,
  Moon,
  Sun,
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

/**
 * SettingsScreen - User settings and preferences
 * Includes notifications, privacy, theme, and account management
 */
export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [privacyModeEnabled, setPrivacyModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <BlurView intensity={60} tint="light" style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft color={Colors.deepPurple} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={styles.headerSpacer} />
          </View>
        </BlurView>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
        >
          <GlassmorphicCard intensity={80} style={styles.mainCard}>
            {/* User Info */}
            <SDCard variant="elevated" padding="lg" style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <User color={Colors.deepPurple} size={24} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  <Text style={styles.userRole}>
                    {user?.role === 'COORDINATOR' ? 'Coordinator' : 'Student'}
                  </Text>
                </View>
              </View>
            </SDCard>

            {/* Notifications */}
            <SDCard padding="lg" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Bell color={Colors.deepPurple} size={20} />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Notifications</Text>
                  <Text style={styles.sectionDescription}>
                    Receive updates about your volunteer hours and badges
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Colors.border, true: Colors.deepPurple }}
                  thumbColor={notificationsEnabled ? Colors.light : Colors.textSecondary}
                />
              </View>
            </SDCard>

            {/* Privacy */}
            <SDCard padding="lg" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Shield color={Colors.deepPurple} size={20} />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Privacy Mode</Text>
                  <Text style={styles.sectionDescription}>
                    Hide your profile from other users
                  </Text>
                </View>
                <Switch
                  value={privacyModeEnabled}
                  onValueChange={setPrivacyModeEnabled}
                  trackColor={{ false: Colors.border, true: Colors.deepPurple }}
                  thumbColor={privacyModeEnabled ? Colors.light : Colors.textSecondary}
                />
              </View>
            </SDCard>

            {/* Theme */}
            <SDCard padding="lg" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  {darkModeEnabled ? (
                    <Moon color={Colors.deepPurple} size={20} />
                  ) : (
                    <Sun color={Colors.deepPurple} size={20} />
                  )}
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Dark Mode</Text>
                  <Text style={styles.sectionDescription}>
                    Switch between light and dark themes
                  </Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: Colors.border, true: Colors.deepPurple }}
                  thumbColor={darkModeEnabled ? Colors.light : Colors.textSecondary}
                />
              </View>
            </SDCard>

            {/* Help & Support */}
            <TouchableOpacity style={styles.actionButton}>
              <SDCard padding="lg" style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <HelpCircle color={Colors.deepPurple} size={20} />
                  <Text style={styles.actionText}>Help & Support</Text>
                </View>
              </SDCard>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity onPress={handleLogout} style={styles.actionButton}>
              <SDCard padding="lg" style={[styles.actionCard, styles.logoutCard]}>
                <View style={styles.actionContent}>
                  <LogOut color={Colors.error} size={20} />
                  <Text style={[styles.actionText, styles.logoutText]}>Logout</Text>
                </View>
              </SDCard>
            </TouchableOpacity>
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
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    backgroundColor: Colors.glassLight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: Sizes.radiusFull,
  },
  headerTitle: {
    ...typography.h2,
    color: Colors.deepPurple,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  mainCard: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: Sizes.radiusFull,
    backgroundColor: `${Colors.deepPurple}1A`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userRole: {
    fontSize: Sizes.fontXs,
    color: Colors.deepPurple,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: Sizes.radiusFull,
    backgroundColor: `${Colors.deepPurple}1A`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  actionButton: {
    marginTop: spacing.sm,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  logoutCard: {
    backgroundColor: `${Colors.error}1A`,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionText: {
    fontSize: Sizes.fontMd,
    fontWeight: '500',
    color: Colors.text,
  },
  logoutText: {
    color: Colors.error,
  },
});
