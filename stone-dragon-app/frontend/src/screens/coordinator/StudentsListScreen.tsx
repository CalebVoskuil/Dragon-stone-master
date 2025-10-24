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
import { Search, User } from 'lucide-react-native';
import {
  GradientBackground,
  SDCard,
  GlassmorphicCard,
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface Student {
  id: string;
  name: string;
  email: string;
  school: string;
  totalHours: number;
  pendingHours: number;
  approvedHours: number;
}

/**
 * StudentsListScreen - Student management
 * View all students with their volunteer statistics
 */
export default function StudentsListScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock students data
  const students: Student[] = [
    { id: '1', name: 'Alex Smith', email: 'alex@example.com', school: 'Cape Town High School', totalHours: 45, pendingHours: 3, approvedHours: 42 },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', school: 'Wynberg Girls High', totalHours: 38, pendingHours: 2.5, approvedHours: 35.5 },
    { id: '3', name: 'Michael Chen', email: 'michael@example.com', school: 'University of Cape Town', totalHours: 62, pendingHours: 0, approvedHours: 62 },
    { id: '4', name: 'Emma Wilson', email: 'emma@example.com', school: 'Cape Town High School', totalHours: 27, pendingHours: 5, approvedHours: 22 },
    { id: '5', name: 'James Brown', email: 'james@example.com', school: 'Stellenbosch University', totalHours: 51, pendingHours: 4, approvedHours: 47 },
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStudent = ({ item }: { item: Student }) => (
    <TouchableOpacity onPress={() => console.log('View student:', item.id)}>
      <SDCard variant="elevated" padding="md" style={styles.studentCard}>
        <View style={styles.studentHeader}>
          <View style={styles.avatar}>
            <User color={Colors.light} size={24} />
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentEmail}>{item.email}</Text>
            <Text style={styles.studentSchool}>{item.school}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.deepPurple }]}>{item.totalHours}</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.orange }]}>{item.pendingHours}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.green }]}>{item.approvedHours}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>
      </SDCard>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          <Text style={styles.title}>Students</Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={Colors.textSecondary} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search students..."
              placeholderTextColor={Colors.textSecondary}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Students List */}
          <FlatList
            data={filteredStudents}
            renderItem={renderStudent}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <User color={Colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>No students found</Text>
                <Text style={styles.emptyDescription}>
                  {searchTerm ? 'Try adjusting your search' : 'No registered students yet'}
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
    marginBottom: spacing.lg,
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
  listContent: {
    paddingBottom: spacing.lg,
  },
  studentCard: {
    marginBottom: spacing.md,
    backgroundColor: Colors.card,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.mediumPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  studentEmail: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  studentSchool: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyDescription: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

