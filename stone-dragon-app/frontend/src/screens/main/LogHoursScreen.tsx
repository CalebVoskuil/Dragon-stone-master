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
  Modal,
} from 'react-native';
import { ArrowLeft, Check, ChevronDown, X, Clock, FileText, AlertCircle, Calendar, Tag } from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  SDCard,
  GlassmorphicCard,
  SDFileUpload,
  GlassmorphicBanner,
} from '../../components/ui';
import { LeaderboardModal, NotificationCenterModal } from '../../components/admin';
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
const HistoryView = ({ onLogPress }: { onLogPress: (log: any) => void }) => {
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
      <SDCard variant="elevated" padding="lg" style={styles.emptyHistoryCard}>
        <Text style={styles.emptyHistoryTitle}>No History Yet</Text>
        <Text style={styles.emptyHistoryText}>
          Your submitted volunteer logs will appear here once you start logging hours.
        </Text>
      </SDCard>
    );
  }

  return (
    <View style={styles.historyContainer}>
      {historyLogs.map((log) => (
        <TouchableOpacity key={log.id} onPress={() => onLogPress(log)} activeOpacity={0.7}>
          <SDCard variant="elevated" padding="sm" style={styles.historyCard}>
            <View style={styles.historyCardContent}>
              {/* Avatar */}
              <View style={styles.historyAvatar}>
                <Text style={styles.historyAvatarText}>
                  {log.hours}h
                </Text>
              </View>

              {/* Content */}
              <View style={styles.historyContent}>
                <View style={styles.historyCardHeader}>
                  <Text style={styles.historyTitle} numberOfLines={1}>
                    {log.description}
                  </Text>
                  <View style={styles.historyHeaderRight}>
                    {log.status === 'approved' && (
                      <View style={[styles.statusBadge, styles.statusApproved]}>
                        <Text style={styles.statusText}>Approved</Text>
                      </View>
                    )}
                    {log.status === 'rejected' && (
                      <View style={[styles.statusBadge, styles.statusRejected]}>
                        <Text style={styles.statusText}>Rejected</Text>
                      </View>
                    )}
                    {log.status === 'pending' && (
                      <View style={[styles.statusBadge, styles.statusPending]}>
                        <Text style={styles.statusText}>Pending</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.historyMetaRow}>
                  <Text style={styles.historyDate}>{formatDate(log.createdAt)}</Text>
                </View>

                {log.coordinatorComment && (
                  <View style={styles.commentContainer}>
                    <Text style={styles.commentLabel}>Feedback:</Text>
                    <Text style={styles.commentText}>{log.coordinatorComment}</Text>
                  </View>
                )}
              </View>
            </View>
          </SDCard>
        </TouchableOpacity>
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
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
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
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logDetailVisible, setLogDetailVisible] = useState(false);
  const [isEditingLog, setIsEditingLog] = useState(false);
  const [editFormData, setEditFormData] = useState<FormData>({
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
  const [editFile, setEditFile] = useState<any>(null);
  const [editPreview, setEditPreview] = useState<string>('');

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

  const resetForm = () => {
    setFormData({
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
    setSelectedFile(null);
    setPreview('');
    setErrors({});
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

    // Description validation - optional for all types
    // No validation needed since description is optional

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
        // Reset form
        resetForm();
        // Show success modal
        setShowSuccess(true);
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
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

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
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
                            outputRange: ['0%', '100%'],
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

              {/* Content */}
              {activeTab === 'log' ? (
                <>
                  {errors.general && (
                    <View style={styles.errorCard}>
                      <Text style={styles.errorText}>{errors.general}</Text>
                    </View>
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
                <HistoryView onLogPress={(log) => {
                  setSelectedLog(log);
                  setIsEditingLog(false);
                  setLogDetailVisible(true);
                }} />
              )}
            </GlassmorphicCard>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : (user?.school as any)?.name || 'Stone Dragon NPO'}
            welcomeMessage="Log Hours"
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

        {/* Success Modal */}
        <Modal
          visible={showSuccess}
          animationType="fade"
          transparent
          statusBarTranslucent
          onRequestClose={() => setShowSuccess(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successModalContainer}>
              <GlassmorphicCard intensity={95} style={styles.successModalCard}>
                <View style={styles.successIconLarge}>
                  <Check color={Colors.green} size={48} strokeWidth={3} />
                </View>
                <Text style={styles.successTitle}>Submitted Successfully!</Text>
                <Text style={styles.successMessage}>
                  Your volunteer hours have been submitted for verification.
                </Text>
                <Text style={styles.successHint}>
                  You'll receive a notification once they're reviewed.
                </Text>
                <SDButton
                  variant="primary-filled"
                  onPress={() => setShowSuccess(false)}
                  style={styles.successButton}
                >
                  Continue
                </SDButton>
              </GlassmorphicCard>
            </View>
          </View>
        </Modal>

        {/* Log Detail Modal */}
        <Modal
          visible={logDetailVisible}
          animationType="fade"
          transparent
          statusBarTranslucent
          onRequestClose={() => {
            setLogDetailVisible(false);
            setIsEditingLog(false);
            setEditFile(null);
            setEditPreview('');
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => {
                setLogDetailVisible(false);
                setIsEditingLog(false);
                setEditFile(null);
                setEditPreview('');
              }}
            />
            <ScrollView
              style={styles.outerScrollView}
              contentContainerStyle={styles.outerScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalContainer}>
                <GlassmorphicCard intensity={95} style={styles.modalContent}>
                  {/* Header */}
                  <View style={styles.header}>
                    <View style={styles.headerLeft}>
                      <View style={styles.headerIcon}>
                        <FileText color={Colors.deepPurple} size={24} />
                      </View>
                      <Text style={styles.headerTitle}>Log Details</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setLogDetailVisible(false);
                        setIsEditingLog(false);
                        setEditFile(null);
                        setEditPreview('');
                      }}
                      style={styles.closeButton}
                    >
                      <X color={Colors.textSecondary} size={24} />
                    </TouchableOpacity>
                  </View>

                  {selectedLog && (
                    <>
                      {/* Activity Type */}
                      {(() => {
                        const desc = selectedLog.description || '';
                        let activityType = 'Other';
                        if (desc.startsWith('Event:')) activityType = 'Event';
                        else if (desc.startsWith('Donation -')) activityType = 'Donation';
                        else if (desc.startsWith('Volunteer Work -')) activityType = 'Volunteer';
                        else if (desc.startsWith('Other Activity -')) activityType = 'Other';
                        
                        return (
                          <View style={styles.section}>
                            <View style={styles.infoRow}>
                              <View style={styles.infoIcon}>
                                <Tag color={Colors.deepPurple} size={20} />
                              </View>
                              <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Type:</Text>
                                <Text style={styles.infoValue}>{activityType}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      })()}

                      {/* Hours */}
                      <View style={styles.section}>
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <Clock color={Colors.deepPurple} size={20} />
                          </View>
                          <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Hours:</Text>
                            <Text style={styles.infoValue}>{selectedLog.hours}h</Text>
                          </View>
                        </View>
                      </View>

                      {/* Status */}
                      <View style={styles.section}>
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <AlertCircle 
                              color={
                                selectedLog.status === 'approved' ? Colors.green :
                                selectedLog.status === 'rejected' ? Colors.red :
                                Colors.golden
                              } 
                              size={20} 
                            />
                          </View>
                          <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Status:</Text>
                            <Text style={[
                              styles.infoValue,
                              { 
                                color: selectedLog.status === 'approved' ? Colors.green :
                                       selectedLog.status === 'rejected' ? Colors.red :
                                       Colors.golden,
                                textTransform: 'capitalize'
                              }
                            ]}>
                              {selectedLog.status}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Activity Date */}
                      {selectedLog.date && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Calendar color={Colors.deepPurple} size={20} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Activity Date:</Text>
                              <Text style={styles.infoValue}>
                                {new Date(selectedLog.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Date Submitted */}
                      <View style={styles.section}>
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <Calendar color={Colors.deepPurple} size={20} />
                          </View>
                          <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Submitted:</Text>
                            <Text style={styles.infoValue}>
                              {new Date(selectedLog.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Donation Items (if applicable) */}
                      {selectedLog.donationItems && selectedLog.donationItems > 0 && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Tag color={Colors.deepPurple} size={20} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Donation Value:</Text>
                              <Text style={styles.infoValue}>{selectedLog.donationItems}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Description */}
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <View style={styles.descriptionBox}>
                          <Text style={styles.descriptionText}>
                            {selectedLog.description || 'No description provided'}
                          </Text>
                        </View>
                      </View>

                      {/* Coordinator Comment */}
                      {selectedLog.coordinatorComment && (
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Coordinator Feedback</Text>
                          <View style={styles.existingCommentBox}>
                            <Text style={styles.existingCommentText}>
                              {selectedLog.coordinatorComment}
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Edit/Resubmit Button for Rejected Logs */}
                      {selectedLog.status === 'rejected' && !isEditingLog && (
                        <View style={styles.section}>
                          <SDButton
                            variant="primary-filled"
                            size="lg"
                            fullWidth
                            onPress={() => {
                              // Parse the original log description to extract all data
                              const desc = selectedLog.description || '';
                              
                              let parsedData: FormData = {
                                type: '',
                                event: '',
                                item: '',
                                amount: '',
                                title: '',
                                organization: '',
                                activityTitle: '',
                                hours: selectedLog.hours?.toString() || '',
                                description: '',
                              };

                              // Detect activity type and parse accordingly
                              if (desc.startsWith('Event:')) {
                                parsedData.type = 'Event';
                                const eventMatch = desc.match(/Event:\s*(.+?)(?:\n|$)/);
                                const descMatch = desc.match(/Description:\s*(.+?)$/s);
                                parsedData.event = eventMatch ? eventMatch[1].trim() : '';
                                parsedData.eventId = selectedLog.eventId || '';
                                parsedData.description = descMatch ? descMatch[1].trim() : '';
                              } else if (desc.startsWith('Donation -')) {
                                parsedData.type = 'Donation';
                                const itemMatch = desc.match(/Item:\s*(.+?),/);
                                const amountMatch = desc.match(/Amount:\s*(.+?)(?:\n|$)/);
                                const descMatch = desc.match(/Description:\s*(.+?)$/s);
                                parsedData.item = itemMatch ? itemMatch[1].trim() : '';
                                parsedData.amount = amountMatch ? amountMatch[1].trim() : '';
                                parsedData.description = descMatch ? descMatch[1].trim() : '';
                              } else if (desc.startsWith('Volunteer Work -')) {
                                parsedData.type = 'Volunteer';
                                const titleMatch = desc.match(/Title:\s*(.+?),/);
                                const orgMatch = desc.match(/Organization:\s*(.+?)(?:\n|$)/);
                                const descMatch = desc.match(/Description:\s*(.+?)$/s);
                                parsedData.title = titleMatch ? titleMatch[1].trim() : '';
                                parsedData.organization = orgMatch ? orgMatch[1].trim() : '';
                                parsedData.description = descMatch ? descMatch[1].trim() : '';
                              } else if (desc.startsWith('Other Activity -')) {
                                parsedData.type = 'Other';
                                const titleMatch = desc.match(/Title:\s*(.+?)(?:\n|$)/);
                                const descMatch = desc.match(/Description:\s*(.+?)$/s);
                                parsedData.activityTitle = titleMatch ? titleMatch[1].trim() : '';
                                parsedData.description = descMatch ? descMatch[1].trim() : '';
                              } else {
                                // Fallback: couldn't parse, just use description as-is
                                parsedData.description = desc;
                              }
                              
                              setEditFormData(parsedData);
                              setEditFile(null);
                              setEditPreview('');
                              setIsEditingLog(true);
                            }}
                          >
                            Edit & Resubmit
                          </SDButton>
                        </View>
                      )}

                      {/* Edit Form for Rejected Logs */}
                      {isEditingLog && selectedLog.status === 'rejected' && (
                        <View style={styles.editSection}>
                          <Text style={styles.editSectionTitle}>Edit Log Information</Text>
                          
                          {/* Hours Input */}
                          <View style={styles.editInputGroup}>
                            <Text style={styles.editLabel}>Hours *</Text>
                            <TextInput
                              style={styles.editInput}
                              value={editFormData.hours}
                              onChangeText={(value) => setEditFormData(prev => ({ ...prev, hours: value }))}
                              keyboardType="decimal-pad"
                              placeholder="e.g. 2.5"
                            />
                          </View>

                          {/* Description Input */}
                          <View style={styles.editInputGroup}>
                            <Text style={styles.editLabel}>Description *</Text>
                            <TextInput
                              style={[styles.editInput, styles.editTextArea]}
                              value={editFormData.description}
                              onChangeText={(value) => setEditFormData(prev => ({ ...prev, description: value }))}
                              multiline
                              numberOfLines={4}
                              placeholder="Describe your activity..."
                            />
                          </View>

                          {/* Photo Proof Upload */}
                          <View style={styles.editInputGroup}>
                            <Text style={styles.editLabel}>
                              Photo Proof {editFormData.type === 'Volunteer' ? '*' : '(Optional)'}
                            </Text>
                            <Text style={styles.editHint}>
                              {editFormData.type === 'Volunteer' 
                                ? 'Photo proof is required for volunteer activities.'
                                : 'Upload a photo for verification (optional).'}
                            </Text>
                            <SDFileUpload
                              onFileSelect={(file) => {
                                setEditFile(file);
                                setEditPreview(file.uri);
                              }}
                              onFileRemove={() => {
                                setEditFile(null);
                                setEditPreview('');
                              }}
                              acceptedTypes={['image/*']}
                              maxSizeMB={10}
                              preview={editPreview}
                              label="Upload Photo Proof"
                              description="Take a photo or upload from gallery"
                            />
                          </View>

                          {/* Action Buttons */}
                          <View style={styles.editButtonGroup}>
                            <TouchableOpacity
                              style={styles.editCancelButton}
                              onPress={() => {
                                setIsEditingLog(false);
                                setEditFile(null);
                                setEditPreview('');
                              }}
                            >
                              <Text style={styles.editCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.editSaveButton}
                              onPress={async () => {
                                // Validate
                                if (!editFormData.hours || parseFloat(editFormData.hours) <= 0) {
                                  Alert.alert('Error', 'Please enter valid hours');
                                  return;
                                }
                                if (editFormData.type === 'Volunteer' && !editFile) {
                                  Alert.alert('Error', 'Photo proof is required for volunteer activities');
                                  return;
                                }

                                try {
                                  setSubmitting(true);
                                  
                                  // Build description based on type
                                  let fullDescription = editFormData.description;
                                  if (editFormData.type === 'Event') {
                                    fullDescription = `Event: ${editFormData.event}\nDescription: ${editFormData.description}`;
                                  } else if (editFormData.type === 'Donation') {
                                    fullDescription = `Donation - Item: ${editFormData.item}, Amount: ${editFormData.amount}`;
                                    if (editFormData.description.trim()) {
                                      fullDescription += `\nDescription: ${editFormData.description}`;
                                    }
                                  } else if (editFormData.type === 'Volunteer') {
                                    fullDescription = `Volunteer Work - Title: ${editFormData.title}, Organization: ${editFormData.organization}\nDescription: ${editFormData.description}`;
                                  } else if (editFormData.type === 'Other') {
                                    fullDescription = `Other Activity - Title: ${editFormData.activityTitle}\nDescription: ${editFormData.description}`;
                                  }

                                  const claimTypeMap: Record<ActivityType, ClaimType> = {
                                    'Event': 'event',
                                    'Donation': 'donation',
                                    'Volunteer': 'volunteer',
                                    'Other': 'other',
                                  };

                                  const logData: any = {
                                    hours: editFormData.type === 'Donation' ? parseFloat(editFormData.amount) : parseFloat(editFormData.hours),
                                    description: fullDescription,
                                    date: new Date().toISOString(),
                                    schoolId: user?.schoolId,
                                    claimType: claimTypeMap[editFormData.type as ActivityType],
                                    proofFile: editFile || undefined,
                                  };

                                  if (editFormData.type === 'Event' && editFormData.eventId) {
                                    logData.eventId = editFormData.eventId;
                                  }

                                  if (editFormData.type === 'Donation') {
                                    logData.donationItems = parseFloat(editFormData.amount);
                                  }

                                  const response = await apiService.createVolunteerLog(logData);

                                  if (response.success) {
                                    setLogDetailVisible(false);
                                    setIsEditingLog(false);
                                    setEditFile(null);
                                    setEditPreview('');
                                    Alert.alert('Success', 'Your log has been resubmitted successfully!');
                                    // Refresh history if on history tab
                                    if (activeTab === 'history') {
                                      handleTabChange('history');
                                    }
                                  } else {
                                    throw new Error(response.message || 'Failed to resubmit log');
                                  }
                                } catch (error: any) {
                                  Alert.alert('Error', error.message || 'Failed to resubmit log');
                                } finally {
                                  setSubmitting(false);
                                }
                              }}
                            >
                              <Text style={styles.editSaveButtonText}>Save & Resubmit</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </GlassmorphicCard>
              </View>
            </ScrollView>
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
  keyboardView: {
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
    height: 150,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  mainCard: {
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
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
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  successModalCard: {
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: 400,
    marginHorizontal: spacing.lg,
  },
  successIconLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${Colors.green}1A`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h1,
    color: Colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
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
    marginBottom: spacing.lg,
  },
  successButton: {
    minWidth: 150,
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: Sizes.radiusFull,
    padding: 4,
    marginBottom: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
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
  historyContainer: {
    gap: spacing.sm,
  },
  historyCard: {
    backgroundColor: Colors.card,
    marginBottom: spacing.sm,
  },
  historyCardContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  historyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyAvatarText: {
    fontSize: Sizes.fontMd,
    fontWeight: '700',
    color: Colors.deepPurple,
  },
  historyContent: {
    flex: 1,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  historyTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  historyHeaderRight: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  historyMetaRow: {
    flexDirection: 'row',
  },
  historyDate: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: Sizes.radiusFull,
  },
  statusApproved: {
    backgroundColor: Colors.green,
  },
  statusRejected: {
    backgroundColor: Colors.red,
  },
  statusPending: {
    backgroundColor: Colors.golden,
  },
  statusText: {
    fontSize: Sizes.fontXs,
    fontWeight: '700',
    color: Colors.light,
  },
  commentContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  commentLabel: {
    fontSize: Sizes.fontXs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  commentText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    fontStyle: 'italic',
  },
  emptyHistoryCard: {
    alignItems: 'center',
    backgroundColor: Colors.card,
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
  // Log Detail Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  outerScrollView: {
    flex: 1,
    width: '100%',
  },
  outerScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
  },
  modalContent: {
    padding: spacing.xl,
    gap: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Sizes.fontXl,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  section: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
  },
  descriptionBox: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descriptionText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    lineHeight: 20,
  },
  existingCommentBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  existingCommentText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  // Edit Form Styles
  editSection: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    gap: spacing.md,
  },
  editSectionTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.deepPurple,
    marginBottom: spacing.sm,
  },
  editInputGroup: {
    gap: spacing.xs,
  },
  editLabel: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.text,
  },
  editHint: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  editInput: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
    fontSize: Sizes.fontMd,
    color: Colors.text,
  },
  editTextArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  editButtonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  editCancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
    borderColor: Colors.deepPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editCancelButtonText: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.deepPurple,
  },
  editSaveButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.deepPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editSaveButtonText: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.light,
  },
});