import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
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

/**
 * EventsScreen - Events management
 * Create and view volunteer events
 */
export default function EventsScreen() {
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

  // Mock student data (should match the modal's data)
  const mockStudents = [
    { id: '1', name: 'Emma Wilson', initials: 'EW' },
    { id: '2', name: 'James Taylor', initials: 'JT' },
    { id: '3', name: 'Sarah Johnson', initials: 'SJ' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Mock events data with student information
  const events = [
    {
      id: '1',
      name: 'Youth Mentorship Program',
      description: 'Mentor young students with homework and life skills. Help them develop confidence and academic success.',
      date: '25 November 2025',
      time: '03:00 PM - 05:00 PM',
      location: 'Langa Youth Center',
      duration: 2,
      maxVolunteers: 15,
      registered: 12,
      verified: false,
      status: 'upcoming',
      students: [
        { id: '1', name: 'Emma Wilson', email: 'emma.wilson@student.com', status: 'registered' },
        { id: '2', name: 'James Taylor', email: 'james.taylor@student.com', status: 'registered' },
        { id: '3', name: 'Sarah Johnson', email: 'sarah.johnson@student.com', status: 'registered' },
        { id: '4', name: 'Michael Brown', email: 'michael.brown@student.com', status: 'registered' },
        { id: '5', name: 'Lisa Davis', email: 'lisa.davis@student.com', status: 'registered' },
        { id: '6', name: 'David Wilson', email: 'david.wilson@student.com', status: 'registered' },
        { id: '7', name: 'Anna Martinez', email: 'anna.martinez@student.com', status: 'registered' },
        { id: '8', name: 'Tom Anderson', email: 'tom.anderson@student.com', status: 'registered' },
        { id: '9', name: 'Kate Thompson', email: 'kate.thompson@student.com', status: 'registered' },
        { id: '10', name: 'Ryan Garcia', email: 'ryan.garcia@student.com', status: 'registered' },
        { id: '11', name: 'Sophie Lee', email: 'sophie.lee@student.com', status: 'registered' },
        { id: '12', name: 'Alex Chen', email: 'alex.chen@student.com', status: 'registered' },
      ],
    },
    {
      id: '2',
      name: 'Animal Shelter Support',
      description: 'Help care for rescued animals and maintain shelter facilities. Feed animals, clean cages, and provide companionship.',
      date: '5 October 2025',
      time: '11:00 AM - 03:00 PM',
      location: 'Animal Shelter, Plumstead',
      duration: 4,
      maxVolunteers: 20,
      registered: 20,
      verified: true,
      status: 'completed',
      students: [
        { id: '1', name: 'Emma Wilson', email: 'emma.wilson@student.com', status: 'completed' },
        { id: '2', name: 'James Taylor', email: 'james.taylor@student.com', status: 'completed' },
        { id: '3', name: 'Sarah Johnson', email: 'sarah.johnson@student.com', status: 'completed' },
        { id: '4', name: 'Michael Brown', email: 'michael.brown@student.com', status: 'completed' },
        { id: '5', name: 'Lisa Davis', email: 'lisa.davis@student.com', status: 'completed' },
        { id: '6', name: 'David Wilson', email: 'david.wilson@student.com', status: 'completed' },
        { id: '7', name: 'Anna Martinez', email: 'anna.martinez@student.com', status: 'completed' },
        { id: '8', name: 'Tom Anderson', email: 'tom.anderson@student.com', status: 'completed' },
        { id: '9', name: 'Kate Thompson', email: 'kate.thompson@student.com', status: 'completed' },
        { id: '10', name: 'Ryan Garcia', email: 'ryan.garcia@student.com', status: 'completed' },
        { id: '11', name: 'Sophie Lee', email: 'sophie.lee@student.com', status: 'completed' },
        { id: '12', name: 'Alex Chen', email: 'alex.chen@student.com', status: 'completed' },
        { id: '13', name: 'Maria Rodriguez', email: 'maria.rodriguez@student.com', status: 'completed' },
        { id: '14', name: 'John Smith', email: 'john.smith@student.com', status: 'completed' },
        { id: '15', name: 'Emily White', email: 'emily.white@student.com', status: 'completed' },
        { id: '16', name: 'Chris Johnson', email: 'chris.johnson@student.com', status: 'completed' },
        { id: '17', name: 'Amanda Green', email: 'amanda.green@student.com', status: 'completed' },
        { id: '18', name: 'Mark Davis', email: 'mark.davis@student.com', status: 'completed' },
        { id: '19', name: 'Jessica Brown', email: 'jessica.brown@student.com', status: 'completed' },
        { id: '20', name: 'Kevin Wilson', email: 'kevin.wilson@student.com', status: 'completed' },
      ],
    },
    {
      id: '3',
      name: 'School Garden Project',
      description: 'Help maintain and expand the school garden. Plant vegetables, weed beds, and teach students about sustainable gardening.',
      date: '18 September 2025',
      time: '09:00 AM - 12:00 PM',
      location: 'Cape Town High School',
      duration: 3,
      maxVolunteers: 35,
      registered: 32,
      verified: true,
      status: 'completed',
      students: [
        { id: '1', name: 'Emma Wilson', email: 'emma.wilson@student.com', status: 'completed' },
        { id: '2', name: 'James Taylor', email: 'james.taylor@student.com', status: 'completed' },
        { id: '3', name: 'Sarah Johnson', email: 'sarah.johnson@student.com', status: 'completed' },
        { id: '4', name: 'Michael Brown', email: 'michael.brown@student.com', status: 'completed' },
        { id: '5', name: 'Lisa Davis', email: 'lisa.davis@student.com', status: 'completed' },
        { id: '6', name: 'David Wilson', email: 'david.wilson@student.com', status: 'completed' },
        { id: '7', name: 'Anna Martinez', email: 'anna.martinez@student.com', status: 'completed' },
        { id: '8', name: 'Tom Anderson', email: 'tom.anderson@student.com', status: 'completed' },
        { id: '9', name: 'Kate Thompson', email: 'kate.thompson@student.com', status: 'completed' },
        { id: '10', name: 'Ryan Garcia', email: 'ryan.garcia@student.com', status: 'completed' },
        { id: '11', name: 'Sophie Lee', email: 'sophie.lee@student.com', status: 'completed' },
        { id: '12', name: 'Alex Chen', email: 'alex.chen@student.com', status: 'completed' },
        { id: '13', name: 'Maria Rodriguez', email: 'maria.rodriguez@student.com', status: 'completed' },
        { id: '14', name: 'John Smith', email: 'john.smith@student.com', status: 'completed' },
        { id: '15', name: 'Emily White', email: 'emily.white@student.com', status: 'completed' },
        { id: '16', name: 'Chris Johnson', email: 'chris.johnson@student.com', status: 'completed' },
        { id: '17', name: 'Amanda Green', email: 'amanda.green@student.com', status: 'completed' },
        { id: '18', name: 'Mark Davis', email: 'mark.davis@student.com', status: 'completed' },
        { id: '19', name: 'Jessica Brown', email: 'jessica.brown@student.com', status: 'completed' },
        { id: '20', name: 'Kevin Wilson', email: 'kevin.wilson@student.com', status: 'completed' },
        { id: '21', name: 'Rachel Adams', email: 'rachel.adams@student.com', status: 'completed' },
        { id: '22', name: 'Daniel Miller', email: 'daniel.miller@student.com', status: 'completed' },
        { id: '23', name: 'Olivia Taylor', email: 'olivia.taylor@student.com', status: 'completed' },
        { id: '24', name: 'Nathan Clark', email: 'nathan.clark@student.com', status: 'completed' },
        { id: '25', name: 'Grace Lewis', email: 'grace.lewis@student.com', status: 'completed' },
        { id: '26', name: 'Ethan Walker', email: 'ethan.walker@student.com', status: 'completed' },
        { id: '27', name: 'Chloe Hall', email: 'chloe.hall@student.com', status: 'completed' },
        { id: '28', name: 'Lucas Allen', email: 'lucas.allen@student.com', status: 'completed' },
        { id: '29', name: 'Maya Young', email: 'maya.young@student.com', status: 'completed' },
        { id: '30', name: 'Noah King', email: 'noah.king@student.com', status: 'completed' },
        { id: '31', name: 'Ava Wright', email: 'ava.wright@student.com', status: 'completed' },
        { id: '32', name: 'Liam Lopez', email: 'liam.lopez@student.com', status: 'completed' },
      ],
    },
    {
      id: '4',
      name: 'Hospital Visit Program',
      description: 'Visit patients in the children\'s ward, read stories, play games, and provide emotional support to families.',
      date: '30 September 2025',
      time: '02:00 PM - 04:00 PM',
      location: 'Groote Schuur Hospital',
      duration: 2,
      maxVolunteers: 12,
      registered: 10,
      verified: true,
      status: 'ongoing',
      students: [
        { id: '1', name: 'Emma Wilson', email: 'emma.wilson@student.com', status: 'participated' },
        { id: '2', name: 'James Taylor', email: 'james.taylor@student.com', status: 'participated' },
        { id: '3', name: 'Sarah Johnson', email: 'sarah.johnson@student.com', status: 'participated' },
        { id: '4', name: 'Michael Brown', email: 'michael.brown@student.com', status: 'participated' },
        { id: '5', name: 'Lisa Davis', email: 'lisa.davis@student.com', status: 'participated' },
        { id: '6', name: 'David Wilson', email: 'david.wilson@student.com', status: 'participated' },
        { id: '7', name: 'Anna Martinez', email: 'anna.martinez@student.com', status: 'participated' },
        { id: '8', name: 'Tom Anderson', email: 'tom.anderson@student.com', status: 'participated' },
        { id: '9', name: 'Kate Thompson', email: 'kate.thompson@student.com', status: 'participated' },
        { id: '10', name: 'Ryan Garcia', email: 'ryan.garcia@student.com', status: 'participated' },
      ],
    },
  ];

  const handleCreateEvent = () => {
    console.log('Create event:', {
      eventName,
      description,
      date,
      startTime,
      location,
      duration,
      maxVolunteers,
      category,
      coordinators: selectedCoordinators,
    });
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
                      const student = mockStudents.find(s => s.id === coordinatorId);
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
    ...typography.button,
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
    ...typography.h3,
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
    ...typography.h3,
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
    ...typography.h3,
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

