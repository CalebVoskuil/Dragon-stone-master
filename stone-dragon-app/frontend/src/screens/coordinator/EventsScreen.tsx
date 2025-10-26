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
} from 'react-native';
import { Calendar, MapPin, Clock, Users, ChevronDown } from 'lucide-react-native';
import {
  GradientBackground,
  GlassmorphicCard,
  SDButton,
} from '../../components/ui';
import { StudentCoordinatorsModal, EventDetailsModal } from '../../components/admin';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { apiService } from '../../services/api';
import { useAuth } from '../../store/AuthContext';

/**
 * EventsScreen - Events management
 * Create and view volunteer events
 */
export default function EventsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'events'>('create');
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState('');
  const [category, setCategory] = useState('');
  const [coordinatorModalVisible, setCoordinatorModalVisible] = useState(false);
  const [selectedCoordinators, setSelectedCoordinators] = useState<string[]>([]);
  const [eventDetailsModalVisible, setEventDetailsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        // Filter for students and student coordinators
        const studentList = usersResponse.data.filter((u: any) => 
          u.role === 'STUDENT' || u.role === 'STUDENT_COORDINATOR'
        );
        setStudents(studentList);
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
      const response = await apiService.createEvent({
        title: eventName,
        description,
        date: new Date(date).toISOString(),
        time: startTime,
        location,
        duration: duration ? parseFloat(duration) : undefined,
        maxVolunteers: parseInt(maxVolunteers),
        studentCoordinatorIds: selectedCoordinators,
      });

      if (response.success) {
        Alert.alert('Success', 'Event created successfully');
        // Reset form
        setEventName('');
        setDescription('');
        setDate('');
        setStartTime('');
        setLocation('');
        setDuration('');
        setMaxVolunteers('');
        setCategory('');
        setSelectedCoordinators([]);
        // Reload events
        await loadData();
        setActiveTab('events');
      }
    } catch (error: any) {
      console.error('Create event error:', error);
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const removeCoordinator = (coordinatorId: string) => {
    setSelectedCoordinators((prev) => prev.filter((id) => id !== coordinatorId));
  };

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    setEventDetailsModalVisible(true);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          {/* Header */}
          <Text style={styles.title}>Events</Text>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'create' && styles.tabActive]}
              onPress={() => setActiveTab('create')}
            >
              <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>
                Create
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'events' && styles.tabActive]}
              onPress={() => setActiveTab('events')}
            >
              <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
                Events
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'create' ? (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                    <TextInput
                      style={styles.input}
                      placeholder="dd/mm/yyyy"
                      placeholderTextColor={Colors.textSecondary}
                      value={date}
                      onChangeText={setDate}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <Clock color={Colors.text} size={14} /> Start Time
                    </Text>
                    <TextInput
                      style={styles.input}
                      placeholder="--:--"
                      placeholderTextColor={Colors.textSecondary}
                      value={startTime}
                      onChangeText={setStartTime}
                    />
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

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <TouchableOpacity style={styles.dropdown}>
                      <Text style={styles.dropdownText}>
                        {category || 'Select a category'}
                      </Text>
                      <ChevronDown color={Colors.textSecondary} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Student Co-ordinators Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Student Co-ordinators</Text>
                  <View style={styles.coordinatorsContainer}>
                    {selectedCoordinators.map((coordinatorId) => {
                      const student = students.find((s: any) => s.id === coordinatorId);
                      if (!student) return null;
                      return (
                        <TouchableOpacity
                          key={student.id}
                          style={styles.coordinatorAvatar}
                          onPress={() => removeCoordinator(student.id)}
                        >
                          <View style={styles.coordinatorCircle}>
                            <Text style={styles.coordinatorText}>
                              {getInitials(student.name)}
                            </Text>
                          </View>
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
            </ScrollView>
          ) : (
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.eventsContainer}>
                {events.map((event) => (
                  <TouchableOpacity 
                    key={event.id} 
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventName}>{event.name}</Text>
                      {event.verified && (
                        <Text style={styles.verifiedBadge}>✓</Text>
                      )}
                    </View>
                    <View style={styles.eventMeta}>
                      <View style={styles.eventMetaItem}>
                        <Calendar color={Colors.textSecondary} size={14} />
                        <Text style={styles.eventMetaText}>{event.date}</Text>
                      </View>
                      <View style={styles.eventMetaItem}>
                        <Users color={Colors.textSecondary} size={14} />
                        <Text style={styles.eventMetaText}>
                          {event.registered}/{event.maxVolunteers}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </GlassmorphicCard>

        {/* Student Coordinators Modal */}
        <StudentCoordinatorsModal
          visible={coordinatorModalVisible}
          onClose={() => setCoordinatorModalVisible(false)}
          onConfirm={(ids) => {
            setSelectedCoordinators(ids);
            console.log('Selected student coordinators:', ids);
          }}
          selectedIds={selectedCoordinators}
        />

        {/* Event Details Modal */}
        <EventDetailsModal
          visible={eventDetailsModalVisible}
          onClose={() => setEventDetailsModalVisible(false)}
          event={selectedEvent}
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
    margin: spacing.md,
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: Colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
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
  scrollView: {
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
  },
  coordinatorCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.deepPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordinatorText: {
    ...typography.subhead,
    color: Colors.light,
    fontWeight: '600',
  },
  addButton: {
    alignItems: 'center',
  },
  addCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 32,
    color: Colors.deepPurple,
    fontWeight: '300',
  },
  addLabel: {
    ...typography.body,
    color: Colors.text,
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
  },
  verifiedBadge: {
    backgroundColor: '#FFD700',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  eventMeta: {
    flexDirection: 'row',
    gap: spacing.md,
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
});

