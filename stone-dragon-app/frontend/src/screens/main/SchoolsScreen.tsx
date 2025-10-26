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
  TextInput,
  IconButton,
  Surface,
} from 'react-native-paper';

import { apiService } from '../../services/api';
import { School } from '../../types';
import { theme } from '../../theme/theme';
import { spacing } from '../../constants/Sizes';

const SchoolsScreen: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSchools = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getSchools();
      if (response.success && response.data) {
        setSchools(response.data);
        setFilteredSchools(response.data);
      }
    } catch (error) {
      console.error('Error loading schools:', error);
      Alert.alert('Error', 'Failed to load schools');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSchools();
    setRefreshing(false);
  }, [loadSchools]);

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
  }, [schools, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading schools...</Text>
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
              <Title>Participating Schools</Title>
              <Paragraph style={styles.headerSubtitle}>
                Find schools where you can volunteer
              </Paragraph>
            </Card.Content>
          </Card>

          {/* Search */}
          <Card style={styles.searchCard}>
            <Card.Content>
              <TextInput
                label="Search schools"
                mode="outlined"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                right={
                  searchQuery ? (
                    <TextInput.Icon
                      icon="close"
                      onPress={clearSearch}
                    />
                  ) : (
                    <TextInput.Icon icon="magnify" />
                  )
                }
                placeholder="Search by name, address, or email..."
              />
            </Card.Content>
          </Card>

          {/* Results Count */}
          <Surface style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {filteredSchools.length} school{filteredSchools.length !== 1 ? 's' : ''} found
            </Text>
          </Surface>

          {/* Schools List */}
          {filteredSchools.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>No Schools Found</Text>
                <Paragraph style={styles.emptyText}>
                  {searchQuery
                    ? 'No schools match your search criteria.'
                    : 'No schools are currently available.'}
                </Paragraph>
                {searchQuery && (
                  <IconButton
                    icon="refresh"
                    mode="contained"
                    onPress={clearSearch}
                    style={styles.clearButton}
                  />
                )}
              </Card.Content>
            </Card>
          ) : (
            filteredSchools.map((school) => (
              <Card key={school.id} style={styles.schoolCard}>
                <Card.Content>
                  <View style={styles.schoolHeader}>
                    <Text style={styles.schoolName}>{school.name}</Text>
                    {school.isActive ? (
                      <Surface style={styles.activeBadge}>
                        <Text style={styles.activeText}>Active</Text>
                      </Surface>
                    ) : (
                      <Surface style={styles.inactiveBadge}>
                        <Text style={styles.inactiveText}>Inactive</Text>
                      </Surface>
                    )}
                  </View>

                  {school.address && (
                    <View style={styles.infoRow}>
                      <IconButton
                        icon="map-marker"
                        size={16}
                        iconColor={theme.colors.onSurfaceVariant}
                      />
                      <Text style={styles.infoText}>{school.address}</Text>
                    </View>
                  )}

                  {school.contactPhone && (
                    <View style={styles.infoRow}>
                      <IconButton
                        icon="phone"
                        size={16}
                        iconColor={theme.colors.onSurfaceVariant}
                      />
                      <Text style={styles.infoText}>{school.contactPhone}</Text>
                    </View>
                  )}

                  {school.contactEmail && (
                    <View style={styles.infoRow}>
                      <IconButton
                        icon="email"
                        size={16}
                        iconColor={theme.colors.onSurfaceVariant}
                      />
                      <Text style={styles.infoText}>{school.contactEmail}</Text>
                    </View>
                  )}

                  <View style={styles.schoolFooter}>
                    <Text style={styles.schoolId}>ID: {school.id}</Text>
                    <Text style={styles.schoolDate}>
                      Added: {new Date(school.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
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
  headerCard: {
    marginBottom: spacing.md,
  },
  headerSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  searchCard: {
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  resultsContainer: {
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderRadius: 8,
    elevation: 1,
  },
  resultsText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  schoolCard: {
    marginBottom: spacing.md,
  },
  schoolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: spacing.sm,
  },
  activeBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  activeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  inactiveText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: -spacing.sm,
  },
  schoolFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  schoolId: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  schoolDate: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
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
  clearButton: {
    marginTop: spacing.sm,
  },
});

export default SchoolsScreen;
