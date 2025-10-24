import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  SDInput,
  SDCard,
  SDFileUpload,
  GlassmorphicCard,
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';

/**
 * LogHoursScreen - Log volunteer hours with proof
 * Allows students to submit volunteer hours for verification
 */
export default function LogHoursScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    hours: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [preview, setPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.hours.trim()) {
      newErrors.hours = 'Hours are required';
    } else if (isNaN(parseFloat(formData.hours)) || parseFloat(formData.hours) <= 0) {
      newErrors.hours = 'Please enter a valid number of hours';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required (minimum 10 characters)';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!user?.schoolId) {
      newErrors.school = 'School ID is missing. Please update your profile.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    if (file.uri) {
      setPreview(file.uri);
    }
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setPreview('');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!user?.schoolId) {
      setErrors({ general: 'School ID is missing. Please update your profile.' });
      return;
    }

    setSubmitting(true);

    try {
      const logData = {
        hours: parseFloat(formData.hours),
        description: formData.description,
        date: formData.date || new Date().toISOString(),
        schoolId: user.schoolId,
        proofFile: selectedFile || undefined,
      };

      const response = await apiService.createVolunteerLog(logData);

      if (response.success) {
        setShowSuccess(true);

        // Auto-redirect after showing success
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to submit log');
      }
    } catch (error: any) {
      console.error('Failed to submit log:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setSubmitting(false);
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
            <Text style={styles.headerTitle}>Log Volunteer Hours</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <GlassmorphicCard intensity={80} style={styles.formCard}>
              {errors.general && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              )}

              <SDInput
                label="Hours Volunteered"
                placeholder="e.g., 3.5"
                value={formData.hours}
                onChangeText={(value) => handleInputChange('hours', value)}
                error={errors.hours}
                required
                keyboardType="decimal-pad"
                hint="Enter the number of hours you volunteered"
              />

              <SDInput
                label="Description"
                placeholder="Describe your volunteer activity (minimum 10 characters)..."
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                error={errors.description}
                required
                multiline
                numberOfLines={4}
                style={styles.textArea}
                hint="Include details about what you did and where"
              />

              <SDFileUpload
                label="Proof of Volunteer Work (Optional)"
                description="Upload a photo or document"
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                preview={preview}
                error={errors.file}
                acceptedTypes={['image/*', 'application/pdf']}
                maxSizeMB={5}
              />

              <SDButton
                variant="primary-filled"
                size="lg"
                fullWidth
                onPress={handleSubmit}
                loading={submitting}
              >
                Submit for Verification
              </SDButton>

              <Text style={styles.note}>
                Your hours will be reviewed by a coordinator and you'll be notified once approved.
              </Text>
            </GlassmorphicCard>
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
  headerTitle: {
    ...typography.h2,
    color: Colors.light,
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
    gap: spacing.md,
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: `${Colors.red}1A`,
    borderWidth: 1,
    borderColor: `${Colors.red}33`,
    borderRadius: Sizes.radiusMd,
  },
  errorText: {
    fontSize: Sizes.fontSm,
    color: Colors.red,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  note: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
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
});
