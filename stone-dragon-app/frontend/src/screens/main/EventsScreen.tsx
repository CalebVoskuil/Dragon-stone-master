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
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { eventsService, Event } from '../../services/eventsService';

export default function EventsScreen() {
  const [filter, setFilter] = useState<'all' | 'registered' | 'available'>('all');
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from shared service
  useEffect(() => {
    setEvents(eventsService.getAllEvents());
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter === 'registered') return event.isRegistered;
    if (filter === 'available') return !event.isRegistered;
    return true;
  });

  const handleRegister = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Check if event is full
    if (event.spotsAvailable === 0) {
      Alert.alert('Event Full', 'Sorry, this event is already full.');
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Confirm Registration',
      `Are you sure you want to register for "${event.title}"?\n\nThis event awards ${event.hoursAwarded} volunteer hours.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Register',
          onPress: () => {
            // Use shared service to register
            console.log('🎯 Attempting to register for event:', eventId);
            const success = eventsService.registerForEvent(eventId);
            console.log('✅ Registration success:', success);
            if (success) {
              // Refresh events from service
              const updatedEvents = eventsService.getAllEvents();
              console.log('🔄 Updated events:', updatedEvents);
              setEvents(updatedEvents);

              // Show success message
              Alert.alert(
                'Registration Successful!',
                `You've been registered for "${event.title}". You'll receive ${event.hoursAwarded} volunteer hours upon completion.`,
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert('Registration Failed', 'Unable to register for this event.');
            }
          },
        },
      ]
    );
  };

  const handleUnregister = (eventId: string) => {
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
          onPress: () => {
            // Use shared service to unregister
            const success = eventsService.unregisterFromEvent(eventId);
            if (success) {
              // Refresh events from service
              setEvents(eventsService.getAllEvents());

              // Show confirmation message
              Alert.alert(
                'Unregistered Successfully',
                `You've been unregistered from "${event.title}".`,
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert('Unregistration Failed', 'Unable to unregister from this event.');
            }
          },
        },
      ]
    );
  };

  const renderEvent = (event: Event) => (
    <SDCard key={event.id} variant="elevated" padding="md" style={styles.eventCard}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventOrg}>{event.organization}</Text>

      <View style={styles.eventDetails}>
        <View style={styles.eventDetail}>
          <Calendar color={Colors.deepPurple} size={16} />
          <Text style={styles.eventDetailText}>
            {event.date} • {event.time}
          </Text>
        </View>

        <View style={styles.eventDetail}>
          <MapPin color={Colors.deepPurple} size={16} />
          <Text style={styles.eventDetailText}>{event.location}</Text>
        </View>

        <View style={styles.eventDetail}>
          <Clock color={Colors.deepPurple} size={16} />
          <Text style={styles.eventDetailText}>{event.hoursAwarded} hours awarded</Text>
        </View>

        <View style={styles.eventDetail}>
          <Users color={Colors.deepPurple} size={16} />
          <Text style={styles.eventDetailText}>
            {event.spotsAvailable}/{event.totalSpots} spots available
          </Text>
        </View>
      </View>

      <Text style={styles.eventDescription} numberOfLines={2}>
        {event.description}
      </Text>

      {event.isRegistered ? (
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
          disabled={event.spotsAvailable === 0}
        >
          {event.spotsAvailable === 0 ? 'Full' : 'Register'}
        </SDButton>
      )}
    </SDCard>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.pageTitle}>Volunteer Events</Text>

          <GlassmorphicCard intensity={80} style={styles.mainCard}>
            {/* Filter Tabs */}
            <View style={styles.filterTabs}>
              <TouchableOpacity
                onPress={() => setFilter('all')}
                style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    filter === 'all' && styles.filterTabTextActive,
                  ]}
                >
                  All Events
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilter('registered')}
                style={[
                  styles.filterTab,
                  filter === 'registered' && styles.filterTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    filter === 'registered' && styles.filterTabTextActive,
                  ]}
                >
                  My Events
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilter('available')}
                style={[
                  styles.filterTab,
                  filter === 'available' && styles.filterTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    filter === 'available' && styles.filterTabTextActive,
                  ]}
                >
                  Available
                </Text>
              </TouchableOpacity>
            </View>

            {/* Events List */}
            <View style={styles.eventsList}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(renderEvent)
              ) : (
                <SDCard padding="lg" style={styles.emptyState}>
                  <Calendar color={Colors.textSecondary} size={48} />
                  <Text style={styles.emptyTitle}>No events found</Text>
                  <Text style={styles.emptyDescription}>
                    {filter === 'registered'
                      ? "You haven't registered for any events yet."
                      : 'Check back later for new opportunities.'}
                  </Text>
                </SDCard>
              )}
            </View>
          </GlassmorphicCard>
        </ScrollView>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: Colors.deepPurple,
  },
  filterTabText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.light,
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

