/**
 *
 */

/**
 *
 */
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
import { SDButton } from '../ui';

interface EventDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  event: Event | null;
  currentUserId?: string;
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
}

export default function EventDetailsModal({
  visible,
  onClose,
  event,
  currentUserId,
  onRegister,
  onUnregister,
}: EventDetailsModalProps) {
  if (!event) return null;

  // Calculate registered count
  const registeredCount = event.eventRegistrations?.length || event._count?.eventRegistrations || 0;
  
  // Check if current user is registered
  const isUserRegistered = currentUserId 
    ? event.eventRegistrations?.some(reg => reg.userId === currentUserId) || false 
    : false;
  
  // Check if event is full
  const isFull = registeredCount >= event.maxVolunteers;
  const spotsAvailable = event.maxVolunteers - registeredCount;
  
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
      statusBarTranslucent
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        indicatorStyle="white"
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Colors.textSecondary} size={24} />
            </TouchableOpacity>

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

            {/* Action Buttons - Only show if handlers are provided (student view) */}
            {(onRegister || onUnregister) && (
              <View style={styles.actionSection}>
                {isUserRegistered ? (
                  <View style={styles.registeredSection}>
                    <View style={styles.registeredBadge}>
                      <CheckCircle color={Colors.green} size={16} />
                      <Text style={styles.registeredText}>You're Registered</Text>
                    </View>
                    {onUnregister && (
                      <SDButton
                        variant="ghost"
                        size="md"
                        fullWidth
                        onPress={() => {
                          onUnregister(event.id);
                          onClose();
                        }}
                      >
                        Unregister
                      </SDButton>
                    )}
                  </View>
                ) : (
                  onRegister && (
                    <SDButton
                      variant="primary-filled"
                      size="md"
                      fullWidth
                      onPress={() => {
                        onRegister(event.id);
                        onClose();
                      }}
                      disabled={isFull}
                    >
                      {isFull ? 'Event Full' : `Register (${spotsAvailable} spots left)`}
                    </SDButton>
                  )
                )}
              </View>
            )}
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 140, // Space for banner
    paddingBottom: 100, // Space for nav bar
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  modalOverlay: {
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusXl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5, // Lower elevation to stay behind banner and nav
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
  actionSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  registeredSection: {
    gap: spacing.md,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: `${Colors.green}15`,
    borderRadius: Sizes.radiusMd,
    alignSelf: 'center',
  },
  registeredText: {
    fontSize: Sizes.fontMd,
    color: Colors.green,
    fontWeight: '600',
  },
});
