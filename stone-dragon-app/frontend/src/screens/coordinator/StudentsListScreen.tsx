import React, { useState, useEffect } from 'react';
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
import { Search, User, School as SchoolIcon, ChevronDown } from 'lucide-react-native';
import {
  GradientBackground,
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
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [schools, setSchools] = useState<any[]>([]);
  const [schoolDropdownVisible, setSchoolDropdownVisible] = useState(false);
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
    setSelectedStudent({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      school: student.school?.name || 'Unknown School',
      totalHours: student.totalHours || 0,
      pendingHours: student.pendingLogs || 0,
      approvedHours: student.approvedLogs || 0,
    });
    setModalVisible(true);
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      onPress={() => handleStudentPress(item)}
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
          <Text style={styles.studentEmail}>{item.email}</Text>
        </View>
        <View style={styles.studentStats}>
          <Text style={styles.hoursText}>{item.totalHours || 0}h</Text>
          <Text style={styles.hoursLabel}>Total</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          <Text style={styles.title}>Students Directory</Text>

          {/* Admin School Filter */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.schoolDropdown}
              onPress={() => setSchoolDropdownVisible(true)}
            >
              <Text style={styles.schoolDropdownLabel}>Select School</Text>
              <View style={styles.schoolDropdownValue}>
                <Text style={styles.schoolDropdownText}>
                  {schoolFilter === 'all' ? 'All Schools' : schools.find(s => s.id === schoolFilter)?.name || 'Select School'}
                </Text>
                <ChevronDown color={Colors.textSecondary} size={20} />
              </View>
            </TouchableOpacity>
          )}

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search color={Colors.textSecondary} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or email..."
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
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  studentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: Sizes.fontMd,
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
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  studentSchool: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginLeft: spacing.xs,
  },
  studentEmail: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  studentStats: {
    alignItems: 'flex-end',
  },
  hoursText: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.deepPurple,
  },
  hoursLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
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

