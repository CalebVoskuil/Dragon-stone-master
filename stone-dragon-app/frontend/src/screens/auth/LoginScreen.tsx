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
import { Eye, EyeOff } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { GradientBackground, SDButton, SDInput, SDCard } from '../../components/ui';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

/**
 * LoginScreen - User authentication screen
 * Email/password login with validation
 */
export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    console.log('Forgot password');
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});
      await login({ email, password });
    } catch (error) {
      setErrors({ general: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue tracking your volunteer hours
              </Text>
            </View>

            {/* Login Form */}
            <SDCard variant="elevated" padding="lg" style={styles.formCard}>
              {errors.general && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              )}

              <SDInput
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                required
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <View>
                <SDInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  required
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff color={Colors.textSecondary} size={20} />
                  ) : (
                    <Eye color={Colors.textSecondary} size={20} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <SDButton
                variant="primary-filled"
                size="lg"
                fullWidth
                onPress={handleSubmit}
                loading={loading}
              >
                Sign In
              </SDButton>
            </SDCard>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Login for Demo */}
            {__DEV__ && (
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Quick Demo Login:</Text>
                <View style={styles.demoButtons}>
                  <SDButton
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setEmail('alex.smith@student.ucta.ac.za');
                      setPassword('password123');
                    }}
                  >
                    Student
                  </SDButton>
                  <SDButton
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setEmail('coordinator.rallim@example.com');
                      setPassword('password123');
                    }}
                  >
                    Coordinator
                  </SDButton>
                </View>
                <View style={styles.demoButtons}>
                  <SDButton
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setEmail('studentcoord.rallim@example.com');
                      setPassword('password123');
                    }}
                  >
                    Student Coord
                  </SDButton>
                  <SDButton
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setEmail('admin@stonedragon.org');
                      setPassword('password123');
                    }}
                  >
                    Admin
                  </SDButton>
                </View>
              </View>
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
  passwordToggle: {
    position: 'absolute',
    right: spacing.md,
    top: 36,
    padding: spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...typography.body,
    color: Colors.light,
  },
  registerLink: {
    ...typography.body,
    color: Colors.golden,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  demoContainer: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Sizes.radiusMd,
  },
  demoTitle: {
    fontSize: Sizes.fontSm,
    color: Colors.light,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  demoButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
});
