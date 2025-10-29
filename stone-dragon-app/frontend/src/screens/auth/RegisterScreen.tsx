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
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Eye, EyeOff, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { GradientBackground, SDButton, SDInput, SDCard } from '../../components/ui';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { apiService } from '../../services/api';

/**
 * RegisterScreen - New user registration
 * Collects user information and creates account
 */
export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    school: '',
    schoolId: '', // Store the actual school ID
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSchoolPicker, setShowSchoolPicker] = useState(false);
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Fetch schools on mount
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoadingSchools(true);
      const response = await apiService.getSchools();
      if (response.success && response.data) {
        setSchools(response.data as Array<{ id: string; name: string }>);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      // Use a fallback list if API fails
      setSchools([
        { id: 'fallback-1', name: 'Cape Town High School' },
        { id: 'fallback-2', name: "Wynberg Boys' High School" },
        { id: 'fallback-3', name: "Wynberg Girls' High School" },
      ]);
    } finally {
      setLoadingSchools(false);
    }
  };

  const validatePasswordRequirements = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const getPasswordErrorMessage = () => {
    const checks = passwordRequirements;
    const missing = [];
    if (!checks.length) missing.push('8 characters minimum');
    if (!checks.uppercase) missing.push('one uppercase letter');
    if (!checks.lowercase) missing.push('one lowercase letter');
    if (!checks.number) missing.push('one number');
    if (!checks.special) missing.push('one special character');
    return missing.length > 0 ? `Password must contain: ${missing.join(', ')}` : '';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const requirements = validatePasswordRequirements(formData.password);
      const allMet = Object.values(requirements).every(Boolean);
      if (!allMet) {
        newErrors.password = getPasswordErrorMessage();
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.school) {
      newErrors.school = 'Please select your school';
    }

    if (!acceptedPrivacy) {
      newErrors.privacy = 'You must accept the Privacy Policy to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handlePrivacyPolicy = () => {
    // TODO: Navigate to privacy policy screen
    console.log('View Privacy Policy');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        school: formData.schoolId, // Use schoolId instead of school name
        dateOfBirth: formData.dateOfBirth,
      });
      // Auto-login after registration - navigation handled by AuthContext
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    
    // Update password requirements in real-time
    if (field === 'password') {
      setPasswordRequirements(validatePasswordRequirements(value));
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
            contentContainerStyle={styles.scrollContent}
            indicatorStyle="white"
            showsVerticalScrollIndicator={true}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join Stone Dragon NPO and start making a difference
              </Text>
            </View>

            {/* Registration Form */}
            <SDCard variant="elevated" padding="lg" style={styles.formCard}>
              {errors.general && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              )}

              <SDInput
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                error={errors.name}
                required
                autoCapitalize="words"
              />

              <SDInput
                label="Email Address"
                placeholder="your.email@example.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                required
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              {/* School Picker */}
              <View>
                <Text style={styles.label}>
                  School <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => setShowSchoolPicker(true)}
                  style={[styles.pickerButton, errors.school && styles.pickerButtonError]}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      !formData.school && styles.pickerPlaceholder,
                    ]}
                  >
                    {formData.school || 'Select your school'}
                  </Text>
                </TouchableOpacity>
                {errors.school && <Text style={styles.fieldError}>{errors.school}</Text>}
              </View>

              <View>
                <SDInput
                  label="Password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  error={errors.password}
                  required
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? (
                    <EyeOff color={Colors.textSecondary} size={20} />
                  ) : (
                    <Eye color={Colors.textSecondary} size={20} />
                  )}
                </TouchableOpacity>
                
                {/* Password Requirements */}
                {formData.password.length > 0 && (
                  <View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Password must contain:</Text>
                    <View style={styles.requirementItem}>
                      <Check 
                        color={passwordRequirements.length ? Colors.green : Colors.textSecondary} 
                        size={16} 
                      />
                      <Text style={[
                        styles.requirementText,
                        passwordRequirements.length && styles.requirementMet
                      ]}>
                        At least 8 characters
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Check 
                        color={passwordRequirements.uppercase ? Colors.green : Colors.textSecondary} 
                        size={16} 
                      />
                      <Text style={[
                        styles.requirementText,
                        passwordRequirements.uppercase && styles.requirementMet
                      ]}>
                        One uppercase letter
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Check 
                        color={passwordRequirements.lowercase ? Colors.green : Colors.textSecondary} 
                        size={16} 
                      />
                      <Text style={[
                        styles.requirementText,
                        passwordRequirements.lowercase && styles.requirementMet
                      ]}>
                        One lowercase letter
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Check 
                        color={passwordRequirements.number ? Colors.green : Colors.textSecondary} 
                        size={16} 
                      />
                      <Text style={[
                        styles.requirementText,
                        passwordRequirements.number && styles.requirementMet
                      ]}>
                        One number
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Check 
                        color={passwordRequirements.special ? Colors.green : Colors.textSecondary} 
                        size={16} 
                      />
                      <Text style={[
                        styles.requirementText,
                        passwordRequirements.special && styles.requirementMet
                      ]}>
                        One special character
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View>
                <SDInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  error={errors.confirmPassword}
                  required
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  {showConfirmPassword ? (
                    <EyeOff color={Colors.textSecondary} size={20} />
                  ) : (
                    <Eye color={Colors.textSecondary} size={20} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Privacy Policy Checkbox */}
              <TouchableOpacity
                onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                style={styles.checkboxContainer}
              >
                <View style={[styles.checkbox, acceptedPrivacy && styles.checkboxChecked]}>
                  {acceptedPrivacy && <Check color={Colors.light} size={16} />}
                </View>
                <View style={styles.checkboxLabel}>
                  <Text style={styles.checkboxText}>I accept the </Text>
                  <TouchableOpacity onPress={handlePrivacyPolicy}>
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              {errors.privacy && <Text style={styles.fieldError}>{errors.privacy}</Text>}

              <SDButton
                variant="primary-filled"
                size="lg"
                fullWidth
                onPress={handleSubmit}
                loading={loading}
              >
                Create Account
              </SDButton>
            </SDCard>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* School Picker Modal */}
        <Modal
          visible={showSchoolPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSchoolPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Your School</Text>
                <TouchableOpacity onPress={() => setShowSchoolPicker(false)}>
                  <Text style={styles.modalClose}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                indicatorStyle="white"
                showsVerticalScrollIndicator={true}
              >
                {loadingSchools ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.deepPurple} />
                    <Text style={styles.loadingText}>Loading schools...</Text>
                  </View>
                ) : schools.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No schools available</Text>
                  </View>
                ) : (
                  schools.map((school) => (
                    <TouchableOpacity
                      key={school.id}
                      onPress={() => {
                        handleInputChange('school', school.name);
                        handleInputChange('schoolId', school.id);
                        setShowSchoolPicker(false);
                      }}
                      style={styles.schoolOption}
                    >
                      <Text
                        style={[
                          styles.schoolOptionText,
                          formData.schoolId === school.id && styles.schoolOptionSelected,
                        ]}
                      >
                        {school.name}
                      </Text>
                      {formData.schoolId === school.id && (
                        <Check color={Colors.deepPurple} size={20} />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: Colors.light,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: Colors.light,
    textAlign: 'center',
    opacity: 0.9,
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: `${Colors.red}1A`,
    borderWidth: 1,
    borderColor: `${Colors.red}33`,
    borderRadius: Sizes.radiusMd,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: Sizes.fontSm,
    color: Colors.red,
  },
  label: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  required: {
    color: Colors.red,
  },
  pickerButton: {
    height: Sizes.inputHeight,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.radiusMd,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  pickerButtonError: {
    borderColor: Colors.red,
  },
  pickerText: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
  },
  pickerPlaceholder: {
    color: Colors.textSecondary,
  },
  fieldError: {
    color: Colors.red,
    fontSize: Sizes.fontSm,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  passwordToggle: {
    position: 'absolute',
    right: spacing.md,
    top: 36,
    padding: spacing.xs,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: Colors.deepPurple,
    borderColor: Colors.deepPurple,
  },
  checkboxLabel: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
  },
  linkText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...typography.body,
    color: Colors.light,
  },
  loginLink: {
    ...typography.body,
    color: Colors.golden,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Sizes.radiusXl,
    borderTopRightRadius: Sizes.radiusXl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    ...typography.h2,
    color: Colors.text,
  },
  modalClose: {
    fontSize: Sizes.fontMd,
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  schoolOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  schoolOptionText: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
  },
  schoolOptionSelected: {
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: Colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: Colors.textSecondary,
  },
  requirementsContainer: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: `${Colors.card}CC`,
    borderRadius: Sizes.radiusMd,
  },
  requirementsTitle: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  requirementText: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    marginLeft: spacing.xs,
  },
  requirementMet: {
    color: Colors.green,
  },
});
