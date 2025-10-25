import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import {
  GradientBackground,
  GlassmorphicCard,
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

/**
 * EventsScreen - Events management (To be implemented)
 * Placeholder for future events functionality
 */
export default function EventsScreen() {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Calendar color={Colors.deepPurple} size={64} />
            </View>
            <Text style={styles.title}>Events</Text>
            <Text style={styles.description}>
              Events management coming soon
            </Text>
            <Text style={styles.subtitle}>
              This feature will allow coordinators to create and manage volunteer events
            </Text>
          </View>
        </GlassmorphicCard>
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
    margin: spacing.lg,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.deepPurple}1A`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: Colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: Sizes.fontLg,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

