import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  SDCard,
  GlassmorphicCard,
  SDFileUpload,
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { Event, ClaimType } from '../../types';

type ActivityType = 'Event' | 'Donation' | 'Volunteer' | 'Other';

interface FormData {
  type: ActivityType | '';
  // Event fields
  event: string;
  eventId?: string;
  // Donation fields
  item: string;
  amount: string;
  // Volunteer fields
  title: string;
  organization: string;
  // Other fields
  activityTitle: string;
  // Common fields
  hours: string;
  description: string;
}

/**
 * HistoryView - Shows past submitted volunteer logs
 */
const HistoryView = () => {
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryLogs();
  }, []);

  const fetchHistoryLogs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getVolunteerLogs();
      if (response.success && response.data) {
        setHistoryLogs(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch history logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      case 'pending':
        return Colors.golden;
      default:
        return Colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  if (historyLogs.length === 0) {
    return (
      <GlassmorphicCard intensity={80} style={styles.emptyHistoryCard}>
        <Text style={styles.emptyHistoryTitle}>No History Yet</Text>
        <Text style={styles.emptyHistoryText}>
          Your submitted volunteer logs will appear here once you start logging hours.
        </Text>
      </GlassmorphicCard>
    );
  }

  return (
    <View style={styles.historyContainer}>
      {historyLogs.map((log) => (
        <GlassmorphicCard key={log.id} intensity={80} style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>{log.description}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(log.status)}1A` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(log.status) }]}>
                {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.historyDetails}>
            <Text style={styles.historyHours}>{log.hours}h</Text>
            <Text style={styles.historyDate}>{formatDate(log.createdAt)}</Text>
          </View>
          {log.coordinatorComment && (
            <Text style={styles.coordinatorComment}>
              Coordinator: {log.coordinatorComment}
            </Text>
          )}
        </GlassmorphicCard>
      ))}
    </View>
  );
};

/**
 * LogHoursScreen - Multi-step form for logging different types of activities
 * Shows type selection first, then dynamic form based on selection
 */
export default function LogHoursScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'log' | 'history'>('log');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const slideAnimation = useState(new Animated.Value(0))[0];
  const [formData, setFormData] = useState<FormData>({
    type: '',
    event: '',
    item: '',
    amount: '',
    title: '',
    organization: '',
    activityTitle: '',
    hours: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [preview, setPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activityTypes: ActivityType[] = ['Event', 'Donation', 'Volunteer', 'Other'];

  // Load registered events when component mounts
  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  // Refresh events when user navigates back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRegisteredEvents();
    });

    return unsubscribe;
  }, [navigation]);

  // Fetch registered events from API
  const fetchRegisteredEvents = async () => {
    console.log('🔄 Fetching registered events...');
    setLoadingEvents(true);
    try {
      const response = await apiService.getMyEvents();
      if (response.success && response.data) {
        console.log('📅 Registered events from API:', response.data);
        setRegisteredEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching registered events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleTypeSelect = (type: ActivityType) => {
    setFormData(prev => ({ ...prev, type }));
    setShowTypeDropdown(false);
    
    // Fetch registered events when Event type is selected
    if (type === 'Event') {
      fetchRegisteredEvents();
    }
  };

  const handleEventSelect = (event: any) => {
    setFormData(prev => ({ 
      ...prev, 
      event: event.title,
      eventId: event.id 
    }));
    setShowEventDropdown(false);
    
    // Auto-fill hours with the event's duration if available
    if (event.duration) {
      setFormData(prev => ({ ...prev, hours: event.duration.toString() }));
    }
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    setPreview(file.uri);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setPreview('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Please select an activity type';
    }

    // Type-specific validation
    if (formData.type === 'Event' && !formData.event.trim()) {
      newErrors.event = 'Event is required';
    }

    if (formData.type === 'Donation') {
      if (!formData.item.trim()) newErrors.item = 'Item is required';
      if (!formData.amount.trim()) newErrors.amount = 'Amount is required';
    }

    if (formData.type === 'Volunteer') {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
      if (!selectedFile) newErrors.photoProof = 'Photo proof is required for volunteer activities';
    }

    if (formData.type === 'Other' && !formData.activityTitle.trim()) {
      newErrors.activityTitle = 'Title is required';
    }

    // Common validation - only require hours for time-based activities
    if (formData.type !== 'Donation') {
      if (!formData.hours.trim()) {
        newErrors.hours = 'Hours are required';
      } else if (isNaN(parseFloat(formData.hours)) || parseFloat(formData.hours) <= 0) {
        newErrors.hours = 'Please enter a valid number of hours';
      }
    }

    // Description validation - optional for donations since we include item/amount
    if (formData.type !== 'Donation') {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters';
      }
    } else {
      // For donations, if description is provided, it should be at least 10 characters
      if (formData.description.trim() && formData.description.trim().length < 10) {
        newErrors.description = 'Description must be at least 10 characters';
      }
    }

    if (!user?.schoolId) {
      newErrors.school = 'School ID is missing. Please update your profile.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTabChange = (tab: 'log' | 'history') => {
    setActiveTab(tab);
    Animated.timing(slideAnimation, {
      toValue: tab === 'log' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    console.log('Submit button pressed');
    console.log('Form data:', formData);
    console.log('Selected file:', selectedFile);
    console.log('User:', user);
    
    // Clear previous errors
    setErrors({});
    
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }

    if (!user?.schoolId) {
      setErrors({ general: 'School ID is missing. Please update your profile.' });
      return;
    }

    setSubmitting(true);

    try {
      // Build a comprehensive description that includes all activity details
      let fullDescription = formData.description;
      
      if (formData.type === 'Event') {
        fullDescription = `Event: ${formData.event}\nDescription: ${formData.description}`;
      } else if (formData.type === 'Donation') {
        fullDescription = `Donation - Item: ${formData.item}, Amount: ${formData.amount}`;
        if (formData.description.trim()) {
          fullDescription += `\nDescription: ${formData.description}`;
        }
      } else if (formData.type === 'Volunteer') {
        fullDescription = `Volunteer Work - Title: ${formData.title}, Organization: ${formData.organization}\nDescription: ${formData.description}`;
      } else if (formData.type === 'Other') {
        fullDescription = `Other Activity - Title: ${formData.activityTitle}\nDescription: ${formData.description}`;
      }

      // Map ActivityType to ClaimType
      const claimTypeMap: Record<ActivityType, ClaimType> = {
        'Event': 'event',
        'Donation': 'donation',
        'Volunteer': 'volunteer',
        'Other': 'other',
      };

      const logData: any = {
        hours: formData.type === 'Other' ? 0 : (formData.type === 'Donation' ? parseFloat(formData.amount) : parseFloat(formData.hours)),
        description: fullDescription,
        date: new Date().toISOString(),
        schoolId: user.schoolId,
        claimType: claimTypeMap[formData.type as ActivityType],
        proofFile: selectedFile || undefined,
      };

      // Add event-specific fields
      if (formData.type === 'Event' && formData.eventId) {
        logData.eventId = formData.eventId;
      }

      // Add donation-specific fields
      if (formData.type === 'Donation') {
        logData.donationItems = parseFloat(formData.amount);
      }

      console.log('Sending log data:', logData);

      const response = await apiService.createVolunteerLog(logData);

      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to submit log');
      }
    } catch (error: any) {
      console.error('Failed to submit log:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to submit. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const renderTypeSelection = () => (
    <GlassmorphicCard intensity={80} style={styles.formCard}>
      <Text style={styles.sectionTitle}>Type *</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowTypeDropdown(!showTypeDropdown)}
      >
        <Text style={[styles.dropdownText, !formData.type && styles.placeholder]}>
          {formData.type || 'Select type'}
        </Text>
        <ChevronDown color={Colors.textSecondary} size={20} />
      </TouchableOpacity>

      {showTypeDropdown && (
        <View style={styles.dropdownList}>
          {activityTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.dropdownItem}
              onPress={() => handleTypeSelect(type)}
            >
              <Text style={styles.dropdownItemText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {errors.type && (
        <Text style={styles.errorText}>{errors.type}</Text>
      )}
    </GlassmorphicCard>
  );

  const renderEventForm = () => (
    <>
      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Event *</Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowEventDropdown(!showEventDropdown)}
          disabled={loadingEvents}
        >
          <Text style={[
            styles.dropdownText,
            !formData.event && styles.placeholder
          ]}>
            {formData.event || (loadingEvents ? 'Loading events...' : 'Select event')}
          </Text>
          <ChevronDown color={Colors.textSecondary} size={20} />
        </TouchableOpacity>
        
        {showEventDropdown && (
          <View style={styles.dropdownList}>
            {registeredEvents.length > 0 ? (
              registeredEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.dropdownItem}
                  onPress={() => handleEventSelect(event)}
                >
                  <View style={styles.eventItem}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventOrg}>{event.organization}</Text>
                    <Text style={styles.eventDate}>{event.date} • {event.hoursAwarded}h</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.dropdownItem}>
                <Text style={styles.noEventsText}>No registered events found</Text>
              </View>
            )}
          </View>
        )}
        
        {errors.event && (
          <Text style={styles.errorText}>{errors.event}</Text>
        )}
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Number of Hours *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2.5"
          value={formData.hours}
          onChangeText={(value) => handleInputChange('hours', value)}
          keyboardType="decimal-pad"
        />
        <Text style={styles.hint}>You can enter decimal values (e.g. 2.5 for 2 hours 30 minutes)</Text>
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any additional notes about your participation..."
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.charCount}>{formData.description.length}/500 characters</Text>
      </GlassmorphicCard>
    </>
  );

  const renderDonationForm = () => (
    <>
      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Item *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Books, Clothes, Food"
          value={formData.item}
          onChangeText={(value) => handleInputChange('item', value)}
        />
        {errors.item && (
          <Text style={styles.errorText}>{errors.item}</Text>
        )}
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 50"
          value={formData.amount}
          onChangeText={(value) => handleInputChange('amount', value)}
          keyboardType="numeric"
        />
        <Text style={styles.hint}>Enter the monetary value or quantity</Text>
        {errors.amount && (
          <Text style={styles.errorText}>{errors.amount}</Text>
        )}
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your donation..."
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.charCount}>{formData.description.length}/500 characters</Text>
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Photo Proof (Optional)</Text>
        <Text style={styles.hint}>Upload a photo of your donation for verification.</Text>
        <SDFileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          acceptedTypes={['image/*']}
          maxSizeMB={10}
          preview={preview}
          label="Upload Photo Proof"
          description="Take a photo or upload from gallery"
        />
      </GlassmorphicCard>
    </>
  );

  const renderVolunteerForm = () => (
    <>
      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Food Bank Volunteer"
          value={formData.title}
          onChangeText={(value) => handleInputChange('title', value)}
        />
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Organization *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Cape Town Food Bank"
          value={formData.organization}
          onChangeText={(value) => handleInputChange('organization', value)}
        />
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Number of Hours *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2.5"
          value={formData.hours}
          onChangeText={(value) => handleInputChange('hours', value)}
          keyboardType="decimal-pad"
        />
        <Text style={styles.hint}>You can enter decimal values (e.g. 2.5 for 2 hours 30 minutes)</Text>
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe what you did during your volunteer work..."
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          numberOfLines={4}
        />
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Photo Proof *</Text>
        <Text style={styles.hint}>Upload a photo of your volunteer work for verification.</Text>
        <SDFileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          acceptedTypes={['image/*']}
          maxSizeMB={10}
          preview={preview}
          label="Upload Photo Proof"
          description="Take a photo or upload from gallery"
        />
        {errors.photoProof && (
          <Text style={styles.errorText}>{errors.photoProof}</Text>
        )}
      </GlassmorphicCard>
    </>
  );

  const renderOtherForm = () => (
    <>
      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Community Fundraiser"
          value={formData.activityTitle}
          onChangeText={(value) => handleInputChange('activityTitle', value)}
        />
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your activity in detail..."
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.charCount}>{formData.description.length}/500 characters</Text>
      </GlassmorphicCard>

      <GlassmorphicCard intensity={80} style={styles.formCard}>
        <Text style={styles.sectionTitle}>Photo Proof (Optional)</Text>
        <Text style={styles.hint}>Upload a photo for verification.</Text>
        <SDFileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          acceptedTypes={['image/*']}
          maxSizeMB={10}
          preview={preview}
          label="Upload Photo Proof"
          description="Take a photo or upload from gallery"
        />
      </GlassmorphicCard>
    </>
  );

  const renderForm = () => {
    switch (formData.type) {
      case 'Event':
        return renderEventForm();
      case 'Donation':
        return renderDonationForm();
      case 'Volunteer':
        return renderVolunteerForm();
      case 'Other':
        return renderOtherForm();
      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.successContainer}>
            <GlassmorphicCard style={styles.successCard}>
              <View style={styles.successIcon}>
                <Check color={Colors.green} size={40} />
              </View>
              <Text style={styles.successTitle}>Submitted Successfully!</Text>
              <Text style={styles.successMessage}>
                Your volunteer hours have been submitted for verification.
              </Text>
              <Text style={styles.successHint}>
                You'll receive a notification once they're reviewed.
              </Text>
            </GlassmorphicCard>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft color={Colors.light} size={24} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Log Hours</Text>
              <Text style={styles.headerSubtitle}>Record your community impact</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

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
                        outputRange: [0, 150], // Half the width of the control
                      }),
                    },
                  ],
                },
              ]}
            />
            <TouchableOpacity
              style={styles.segment}
              onPress={() => handleTabChange('log')}
            >
              <Text style={[styles.segmentText, activeTab === 'log' && styles.activeSegmentText]}>
                Log
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.segment}
              onPress={() => handleTabChange('history')}
            >
              <Text style={[styles.segmentText, activeTab === 'history' && styles.activeSegmentText]}>
                History
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {activeTab === 'log' ? (
              <>
                {errors.general && (
                  <GlassmorphicCard intensity={80} style={styles.errorCard}>
                    <Text style={styles.errorText}>{errors.general}</Text>
                  </GlassmorphicCard>
                )}
                {renderTypeSelection()}
                {formData.type && renderForm()}

                {formData.type && (
                  <SDButton
                    variant="primary-filled"
                    size="lg"
                    fullWidth
                    onPress={handleSubmit}
                    loading={submitting}
                    style={styles.submitButton}
                  >
                    Submit for Verification
                  </SDButton>
                )}
              </>
            ) : (
              <HistoryView />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: Colors.light,
  },
  headerSubtitle: {
    fontSize: Sizes.fontSm,
    color: Colors.light,
    opacity: 0.8,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
  },
  dropdownText: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
    flex: 1,
  },
  placeholder: {
    color: Colors.textSecondary,
  },
  dropdownList: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
  },
  eventItem: {
    gap: spacing.xs,
  },
  eventTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
  },
  eventOrg: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  eventDate: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  noEventsText: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
    fontSize: Sizes.fontMd,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  hint: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  charCount: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  successCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.green}1A`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h1,
    color: Colors.text,
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successHint: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Sizes.fontSm,
    color: Colors.red,
    marginTop: spacing.xs,
  },
  errorCard: {
    padding: spacing.md,
    backgroundColor: `${Colors.red}1A`,
    borderWidth: 1,
    borderColor: `${Colors.red}33`,
    marginBottom: spacing.md,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Sizes.radiusFull,
    padding: 4,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    position: 'relative',
  },
  slidingBackground: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    backgroundColor: Colors.deepPurple,
    borderRadius: Sizes.radiusFull,
    width: '50%',
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    zIndex: 1,
  },
  segmentText: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.light,
    opacity: 0.7,
  },
  activeSegmentText: {
    color: Colors.light,
    opacity: 1,
  },
  historyContainer: {
    gap: spacing.md,
  },
  historyCard: {
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  historyTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: Sizes.radiusFull,
  },
  statusText: {
    fontSize: Sizes.fontXs,
    fontWeight: '600',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyHours: {
    fontSize: Sizes.fontLg,
    fontWeight: '700',
    color: Colors.deepPurple,
  },
  historyDate: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  coordinatorComment: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  emptyHistoryCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyHistoryTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  emptyHistoryText: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: Sizes.fontMd,
    color: Colors.textSecondary,
  },
});