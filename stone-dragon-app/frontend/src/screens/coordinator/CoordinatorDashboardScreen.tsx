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
import { Settings, Bell } from 'lucide-react-native';
import {
  GradientBackground,
  GlassmorphicCard,
  SDButton,
} from '../../components/ui';
import SDClaimCard from '../../components/admin/SDClaimCard';
import SDStatGrid from '../../components/admin/SDStatGrid';
import ClaimDetailModal from '../../components/admin/ClaimDetailModal';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/api';

/**
 * CoordinatorDashboardScreen - Main coordinator dashboard
 * Shows pending claims, statistics, and quick actions
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
    totalStudents: 0,
    totalHours: 0,
    avgResponseTime: '0',
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

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
        
        // Calculate today's claims from recent logs
        const todayClaims = (data.recentLogs || []).filter((log) => {
          const logDate = new Date(log.createdAt);
          const today = new Date();
          return logDate.toDateString() === today.toDateString();
        }).length;

        // Get unique students count
        const uniqueStudents = new Set(
          (data.recentLogs || []).map(log => log.userId)
        ).size;

        // Map statistics to SDStatGrid format
        setStats({
          pending: data.statistics.pendingLogs,
          today: todayClaims,
          approved: data.statistics.approvedLogs,
          totalStudents: uniqueStudents,
          totalHours: data.statistics.totalHours,
          avgResponseTime: '2', // Placeholder - could be calculated from log review times
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

  // Filter logs from the last 24 hours
  const recentClaims = recentLogs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  });

  const pendingCount = stats.pending;

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
        {/* Fixed Header with Blur */}
        <BlurView intensity={60} tint="light" style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile' as never)}
              style={styles.headerButton}
            >
              <Settings color={Colors.deepPurple} size={20} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Claims</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications' as never)}
              style={styles.headerButton}
            >
              <Bell color={Colors.deepPurple} size={20} />
              {pendingCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
              <SDStatGrid stats={stats} />

            {/* Recent Claims List */}
            <View style={styles.claimsList}>
              <Text style={styles.sectionTitle}>
                Recent
              </Text>
              {recentClaims.length > 0 ? (
                recentClaims.map((log) => (
                  <View key={log.id}>{renderClaim({ item: log })}</View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No recent claims</Text>
                  <Text style={styles.emptyDescription}>
                    No claims have been submitted in the last 24 hours.
                  </Text>
                </View>
              )}
            </View>
          </GlassmorphicCard>
          )}
        </ScrollView>

        {/* Claim Detail Modal */}
        <ClaimDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          claim={selectedClaim}
          onApprove={handleApprove}
          onReject={handleReject}
        />
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
    paddingBottom: spacing.xxl,
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
