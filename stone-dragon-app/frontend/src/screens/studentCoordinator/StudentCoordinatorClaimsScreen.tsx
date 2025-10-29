/**
 *
 */

/**
 *
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  GlassmorphicCard,
  GlassmorphicBanner,
} from '../../components/ui';
import SDClaimCard from '../../components/admin/SDClaimCard';
import ClaimDetailModal from '../../components/admin/ClaimDetailModal';
import { LeaderboardModal, NotificationCenterModal } from '../../components/admin';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { apiService } from '../../services/api';

/**
 * StudentCoordinatorClaimsScreen - Event claims management for student coordinators
 * Shows only event claims for events where the user is a student coordinator
 */
export default function StudentCoordinatorClaimsScreen() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [allClaims, setAllClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch event claims for assigned events
      const params = statusFilter === 'all' ? {} : { status: statusFilter };
      const response = await apiService.getPendingEventClaims(params);
      
      if (response.success && response.data) {
        setAllClaims(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching claims:', err);
      setError(err.message || 'Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClaims();
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

  const filteredClaims = allClaims.filter((claim) => {
    if (!searchTerm) return true;
    
    const studentName = claim.user ? `${claim.user.firstName} ${claim.user.lastName}` : '';
    const claimId = `#${claim.id.substring(0, 8).toUpperCase()}`;
    const eventTitle = claim.event?.title || '';
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApprove = async (id: string, message: string = '') => {
    try {
      await apiService.reviewEventClaim(id, 'approved', message);
      await fetchClaims();
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    }
  };

  const handleReject = async (id: string, message: string = '') => {
    try {
      await apiService.reviewEventClaim(id, 'rejected', message);
      await fetchClaims();
    } catch (error) {
      console.error('Error rejecting claim:', error);
      throw error;
    }
  };

  const handleCardPress = (id: string) => {
    const claim = allClaims.find((c) => c.id === id);
    if (claim) {
      setSelectedClaim({
        id: claim.id,
        studentName: claim.user ? `${claim.user.firstName} ${claim.user.lastName}` : 'Unknown',
        hours: claim.hours,
        description: claim.description,
        date: claim.date,
        status: claim.status,
        createdAt: claim.createdAt,
        coordinatorComment: claim.coordinatorComment,
        eventTitle: claim.event?.title,
        proofFileName: claim.proofFileName,
      });
      setModalVisible(true);
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedClaims([...selectedClaims, id]);
    } else {
      setSelectedClaims(selectedClaims.filter((claimId) => claimId !== id));
    }
  };

  const handleLongPress = (id: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedClaims([id]);
    }
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(
        selectedClaims.map((claimId) => apiService.reviewEventClaim(claimId, 'approved'))
      );
      await fetchClaims();
      setSelectionMode(false);
      setSelectedClaims([]);
    } catch (error) {
      console.error('Error bulk approving claims:', error);
    }
  };

  const handleBulkReject = async () => {
    try {
      await Promise.all(
        selectedClaims.map((claimId) => apiService.reviewEventClaim(claimId, 'rejected'))
      );
      await fetchClaims();
      setSelectionMode(false);
      setSelectedClaims([]);
    } catch (error) {
      console.error('Error bulk rejecting claims:', error);
    }
  };

  const renderClaim = ({ item }: { item: any }) => (
    <SDClaimCard
      id={item.id}
      studentName={item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown'}
      claimId={`#${item.id.substring(0, 8).toUpperCase()}`}
      hours={item.hours}
      description={item.description}
      date={formatDate(item.createdAt)}
      status={item.status}
      isSelected={selectedClaims.includes(item.id)}
      onSelect={handleSelect}
      onApprove={handleApprove}
      onReject={handleReject}
      onCardPress={handleCardPress}
      onLongPress={handleLongPress}
      selectionMode={selectionMode}
      eventTitle={item.event?.title}
    />
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          {/* Header */}
          <Text style={styles.title}>Event Claims</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={Colors.textSecondary} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by student, claim ID, or event..."
              placeholderTextColor={Colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setStatusFilter(filter)}
                style={[styles.filterTab, statusFilter === filter && styles.filterTabActive]}
              >
                <Text style={[styles.filterTabText, statusFilter === filter && styles.filterTabTextActive]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selection Mode Actions */}
          {selectionMode && selectedClaims.length > 0 && (
            <View style={styles.bulkActions}>
              <Text style={styles.selectedCount}>{selectedClaims.length} selected</Text>
              <View style={styles.bulkButtons}>
                <SDButton variant="accept" size="sm" onPress={handleBulkApprove}>
                  Approve All
                </SDButton>
                <SDButton variant="reject" size="sm" onPress={handleBulkReject}>
                  Reject All
                </SDButton>
                <SDButton variant="ghost" size="sm" onPress={() => { setSelectionMode(false); setSelectedClaims([]); }}>
                  Cancel
                </SDButton>
              </View>
            </View>
          )}

          {/* Claims List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.deepPurple} />
              <Text style={styles.loadingText}>Loading claims...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <SDButton variant="primary-filled" size="md" onPress={fetchClaims}>
                Retry
              </SDButton>
            </View>
          ) : (
            <FlatList
              data={filteredClaims}
              renderItem={renderClaim}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              indicatorStyle="white"
              showsVerticalScrollIndicator={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No claims found</Text>
                  <Text style={styles.emptyDescription}>
                    {searchTerm 
                      ? 'Try adjusting your search' 
                      : statusFilter === 'pending' 
                        ? 'No pending claims to review'
                        : `No ${statusFilter} claims`}
                  </Text>
                </View>
              }
            />
          )}
        </GlassmorphicCard>

        {/* Claim Detail Modal */}
        <ClaimDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          claim={selectedClaim}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : (user?.school as any)?.name || 'School'}
            welcomeMessage="Event Claims"
            notificationCount={filteredClaims.filter(c => c.status === 'pending').length}
            onLeaderboardPress={() => setLeaderboardVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
            userRole={user?.role}
          />
        </View>

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mainCard: {
    flex: 1,
    margin: spacing.lg,
    marginTop: 130, // Space for the banner
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: Colors.text,
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: Sizes.fontMd,
    color: Colors.text,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
  bulkActions: {
    backgroundColor: `${Colors.deepPurple}1A`,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  selectedCount: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.deepPurple,
    marginBottom: spacing.sm,
  },
  bulkButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  listContent: {
    paddingBottom: spacing.lg,
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
    minHeight: 300,
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
    minHeight: 300,
  },
  errorText: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

