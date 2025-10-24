import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Settings, Bell } from 'lucide-react-native';
import {
  GradientBackground,
  GlassmorphicCard,
} from '../../components/ui';
import SDClaimCard from '../../components/admin/SDClaimCard';
import SDStatGrid from '../../components/admin/SDStatGrid';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';

/**
 * CoordinatorDashboardScreen - Main coordinator dashboard
 * Shows pending claims, statistics, and quick actions
 */
export default function CoordinatorDashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Mock data - replace with actual API calls
  const stats = {
    pending: 8,
    today: 12,
    approved: 45,
    totalStudents: 156,
    totalHours: 1245,
    avgResponseTime: '2.5',
  };

  const mockLogs = [
    {
      id: '1',
      studentName: 'Alex Smith',
      claimId: '#CLM001',
      date: '2 hours ago',
      hours: 3,
      description: 'Helped teach basic computer skills',
      status: 'pending' as const,
    },
    {
      id: '2',
      studentName: 'Sarah Johnson',
      claimId: '#CLM002',
      date: '5 hours ago',
      hours: 2.5,
      description: 'Beach cleanup at Camps Bay',
      status: 'pending' as const,
    },
    {
      id: '3',
      studentName: 'Michael Chen',
      claimId: '#CLM003',
      date: '1 day ago',
      hours: 4,
      description: 'Helped renovate playground equipment',
      status: 'approved' as const,
    },
    {
      id: '4',
      studentName: 'Emma Wilson',
      claimId: '#CLM004',
      date: '1 day ago',
      hours: 2,
      description: 'Food bank distribution',
      status: 'approved' as const,
    },
  ];

  const filteredLogs = mockLogs.filter((log) =>
    statusFilter === 'all' ? true : log.status === statusFilter
  );

  const pendingCount = mockLogs.filter((log) => log.status === 'pending').length;

  const handleApprove = (id: string) => {
    // TODO: Implement approve API call
    console.log('Approve claim:', id);
  };

  const handleReject = (id: string) => {
    // TODO: Implement reject API call
    console.log('Reject claim:', id);
  };

  const handleCardPress = (id: string) => {
    // TODO: Navigate to claim detail screen
    console.log('View claim details:', id);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch fresh data here
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderClaim = ({ item }: { item: typeof mockLogs[0] }) => (
    <SDClaimCard
      id={item.id}
      studentName={item.studentName}
      claimId={item.claimId}
      date={item.date}
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
              onPress={() => navigation.navigate('Settings' as never)}
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
          <GlassmorphicCard intensity={80} style={styles.mainCard}>
            {/* Statistics Grid */}
            <SDStatGrid stats={stats} />

            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setStatusFilter(filter)}
                  style={[
                    styles.filterTab,
                    statusFilter === filter && styles.filterTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      statusFilter === filter && styles.filterTabTextActive,
                    ]}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Claims List */}
            <View style={styles.claimsList}>
              <Text style={styles.sectionTitle}>
                {statusFilter === 'pending' ? 'Pending Claims' : 'All Claims'}
              </Text>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <View key={log.id}>{renderClaim({ item: log })}</View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No claims found</Text>
                  <Text style={styles.emptyDescription}>
                    {statusFilter === 'pending'
                      ? 'All caught up! No pending claims to review.'
                      : 'No claims match the selected filter.'}
                  </Text>
                </View>
              )}
            </View>
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
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
  },
  filterTabActive: {
    backgroundColor: Colors.deepPurple,
  },
  filterTabText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.light,
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
});
