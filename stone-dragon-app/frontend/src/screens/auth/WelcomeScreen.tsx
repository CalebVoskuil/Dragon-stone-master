import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronRight, Shield, Clock, Award } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { GradientBackground, SDButton, SDCard } from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

/**
 * WelcomeScreen - Onboarding carousel for new users
 * Shows key features and benefits of the Stone Dragon app
 */
export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGetStarted = () => {
    navigation.navigate('Register' as never);
  };

  const handleViewPrivacy = () => {
    // TODO: Navigate to privacy policy screen
    console.log('View Privacy Policy');
  };

  const slides = [
    {
      icon: Award,
      title: 'Welcome to Stone Dragon NPO',
      subtitle: 'Making a difference, one hour at a time',
      description:
        'Track your volunteer hours, earn badges, and contribute to positive change in our Cape Town community.',
    },
    {
      icon: Clock,
      title: 'Log Your Impact',
      subtitle: 'Every hour counts',
      description:
        'Easily log volunteer hours with photo proof. Our coordinators verify your contributions and award points for your dedication.',
    },
    {
      icon: Shield,
      title: 'Your Privacy Matters',
      subtitle: 'Safe and secure',
      description:
        'We protect your personal information in compliance with POPIA. Your data is used only to track your volunteer contributions.',
    },
  ];

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon color={Colors.deepPurple} size={48} />
            </View>
          </View>

          {/* Content Card */}
          <SDCard variant="elevated" padding="lg" style={styles.contentCard}>
            <Text style={styles.title}>{currentSlideData.title}</Text>
            <Text style={styles.subtitle}>{currentSlideData.subtitle}</Text>
            <Text style={styles.description}>{currentSlideData.description}</Text>
          </SDCard>

          {/* Slide Indicators */}
          <View style={styles.indicators}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
                style={[styles.indicator, index === currentSlide && styles.indicatorActive]}
                accessibilityLabel={`Go to slide ${index + 1}`}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigation}>
            {currentSlide < slides.length - 1 ? (
              <SDButton
                variant="primary-filled"
                size="lg"
                fullWidth
                onPress={() => setCurrentSlide(currentSlide + 1)}
              >
                Next
              </SDButton>
            ) : (
              <SDButton
                variant="primary-filled"
                size="lg"
                fullWidth
                onPress={handleGetStarted}
              >
                Get Started
              </SDButton>
            )}

            <TouchableOpacity onPress={handleViewPrivacy} style={styles.privacyButton}>
              <Text style={styles.privacyText}>Privacy Policy & Consent Information</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Skip Button */}
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity onPress={handleGetStarted} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.deepPurple}1A`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCard: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.deepPurple,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Sizes.fontSm * 1.6,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  indicatorActive: {
    backgroundColor: Colors.deepPurple,
    width: 24,
  },
  navigation: {
    gap: spacing.md,
  },
  privacyButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  privacyText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    textDecorationLine: 'underline',
  },
  skipButton: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  skipText: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
});

