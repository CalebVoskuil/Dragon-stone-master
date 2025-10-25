import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { X, Calendar, MapPin, Clock, Users, CheckCircle, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface Student {
  id: string;
  name: string;
  email: string;
  status: 'registered' | 'participated' | 'completed';
}

interface EventDetails {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  duration: number;
  maxVolunteers: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  verified: boolean;
  students: Student[];
}

interface EventDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  event: EventDetails | null;
}

export default function EventDetailsModal({
  visible,
  onClose,
  event,
}: EventDetailsModalProps) {
  if (!event) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return Colors.blue;
      case 'ongoing':
        return Colors.golden;
      case 'completed':
        return Colors.green;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return Colors.blue;
      case 'participated':
        return Colors.golden;
      case 'completed':
        return Colors.green;
      default:
        return Colors.textSecondary;
    }
  };

  const getStudentStatusText = (status: string) => {
    switch (status) {
      case 'registered':
        return 'Registered';
      case 'participated':
        return 'Participated';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const registeredStudents = event.students.filter(s => s.status === 'registered');
  const participatedStudents = event.students.filter(s => s.status === 'participated');
  const completedStudents = event.students.filter(s => s.status === 'completed');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <BlurView intensity={60} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Colors.textSecondary} size={24} />
            </TouchableOpacity>

            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{event.name}</Text>
              
              {/* Status Badge */}
              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(event.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                    {getStatusText(event.status)}
                  </Text>
                </View>
                {event.verified && (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle color={Colors.golden} size={16} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Event Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Event Details</Text>
              
              <View style={styles.detailRow}>
                <Calendar color={Colors.deepPurple} size={18} />
                <Text style={styles.detailText}>{event.date}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Clock color={Colors.deepPurple} size={18} />
                <Text style={styles.detailText}>{event.time} ({event.duration} hours)</Text>
              </View>
              
              <View style={styles.detailRow}>
                <MapPin color={Colors.deepPurple} size={18} />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Users color={Colors.deepPurple} size={18} />
                <Text style={styles.detailText}>
                  {event.registered}/{event.maxVolunteers} volunteers
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>

            {/* Students Lists */}
            {registeredStudents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Registered Students ({registeredStudents.length})</Text>
                <View style={styles.studentsList}>
                  {registeredStudents.map((student) => (
                    <View key={student.id} style={styles.studentItem}>
                      <View style={styles.studentAvatar}>
                        <User color={Colors.light} size={16} />
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentEmail}>{student.email}</Text>
                      </View>
                      <View style={[styles.studentStatusBadge, { backgroundColor: `${getStudentStatusColor(student.status)}20` }]}>
                        <Text style={[styles.studentStatusText, { color: getStudentStatusColor(student.status) }]}>
                          {getStudentStatusText(student.status)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {participatedStudents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Participated Students ({participatedStudents.length})</Text>
                <View style={styles.studentsList}>
                  {participatedStudents.map((student) => (
                    <View key={student.id} style={styles.studentItem}>
                      <View style={styles.studentAvatar}>
                        <User color={Colors.light} size={16} />
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentEmail}>{student.email}</Text>
                      </View>
                      <View style={[styles.studentStatusBadge, { backgroundColor: `${getStudentStatusColor(student.status)}20` }]}>
                        <Text style={[styles.studentStatusText, { color: getStudentStatusColor(student.status) }]}>
                          {getStudentStatusText(student.status)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {completedStudents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Completed Students ({completedStudents.length})</Text>
                <View style={styles.studentsList}>
                  {completedStudents.map((student) => (
                    <View key={student.id} style={styles.studentItem}>
                      <View style={styles.studentAvatar}>
                        <User color={Colors.light} size={16} />
                      </View>
                      <View style={styles.studentInfo}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.studentEmail}>{student.email}</Text>
                      </View>
                      <View style={[styles.studentStatusBadge, { backgroundColor: `${getStudentStatusColor(student.status)}20` }]}>
                        <Text style={[styles.studentStatusText, { color: getStudentStatusColor(student.status) }]}>
                          {getStudentStatusText(student.status)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Empty State */}
            {event.students.length === 0 && (
              <View style={styles.emptyState}>
                <Users color={Colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>No Students Yet</Text>
                <Text style={styles.emptyDescription}>
                  Students will appear here once they register for this event.
                </Text>
              </View>
            )}
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusXl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    padding: spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusFull,
  },
  scrollView: {
    maxHeight: 600,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: Sizes.radiusMd,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: Sizes.radiusMd,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: `${Colors.golden}20`,
    borderRadius: Sizes.radiusMd,
  },
  verifiedText: {
    fontSize: Sizes.fontSm,
    color: Colors.golden,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  detailText: {
    ...typography.body,
    color: Colors.text,
    flex: 1,
  },
  description: {
    ...typography.body,
    color: Colors.textSecondary,
    lineHeight: Sizes.fontMd * 1.5,
  },
  studentsList: {
    gap: spacing.sm,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.deepPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    ...typography.body,
    color: Colors.text,
    fontWeight: '500',
  },
  studentEmail: {
    ...typography.caption,
    color: Colors.textSecondary,
  },
  studentStatusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: Sizes.radiusSm,
  },
  studentStatusText: {
    fontSize: Sizes.fontXs,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: Colors.text,
    fontWeight: '600',
  },
  emptyDescription: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
