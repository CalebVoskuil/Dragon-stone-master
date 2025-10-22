import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  LinearGradient,
} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../store/AuthContext';
import { LoginCredentials } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../theme/theme';
import { SDButton } from '../../components/SDButton';
import { SDCard } from '../../components/SDCard';
import { SDInput } from '../../components/SDInput';
import { apiService } from '../../services/api';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
    } catch (error) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  const navigateToRegister = () => {
    clearError();
    navigation.navigate('Register' as never);
  };

  const testConnection = async () => {
    try {
      const isConnected = await apiService.testConnection();
      if (isConnected) {
        Alert.alert('Connection Test', '✅ Successfully connected to backend server!');
      } else {
        Alert.alert('Connection Test', '❌ Cannot connect to backend server. Please check if the server is running on 192.168.0.208:3001');
      }
    } catch (error) {
      Alert.alert('Connection Test', '❌ Connection test failed. Please check if the backend server is running.');
    }
  };

  const quickLogin = async (role: 'student' | 'coordinator' | 'admin-student' | 'admin-coordinator') => {
    const credentials = {
      student: { email: 'student@demo.com', password: 'password' },
      coordinator: { email: 'coordinator@demo.com', password: 'password' },
      'admin-student': { email: 'admin-student@demo.com', password: 'password' },
      'admin-coordinator': { email: 'admin-coordinator@demo.com', password: 'password' }
    };

    const { email, password } = credentials[role];
    
    try {
      await login({ email, password });
    } catch (error) {
      Alert.alert('Login Failed', 'Demo login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue tracking your volunteer hours</Text>
          </View>

          {/* Login Form */}
          <SDCard padding="lg" style={styles.formCard}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
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
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SDInput
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                  autoComplete="current-password"
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

            <View style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </View>

            <SDButton
              variant="primary-filled"
              size="lg"
              fullWidth
              loading={isLoading}
              onPress={handleSubmit(onSubmit)}
              style={styles.loginButton}
            >
              Sign In
            </SDButton>
          </SDCard>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerLink} onPress={navigateToRegister}>
                Sign Up
              </Text>
            </Text>
          </View>

          {/* Demo Accounts */}
          <SDCard padding="md" style={styles.demoCard}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <View style={styles.demoAccounts}>
              <Text style={styles.demoAccountText}>
                <Text style={styles.demoLabel}>Student:</Text> student@demo.com / password
              </Text>
              <Text style={styles.demoAccountText}>
                <Text style={styles.demoLabel}>Coordinator:</Text> coordinator@demo.com / password
              </Text>
              <Text style={styles.demoAccountText}>
                <Text style={styles.demoLabel}>Admin Student:</Text> admin-student@demo.com / password
              </Text>
              <Text style={styles.demoAccountText}>
                <Text style={styles.demoLabel}>Admin Coordinator:</Text> admin-coordinator@demo.com / password
              </Text>
            </View>
            
            {/* Connection Test */}
            <View style={styles.connectionTestContainer}>
              <SDButton
                variant="ghost"
                size="sm"
                onPress={testConnection}
                disabled={isLoading}
                style={styles.connectionTestButton}
              >
                Test Connection
              </SDButton>
            </View>

            {/* Quick Login Buttons */}
            <View style={styles.quickLoginContainer}>
              <Text style={styles.quickLoginTitle}>Quick Login:</Text>
              <View style={styles.quickLoginButtons}>
                <SDButton
                  variant="secondary"
                  size="sm"
                  onPress={() => quickLogin('student')}
                  disabled={isLoading}
                  style={styles.quickLoginButton}
                >
                  Student
                </SDButton>
                <SDButton
                  variant="secondary"
                  size="sm"
                  onPress={() => quickLogin('coordinator')}
                  disabled={isLoading}
                  style={styles.quickLoginButton}
                >
                  Coordinator
                </SDButton>
                <SDButton
                  variant="secondary"
                  size="sm"
                  onPress={() => quickLogin('admin-student')}
                  disabled={isLoading}
                  style={styles.quickLoginButton}
                >
                  Admin Student
                </SDButton>
                <SDButton
                  variant="secondary"
                  size="sm"
                  onPress={() => quickLogin('admin-coordinator')}
                  disabled={isLoading}
                  style={styles.quickLoginButton}
                >
                  Admin Coord
                </SDButton>
              </View>
            </View>
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
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
  errorContainer: {
    backgroundColor: `${colors.error}10`,
    borderWidth: 1,
    borderColor: `${colors.error}20`,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.caption.fontSize,
    color: colors.error,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  registerText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  demoCard: {
    backgroundColor: colors.surfaceSecondary,
  },
  demoTitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  demoAccounts: {
    marginBottom: spacing.md,
  },
  demoAccountText: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  demoLabel: {
    fontWeight: '600',
    color: colors.textDark,
  },
  connectionTestContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    paddingTop: spacing.md,
  },
  connectionTestButton: {
    minWidth: 120,
  },
  quickLoginContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    paddingTop: spacing.md,
  },
  quickLoginTitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  quickLoginButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickLoginButton: {
    flex: 1,
    minWidth: '45%',
  },
});

export default LoginScreen;
