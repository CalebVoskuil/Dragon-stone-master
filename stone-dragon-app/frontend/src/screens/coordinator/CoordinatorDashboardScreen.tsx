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
  Button,
  TextInput,
  Chip,
  Surface,
  Divider,
} from 'react-native-paper';
import { format } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { VolunteerLog } from '../../types';
import { theme, spacing } from '../../theme/theme';

interface CoordinatorDashboard {
  totalPendingLogs: number;
  totalApprovedToday: number;
  totalStudents: number;
  schools: Array<{
    id: string;
    name: string;
    pendingLogs: number;
    totalStudents: number;
  }>;
  topVolunteers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    totalHours: number;
  }>;
}

const CoordinatorDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<CoordinatorDashboard | null>(null);
  const [pendingLogs, setPendingLogs] = useState<VolunteerLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewingLogId, setReviewingLogId] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load dashboard stats
      const dashboardResponse = await apiService.getCoordinatorDashboard();
      if (dashboardResponse.success && dashboardResponse.dashboard) {
        setDashboard(dashboardResponse.dashboard);
      }

      // Load pending logs
      const logsResponse = await apiService.getPendingLogs();
      if (logsResponse.success && logsResponse.data) {
        setPendingLogs(logsResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleReviewLog = async (logId: string, status: 'approved' | 'rejected') => {
    try {
      setIsSubmittingReview(true);
      
      const response = await apiService.reviewVolunteerLog(logId, {
        status,
        coordinatorComment: reviewComment.trim() || undefined,
      });

      if (response.success) {
        Alert.alert(
          'Success',
          `Log ${status} successfully!`,
          [
            {
              text: 'OK',
              onPress: () => {
                setReviewingLogId(null);
                setReviewComment('');
                loadDashboardData(); // Refresh data
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to review log');
      }
    } catch (error: any) {
      console.error('Error reviewing log:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to review log'
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const startReview = (logId: string) => {
    setReviewingLogId(logId);
    setReviewComment('');
  };

  const cancelReview = () => {
    setReviewingLogId(null);
    setReviewComment('');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading coordinator dashboard...</Text>
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
          <Card style={styles.headerCard}>
            <Card.Content>
              <Title>Coordinator Dashboard</Title>
              <Paragraph style={styles.headerSubtitle}>
                Welcome, {user?.firstName} {user?.lastName}
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Stats Overview */}
          {dashboard && (
            <Card style={styles.statsCard}>
              <Card.Content>
                <Title>Overview</Title>
                <View style={styles.statsRow}>
                  <Surface style={styles.statItem}>
                    <Text style={styles.statNumber}>{dashboard.totalPendingLogs}</Text>
                    <Text style={styles.statLabel}>Pending Logs</Text>
                  </Surface>
                  <Surface style={styles.statItem}>
                    <Text style={styles.statNumber}>{dashboard.totalApprovedToday}</Text>
                    <Text style={styles.statLabel}>Approved Today</Text>
                  </Surface>
                  <Surface style={styles.statItem}>
                    <Text style={styles.statNumber}>{dashboard.totalStudents}</Text>
                    <Text style={styles.statLabel}>Total Students</Text>
                  </Surface>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Schools Overview */}
          {dashboard && dashboard.schools.length > 0 && (
            <Card style={styles.schoolsCard}>
              <Card.Content>
                <Title>Schools Overview</Title>
                {dashboard.schools.map((school) => (
                  <View key={school.id} style={styles.schoolItem}>
                    <View style={styles.schoolHeader}>
                      <Text style={styles.schoolName}>{school.name}</Text>
                      <Chip
                        mode="outlined"
                        compact
                        style={[
                          styles.pendingChip,
                          { backgroundColor: school.pendingLogs > 0 ? '#FFF3E0' : '#E8F5E8' }
                        ]}
                        textStyle={{
                          color: school.pendingLogs > 0 ? '#FF9800' : '#4CAF50'
                        }}
                      >
                        {school.pendingLogs} pending
                      </Chip>
                    </View>
                    <Text style={styles.schoolStudents}>
                      {school.totalStudents} students
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Top Volunteers */}
          {dashboard && dashboard.topVolunteers.length > 0 && (
            <Card style={styles.volunteersCard}>
              <Card.Content>
                <Title>Top Volunteers</Title>
                {dashboard.topVolunteers.map((volunteer, index) => (
                  <View key={volunteer.id} style={styles.volunteerItem}>
                    <View style={styles.volunteerHeader}>
                      <Text style={styles.volunteerRank}>#{index + 1}</Text>
                      <Text style={styles.volunteerName}>
                        {volunteer.firstName} {volunteer.lastName}
                      </Text>
                      <Text style={styles.volunteerHours}>{volunteer.totalHours}h</Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          {/* Pending Logs */}
          <Card style={styles.logsCard}>
            <Card.Content>
              <Title>Pending Volunteer Logs</Title>
              {pendingLogs.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No Pending Logs</Text>
                  <Paragraph style={styles.emptyText}>
                    All volunteer logs have been reviewed!
                  </Paragraph>
                </View>
              ) : (
                pendingLogs.map((log) => (
                  <View key={log.id} style={styles.logItem}>
                    {reviewingLogId === log.id ? (
                      <View style={styles.reviewContainer}>
                        <Text style={styles.reviewTitle}>Review Log</Text>
                        <Text style={styles.logHours}>{log.hours} hours</Text>
                        <Text style={styles.logDescription}>{log.description}</Text>
                        <Text style={styles.logStudent}>
                          Student: {log.user?.firstName} {log.user?.lastName}
                        </Text>
                        <Text style={styles.logDate}>
                          Date: {format(new Date(log.date), 'MMM dd, yyyy')}
                        </Text>
                        
                        <TextInput
                          label="Comment (Optional)"
                          mode="outlined"
                          value={reviewComment}
                          onChangeText={setReviewComment}
                          multiline
                          numberOfLines={3}
                          style={styles.commentInput}
                          placeholder="Add a comment for the student..."
                        />
                        
                        <View style={styles.reviewButtons}>
                          <Button
                            mode="outlined"
                            onPress={cancelReview}
                            style={styles.reviewButton}
                            disabled={isSubmittingReview}
                          >
                            Cancel
                          </Button>
                          <Button
                            mode="contained"
                            onPress={() => handleReviewLog(log.id, 'rejected')}
                            style={[styles.reviewButton, { backgroundColor: theme.colors.error }]}
                            disabled={isSubmittingReview}
                          >
                            Reject
                          </Button>
                          <Button
                            mode="contained"
                            onPress={() => handleReviewLog(log.id, 'approved')}
                            style={styles.reviewButton}
                            disabled={isSubmittingReview}
                          >
                            Approve
                          </Button>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.logContent}>
                        <View style={styles.logHeader}>
                          <Text style={styles.logHours}>{log.hours} hours</Text>
                          <Chip mode="outlined" compact style={styles.pendingChip}>
                            Pending
                          </Chip>
                        </View>
                        <Text style={styles.logDescription}>{log.description}</Text>
                        <Text style={styles.logStudent}>
                          Student: {log.user?.firstName} {log.user?.lastName}
                        </Text>
                        <Text style={styles.logDate}>
                          Date: {format(new Date(log.date), 'MMM dd, yyyy')}
                        </Text>
                        {log.school && (
                          <Text style={styles.logSchool}>
                            School: {log.school.name}
                          </Text>
                        )}
                        <Button
                          mode="contained"
                          onPress={() => startReview(log.id)}
                          style={styles.reviewButton}
                        >
                          Review
                        </Button>
                      </View>
                    )}
                  </View>
                ))
              )}
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
  headerCard: {
    marginBottom: spacing.md,
  },
  headerSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
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
  schoolsCard: {
    marginBottom: spacing.md,
  },
  schoolItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  schoolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    flex: 1,
  },
  pendingChip: {
    height: 28,
  },
  schoolStudents: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  volunteersCard: {
    marginBottom: spacing.md,
  },
  volunteerItem: {
    marginBottom: spacing.sm,
  },
  volunteerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volunteerRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: spacing.sm,
    minWidth: 30,
  },
  volunteerName: {
    fontSize: 16,
    color: theme.colors.onSurface,
    flex: 1,
  },
  volunteerHours: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  logsCard: {
    marginBottom: spacing.md,
  },
  logItem: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  logContent: {
    // Default log content styles
  },
  reviewContainer: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: spacing.md,
    borderRadius: 8,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logHours: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  logDescription: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: spacing.sm,
  },
  logStudent: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  logDate: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  logSchool: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  commentInput: {
    marginBottom: spacing.md,
  },
  reviewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  emptyContainer: {
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
  },
});

export default CoordinatorDashboardScreen;
