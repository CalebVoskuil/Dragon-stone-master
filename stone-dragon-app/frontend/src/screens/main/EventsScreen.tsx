/**
 *
 */

/**
 *
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, MapPin, Users, Clock } from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  SDCard,
  GlassmorphicCard,
  GlassmorphicBanner,
} from '../../components/ui';
import { LeaderboardModal, NotificationCenterModal, EventDetailsModal } from '../../components/admin';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { apiService } from '../../services/api';
import { Event } from '../../types';
import { useAuth } from '../../store/AuthContext';

export default function EventsScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [eventDetailsVisible, setEventDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Load events from API
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEvents();
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Show all events
  const filteredEvents = events;

  const handleRegister = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Check if event is full (registered >= maxVolunteers)
    const registered = event.eventRegistrations?.length || 0;
    if (registered >= event.maxVolunteers) {
      Alert.alert('Event Full', 'Sorry, this event is already full.');
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Confirm Registration',
      `Are you sure you want to register for "${event.title}"?\n\nThis event awards ${event.duration || 0} volunteer hours.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Register',
          onPress: async () => {
            try {
              const response = await apiService.registerForEvent(eventId);
              if (response.success) {
                // Refresh events
                await loadEvents();

                // Show success message
                Alert.alert(
                  'Registration Successful!',
                  `You've been registered for "${event.title}". You'll receive ${event.duration || 0} volunteer hours upon completion.`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Registration Failed', response.message || 'Unable to register for this event.');
              }
            } catch (error: any) {
              console.error('Registration error:', error);
              const errorMessage = error.response?.data?.message || error.message || 'Failed to register for event';
              console.error('Error details:', error.response?.data);
              
              // If already registered, refresh to update UI
              if (error.response?.data?.message === 'Already registered for this event') {
                await loadEvents();
                Alert.alert('Already Registered', 'You are already registered for this event.');
              } else {
                Alert.alert('Error', errorMessage);
              }
            }
          },
        },
      ]
    );
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailsVisible(true);
  };

  const handleUnregister = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    Alert.alert(
      'Confirm Unregistration',
      `Are you sure you want to unregister from "${event.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unregister',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.unregisterFromEvent(eventId);
              if (response.success) {
                // Refresh events
                await loadEvents();

                // Show confirmation message
                Alert.alert(
                  'Unregistered Successfully',
                  `You've been unregistered from "${event.title}".`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Unregistration Failed', 'Unable to unregister from this event.');
              }
            } catch (error) {
              console.error('Unregistration error:', error);
              Alert.alert('Error', 'Failed to unregister from event');
            }
          },
        },
      ]
    );
  };

  const renderEvent = (event: Event) => {
    const registered = event.eventRegistrations?.length || 0;
    const spotsAvailable = event.maxVolunteers - registered;
    const eventDate = new Date(event.date).toLocaleDateString();
    // Check if current user is registered
    const isRegistered = user ? event.eventRegistrations?.some(reg => reg.userId === user.id) || false : false;
    
    console.log(`Event: ${event.title}, User: ${user?.id}, Registered: ${isRegistered}, Registrations:`, event.eventRegistrations);

    return (
      <TouchableOpacity
        key={event.id}
        onPress={() => handleEventPress(event)}
        activeOpacity={0.7}
      >
        <SDCard variant="elevated" padding="md" style={styles.eventCard}>
          <Text style={styles.eventTitle}>{event.title}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Calendar color={Colors.deepPurple} size={16} />
            <Text style={styles.eventDetailText}>
              {eventDate}{event.time ? ` • ${event.time}` : ''}
            </Text>
          </View>

          {event.location && (
            <View style={styles.eventDetail}>
              <MapPin color={Colors.deepPurple} size={16} />
              <Text style={styles.eventDetailText}>{event.location}</Text>
            </View>
          )}

          {event.duration && (
            <View style={styles.eventDetail}>
              <Clock color={Colors.deepPurple} size={16} />
              <Text style={styles.eventDetailText}>{event.duration} hours awarded</Text>
            </View>
          )}

          <View style={styles.eventDetail}>
            <Users color={Colors.deepPurple} size={16} />
            <Text style={styles.eventDetailText}>
              {spotsAvailable}/{event.maxVolunteers} spots available
            </Text>
          </View>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>

        {isRegistered ? (
          <View style={styles.registeredSection}>
            <View style={styles.registeredBadge}>
              <Text style={styles.registeredText}>✓ Registered</Text>
            </View>
            <SDButton
              variant="ghost"
              size="sm"
              fullWidth
              onPress={() => handleUnregister(event.id)}
              style={styles.unregisterButton}
            >
              Unregister
            </SDButton>
          </View>
        ) : (
          <SDButton
            variant="primary-filled"
            size="sm"
            fullWidth
            onPress={() => handleRegister(event.id)}
            disabled={spotsAvailable === 0}
          >
            {spotsAvailable === 0 ? 'Full' : 'Register'}
          </SDButton>
        )}
        </SDCard>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.bannerSpacer} />

          <GlassmorphicCard intensity={80} style={styles.mainCard}>
            {/* Events List */}
            <View style={styles.eventsList}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(renderEvent)
              ) : (
                <SDCard padding="lg" style={styles.emptyState}>
                  <Calendar color={Colors.textSecondary} size={48} />
                  <Text style={styles.emptyTitle}>No events found</Text>
                  <Text style={styles.emptyDescription}>
                    Check back later for new opportunities.
                  </Text>
                </SDCard>
              )}
            </View>
          </GlassmorphicCard>
        </ScrollView>

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : (user?.school as any)?.name || 'Stone Dragon NPO'}
            welcomeMessage="Volunteer Events"
            onLeaderboardPress={() => setLeaderboardVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
            userRole={user?.role}
          />
        </View>

        {/* Modals */}
        <LeaderboardModal
          visible={leaderboardVisible}
          onClose={() => setLeaderboardVisible(false)}
        />
        <NotificationCenterModal
          visible={notificationVisible}
          onClose={() => setNotificationVisible(false)}
        />
        <EventDetailsModal
          visible={eventDetailsVisible}
          onClose={() => setEventDetailsVisible(false)}
          event={selectedEvent}
          currentUserId={user?.id}
          onRegister={handleRegister}
          onUnregister={handleUnregister}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for nav bar
  },
  pageTitle: {
    ...typography.h1,
    color: Colors.light,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  mainCard: {
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  eventsList: {
    gap: spacing.md,
  },
  eventCard: {
    backgroundColor: Colors.card,
  },
  eventTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  eventOrg: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginBottom: spacing.md,
  },
  eventDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eventDetailText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
  },
  eventDescription: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    lineHeight: Sizes.fontSm * 1.5,
    marginBottom: spacing.md,
  },
  registeredSection: {
    gap: spacing.sm,
  },
  registeredBadge: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: `${Colors.golden}1A`,
    borderRadius: Sizes.radiusMd,
    alignItems: 'center',
  },
  registeredText: {
    fontSize: Sizes.fontSm,
    color: Colors.golden,
    fontWeight: '600',
  },
  unregisterButton: {
    borderColor: Colors.red,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
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
});

