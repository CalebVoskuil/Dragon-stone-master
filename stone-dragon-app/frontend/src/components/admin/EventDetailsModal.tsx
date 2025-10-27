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
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

import { Event } from '../../types';

interface EventDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  event: Event | null;
}

export default function EventDetailsModal({
  visible,
  onClose,
  event,
}: EventDetailsModalProps) {
  if (!event) return null;

  // Calculate registered count
  const registeredCount = event.eventRegistrations?.length || event._count?.eventRegistrations || 0;
  
  // Format date
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Determine if event is past
  const isPast = new Date(event.date) < new Date();
  const status = isPast ? 'completed' : 'upcoming';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return Colors.deepPurple;
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

  // Get list of registered students
  const registeredStudents = event.eventRegistrations || [];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
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
              <Text style={styles.title}>{event.title}</Text>
              
              {/* Status Badge */}
              <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                    {getStatusText(status)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Event Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Event Details</Text>
              
              <View style={styles.detailRow}>
                <Calendar color={Colors.deepPurple} size={18} />
                <Text style={styles.detailText}>{eventDate}</Text>
              </View>
              
              {event.time && (
                <View style={styles.detailRow}>
                  <Clock color={Colors.deepPurple} size={18} />
                  <Text style={styles.detailText}>
                    {event.time}
                    {event.duration ? ` (${event.duration} hours awarded)` : ''}
                  </Text>
                </View>
              )}
              
              {event.location && (
                <View style={styles.detailRow}>
                  <MapPin color={Colors.deepPurple} size={18} />
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
              )}
              
              <View style={styles.detailRow}>
                <Users color={Colors.deepPurple} size={18} />
                <Text style={styles.detailText}>
                  {registeredCount}/{event.maxVolunteers} volunteers registered
                </Text>
              </View>
              
              {event.coordinator && (
                <View style={styles.detailRow}>
                  <User color={Colors.deepPurple} size={18} />
                  <Text style={styles.detailText}>
                    Coordinator: {event.coordinator.firstName} {event.coordinator.lastName}
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>

            {/* Registered Students */}
            {registeredStudents.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Registered Students ({registeredStudents.length})</Text>
                <View style={styles.studentsList}>
                  {registeredStudents.map((registration) => {
                    const student = registration.user;
                    if (!student) return null;
                    
                    return (
                      <View key={registration.id} style={styles.studentItem}>
                        <View style={styles.studentAvatar}>
                          <User color={Colors.light} size={16} />
                        </View>
                        <View style={styles.studentInfo}>
                          <Text style={styles.studentName}>
                            {student.firstName} {student.lastName}
                          </Text>
                          <Text style={styles.studentEmail}>{student.email}</Text>
                        </View>
                        <View style={[styles.studentStatusBadge, { backgroundColor: `${Colors.deepPurple}20` }]}>
                          <Text style={[styles.studentStatusText, { color: Colors.deepPurple }]}>
                            Registered
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : (
              <View style={styles.section}>
                <View style={styles.emptyState}>
                  <Users color={Colors.textSecondary} size={48} />
                  <Text style={styles.emptyTitle}>No Students Yet</Text>
                  <Text style={styles.emptyDescription}>
                    Students will appear here once they register for this event.
                  </Text>
                </View>
              </View>
            )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: 'transparent', // No overlay effect above white panel
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
    ...typography.subhead,
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
    ...typography.subhead,
    color: Colors.text,
    fontWeight: '600',
  },
  emptyDescription: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
