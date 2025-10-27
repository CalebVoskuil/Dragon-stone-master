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
  ActivityIndicator,
  Chip,
  Button,
  Menu,
  Divider,
  Surface,
} from 'react-native-paper';
import { format } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { VolunteerLog } from '../../types';
import { theme } from '../../theme/theme';
import { spacing } from '../../constants/Sizes';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface UserStats {
  totalLogs: number;
  pendingLogs: number;
  approvedLogs: number;
  rejectedLogs: number;
  totalHours: number;
}

const MyLogsScreen: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<VolunteerLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<VolunteerLog[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');

  const loadLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch user statistics (all logs)
      const statsResponse = await apiService.getUserStats();
      if (statsResponse.success && statsResponse.data) {
        setUserStats(statsResponse.data);
      }
      
      // Fetch paginated logs for display (with higher limit to show more logs)
      const response = await apiService.getVolunteerLogs({ limit: 50 });
      if (response.success && response.data) {
        setLogs(response.data);
        setFilteredLogs(response.data);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
      Alert.alert('Error', 'Failed to load volunteer logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  }, [loadLogs]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.status === selectedFilter));
    }
  }, [logs, selectedFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'rejected':
        return '#F44336';
      default:
        return theme.colors.outline;
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#E8F5E8';
      case 'pending':
        return '#FFF3E0';
      case 'rejected':
        return '#FFEBEE';
      default:
        return theme.colors.surface;
    }
  };

  const getFilterLabel = (filter: FilterStatus) => {
    switch (filter) {
      case 'all':
        return 'All Logs';
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'All Logs';
    }
  };


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {/* Stats Section */}
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title>Your Volunteer Summary</Title>
              <View style={styles.statsRow}>
                <Surface style={styles.statItem}>
                  <Text style={styles.statNumber}>{userStats?.totalHours || 0}</Text>
                  <Text style={styles.statLabel}>Total Hours</Text>
                </Surface>
                <Surface style={styles.statItem}>
                  <Text style={styles.statNumber}>{userStats?.approvedLogs || 0}</Text>
                  <Text style={styles.statLabel}>Approved</Text>
                </Surface>
                <Surface style={styles.statItem}>
                  <Text style={styles.statNumber}>{userStats?.pendingLogs || 0}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </Surface>
              </View>
            </Card.Content>
          </Card>

          {/* Filter Section */}
          <Card style={styles.filterCard}>
            <Card.Content>
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by Status:</Text>
                <Menu
                  visible={filterMenuVisible}
                  onDismiss={() => setFilterMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setFilterMenuVisible(true)}
                      style={styles.filterButton}
                      contentStyle={styles.filterButtonContent}
                    >
                      {getFilterLabel(selectedFilter)}
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setSelectedFilter('all');
                      setFilterMenuVisible(false);
                    }}
                    title="All Logs"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedFilter('pending');
                      setFilterMenuVisible(false);
                    }}
                    title="Pending"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedFilter('approved');
                      setFilterMenuVisible(false);
                    }}
                    title="Approved"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedFilter('rejected');
                      setFilterMenuVisible(false);
                    }}
                    title="Rejected"
                  />
                </Menu>
              </View>
            </Card.Content>
          </Card>

          {/* Logs List */}
          {filteredLogs.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>No Logs Found</Text>
                <Paragraph style={styles.emptyText}>
                  {selectedFilter === 'all'
                    ? "You haven't logged any volunteer hours yet."
                    : `No ${selectedFilter} logs found.`}
                </Paragraph>
                {selectedFilter === 'all' && (
                  <Button
                    mode="contained"
                    onPress={() => {/* Navigate to LogHours */}}
                    style={styles.emptyButton}
                  >
                    Log Your First Hours
                  </Button>
                )}
              </Card.Content>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} style={styles.logCard}>
                <Card.Content>
                  <View style={styles.logHeader}>
                    <View style={styles.logTitleRow}>
                      <Text style={styles.logHours}>{log.hours}h</Text>
                      <Chip
                        mode="outlined"
                        compact
                        style={[
                          styles.statusChip,
                          {
                            backgroundColor: getStatusBackgroundColor(log.status),
                            borderColor: getStatusColor(log.status),
                          },
                        ]}
                        textStyle={{ color: getStatusColor(log.status) }}
                      >
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Chip>
                    </View>
                    <Text style={styles.logDate}>
                      {format(new Date(log.date), 'MMM dd, yyyy')}
                    </Text>
                  </View>

                  <Paragraph style={styles.logDescription}>
                    {log.description}
                  </Paragraph>

                  {log.school && (
                    <View style={styles.schoolInfo}>
                      <Text style={styles.schoolLabel}>School:</Text>
                      <Text style={styles.schoolName}>{log.school.name}</Text>
                    </View>
                  )}

                  {log.coordinatorComment && (
                    <View style={styles.commentContainer}>
                      <Divider style={styles.commentDivider} />
                      <Text style={styles.commentLabel}>Coordinator Comment:</Text>
                      <Paragraph style={styles.commentText}>
                        {log.coordinatorComment}
                      </Paragraph>
                    </View>
                  )}

                  {log.reviewedAt && (
                    <Text style={styles.reviewedDate}>
                      Reviewed: {format(new Date(log.reviewedAt), 'MMM dd, yyyy')}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
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
  filterCard: {
    marginBottom: spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  filterButton: {
    minWidth: 120,
  },
  filterButtonContent: {
    justifyContent: 'space-between',
  },
  logCard: {
    marginBottom: spacing.md,
  },
  logHeader: {
    marginBottom: spacing.sm,
  },
  logTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logHours: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statusChip: {
    height: 28,
  },
  logDate: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  logDescription: {
    marginBottom: spacing.sm,
    color: theme.colors.onSurface,
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  schoolLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginRight: spacing.xs,
  },
  schoolName: {
    fontSize: 14,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  commentContainer: {
    marginTop: spacing.sm,
  },
  commentDivider: {
    marginBottom: spacing.sm,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  commentText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  reviewedDate: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
  emptyCard: {
    marginTop: spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
});

export default MyLogsScreen;
