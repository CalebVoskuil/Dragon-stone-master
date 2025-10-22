import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { School, UserRole } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { SDButton } from '../../components/SDButton';
import { SDCard } from '../../components/SDCard';
import { SDInput } from '../../components/SDInput';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId: string;
}

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolMenuVisible, setSchoolMenuVisible] = useState(false);
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: 'STUDENT',
      schoolId: '',
    },
  });

  const watchedRole = watch('role');
  const watchedSchoolId = watch('schoolId');

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

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'VOLUNTEER': return 'Volunteer';
      case 'COORDINATOR': return 'Coordinator';
      case 'ADMIN': return 'Administrator';
      default: return role;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      const registerData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        schoolId: data.schoolId || undefined,
      };

      const response = await apiService.register(registerData);

      if (response.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully!',
          [
            {
              text: 'OK',
              onPress: async () => {
                // Auto-login after successful registration
                try {
                  await login(data.email, data.password);
                  // Navigation will be handled by the auth context
                } catch (loginError) {
                  console.error('Auto-login failed:', loginError);
                  // Navigate to login screen if auto-login fails
                  navigation.navigate('Login' as never);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', response.message || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Failed to create account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  if (isLoadingSchools) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading schools...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Stone Dragon NPO and start making a difference</Text>
          </View>

          {/* Registration Form */}
          <SDCard padding="lg" style={styles.formCard}>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: 'First name is required',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SDInput
                  label="First Name"
                  placeholder="Enter your first name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                  required
                  autoComplete="given-name"
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              rules={{
                required: 'Last name is required',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SDInput
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                  required
                  autoComplete="family-name"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Enter a valid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SDInput
                  label="Email Address"
                  placeholder="your.email@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SDInput
                  label="Password"
                  placeholder="Minimum 8 characters"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  hint="Minimum 8 characters"
                  autoComplete="new-password"
                  required
                  right={
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Please confirm your password',
                validate: (value) => {
                  const password = watch('password');
                  return value === password || 'Passwords do not match';
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SDInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  required
                  right={
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />
              )}
            />

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <Text style={styles.fieldLabel}>Role</Text>
              <Menu
                visible={roleMenuVisible}
                onDismiss={() => setRoleMenuVisible(false)}
                anchor={
                  <SDButton
                    variant="ghost"
                    size="md"
                    onPress={() => setRoleMenuVisible(true)}
                    style={styles.menuButton}
                  >
                    {getRoleDisplayName(watchedRole)}
                  </SDButton>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setValue('role', 'STUDENT');
                    setRoleMenuVisible(false);
                  }}
                  title="Student"
                />
                <Menu.Item
                  onPress={() => {
                    setValue('role', 'VOLUNTEER');
                    setRoleMenuVisible(false);
                  }}
                  title="Volunteer"
                />
                <Menu.Item
                  onPress={() => {
                    setValue('role', 'COORDINATOR');
                    setRoleMenuVisible(false);
                  }}
                  title="Coordinator"
                />
                <Menu.Item
                  onPress={() => {
                    setValue('role', 'ADMIN');
                    setRoleMenuVisible(false);
                  }}
                  title="Administrator"
                />
              </Menu>
            </View>

            {/* School Selection */}
            <View style={styles.schoolContainer}>
              <Text style={styles.fieldLabel}>School (Optional)</Text>
              <Menu
                visible={schoolMenuVisible}
                onDismiss={() => setSchoolMenuVisible(false)}
                anchor={
                  <SDButton
                    variant="ghost"
                    size="md"
                    onPress={() => setSchoolMenuVisible(true)}
                    style={styles.menuButton}
                  >
                    {selectedSchool ? selectedSchool.name : 'Select School (Optional)'}
                  </SDButton>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setValue('schoolId', '');
                    setSelectedSchool(null);
                    setSchoolMenuVisible(false);
                  }}
                  title="No School"
                />
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

            <SDButton
              variant="primary-filled"
              size="lg"
              fullWidth
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            >
              Create Account
            </SDButton>
          </SDCard>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink} onPress={navigateToLogin}>
                Sign In
              </Text>
            </Text>
          </View>
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
    padding: spacing.lg,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  formCard: {
    marginBottom: spacing.lg,
  },
  roleContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  menuButton: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  schoolContainer: {
    marginBottom: spacing.lg,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '500',
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
});

export default RegisterScreen;
