/**
 * @fileoverview Coordinator dashboard screen.
 * Displays statistics, pending claims, and overview for coordinators.
 * 
 * @module screens/coordinator/CoordinatorDashboardScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Trophy, Bell } from 'lucide-react-native';
import {
  GradientBackground,
  GlassmorphicCard,
  GlassmorphicBanner,
  SDButton,
} from '../../components/ui';
import SDClaimCard from '../../components/admin/SDClaimCard';
import SDStatGrid from '../../components/admin/SDStatGrid';
import ClaimDetailModal from '../../components/admin/ClaimDetailModal';
import LeaderboardModal from '../../components/admin/LeaderboardModal';
import NotificationCenterModal from '../../components/admin/NotificationCenterModal';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/api';
import { TrendingUpIcon } from '../../assets/svgs';

/**
 * CoordinatorDashboardScreen - Main coordinator/admin dashboard
 * Coordinators: Shows pending claims, statistics, and quick actions
 * Admins: Shows recently reviewed claims (approved/rejected)
 */
export default function CoordinatorDashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    today: 0,
    approved: 0,
    rejected: 0,
    totalStudents: 0,
    totalHours: 0,
    avgResponseTime: '0',
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [dashboardUserRole, setDashboardUserRole] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getCoordinatorDashboard();

      if (response.success && response.data) {
        const data = response.data;
        
        // Store user role from backend
        setDashboardUserRole(data.userRole || '');
        
        // Map statistics to SDStatGrid format using real backend data
        setStats({
          pending: data.statistics.pendingLogs,
          today: data.statistics.todayLogs,
          approved: data.statistics.approvedLogs,
          rejected: data.statistics.rejectedLogs || 0,
          totalStudents: data.statistics.activeStudents,
          totalHours: data.statistics.totalHours,
          avgResponseTime: data.statistics.approvalRate + '%', // Use approval rate instead
        });
        
        setRecentLogs(data.recentLogs || []);
      }
    } catch (err: any) {
      console.error('Error fetching coordinator dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Use pending logs from backend (already filtered by role)
  const recentClaims = recentLogs;

  // Check if user is admin
  const isAdmin = dashboardUserRole === 'ADMIN' || user?.role === 'ADMIN';

  // Admins don't have pending count in notifications (they only see reviewed claims)
  const pendingCount = isAdmin ? 0 : stats.pending;

  const handleApprove = async (id: string, message: string = '') => {
    try {
      await apiService.reviewVolunteerLog(id, 'approved', message);
      // Refresh data after approval
      await fetchDashboardData();
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    }
  };

  const handleReject = async (id: string, message: string = '') => {
    try {
      await apiService.reviewVolunteerLog(id, 'rejected', message);
      // Refresh data after rejection
      await fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting claim:', error);
      throw error;
    }
  };

  const handleCardPress = (id: string) => {
    const log = recentLogs.find((log) => log.id === id);
    if (log) {
      setSelectedClaim({
        id: log.id,
        studentName: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown',
        hours: log.hours,
        description: log.description,
        date: log.date,
        status: log.status,
        createdAt: log.createdAt,
        coordinatorComment: log.coordinatorComment,
        proofFileName: log.proofFileName,
        proofFilePath: log.proofFilePath,
      });
      setModalVisible(true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderClaim = ({ item }: { item: any }) => (
    <SDClaimCard
      id={item.id}
      studentName={item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown'}
      claimId={`#${item.id.substring(0, 8).toUpperCase()}`}
      date={formatDate(item.createdAt)}
      hours={item.hours}
      description={item.description}
      status={item.status}
      onApprove={handleApprove}
      onReject={handleReject}
      onCardPress={handleCardPress}
    />
  );

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
          {/* This Week Section */}
          <View style={styles.thisWeekContainer}>
            <TrendingUpIcon size={20} color={Colors.deepPurple} />
            <Text style={styles.thisWeekText}>This Week</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.deepPurple} />
              <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <SDButton variant="primary-filled" size="md" onPress={fetchDashboardData}>
                Retry
              </SDButton>
            </View>
          ) : (
            <GlassmorphicCard intensity={100} style={styles.mainCard}>
              {/* Statistics Grid */}
              <SDStatGrid stats={stats} isAdmin={isAdmin} />

            {/* Claims List - Pending for Coordinators, Recent for Admins */}
            <View style={styles.claimsList}>
              <Text style={styles.sectionTitle}>
                {isAdmin 
                  ? `Recent (${recentClaims.length})` 
                  : `Pending Review (${recentClaims.length})`
                }
              </Text>
              {recentClaims.length > 0 ? (
                recentClaims.map((log) => (
                  <View key={log.id}>{renderClaim({ item: log })}</View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>
                    {isAdmin ? 'No recent claims' : 'No pending claims'}
                  </Text>
                  <Text style={styles.emptyDescription}>
                    {isAdmin 
                      ? 'No claims have been reviewed recently. Check back later for updates.'
                      : 'All claims have been reviewed. Check back later for new submissions.'
                    }
                  </Text>
                </View>
              )}
            </View>
          </GlassmorphicCard>
          )}
        </ScrollView>

        {/* Glassmorphic Banner - Fixed at top, content scrolls behind */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : user?.school?.name || 'School'}
            welcomeMessage={`Welcome back, ${user?.firstName || 'Coordinator'}`}
            notificationCount={pendingCount}
            onLeaderboardPress={() => setLeaderboardVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
            userRole={user?.role}
          />
        </View>

        {/* Claim Detail Modal */}
        <ClaimDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          claim={selectedClaim}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Leaderboard Modal */}
        <LeaderboardModal
          visible={leaderboardVisible}
          onClose={() => setLeaderboardVisible(false)}
        />

        {/* Notification Center Modal */}
        <NotificationCenterModal
          visible={notificationVisible}
          onClose={() => setNotificationVisible(false)}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerWrapper: {
    // Fixed at top - content scrolls behind creating blur effect
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
  headerButton: {
    padding: spacing.sm,
    borderRadius: Sizes.radiusFull,
    position: 'relative',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: Colors.deepPurple,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: Sizes.fontXs,
    fontWeight: '600',
    color: Colors.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 130, // Adjusted to bring content slightly higher
    paddingBottom: 100, // Extra padding to ensure bottom content is visible above nav bar
  },
  thisWeekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  thisWeekText: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.deepPurple,
  },
  mainCard: {
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  claimsList: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 400,
  },
  loadingText: {
    ...typography.body,
    color: Colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    minHeight: 400,
  },
  errorText: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

/* End of file screens/coordinator/CoordinatorDashboardScreen.tsx */
