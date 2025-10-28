import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, FlatList, Dimensions } from 'react-native';
import { ChevronRight, Shield, Clock, Award, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { GradientBackground, SDButton, SDCard, GlassmorphicCard } from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

/**
 * WelcomeScreen - Onboarding carousel for new users
 * Shows key features and benefits of the Stone Dragon app
 */
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleGetStarted = () => {
    navigation.navigate('Register' as never);
  };

  const handleViewPrivacy = () => {
    setPrivacyPolicyVisible(true);
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentSlide(slideIndex);
  };

  const scrollToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentSlide(index);
  };

  const slides = [
    {
      id: '1',
      icon: Award,
      title: 'Welcome to Stone Dragon NPO',
      subtitle: 'Making a difference, one hour at a time',
      description:
        'Track your volunteer hours, earn badges, and contribute to positive change in our Cape Town community.',
    },
    {
      id: '2',
      icon: Clock,
      title: 'Log Your Impact',
      subtitle: 'Every hour counts',
      description:
        'Easily log volunteer hours with photo proof. Our coordinators verify your contributions and award points for your dedication.',
    },
    {
      id: '3',
      icon: Shield,
      title: 'Your Privacy Matters',
      subtitle: 'Safe and secure',
      description:
        'We protect your personal information in compliance with POPIA. Your data is used only to track your volunteer contributions.',
    },
  ];

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    const Icon = item.icon;
    return (
      <View style={styles.slideContainer}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon color={Colors.deepPurple} size={48} />
          </View>
        </View>

        {/* Content Card */}
        <SDCard variant="elevated" padding="lg" style={styles.contentCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </SDCard>
      </View>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Swipeable Carousel */}
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={false}
            style={styles.carousel}
          />

          {/* Slide Indicators */}
          <View style={styles.indicators}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => scrollToSlide(index)}
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
                onPress={() => scrollToSlide(currentSlide + 1)}
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
        </View>

        {/* Skip Button */}
        {currentSlide < slides.length - 1 && (
          <TouchableOpacity onPress={handleGetStarted} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        {/* Privacy Policy Modal */}
        <Modal
          visible={privacyPolicyVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setPrivacyPolicyVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <GlassmorphicCard intensity={95} style={styles.modalCard}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <Shield color={Colors.deepPurple} size={24} />
                  <Text style={styles.modalTitle}>Privacy Policy</Text>
                  <TouchableOpacity 
                    onPress={() => setPrivacyPolicyVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <X color={Colors.textSecondary} size={24} />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView 
                  style={styles.modalContent}
                  showsVerticalScrollIndicator={true}
                  indicatorStyle="default"
                >
                  <Text style={styles.policyTitle}>Stone Dragon App – POPIA Privacy Policy</Text>
                  <Text style={styles.policyDate}>Effective Date: 28 October 2025</Text>
                  <Text style={styles.policyDate}>Last Updated: 28 October 2025</Text>

                  <Text style={styles.sectionHeading}>1. Introduction</Text>
                  <Text style={styles.policyText}>
                    Stone Dragon ("we", "our", or "us") is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA), Act No. 4 of 2013.
                  </Text>
                  <Text style={styles.policyText}>
                    This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the Stone Dragon App and related services.
                  </Text>
                  <Text style={styles.policyText}>
                    By using our app, you agree to the terms of this Privacy Policy.
                  </Text>

                  <Text style={styles.sectionHeading}>2. Information We Collect</Text>
                  <Text style={styles.policySubheading}>2.1 Personal Information:</Text>
                  <Text style={styles.policyText}>
                    Full name, email address, mobile number, profile photo (optional), organization or community affiliation.
                  </Text>
                  <Text style={styles.policySubheading}>2.2 Usage and Technical Information:</Text>
                  <Text style={styles.policyText}>
                    Device type, operating system, IP address, app performance data, in-app interactions and preferences.
                  </Text>
                  <Text style={styles.policySubheading}>2.3 Optional Data (with consent):</Text>
                  <Text style={styles.policyText}>
                    Location data for event mapping or camp directions, and media uploads (photos/videos shared through the app).
                  </Text>

                  <Text style={styles.sectionHeading}>3. How We Use Your Information</Text>
                  <Text style={styles.policyText}>
                    We use collected information to register users, manage profiles, facilitate events, process donations, communicate updates, and improve app security. We will never sell, rent, or trade your information.
                  </Text>

                  <Text style={styles.sectionHeading}>4. Data Storage and Protection</Text>
                  <Text style={styles.policyText}>
                    Your information is stored securely on encrypted servers. Access is restricted to authorized Stone Dragon personnel and trusted service providers. Data is retained only as long as necessary or required by law.
                  </Text>

                  <Text style={styles.sectionHeading}>5. Sharing of Information</Text>
                  <Text style={styles.policyText}>
                    We may share limited data with trusted service providers for functionality or as required by law. All partners are bound by confidentiality and data-protection agreements consistent with POPIA.
                  </Text>

                  <Text style={styles.sectionHeading}>6. Your Rights Under POPIA</Text>
                  <Text style={styles.policyText}>
                    You have the right to access, correct, delete, or withdraw consent regarding your information. You can also object to processing and lodge complaints with the Information Regulator of South Africa.
                  </Text>
                  <Text style={styles.policyText}>
                    Contact: complaints.IR@justice.gov.za | Website: https://www.justice.gov.za/inforeg/
                  </Text>

                  <Text style={styles.sectionHeading}>7. Children's Privacy</Text>
                  <Text style={styles.policyText}>
                    The Stone Dragon App may include youth programs. We do not knowingly collect personal information from children under 13 without parental consent.
                  </Text>

                  <Text style={styles.sectionHeading}>8. Policy Updates</Text>
                  <Text style={styles.policyText}>
                    We may update this policy periodically to reflect changes in our practices or legal requirements.
                  </Text>

                  <Text style={styles.sectionHeading}>9. Contact Us</Text>
                  <Text style={styles.policyText}>Stone Dragon (Non-Profit Organisation)</Text>
                  <Text style={styles.policyText}>• Cape Town, South Africa</Text>
                  <Text style={styles.policyText}>• privacy@stonedragon.org.za</Text>
                  <Text style={styles.policyText}>• +27 21 555 9083</Text>
                </ScrollView>

                {/* Close Button */}
                <SDButton
                  variant="primary-filled"
                  onPress={() => setPrivacyPolicyVisible(false)}
                  style={styles.modalButton}
                >
                  Close
                </SDButton>
              </GlassmorphicCard>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  carousel: {
    flexGrow: 0,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
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
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
  },
  modalCard: {
    padding: spacing.xl,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: {
    ...typography.h2,
    color: Colors.text,
    flex: 1,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  modalContent: {
    maxHeight: 500,
    marginBottom: spacing.lg,
  },
  policyTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  policyDate: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sectionHeading: {
    fontSize: Sizes.fontMd,
    fontWeight: '700',
    color: Colors.deepPurple,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  policySubheading: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  policyText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    lineHeight: Sizes.fontSm * 1.6,
    marginBottom: spacing.sm,
  },
  modalButton: {
    marginTop: spacing.md,
  },
});

