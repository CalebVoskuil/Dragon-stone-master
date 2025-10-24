import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
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

/**
 * SettingsScreen - App settings and preferences
 * User account, notifications, and app preferences
 */
export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

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

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <GlassmorphicCard intensity={80} style={styles.mainCard}>
            <Text style={styles.title}>Settings</Text>

            {/* Account Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              
              <SDCard variant="elevated" padding="md" style={styles.profileCard}>
                <View style={styles.profileContent}>
                  <View style={styles.avatar}>
                    <User color={Colors.light} size={32} />
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={styles.profileRole}>Coordinator</Text>
                    <Text style={styles.profileEmail}>{user?.email}</Text>
                  </View>
                </View>
              </SDCard>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <User color={Colors.deepPurple} size={20} />
                  <Text style={styles.menuText}>Edit Profile</Text>
                </View>
                <ChevronRight color={Colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>

              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Bell color={Colors.deepPurple} size={20} />
                  <Text style={styles.menuText}>Push Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: Colors.border, true: Colors.deepPurple }}
                  thumbColor={Colors.light}
                />
              </View>

              <View style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Moon color={Colors.deepPurple} size={20} />
                  <Text style={styles.menuText}>Dark Mode</Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  trackColor={{ false: Colors.border, true: Colors.deepPurple }}
                  thumbColor={Colors.light}
                />
              </View>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Globe color={Colors.deepPurple} size={20} />
                  <Text style={styles.menuText}>Language</Text>
                </View>
                <View style={styles.menuRight}>
                  <Text style={styles.menuValue}>English</Text>
                  <ChevronRight color={Colors.textSecondary} size={20} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Support Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support</Text>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <HelpCircle color={Colors.deepPurple} size={20} />
                  <Text style={styles.menuText}>Help Center</Text>
                </View>
                <ChevronRight color={Colors.textSecondary} size={20} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Shield color={Colors.deepPurple} size={20} />
                  <Text style={styles.menuText}>Privacy Policy</Text>
                </View>
                <ChevronRight color={Colors.textSecondary} size={20} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Shield color={Colors.deepPurple} size={20} />
                  <Text style={styles.menuText}>Terms of Service</Text>
                </View>
                <ChevronRight color={Colors.textSecondary} size={20} />
              </TouchableOpacity>
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
  mainCard: {
    margin: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: Colors.text,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.md,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.md,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.deepPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  profileRole: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusMd,
    marginBottom: spacing.sm,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  menuText: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuValue: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  logoutButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
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
});

