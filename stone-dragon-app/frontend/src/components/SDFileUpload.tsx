import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../theme/theme';
import { SDButton } from './SDButton';

interface SDFileUploadProps {
  onFileSelect: (file: { uri: string; name: string; type: string; size: number }) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  preview?: string;
  error?: string;
  loading?: boolean;
  label?: string;
  description?: string;
  style?: ViewStyle;
}

export const SDFileUpload: React.FC<SDFileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['image/*'],
  maxSizeMB = 10,
  preview,
  error,
  loading = false,
  label = 'Upload File',
  description = 'Take a photo or upload from gallery',
  style,
}) => {
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: { size: number; type: string }) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      Alert.alert('File Too Large', `File size must be less than ${maxSizeMB}MB`);
      return false;
    }
    return true;
  };

  const handleImagePicker = async () => {
    try {
      setUploading(true);
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || 'image.jpg',
          type: 'image/jpeg',
          size: asset.fileSize || 0,
        };
        
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      setUploading(true);
      
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.fileName || 'camera_image.jpg',
          type: 'image/jpeg',
          size: asset.fileSize || 0,
        };
        
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image');
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentPicker = async () => {
    try {
      setUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedTypes.includes('image/*') ? 'image/*' : '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const file = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size || 0,
        };
        
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image-outline';
    }
    return 'document-outline';
  };

  if (preview) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.previewContainer}>
          <View style={styles.previewContent}>
            {preview.startsWith('data:image') || preview.startsWith('file://') ? (
              <Image 
                source={{ uri: preview }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.fileIconContainer}>
                <Ionicons 
                  name={getFileIcon(preview) as keyof typeof Ionicons.glyphMap} 
                  size={32} 
                  color={colors.textMuted} 
                />
              </View>
            )}
            
            <View style={styles.previewText}>
              <Text style={styles.previewTitle}>File uploaded successfully</Text>
              <Text style={styles.previewSubtitle}>Ready to submit</Text>
            </View>

            {onFileRemove && (
              <SDButton
                variant="ghost"
                size="sm"
                onPress={onFileRemove}
                style={styles.removeButton}
                icon="close"
              />
            )}
          </View>
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.uploadContainer}>
        <View style={styles.uploadContent}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name="cloud-upload-outline" 
              size={48} 
              color={colors.textMuted} 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.uploadTitle}>{label}</Text>
            <Text style={styles.uploadDescription}>{description}</Text>
            <Text style={styles.uploadHint}>
              Accepted: {acceptedTypes.join(', ')} • Max size: {maxSizeMB}MB
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <SDButton
              variant="secondary"
              size="sm"
              onPress={handleImagePicker}
              disabled={loading || uploading}
              style={styles.uploadButton}
            >
              Choose File
            </SDButton>
            
            <SDButton
              variant="secondary"
              size="sm"
              onPress={handleCameraCapture}
              disabled={loading || uploading}
              style={styles.uploadButton}
              icon="camera"
            >
              Camera
            </SDButton>
          </View>
        </View>

        {(loading || uploading) && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>
              {uploading ? 'Uploading...' : 'Processing...'}
            </Text>
          </View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: colors.outline,
    borderStyle: 'dashed',
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  uploadContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  uploadTitle: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  uploadDescription: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  uploadHint: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  uploadButton: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${colors.background}CC`,
    borderRadius: borderRadius.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.body.fontSize,
    color: colors.textDark,
  },
  previewContainer: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  fileIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    flex: 1,
  },
  previewTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  previewSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
  },
  removeButton: {
    paddingHorizontal: spacing.sm,
  },
  errorText: {
    fontSize: typography.caption.fontSize,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default SDFileUpload;
