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
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { School, UserRole } from '../../types';
import { theme, spacing } from '../../theme/theme';

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Create Account</Title>
              <Paragraph style={styles.subtitle}>
                Join the Stone Dragon Volunteer Program
              </Paragraph>

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
                  <TextInput
                    label="Email"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    placeholder="your.email@example.com"
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}

              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Password"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.password}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    }
                    placeholder="Enter your password"
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}

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
                  <TextInput
                    label="Confirm Password"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                    placeholder="Confirm your password"
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              )}

              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: 'First name is required',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="First Name"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.firstName}
                    style={styles.input}
                    placeholder="Enter your first name"
                  />
                )}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName.message}</Text>
              )}

              <Controller
                control={control}
                name="lastName"
                rules={{
                  required: 'Last name is required',
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Last Name"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.lastName}
                    style={styles.input}
                    placeholder="Enter your last name"
                  />
                )}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName.message}</Text>
              )}

              <View style={styles.roleContainer}>
                <Text style={styles.roleLabel}>Role</Text>
                <Menu
                  visible={roleMenuVisible}
                  onDismiss={() => setRoleMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setRoleMenuVisible(true)}
                      style={styles.roleButton}
                      contentStyle={styles.roleButtonContent}
                    >
                      {getRoleDisplayName(watchedRole)}
                    </Button>
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

              <View style={styles.schoolContainer}>
                <Text style={styles.schoolLabel}>School (Optional)</Text>
                <Menu
                  visible={schoolMenuVisible}
                  onDismiss={() => setSchoolMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setSchoolMenuVisible(true)}
                      style={styles.schoolButton}
                      contentStyle={styles.schoolButtonContent}
                    >
                      {selectedSchool ? selectedSchool.name : 'Select School (Optional)'}
                    </Button>
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

              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Divider style={styles.divider} />

              <Button
                mode="text"
                onPress={navigateToLogin}
                style={styles.loginButton}
              >
                Already have an account? Login
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.md,
  },
  content: {
    flex: 1,
  },
  card: {
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: theme.colors.onSurfaceVariant,
  },
  input: {
    marginBottom: spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: spacing.sm,
    marginTop: -spacing.sm,
  },
  roleContainer: {
    marginBottom: spacing.md,
  },
  roleLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  roleButton: {
    justifyContent: 'flex-start',
  },
  roleButtonContent: {
    justifyContent: 'flex-start',
  },
  schoolContainer: {
    marginBottom: spacing.md,
  },
  schoolLabel: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  schoolButton: {
    justifyContent: 'flex-start',
  },
  schoolButtonContent: {
    justifyContent: 'flex-start',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: theme.colors.onSurfaceVariant,
  },
});

export default RegisterScreen;
