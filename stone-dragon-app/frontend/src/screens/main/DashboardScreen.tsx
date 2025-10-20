import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Chip,
  Surface,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { VolunteerLog, BadgeProgress } from '../../types';
import { theme, spacing } from '../../theme/theme';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [recentLogs, setRecentLogs] = useState<VolunteerLog[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load recent volunteer logs
      const logsResponse = await apiService.getVolunteerLogs({ limit: 5 });
      if (logsResponse.success && logsResponse.data) {
        setRecentLogs(logsResponse.data);
      }

      // Load badge progress
      if (user?.id) {
        const badgeResponse = await apiService.getBadgeProgress(user.id);
        if (badgeResponse.success && badgeResponse.data) {
          setBadgeProgress(badgeResponse.data.badgeProgress);
          setTotalHours(badgeResponse.data.totalHours);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.greeting}>
              {getGreeting()}, {user?.firstName}!
            </Title>
            <Paragraph style={styles.roleText}>
              {getRoleDisplayName(user?.role || '')}
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Stats Section */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Your Progress</Title>
            <View style={styles.statsRow}>
              <Surface style={styles.statItem}>
                <Text style={styles.statNumber}>{totalHours}</Text>
                <Text style={styles.statLabel}>Total Hours</Text>
              </Surface>
              <Surface style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {recentLogs.filter(log => log.status === 'approved').length}
                </Text>
                <Text style={styles.statLabel}>Approved Logs</Text>
              </Surface>
              <Surface style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {recentLogs.filter(log => log.status === 'pending').length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </Surface>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('LogHours' as never)}
                style={styles.actionButton}
                icon="plus"
              >
                Log Hours
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('MyLogs' as never)}
                style={styles.actionButton}
                icon="list"
              >
                View Logs
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Logs */}
        {recentLogs.length > 0 && (
          <Card style={styles.recentCard}>
            <Card.Content>
              <Title>Recent Activity</Title>
              {recentLogs.map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logHours}>{log.hours}h</Text>
                    <Chip
                      mode="outlined"
                      compact
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor: 
                            log.status === 'approved' ? '#E8F5E8' :
                            log.status === 'pending' ? '#FFF3E0' : '#FFEBEE'
                        }
                      ]}
                    >
                      {log.status}
                    </Chip>
                  </View>
                  <Text style={styles.logDescription} numberOfLines={2}>
                    {log.description}
                  </Text>
                  <Text style={styles.logDate}>
                    {new Date(log.date).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Badge Progress */}
        {badgeProgress.length > 0 && (
          <Card style={styles.badgesCard}>
            <Card.Content>
              <Title>Badge Progress</Title>
              {badgeProgress.slice(0, 3).map((badge) => (
                <View key={badge.badgeId} style={styles.badgeItem}>
                  <View style={styles.badgeHeader}>
                    <Text style={styles.badgeName}>{badge.badgeName}</Text>
                    {badge.isEarned && (
                      <Chip mode="flat" compact style={styles.earnedChip}>
                        Earned!
                      </Chip>
                    )}
                  </View>
                  <Text style={styles.badgeProgress}>
                    {badge.currentHours}/{badge.requiredHours} hours
                  </Text>
                </View>
              ))}
              <Button
                mode="text"
                onPress={() => navigation.navigate('Badges' as never)}
                style={styles.viewAllButton}
              >
                View All Badges
              </Button>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  welcomeCard: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.primary,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roleText: {
    color: 'white',
    opacity: 0.9,
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
  },
  actionsCard: {
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  recentCard: {
    marginBottom: spacing.md,
  },
  logItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logHours: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statusChip: {
    height: 24,
  },
  logDescription: {
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  logDate: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  badgesCard: {
    marginBottom: spacing.md,
  },
  badgeItem: {
    marginBottom: spacing.md,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgeName: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  earnedChip: {
    backgroundColor: theme.colors.primary,
  },
  badgeProgress: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  viewAllButton: {
    marginTop: spacing.sm,
  },
});

export default DashboardScreen;
