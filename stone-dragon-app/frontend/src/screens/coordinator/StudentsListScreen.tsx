/**
 * @fileoverview Students list screen for coordinators.
 * Displays list of students with their volunteer hours and statistics.
 * 
 * @module screens/coordinator/StudentsListScreen
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
  Modal,
  ScrollView,
} from 'react-native';
import { Search, User, ChevronDown } from 'lucide-react-native';
import {
  GradientBackground,
  GlassmorphicCard,
  GlassmorphicBanner,
} from '../../components/ui';
import StudentDetailModal from '../../components/admin/StudentDetailModal';
import LeaderboardModal from '../../components/admin/LeaderboardModal';
import NotificationCenterModal from '../../components/admin/NotificationCenterModal';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { apiService } from '../../services/api';
import { useAuth } from '../../store/AuthContext';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school?: {
    id: string;
    name: string;
  };
  schoolId?: string;
  totalHours: number;
  pendingLogs?: number;
  approvedLogs?: number;
}

/**
 * StudentsListScreen - Student management
 * View all students with their volunteer statistics
 */
export default function StudentsListScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<string>('');
  const [schools, setSchools] = useState<any[]>([]);
  const [schoolDropdownVisible, setSchoolDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchSchools();
    } else {
      fetchStudents();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (schoolFilter) {
      fetchStudents();
    }
  }, [schoolFilter]);

  const fetchSchools = async () => {
    try {
      const response = await apiService.getSchools();
      if (response.success && response.data) {
        setSchools(response.data);
        // Auto-select first school for admins
        if (response.data.length > 0 && !schoolFilter) {
          setSchoolFilter(response.data[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching schools:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For admins, don't fetch until a school is selected
      if (isAdmin && !schoolFilter) {
        setLoading(false);
        return;
      }

      const params: any = { limit: 100 };
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (isAdmin && schoolFilter) {
        params.schoolId = schoolFilter;
      }

      const response = await apiService.getStudentsList(params);
      
      if (response.success && response.data) {
        setStudents(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchStudents();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
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
            {getInitials(item.firstName, item.lastName)}
          </Text>
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {item.firstName} {item.lastName}
          </Text>
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
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.bannerSpacer} />
          
          <GlassmorphicCard intensity={80} style={styles.mainCard}>

          {/* Admin School Filter - REQUIRED, NO "ALL SCHOOLS" OPTION */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.schoolDropdown}
              onPress={() => setSchoolDropdownVisible(true)}
            >
              <Text style={styles.schoolDropdownLabel}>Select School</Text>
              <View style={styles.schoolDropdownValue}>
                <Text style={styles.schoolDropdownText}>
                  {schools.find(s => s.id === schoolFilter)?.name || 'Select School'}
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

          {/* Students List */}
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.deepPurple} />
              <Text style={styles.loadingText}>Loading students...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.listContent}>
              {students.map((student) => (
                <React.Fragment key={student.id}>
                  {renderStudent({ item: student })}
                </React.Fragment>
              ))}
              {students.length === 0 && (
                <View style={styles.emptyState}>
                  <User color={Colors.textSecondary} size={48} />
                  <Text style={styles.emptyTitle}>No students found</Text>
                  <Text style={styles.emptyDescription}>
                    {searchTerm ? 'Try adjusting your search' : 
                     isAdmin && !schoolFilter ? 'Please select a school' : 'No registered students yet'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </GlassmorphicCard>
        </ScrollView>

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : user?.school?.name || 'School'}
            welcomeMessage="Students Directory"
            notificationCount={0}
            onLeaderboardPress={() => setLeaderboardVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
            userRole={user?.role}
          />
        </View>

        {/* Student Detail Modal */}
        <StudentDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          student={selectedStudent}
        />

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

        {/* School Dropdown Modal - Only shows the 2 schools */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for nav bar
  },
  bannerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bannerSpacer: {
    height: 130, // Space for the banner
  },
  mainCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    minHeight: 'auto',
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
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.deepPurple,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
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
    minHeight: 300,
  },
  errorText: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
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

/* End of file screens/coordinator/StudentsListScreen.tsx */
