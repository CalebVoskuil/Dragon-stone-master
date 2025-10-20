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
  Chip,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { format } from 'date-fns';

import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';
import { School, CreateVolunteerLogData } from '../../types';
import { theme, spacing } from '../../theme/theme';

interface LogHoursFormData {
  hours: string;
  description: string;
  date: string;
  schoolId: string;
}

const LogHoursScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [schoolMenuVisible, setSchoolMenuVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LogHoursFormData>({
    defaultValues: {
      hours: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      schoolId: '',
    },
  });

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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedFile({
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || 'image.jpg',
          type: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile({
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType,
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: LogHoursFormData) => {
    try {
      setIsLoading(true);

      const logData: CreateVolunteerLogData = {
        hours: parseFloat(data.hours),
        description: data.description,
        date: new Date(data.date).toISOString(),
        schoolId: data.schoolId,
        proofFile: selectedFile,
      };

      const response = await apiService.createVolunteerLog(logData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Volunteer hours logged successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('MyLogs' as never),
            },
          ]
        );
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
              <Title style={styles.title}>Log Volunteer Hours</Title>
              <Paragraph style={styles.subtitle}>
                Record your volunteer activities and hours
              </Paragraph>

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
                  <TextInput
                    label="Hours"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.hours}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder="e.g., 2.5"
                  />
                )}
              />
              {errors.hours && (
                <Text style={styles.errorText}>{errors.hours.message}</Text>
              )}

              <Controller
                control={control}
                name="description"
                rules={{
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Description"
                    mode="outlined"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={!!errors.description}
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                    placeholder="Describe your volunteer activities..."
                  />
                )}
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description.message}</Text>
              )}

              <Controller
                control={control}
                name="date"
                rules={{
                  required: 'Date is required',
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Date"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    error={!!errors.date}
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                  />
                )}
              />
              {errors.date && (
                <Text style={styles.errorText}>{errors.date.message}</Text>
              )}

              <View style={styles.schoolContainer}>
                <Text style={styles.schoolLabel}>School</Text>
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
                      {selectedSchool ? selectedSchool.name : 'Select School'}
                    </Button>
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

              <Divider style={styles.divider} />

              <Text style={styles.sectionTitle}>Proof Document (Optional)</Text>
              <Paragraph style={styles.sectionSubtitle}>
                Upload a photo or document as proof of your volunteer work
              </Paragraph>

              {selectedFile ? (
                <View style={styles.fileContainer}>
                  <Chip
                    icon="file"
                    onClose={removeFile}
                    style={styles.fileChip}
                  >
                    {selectedFile.name}
                  </Chip>
                </View>
              ) : (
                <View style={styles.fileButtons}>
                  <Button
                    mode="outlined"
                    onPress={pickImage}
                    icon="camera"
                    style={styles.fileButton}
                  >
                    Photo
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={pickDocument}
                    icon="file-document"
                    style={styles.fileButton}
                  >
                    Document
                  </Button>
                </View>
              )}

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
                  'Log Hours'
                )}
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
  divider: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  fileContainer: {
    marginBottom: spacing.md,
  },
  fileChip: {
    alignSelf: 'flex-start',
  },
  fileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  fileButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
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

export default LogHoursScreen;
