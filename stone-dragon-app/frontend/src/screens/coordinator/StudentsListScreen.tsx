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
import { Search, User, School as SchoolIcon } from 'lucide-react-native';
import {
  GradientBackground,
  SDCard,
  GlassmorphicCard,
} from '../../components/ui';
import StudentDetailModal from '../../components/admin/StudentDetailModal';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface Student {
  id: string;
  name: string;
  email: string;
  school: string;
  grade?: string;
  age?: number;
  lastActive?: string;
  totalHours: number;
  dayStreak?: number;
  points?: number;
  pendingHours?: number;
  approvedHours?: number;
  rejectedHours?: number;
}

/**
 * StudentsListScreen - Student management
 * View all students with their volunteer statistics
 */
export default function StudentsListScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock students data
  const students: Student[] = [
    { 
      id: '1', 
      name: 'Alex Smith', 
      email: 'alex.smith@studentuct.ac.za', 
      school: 'Cape Town High School',
      grade: 'Grade 11',
      age: 16,
      lastActive: '2 days ago',
      totalHours: 42,
      dayStreak: 5,
      points: 850,
      pendingHours: 3, 
      approvedHours: 39,
      rejectedHours: 0
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@example.com', 
      school: 'Wynberg Girls High',
      grade: 'Grade 12',
      age: 17,
      lastActive: '1 day ago',
      totalHours: 38,
      dayStreak: 12,
      points: 920,
      pendingHours: 2.5, 
      approvedHours: 35.5,
      rejectedHours: 0
    },
    { 
      id: '3', 
      name: 'Michael Chen', 
      email: 'mchen@wynberg.edu', 
      school: 'Wynberg High School',
      grade: 'Grade 10',
      age: 15,
      lastActive: '5 hours ago',
      totalHours: 62,
      dayStreak: 8,
      points: 1240,
      pendingHours: 0, 
      approvedHours: 60,
      rejectedHours: 2
    },
    { 
      id: '4', 
      name: 'Emma Wilson', 
      email: 'emma@example.com', 
      school: 'Cape Town High School',
      grade: 'Grade 11',
      age: 16,
      lastActive: '3 days ago',
      totalHours: 27,
      dayStreak: 3,
      points: 540,
      pendingHours: 5, 
      approvedHours: 22,
      rejectedHours: 0
    },
    { 
      id: '5', 
      name: 'James Brown', 
      email: 'james@example.com', 
      school: 'Stellenbosch High School',
      grade: 'Grade 12',
      age: 18,
      lastActive: '1 week ago',
      totalHours: 51,
      dayStreak: 0,
      points: 1020,
      pendingHours: 4, 
      approvedHours: 47,
      rejectedHours: 0
    },
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleStudentPress = (student: Student) => {
    console.log('Student pressed:', student.name);
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      onPress={() => {
        console.log('TouchableOpacity pressed for:', item.name);
        handleStudentPress(item);
      }}
      activeOpacity={0.7}
      style={styles.studentCard}
    >
      <View style={styles.studentContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <View style={styles.schoolRow}>
            <SchoolIcon color={Colors.textSecondary} size={14} />
            <Text style={styles.studentSchool}>{item.school}</Text>
          </View>
        </View>
      </View>
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

        {/* Student Detail Modal */}
        <StudentDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          student={selectedStudent}
        />
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
    borderRadius: Sizes.radiusLg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.deepPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.light,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  studentSchool: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    fontWeight: '500',
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

