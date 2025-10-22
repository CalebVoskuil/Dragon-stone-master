import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { VolunteerLog } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { SDCard } from '../../components/SDCard';
import { SDButton } from '../../components/SDButton';
import { SDStatusChip } from '../../components/SDStatusChip';
import { SDLogCard } from '../../components/SDLogCard';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';
type SortOption = 'recent' | 'oldest' | 'hours';

interface UserStats {
  totalLogs: number;
  pendingLogs: number;
  approvedLogs: number;
  rejectedLogs: number;
  totalHours: number;
}

const MyLogsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [logs, setLogs] = useState<VolunteerLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<VolunteerLog[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('recent');

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

  const sortLogs = useCallback((logsToSort: VolunteerLog[], sortOption: SortOption) => {
    const sorted = [...logsToSort];
    switch (sortOption) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'hours':
        return sorted.sort((a, b) => b.hours - a.hours);
      default:
        return sorted;
    }
  }, []);

  const filterAndSortLogs = useCallback(() => {
    let filtered = logs;
    
    // Apply filter
    if (selectedFilter !== 'all') {
      filtered = logs.filter(log => log.status === selectedFilter);
    }
    
    // Apply sort
    const sorted = sortLogs(filtered, selectedSort);
    setFilteredLogs(sorted);
  }, [logs, selectedFilter, selectedSort, sortLogs]);

  useEffect(() => {
    filterAndSortLogs();
  }, [filterAndSortLogs]);

  const getFilterLabel = (filter: FilterStatus) => {
    switch (filter) {
      case 'all': return 'All Logs';
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'All Logs';
    }
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'recent': return 'Recent';
      case 'oldest': return 'Oldest';
      case 'hours': return 'Hours';
      default: return 'Recent';
    }
  };

  const renderLogItem = ({ item }: { item: VolunteerLog }) => (
    <SDLogCard
      studentName={`${user?.firstName} ${user?.lastName}`}
      school={item.school?.name || 'Unknown School'}
      hours={item.hours}
      status={item.status}
      submittedAt={format(new Date(item.date), 'MMM dd, yyyy')}
      notes={item.description}
      coordinatorComment={item.coordinatorComment}
      reviewedAt={item.reviewedAt}
    />
  );

  const renderEmptyState = () => (
    <SDCard padding="lg" style={styles.emptyCard}>
      <View style={styles.emptyContent}>
        <Ionicons name="document-outline" size={64} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No Logs Found</Text>
        <Text style={styles.emptyText}>
          {selectedFilter === 'all'
            ? "You haven't logged any volunteer hours yet."
            : `No ${selectedFilter} logs found.`}
        </Text>
        {selectedFilter === 'all' && (
          <SDButton
            variant="primary-filled"
            size="lg"
            onPress={() => navigation.navigate('LogHours' as never)}
            style={styles.emptyButton}
            icon="plus"
          >
            Log Your First Hours
          </SDButton>
        )}
      </View>
    </SDCard>
  );


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Logs</Text>
            <Text style={styles.subtitle}>Track your volunteer hours and status</Text>
          </View>

          {/* Stats Overview */}
          <SDCard padding="lg" style={styles.statsCard}>
            <Text style={styles.statsTitle}>Your Summary</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats?.totalHours || 0}</Text>
                <Text style={styles.statLabel}>Total Hours</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats?.approvedLogs || 0}</Text>
                <Text style={styles.statLabel}>Approved</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats?.pendingLogs || 0}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats?.rejectedLogs || 0}</Text>
                <Text style={styles.statLabel}>Rejected</Text>
              </View>
            </View>
          </SDCard>

          {/* Filter and Sort Controls */}
          <SDCard padding="lg" style={styles.controlsCard}>
            <View style={styles.controlsRow}>
              {/* Filter */}
              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Filter:</Text>
                <Menu
                  visible={filterMenuVisible}
                  onDismiss={() => setFilterMenuVisible(false)}
                  anchor={
                    <SDButton
                      variant="ghost"
                      size="md"
                      onPress={() => setFilterMenuVisible(true)}
                      style={styles.controlButton}
                      icon="filter"
                    >
                      {getFilterLabel(selectedFilter)}
                    </SDButton>
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

              {/* Sort */}
              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Sort:</Text>
                <Menu
                  visible={sortMenuVisible}
                  onDismiss={() => setSortMenuVisible(false)}
                  anchor={
                    <SDButton
                      variant="ghost"
                      size="md"
                      onPress={() => setSortMenuVisible(true)}
                      style={styles.controlButton}
                      icon="sort"
                    >
                      {getSortLabel(selectedSort)}
                    </SDButton>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      setSelectedSort('recent');
                      setSortMenuVisible(false);
                    }}
                    title="Recent"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedSort('oldest');
                      setSortMenuVisible(false);
                    }}
                    title="Oldest"
                  />
                  <Menu.Item
                    onPress={() => {
                      setSelectedSort('hours');
                      setSortMenuVisible(false);
                    }}
                    title="Hours"
                  />
                </Menu>
              </View>
            </View>
          </SDCard>

          {/* Logs List */}
          {filteredLogs.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredLogs}
              renderItem={renderLogItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minWidth: 70,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
  },
  controlsCard: {
    marginBottom: spacing.lg,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlGroup: {
    flex: 1,
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  controlButton: {
    minWidth: 100,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
  emptyCard: {
    marginTop: spacing.xl,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
});

export default MyLogsScreen;
