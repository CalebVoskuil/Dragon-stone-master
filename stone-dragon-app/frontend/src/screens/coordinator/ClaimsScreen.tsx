import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  GlassmorphicCard,
} from '../../components/ui';
import SDClaimCard from '../../components/admin/SDClaimCard';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

/**
 * ClaimsScreen - Detailed claims management
 * Full-screen claims triage with search and filters
 */
export default function ClaimsScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  // Mock claims data
  const allClaims = [
    { id: '1', studentName: 'Alex Smith', claimId: '#CLM001', date: '2 hours ago', hours: 3, description: 'Helped teach basic computer skills', status: 'pending' as const },
    { id: '2', studentName: 'Sarah Johnson', claimId: '#CLM002', date: '5 hours ago', hours: 2.5, description: 'Beach cleanup at Camps Bay', status: 'pending' as const },
    { id: '3', studentName: 'Michael Chen', claimId: '#CLM003', date: '1 day ago', hours: 4, description: 'Helped renovate playground equipment', status: 'approved' as const },
    { id: '4', studentName: 'Emma Wilson', claimId: '#CLM004', date: '1 day ago', hours: 2, description: 'Food bank distribution', status: 'approved' as const },
    { id: '5', studentName: 'James Brown', claimId: '#CLM005', date: '2 days ago', hours: 3.5, description: 'Teaching at community center', status: 'rejected' as const },
    { id: '6', studentName: 'Lisa Anderson', claimId: '#CLM006', date: '3 hours ago', hours: 5, description: 'Animal shelter volunteering', status: 'pending' as const },
  ];

  const filteredClaims = allClaims.filter((claim) => {
    const matchesSearch = claim.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    console.log('Approve claim:', id);
  };

  const handleReject = (id: string) => {
    console.log('Reject claim:', id);
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

  const handleBulkApprove = () => {
    console.log('Bulk approve:', selectedClaims);
    setSelectionMode(false);
    setSelectedClaims([]);
  };

  const handleBulkReject = () => {
    console.log('Bulk reject:', selectedClaims);
    setSelectionMode(false);
    setSelectedClaims([]);
  };

  const renderClaim = ({ item }: { item: typeof allClaims[0] }) => (
    <SDClaimCard
      {...item}
      isSelected={selectedClaims.includes(item.id)}
      onSelect={handleSelect}
      onApprove={handleApprove}
      onReject={handleReject}
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
          <FlatList
            data={filteredClaims}
            renderItem={renderClaim}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No claims found</Text>
                <Text style={styles.emptyDescription}>
                  {searchTerm ? 'Try adjusting your search' : 'No claims match the selected filter'}
                </Text>
              </View>
            }
          />
        </GlassmorphicCard>
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
});

