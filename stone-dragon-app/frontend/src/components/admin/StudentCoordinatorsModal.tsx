import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { X, Search, ArrowUpDown, Check } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface Student {
  id: string;
  name: string;
  email: string;
  school: string;
  grade: string;
  hours: string;
  role?: 'student' | 'student_coordinator';
}

interface StudentCoordinatorsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: string[]) => void;
  selectedIds?: string[];
  students?: Student[];
}

export default function StudentCoordinatorsModal({
  visible,
  onClose,
  onConfirm,
  selectedIds = [],
  students = [],
}: StudentCoordinatorsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'hours'>('name');
  const [selectedStudents, setSelectedStudents] = useState<string[]>(selectedIds);
  const [slideAnim] = useState(new Animated.Value(1000));

  // Map students to use 'name' field for display
  const mappedStudents = students.length > 0 ? students.map((student: any) => ({
    id: student.id,
    name: student.firstName && student.lastName ? `${student.firstName} ${student.lastName}` : student.name || 'Unknown Student',
    email: student.email || '',
    school: typeof student.school === 'object' ? student.school.name : (student.school || student.schoolId || ''),
    grade: student.grade || 'Grade 12',
    hours: typeof student.totalHours === 'number' ? `${student.totalHours}h` : '0h',
    role: student.role?.toLowerCase() || 'student',
  })) : [];

  React.useEffect(() => {
    if (visible) {
      setSelectedStudents(selectedIds);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, selectedIds]);

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedStudents);
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredStudents = mappedStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'grade':
        return a.grade.localeCompare(b.grade);
      case 'hours':
        return parseInt(b.hours) - parseInt(a.hours);
      default:
        return 0;
    }
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>Select Student Co-ordinators</Text>
                <Text style={styles.subtitle}>
                  Choose students to grant co-ordinator privileges for this event
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color={Colors.text} size={24} />
              </TouchableOpacity>
            </View>

            {/* Selected Students */}
            {selectedStudents.length > 0 && (
              <View style={styles.selectedBanner}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.selectedStudents}>
                    {selectedStudents.map((studentId) => {
                      const student = mappedStudents.find(s => s.id === studentId);
                      if (!student) return null;
                      return (
                        <TouchableOpacity
                          key={student.id}
                          style={styles.selectedAvatar}
                          onPress={() => toggleStudent(student.id)}
                        >
                          <View style={styles.selectedAvatarCircle}>
                            <Text style={styles.selectedAvatarText}>
                              {getInitials(student.name)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search color={Colors.textSecondary} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search students by name or email..."
                placeholderTextColor={Colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Sort Selector */}
            <TouchableOpacity style={styles.sortButton}>
              <ArrowUpDown color={Colors.text} size={20} />
              <Text style={styles.sortText}>Sort by Name</Text>
            </TouchableOpacity>

            {/* Students List */}
            <ScrollView 
              style={styles.studentsList} 
              indicatorStyle="white"
              showsVerticalScrollIndicator={true}
            >
              {sortedStudents.map((student) => {
                const isSelected = selectedStudents.includes(student.id);
                return (
                  <TouchableOpacity
                    key={student.id}
                    style={styles.studentCard}
                    onPress={() => toggleStudent(student.id)}
                  >
                    <View style={styles.studentInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {getInitials(student.name)}
                        </Text>
                      </View>
                      <View style={styles.studentDetails}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <View style={styles.studentMeta}>
                          <Text style={styles.studentMetaText}>
                            {student.school}
                          </Text>
                          <Text style={styles.studentMetaText}>•</Text>
                          <Text style={styles.studentMetaText}>
                            {student.grade}
                          </Text>
                          <Text style={styles.studentMetaText}>•</Text>
                          <Text style={styles.studentMetaText}>
                            {student.hours}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Check color={Colors.light} size={18} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>
                Confirm ({selectedStudents.length})
              </Text>
            </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // No overlay effect above white panel
    justifyContent: 'flex-end',
    zIndex: 5, // Behind banner (zIndex: 10) and nav bar
  },
  modalContainer: {
    backgroundColor: Colors.light,
    borderTopLeftRadius: Sizes.radiusXl,
    borderTopRightRadius: Sizes.radiusXl,
    height: '90%',
    zIndex: 5,
  },
  modalContent: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  headerContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  closeButton: {
    padding: spacing.xs,
  },
  selectedBanner: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: Sizes.radiusMd,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedStudents: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  selectedAvatar: {
    position: 'relative',
  },
  selectedAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAvatarText: {
    ...typography.body,
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body,
    color: Colors.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  sortText: {
    ...typography.body,
    color: Colors.text,
  },
  studentsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light,
    borderRadius: Sizes.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.body,
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  studentDetails: {
    flex: 1,
    marginRight: spacing.sm,
  },
  studentName: {
    ...typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
    flex: 1,
  },
  studentMetaText: {
    ...typography.caption,
    color: Colors.textSecondary,
    flexShrink: 1,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.deepPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: Sizes.radiusLg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelText: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.deepPurple,
    borderRadius: Sizes.radiusLg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmText: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.light,
  },
});

