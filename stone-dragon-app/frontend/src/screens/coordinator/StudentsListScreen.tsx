import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
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
import { apiService } from '../../services/api';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role?: string;
  school?: string;
  schoolId?: string;
  grade?: string;
  age?: number;
  lastActive?: string;
  totalHours: number;
  approvedLogs?: number;
  pendingLogs?: number;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudentsList();
      if (response.success && response.data) {
        // Filter to include only STUDENT and STUDENT_COORDINATOR roles
        const filteredData = response.data.filter((user: any) => 
          user.role === 'STUDENT' || user.role === 'STUDENT_COORDINATOR'
        );
        
        // Map API data to our Student interface
        const mappedStudents: Student[] = filteredData.map((student: any) => ({
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          role: student.role,
          school: typeof student.school === 'object' ? student.school.name : (student.school || student.schoolId || ''),
          totalHours: student.totalHours || 0,
          approvedLogs: student.approvedLogs || 0,
          pendingLogs: student.pendingLogs || 0,
        }));
        setStudents(mappedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };


  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.schoolId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    if (!name) return '??';
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
          <Text style={styles.avatarText}>
            {getInitials(item.name || `${item.firstName} ${item.lastName}`)}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.studentName}>{item.name || `${item.firstName} ${item.lastName}`}</Text>
            {item.role === 'STUDENT_COORDINATOR' && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>COORD</Text>
              </View>
            )}
          </View>
          <View style={styles.schoolRow}>
            <SchoolIcon color={Colors.textSecondary} size={14} />
            <Text style={styles.studentSchool}>{item.school || item.schoolId || 'No school'}</Text>
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

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.deepPurple} />
              <Text style={styles.loadingText}>Loading students...</Text>
            </View>
          ) : (
          /* Students List */
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
          />)}
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  studentName: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
  },
  roleBadge: {
    backgroundColor: Colors.deepPurple,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: Sizes.radiusSm,
  },
  roleText: {
    fontSize: Sizes.fontXs,
    fontWeight: '700',
    color: Colors.light,
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    gap: spacing.md,
  },
  loadingText: {
    fontSize: Sizes.fontMd,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

