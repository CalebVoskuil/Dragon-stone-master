import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { School, CreateVolunteerLogData } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { SDButton } from '../../components/SDButton';
import { SDCard } from '../../components/SDCard';
import { SDInput } from '../../components/SDInput';
import { SDFileUpload } from '../../components/SDFileUpload';

interface LogHoursFormData {
  logType: 'event' | 'donation' | 'volunteer' | 'other';
  hours: string;
  description: string;
  date: string;
  schoolId: string;
  eventTitle?: string;
  organization?: string;
  item?: string;
  amount?: string;
}

type LogType = 'event' | 'donation' | 'volunteer' | 'other';

const LogHoursScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolMenuVisible, setSchoolMenuVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LogHoursFormData>({
    defaultValues: {
      logType: 'volunteer',
      hours: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      schoolId: '',
      eventTitle: '',
      organization: '',
      item: '',
      amount: '',
    },
  });

  const watchedSchoolId = watch('schoolId');
  const watchedLogType = watch('logType');

  useEffect(() => {
    loadSchools();
  }, []);

  useEffect(() => {
    if (watchedSchoolId && schools.length > 0) {
      const school = schools.find(s => s.id === watchedSchoolId);
      setSelectedSchool(school || null);
    }
  }, [watchedSchoolId, schools]);

  const loadSchools = async () => {
    try {
      setIsLoadingSchools(true);
      const response = await apiService.getSchools();
      if (response.success && response.data) {
        setSchools(response.data);
      }
    } catch (error) {
      console.error('Error loading schools:', error);
      Alert.alert('Error', 'Failed to load schools');
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const getLogTypeConfig = (type: LogType) => {
    switch (type) {
      case 'event':
        return {
          title: 'Event Participation',
          subtitle: 'Log hours from school or community events',
          requiredFields: ['eventTitle', 'hours'],
          optionalFields: ['description'],
          fileRequired: false,
        };
      case 'donation':
        return {
          title: 'Donation',
          subtitle: 'Log donations with optional photo proof',
          requiredFields: ['item', 'amount'],
          optionalFields: ['description'],
          fileRequired: false,
        };
      case 'volunteer':
        return {
          title: 'Volunteer Work',
          subtitle: 'Log volunteer activities with required photo proof',
          requiredFields: ['organization', 'hours'],
          optionalFields: ['description'],
          fileRequired: true,
        };
      case 'other':
        return {
          title: 'Other Activity',
          subtitle: 'Log other community service activities',
          requiredFields: ['description'],
          optionalFields: ['hours'],
          fileRequired: false,
        };
      default:
        return {
          title: 'Volunteer Work',
          subtitle: 'Log volunteer activities',
          requiredFields: ['hours'],
          optionalFields: ['description'],
          fileRequired: false,
        };
    }
  };

  const onSubmit = async (data: LogHoursFormData) => {
    try {
      setIsLoading(true);

      const config = getLogTypeConfig(data.logType);
      
      // Validate required fields based on log type
      if (config.fileRequired && !selectedFile) {
        Alert.alert('Error', 'Photo proof is required for this log type');
        return;
      }

      const logData: CreateVolunteerLogData = {
        hours: data.hours ? parseFloat(data.hours) : 0,
        description: data.description,
        date: new Date(data.date).toISOString(),
        schoolId: data.schoolId,
        proofFile: selectedFile,
      };

      const response = await apiService.createVolunteerLog(logData);

      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigation.navigate('MyLogs' as never);
        }, 2000);
      } else {
        Alert.alert('Error', response.message || 'Failed to log hours');
      }
    } catch (error: any) {
      console.error('Error logging hours:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to log hours'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSchools) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading schools...</Text>
      </View>
    );
  }

  if (showSuccess) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successContent}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={80} color={colors.accept} />
          </View>
          <Text style={styles.successTitle}>Hours Logged Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Your volunteer hours have been submitted for review.
          </Text>
        </View>
      </View>
    );
  }

  const config = getLogTypeConfig(watchedLogType);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log Hours</Text>
            <Text style={styles.subtitle}>{config.subtitle}</Text>
          </View>

          {/* Log Type Selector */}
          <SDCard padding="lg" style={styles.typeCard}>
            <Text style={styles.sectionTitle}>Activity Type</Text>
            <View style={styles.typeButtons}>
              {(['event', 'donation', 'volunteer', 'other'] as LogType[]).map((type) => (
                <SDButton
                  key={type}
                  variant={watchedLogType === type ? 'primary-filled' : 'ghost'}
                  size="sm"
                  onPress={() => setValue('logType', type)}
                  style={styles.typeButton}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SDButton>
              ))}
            </View>
          </SDCard>

          {/* Dynamic Form Fields */}
          <SDCard padding="lg" style={styles.formCard}>
            <Text style={styles.sectionTitle}>{config.title}</Text>

            {/* Event Title (for event type) */}
            {watchedLogType === 'event' && (
              <Controller
                control={control}
                name="eventTitle"
                rules={{ required: 'Event title is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <SDInput
                    label="Event Title"
                    placeholder="e.g., School Cleanup Day"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.eventTitle?.message}
                    required
                  />
                )}
              />
            )}

            {/* Organization (for volunteer type) */}
            {watchedLogType === 'volunteer' && (
              <Controller
                control={control}
                name="organization"
                rules={{ required: 'Organization is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <SDInput
                    label="Organization"
                    placeholder="e.g., Local Food Bank"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.organization?.message}
                    required
                  />
                )}
              />
            )}

            {/* Item and Amount (for donation type) */}
            {watchedLogType === 'donation' && (
              <>
                <Controller
                  control={control}
                  name="item"
                  rules={{ required: 'Item is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SDInput
                      label="Item Donated"
                      placeholder="e.g., School Supplies"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.item?.message}
                      required
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="amount"
                  rules={{ required: 'Amount is required' }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SDInput
                      label="Amount/Value"
                      placeholder="e.g., $50 or 20 items"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.amount?.message}
                      required
                    />
                  )}
                />
              </>
            )}

            {/* Hours (for event and volunteer types) */}
            {(watchedLogType === 'event' || watchedLogType === 'volunteer') && (
              <Controller
                control={control}
                name="hours"
                rules={{
                  required: 'Hours are required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Enter valid hours (e.g., 2.5)',
                  },
                  validate: (value) => {
                    const num = parseFloat(value);
                    if (num < 0.5) return 'Minimum 0.5 hours required';
                    if (num > 24) return 'Maximum 24 hours per day';
                    return true;
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <SDInput
                    label="Hours"
                    placeholder="e.g., 2.5"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.hours?.message}
                    keyboardType="numeric"
                    required
                  />
                )}
              />
            )}

            {/* Hours (optional for other type) */}
            {watchedLogType === 'other' && (
              <Controller
                control={control}
                name="hours"
                rules={{
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Enter valid hours (e.g., 2.5)',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <SDInput
                    label="Hours (Optional)"
                    placeholder="e.g., 2.5"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.hours?.message}
                    keyboardType="numeric"
                  />
                )}
              />
            )}

            {/* Description */}
            <Controller
              control={control}
              name="description"
              rules={{
                required: watchedLogType === 'other' ? 'Description is required' : false,
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SDInput
                  label={watchedLogType === 'other' ? 'Description' : 'Description (Optional)'}
                  placeholder="Describe your activities..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.description?.message}
                  multiline
                  numberOfLines={4}
                  required={watchedLogType === 'other'}
                />
              )}
            />

            {/* Date */}
            <Controller
              control={control}
              name="date"
              rules={{ required: 'Date is required' }}
              render={({ field: { onChange, value } }) => (
                <SDInput
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                  error={errors.date?.message}
                  required
                />
              )}
            />

            {/* School Selection */}
            <View style={styles.schoolContainer}>
              <Text style={styles.schoolLabel}>School *</Text>
              <Menu
                visible={schoolMenuVisible}
                onDismiss={() => setSchoolMenuVisible(false)}
                anchor={
                  <SDButton
                    variant="ghost"
                    size="lg"
                    onPress={() => setSchoolMenuVisible(true)}
                    style={styles.schoolButton}
                    icon="school"
                  >
                    {selectedSchool ? selectedSchool.name : 'Select School'}
                  </SDButton>
                }
              >
                {schools.map((school) => (
                  <Menu.Item
                    key={school.id}
                    onPress={() => {
                      setValue('schoolId', school.id);
                      setSchoolMenuVisible(false);
                    }}
                    title={school.name}
                  />
                ))}
              </Menu>
            </View>
            {errors.schoolId && (
              <Text style={styles.errorText}>Please select a school</Text>
            )}

            {/* File Upload */}
            <SDFileUpload
              onFileSelect={setSelectedFile}
              preview={selectedFile?.uri}
              label={config.fileRequired ? 'Photo Proof (Required)' : 'Photo Proof (Optional)'}
              description={config.fileRequired 
                ? 'Photo proof is required for this activity type'
                : 'Upload a photo or document as proof of your activity'
              }
            />

            {/* Submit Button */}
            <SDButton
              variant="primary-filled"
              size="lg"
              fullWidth
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            >
              Submit Hours
            </SDButton>
          </SDCard>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
  },
  typeCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    minWidth: '22%',
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  schoolContainer: {
    marginBottom: spacing.md,
  },
  schoolLabel: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  schoolButton: {
    justifyContent: 'flex-start',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  fileUploadContainer: {
    marginBottom: spacing.lg,
  },
  fileUploadLabel: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  fileUploadSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  successContent: {
    alignItems: 'center',
  },
  checkmarkContainer: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default LogHoursScreen;
