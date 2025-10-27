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
  Modal,
  ScrollView,
} from 'react-native';
import { Search, Filter, ChevronDown } from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  GlassmorphicCard,
} from '../../components/ui';
import SDClaimCard from '../../components/admin/SDClaimCard';
import ClaimDetailModal from '../../components/admin/ClaimDetailModal';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { apiService } from '../../services/api';
import { useAuth } from '../../store/AuthContext';

/**
 * ClaimsScreen - Detailed claims management
 * Full-screen claims triage with search and filters
 */
export default function ClaimsScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(isAdmin ? 'approved' : 'pending');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [schools, setSchools] = useState<any[]>([]);
  const [schoolDropdownVisible, setSchoolDropdownVisible] = useState(false);
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [allClaims, setAllClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchSchools();
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchClaims();
  }, [statusFilter, schoolFilter]); // Refetch when filters change

  const fetchSchools = async () => {
    try {
      const response = await apiService.getSchools();
      if (response.success && response.data) {
        setSchools(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching schools:', err);
    }
  };

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build params based on filters
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (isAdmin && schoolFilter !== 'all') {
        params.schoolId = schoolFilter;
      }
      
      const response = await apiService.getVolunteerLogs(params);
      
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
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claimId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApprove = async (id: string, message: string = '') => {
    try {
      await apiService.reviewVolunteerLog(id, 'approved', message);
      await fetchClaims();
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    }
  };

  const handleReject = async (id: string, message: string = '') => {
    try {
      await apiService.reviewVolunteerLog(id, 'rejected', message);
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
        selectedClaims.map((claimId) => apiService.reviewVolunteerLog(claimId, 'approved'))
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
        selectedClaims.map((claimId) => apiService.reviewVolunteerLog(claimId, 'rejected'))
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
      date={formatDate(item.createdAt)}
      hours={item.hours}
      description={item.description}
      status={item.status}
      isSelected={selectedClaims.includes(item.id)}
      onSelect={handleSelect}
      onApprove={handleApprove}
      onReject={handleReject}
      onCardPress={handleCardPress}
      onLongPress={handleLongPress}
      selectionMode={selectionMode}
    />
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          {/* Header */}
          <Text style={styles.title}>Claims Management</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={Colors.textSecondary} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or claim ID..."
              placeholderTextColor={Colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Admin School Filter */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.schoolDropdown}
              onPress={() => setSchoolDropdownVisible(true)}
            >
              <Text style={styles.schoolDropdownLabel}>School Filter</Text>
              <View style={styles.schoolDropdownValue}>
                <Text style={styles.schoolDropdownText}>
                  {schoolFilter === 'all' ? 'All Schools' : schools.find(s => s.id === schoolFilter)?.name || 'Select School'}
                </Text>
                <ChevronDown color={Colors.textSecondary} size={20} />
              </View>
            </TouchableOpacity>
          )}

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            {(isAdmin ? ['all', 'approved', 'rejected'] : ['all', 'pending', 'approved', 'rejected']).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setStatusFilter(filter as any)}
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
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No claims found</Text>
                  <Text style={styles.emptyDescription}>
                    {searchTerm ? 'Try adjusting your search' : 'No claims match the selected filter'}
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

        {/* School Dropdown Modal */}
        <Modal
          visible={schoolDropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSchoolDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSchoolDropdownVisible(false)}
          >
            <View style={styles.schoolDropdownModal}>
              <Text style={styles.schoolDropdownTitle}>Select School</Text>
              <ScrollView style={styles.schoolList}>
                <TouchableOpacity
                  style={[styles.schoolOption, schoolFilter === 'all' && styles.schoolOptionActive]}
                  onPress={() => {
                    setSchoolFilter('all');
                    setSchoolDropdownVisible(false);
                  }}
                >
                  <Text style={[styles.schoolOptionText, schoolFilter === 'all' && styles.schoolOptionTextActive]}>
                    All Schools
                  </Text>
                </TouchableOpacity>
                {schools.map((school) => (
                  <TouchableOpacity
                    key={school.id}
                    style={[styles.schoolOption, schoolFilter === school.id && styles.schoolOptionActive]}
                    onPress={() => {
                      setSchoolFilter(school.id);
                      setSchoolDropdownVisible(false);
                    }}
                  >
                    <Text style={[styles.schoolOptionText, schoolFilter === school.id && styles.schoolOptionTextActive]}>
                      {school.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    margin: spacing.lg,
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
  schoolDropdown: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  schoolDropdownLabel: {
    fontSize: Sizes.fontXs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  schoolDropdownValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  schoolDropdownText: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolDropdownModal: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusLg,
    padding: spacing.lg,
    width: '85%',
    maxHeight: '70%',
  },
  schoolDropdownTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: spacing.md,
  },
  schoolList: {
    maxHeight: 400,
  },
  schoolOption: {
    padding: spacing.md,
    borderRadius: Sizes.radiusMd,
    marginBottom: spacing.sm,
    backgroundColor: Colors.background,
  },
  schoolOptionActive: {
    backgroundColor: Colors.deepPurple,
  },
  schoolOptionText: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
    fontWeight: '500',
  },
  schoolOptionTextActive: {
    color: Colors.light,
  },
});

