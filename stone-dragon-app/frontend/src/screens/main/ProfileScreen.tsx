import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Surface,
  Avatar,
  Divider,
} from 'react-native-paper';
import { format } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { VolunteerLog } from '../../types';
import { theme, spacing } from '../../theme/theme';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [userLogs, setUserLogs] = useState<VolunteerLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getVolunteerLogs();
      if (response.success && response.data) {
        setUserLogs(response.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  }, [loadUserData]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = async () => {
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
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'VOLUNTEER': return 'Volunteer';
      case 'COORDINATOR': return 'Coordinator';
      case 'ADMIN': return 'Administrator';
      default: return role;
    }
  };

  const getTotalHours = () => {
    return userLogs
      .filter(log => log.status === 'approved')
      .reduce((total, log) => total + log.hours, 0);
  };

  const getStats = () => {
    const approved = userLogs.filter(log => log.status === 'approved').length;
    const pending = userLogs.filter(log => log.status === 'pending').length;
    const rejected = userLogs.filter(log => log.status === 'rejected').length;
    return { approved, pending, rejected };
  };

  const getInitials = () => {
    if (!user?.firstName || !user?.lastName) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const stats = getStats();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Profile Header */}
          <Card style={styles.profileCard}>
            <Card.Content style={styles.profileContent}>
              <Avatar.Text
                size={80}
                label={getInitials()}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Title style={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </Title>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Surface style={styles.roleBadge}>
                  <Text style={styles.roleText}>
                    {getRoleDisplayName(user?.role || '')}
                  </Text>
                </Surface>
              </View>
            </Card.Content>
          </Card>

          {/* Stats Section */}
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title>Your Volunteer Statistics</Title>
              <View style={styles.statsRow}>
                <Surface style={styles.statItem}>
                  <Text style={styles.statNumber}>{getTotalHours()}</Text>
                  <Text style={styles.statLabel}>Total Hours</Text>
                </Surface>
                <Surface style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.approved}</Text>
                  <Text style={styles.statLabel}>Approved</Text>
                </Surface>
                <Surface style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.pending}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </Surface>
              </View>
            </Card.Content>
          </Card>

          {/* Account Information */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title>Account Information</Title>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>User ID:</Text>
                <Text style={styles.infoValue}>{user?.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role:</Text>
                <Text style={styles.infoValue}>{getRoleDisplayName(user?.role || '')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member Since:</Text>
                <Text style={styles.infoValue}>
                  {user?.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={[
                  styles.infoValue,
                  { color: user?.isActive ? '#4CAF50' : '#F44336' }
                ]}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Recent Activity */}
          {userLogs.length > 0 && (
            <Card style={styles.activityCard}>
              <Card.Content>
                <Title>Recent Activity</Title>
                {userLogs.slice(0, 3).map((log) => (
                  <View key={log.id} style={styles.activityItem}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityHours}>{log.hours}h</Text>
                      <Text style={[
                        styles.activityStatus,
                        {
                          color: log.status === 'approved' ? '#4CAF50' :
                                 log.status === 'pending' ? '#FF9800' : '#F44336'
                        }
                      ]}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.activityDescription} numberOfLines={2}>
                      {log.description}
                    </Text>
                    <Text style={styles.activityDate}>
                      {format(new Date(log.date), 'MMM dd, yyyy')}
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Actions */}
          <Card style={styles.actionsCard}>
            <Card.Content>
              <Title>Account Actions</Title>
              <Button
                mode="outlined"
                onPress={() => Alert.alert('Coming Soon', 'Edit profile feature will be available soon.')}
                style={styles.actionButton}
                icon="account-edit"
              >
                Edit Profile
              </Button>
              <Button
                mode="outlined"
                onPress={() => Alert.alert('Coming Soon', 'Change password feature will be available soon.')}
                style={styles.actionButton}
                icon="lock-reset"
              >
                Change Password
              </Button>
              <Divider style={styles.divider} />
              <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.logoutButton}
                icon="logout"
                buttonColor={theme.colors.error}
              >
                Logout
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: theme.colors.onSurfaceVariant,
  },
  profileCard: {
    marginBottom: spacing.md,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
    marginRight: spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: theme.colors.onPrimaryContainer,
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    elevation: 2,
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.onSurface,
    flex: 1,
    textAlign: 'right',
  },
  activityCard: {
    marginBottom: spacing.md,
  },
  activityItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  activityHours: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  activityDate: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  actionsCard: {
    marginBottom: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  divider: {
    marginVertical: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.sm,
  },
});

export default ProfileScreen;
