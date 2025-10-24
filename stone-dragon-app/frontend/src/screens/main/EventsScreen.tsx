import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
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

interface Event {
  id: string;
  title: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  spotsAvailable: number;
  totalSpots: number;
  description: string;
  hoursAwarded: number;
  isRegistered: boolean;
}

/**
 * EventsScreen - Browse and register for volunteer events
 * Shows upcoming volunteer opportunities
 */
export default function EventsScreen() {
  const [filter, setFilter] = useState<'all' | 'registered' | 'available'>('all');

  // Mock events data - replace with actual API call
  const events: Event[] = [
    {
      id: '1',
      title: 'Beach Cleanup Drive',
      organization: 'Cape Town Environmental Group',
      date: 'Nov 15, 2025',
      time: '09:00 AM - 12:00 PM',
      location: 'Camps Bay Beach',
      spotsAvailable: 15,
      totalSpots: 30,
      description: 'Join us for a morning beach cleanup to keep our shores beautiful.',
      hoursAwarded: 3,
      isRegistered: true,
    },
    {
      id: '2',
      title: 'Food Bank Distribution',
      organization: 'Community Outreach Foundation',
      date: 'Nov 20, 2025',
      time: '10:00 AM - 02:00 PM',
      location: 'District Six Community Center',
      spotsAvailable: 8,
      totalSpots: 20,
      description: 'Help distribute food parcels to families in need.',
      hoursAwarded: 4,
      isRegistered: false,
    },
    {
      id: '3',
      title: 'Youth Mentorship Program',
      organization: 'Stone Dragon NPO',
      date: 'Nov 25, 2025',
      time: '03:00 PM - 05:00 PM',
      location: 'Langa Youth Center',
      spotsAvailable: 5,
      totalSpots: 15,
      description: 'Mentor young students with homework and life skills.',
      hoursAwarded: 2,
      isRegistered: false,
    },
    {
      id: '4',
      title: 'Animal Shelter Support',
      organization: 'Cape Animal Welfare',
      date: 'Dec 1, 2025',
      time: '11:00 AM - 03:00 PM',
      location: 'Animal Shelter, Plumstead',
      spotsAvailable: 12,
      totalSpots: 12,
      description: 'Help care for rescued animals and maintain shelter facilities.',
      hoursAwarded: 4,
      isRegistered: false,
    },
  ];

  const filteredEvents = events.filter((event) => {
    if (filter === 'registered') return event.isRegistered;
    if (filter === 'available') return !event.isRegistered;
    return true;
  });

  const handleRegister = (eventId: string) => {
    // TODO: Implement actual registration API call
    console.log('Register for event:', eventId);
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
        <View style={styles.registeredBadge}>
          <Text style={styles.registeredText}>✓ Registered</Text>
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

