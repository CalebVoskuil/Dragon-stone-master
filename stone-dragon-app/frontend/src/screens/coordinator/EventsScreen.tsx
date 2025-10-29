/**
 * @fileoverview Coordinator events management screen.
 * Allows coordinators to create, view, and manage volunteer events.
 * 
 * @module screens/coordinator/EventsScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, MapPin, Clock, Users, ChevronDown } from 'lucide-react-native';
import {
  GradientBackground,
  GlassmorphicCard,
  SDButton,
  GlassmorphicBanner,
} from '../../components/ui';
import { StudentCoordinatorsModal, EventDetailsModal, LeaderboardModal, NotificationCenterModal } from '../../components/admin';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { apiService } from '../../services/api';
import { useAuth } from '../../store/AuthContext';
import { Event } from '../../types';

/**
 * EventsScreen - Events management
 * Create and view volunteer events
 */
export default function EventsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'events'>('create');
  const slideAnimation = useState(new Animated.Value(0))[0];
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState('');
  const [coordinatorModalVisible, setCoordinatorModalVisible] = useState(false);
  const [selectedCoordinators, setSelectedCoordinators] = useState<string[]>([]);
  const [eventDetailsModalVisible, setEventDetailsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load events and students in parallel
      const [eventsResponse, usersResponse] = await Promise.all([
        apiService.getEvents(),
        apiService.getStudentsList ? apiService.getStudentsList() : Promise.resolve({ success: true, data: [] })
      ]);

      if (eventsResponse.success && eventsResponse.data) {
        setEvents(eventsResponse.data);
      }

      if (usersResponse.success && usersResponse.data) {
        console.log('Raw users data from API:', usersResponse.data);
        console.log('Total users received:', usersResponse.data.length);
        // Filter for students and student coordinators
        const studentList = usersResponse.data.filter((u: any) => 
          u.role === 'STUDENT' || u.role === 'STUDENT_COORDINATOR'
        );
        console.log('Filtered student list (STUDENT or STUDENT_COORDINATOR):', studentList);
        setStudents(studentList);
      } else {
        console.log('No user data from API, trying alternative endpoint');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCreateEvent = async () => {
    if (!eventName || !description || !date || !maxVolunteers) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // Validate and format date
      let eventDate: Date;
      try {
        eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
          throw new Error('Invalid date format');
        }
      } catch (error) {
        Alert.alert('Error', 'Please enter a valid date');
        setSubmitting(false);
        return;
      }
      
      // Validate maxVolunteers
      const maxVolunteersNum = parseInt(maxVolunteers);
      if (isNaN(maxVolunteersNum) || maxVolunteersNum < 1) {
        Alert.alert('Error', 'Please enter a valid number of volunteers (at least 1)');
        setSubmitting(false);
        return;
      }
      
      console.log('Creating event with data:', {
        title: eventName,
        date: eventDate.toISOString(),
        maxVolunteers: maxVolunteersNum,
      });
      
      const response = await apiService.createEvent({
        title: eventName,
        description,
        date: eventDate.toISOString(),
        time: startTime || undefined,
        location: location || undefined,
        duration: duration ? parseFloat(duration) : undefined,
        maxVolunteers: maxVolunteersNum,
        studentCoordinatorIds: selectedCoordinators.length > 0 ? selectedCoordinators : undefined,
      });

      if (response.success) {
        Alert.alert('Success', 'Event created successfully');
        // Reset form
        setEventName('');
        setDescription('');
        setDate('');
        setSelectedDate(new Date());
        setStartTime('');
        setSelectedTime(new Date());
        setLocation('');
        setDuration('');
        setMaxVolunteers('');
        setSelectedCoordinators([]);
        // Reload events
        await loadData();
        setActiveTab('events');
      }
    } catch (error: any) {
      console.error('Create event error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create event';
      console.error('Error details:', error.response?.data);
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const removeCoordinator = (coordinatorId: string) => {
    setSelectedCoordinators((prev) => prev.filter((id) => id !== coordinatorId));
  };

  const handleTabChange = (tab: 'create' | 'events') => {
    setActiveTab(tab);
    Animated.timing(slideAnimation, {
      toValue: tab === 'create' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    setEventDetailsModalVisible(true);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.outerScrollView}
          contentContainerStyle={styles.outerScrollContent}
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.bannerSpacer} />
          
          <GlassmorphicCard intensity={80} style={styles.mainCard}>

          {/* Segmented Control */}
          <View style={styles.segmentedControl}>
            <Animated.View
              style={[
                styles.slidingBackground,
                {
                  transform: [
                    {
                      translateX: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'], // Slide from left to right
                      }),
                    },
                  ],
                },
              ]}
            />
            <TouchableOpacity
              style={styles.segment}
              onPress={() => handleTabChange('create')}
            >
              <Text style={[styles.segmentText, activeTab === 'create' && styles.activeSegmentText]}>
                Create
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.segment}
              onPress={() => handleTabChange('events')}
            >
              <Text style={[styles.segmentText, activeTab === 'events' && styles.activeSegmentText]}>
                Events
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'create' ? (
            <View style={styles.contentView}>
              <View style={styles.formContainer}>
                {/* Event Details Card */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Event Details</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Event Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Beach Cleanup Drive"
                      placeholderTextColor={Colors.textSecondary}
                      value={eventName}
                      onChangeText={setEventName}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Describe the volunteer event and its objectives..."
                      placeholderTextColor={Colors.textSecondary}
                      value={description}
                      onChangeText={setDescription}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <Calendar color={Colors.text} size={14} /> Date
                    </Text>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={date ? styles.inputText : styles.placeholder}>
                        {date || 'Select date'}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDateValue) => {
                          setShowDatePicker(false); // Close picker on any interaction
                          if (event.type === 'set' && selectedDateValue) {
                            setSelectedDate(selectedDateValue);
                            setDate(selectedDateValue.toISOString().split('T')[0]);
                          }
                          // On Android, event.type is 'dismissed' when user cancels
                          if (event.type === 'dismissed') {
                            setShowDatePicker(false);
                          }
                        }}
                        minimumDate={new Date()}
                      />
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <Clock color={Colors.text} size={14} /> Start Time
                    </Text>
                    <TouchableOpacity
                      style={styles.input}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={startTime ? styles.inputText : styles.placeholder}>
                        {startTime || 'Select time'}
                      </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                      <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        display="default"
                        is24Hour={false}
                        onChange={(event, selectedTimeValue) => {
                          setShowTimePicker(false); // Close picker on any interaction
                          if (event.type === 'set' && selectedTimeValue) {
                            setSelectedTime(selectedTimeValue);
                            // Format time as HH:MM
                            const hours = selectedTimeValue.getHours();
                            const minutes = selectedTimeValue.getMinutes();
                            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                            setStartTime(formattedTime);
                          }
                          // On Android, event.type is 'dismissed' when user cancels
                          if (event.type === 'dismissed') {
                            setShowTimePicker(false);
                          }
                        }}
                      />
                    )}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <MapPin color={Colors.text} size={14} /> Location
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., Camps Bay Beach, Cape Town"
                      placeholderTextColor={Colors.textSecondary}
                      value={location}
                      onChangeText={setLocation}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Duration (hours)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 3"
                      placeholderTextColor={Colors.textSecondary}
                      value={duration}
                      onChangeText={setDuration}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <Users color={Colors.text} size={14} /> Max Volunteers
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g., 30"
                      placeholderTextColor={Colors.textSecondary}
                      value={maxVolunteers}
                      onChangeText={setMaxVolunteers}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Student Co-ordinators Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Student Co-ordinators</Text>
                  <View style={styles.coordinatorsContainer}>
                    {selectedCoordinators.map((coordinatorId) => {
                      const student = students.find((s: any) => s.id === coordinatorId);
                      if (!student) {
                        console.log('Student not found for ID:', coordinatorId);
                        return null;
                      }
                      const studentName = `${student.firstName} ${student.lastName}`;
                      return (
                        <TouchableOpacity
                          key={student.id}
                          style={styles.coordinatorAvatar}
                          onPress={() => removeCoordinator(student.id)}
                        >
                          <View style={styles.coordinatorCircle}>
                            <Text style={styles.coordinatorText}>
                              {getInitials(studentName)}
                            </Text>
                          </View>
                          <Text style={styles.coordinatorName} numberOfLines={1}>
                            {student.firstName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => setCoordinatorModalVisible(true)}
                    >
                      <View style={styles.addCircle}>
                        <Text style={styles.addText}>+</Text>
                      </View>
                      <Text style={styles.addLabel}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Create Button */}
                <SDButton
                  variant="primary-filled"
                  size="lg"
                  fullWidth
                  onPress={handleCreateEvent}
                  style={styles.createButton}
                >
                  Create Event
                </SDButton>
              </View>
            </View>
          ) : (
            <View style={styles.contentView}>
              <View style={styles.eventsContainer}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.deepPurple} />
                    <Text style={styles.loadingText}>Loading events...</Text>
                  </View>
                ) : events.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No events yet</Text>
                    <Text style={styles.emptySubtext}>Create your first event to get started</Text>
                  </View>
                ) : (
                  events.map((event) => {
                    const registered = event.eventRegistrations?.length || event._count?.eventRegistrations || 0;
                    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    
                    return (
                      <TouchableOpacity 
                        key={event.id} 
                        style={styles.eventCard}
                        onPress={() => handleEventPress(event)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.eventHeader}>
                          <Text style={styles.eventName}>{event.title}</Text>
                        </View>
                        
                        <Text style={styles.eventDescription} numberOfLines={2}>
                          {event.description}
                        </Text>
                        
                        <View style={styles.eventMeta}>
                          <View style={styles.eventMetaItem}>
                            <Calendar color={Colors.textSecondary} size={16} />
                            <Text style={styles.eventMetaText}>
                              {eventDate}
                              {event.time ? ` • ${event.time}` : ''}
                            </Text>
                          </View>
                          
                          {event.location && (
                            <View style={styles.eventMetaItem}>
                              <MapPin color={Colors.textSecondary} size={16} />
                              <Text style={styles.eventMetaText}>{event.location}</Text>
                            </View>
                          )}
                          
                          <View style={styles.eventMetaItem}>
                            <Users color={Colors.textSecondary} size={16} />
                            <Text style={styles.eventMetaText}>
                              {registered}/{event.maxVolunteers} registered
                            </Text>
                          </View>
                          
                          {event.duration && (
                            <View style={styles.eventMetaItem}>
                              <Clock color={Colors.textSecondary} size={16} />
                              <Text style={styles.eventMetaText}>{event.duration} hours</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </View>
          )}
        </GlassmorphicCard>
        </ScrollView>

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={(user?.school as any)?.name || (typeof user?.school === 'string' ? user.school : 'School')}
            welcomeMessage="Events Management"
            notificationCount={0}
            onLeaderboardPress={() => setLeaderboardVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
            userRole={user?.role}
          />
        </View>

        {/* Student Coordinators Modal */}
        <StudentCoordinatorsModal
          visible={coordinatorModalVisible}
          onClose={() => setCoordinatorModalVisible(false)}
          onConfirm={(ids) => {
            console.log('Received coordinator IDs:', ids);
            console.log('Available students:', students);
            setSelectedCoordinators(ids);
            console.log('Updated selected coordinators:', ids);
          }}
          selectedIds={selectedCoordinators}
          students={students}
        />

        {/* Event Details Modal */}
        <EventDetailsModal
          visible={eventDetailsModalVisible}
          onClose={() => setEventDetailsModalVisible(false)}
          event={selectedEvent}
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
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  outerScrollView: {
    flex: 1,
  },
  outerScrollContent: {
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
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: Sizes.radiusFull,
    padding: 4,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  slidingBackground: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: Colors.deepPurple,
    borderRadius: Sizes.radiusFull,
    width: '50%',
    zIndex: 0,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  segmentText: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.deepPurple,
  },
  activeSegmentText: {
    color: Colors.light,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: Sizes.radiusLg,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: Sizes.radiusMd,
  },
  tabActive: {
    backgroundColor: Colors.deepPurple,
  },
  tabText: {
    ...typography.subhead,
    color: Colors.text,
  },
  tabTextActive: {
    color: Colors.light,
  },
  contentView: {
    flex: 1,
  },
  formContainer: {
    paddingBottom: spacing.xl,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: Sizes.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subhead,
    color: Colors.text,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: Colors.text,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.light,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    ...typography.body,
    color: Colors.text,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textArea: {
    minHeight: 100,
  },
  dropdown: {
    backgroundColor: Colors.light,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownText: {
    ...typography.body,
    color: Colors.textSecondary,
  },
  coordinatorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    alignItems: 'center',
  },
  coordinatorAvatar: {
    alignItems: 'center',
    gap: 8,
  },
  coordinatorCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordinatorText: {
    ...typography.subhead,
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  coordinatorName: {
    fontSize: 12,
    color: Colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    gap: 8,
  },
  addCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.deepPurple,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 36,
    color: Colors.deepPurple,
    fontWeight: '300',
    lineHeight: 36,
    textAlign: 'center',
    includeFontPadding: false,
  },
  addLabel: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  createButton: {
    marginTop: spacing.lg,
  },
  eventsContainer: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Sizes.radiusLg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  eventName: {
    ...typography.subhead,
    color: Colors.text,
    flex: 1,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  eventDescription: {
    ...typography.body,
    color: Colors.textSecondary,
    marginBottom: spacing.sm,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: Colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  eventMeta: {
    flexDirection: 'column',
    gap: spacing.xs,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  eventMetaText: {
    ...typography.caption,
    color: Colors.textSecondary,
  },
  inputText: {
    ...typography.body,
    color: Colors.text,
  },
  placeholder: {
    ...typography.body,
    color: Colors.textSecondary,
  },
});

/* End of file screens/coordinator/EventsScreen.tsx */

