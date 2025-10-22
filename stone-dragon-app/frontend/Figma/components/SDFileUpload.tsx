import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../../src/theme/theme';
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
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
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
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setUploading(false);
    }
  };

  const handleCamera = async () => {
    try {
      setUploading(true);
      
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
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
          name: asset.fileName || 'photo.jpg',
          type: 'image/jpeg',
          size: asset.fileSize || 0,
        };
        
        if (validateFile(file)) {
          onFileSelect(file);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentPicker = async () => {
    try {
      setUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedTypes.includes('image/*') ? '*/*' : acceptedTypes.join(','),
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
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onFileRemove },
      ]
    );
  };

  if (preview) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: preview }} style={styles.previewImage} />
          <SDButton
            variant="ghost"
            size="sm"
            onPress={handleRemove}
            style={styles.removeButton}
          >
            <Ionicons name="close" size={16} color={colors.error} />
          </SDButton>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.uploadArea, error && styles.errorArea]}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="cloud-upload-outline" 
            size={48} 
            color={error ? colors.error : colors.textMuted} 
          />
        </View>
        
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.acceptedTypes}>
          Accepted: {acceptedTypes.join(', ')} • Max size: {maxSizeMB}MB
        </Text>

        <View style={styles.buttonContainer}>
          <SDButton
            variant="secondary"
            size="sm"
            onPress={handleImagePicker}
            disabled={loading || uploading}
            style={styles.button}
          >
            <Ionicons name="image-outline" size={16} color={colors.textDark} />
            Gallery
          </SDButton>
          
          <SDButton
            variant="secondary"
            size="sm"
            onPress={handleCamera}
            disabled={loading || uploading}
            style={styles.button}
          >
            <Ionicons name="camera-outline" size={16} color={colors.textDark} />
            Camera
          </SDButton>
        </View>

        {acceptedTypes.some(type => type !== 'image/*') && (
          <SDButton
            variant="ghost"
            size="sm"
            onPress={handleDocumentPicker}
            disabled={loading || uploading}
            style={styles.documentButton}
          >
            <Ionicons name="document-outline" size={16} color={colors.primary} />
            Upload Document
          </SDButton>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.outline,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  errorArea: {
    borderColor: colors.error,
    backgroundColor: `${colors.error}10`,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.subhead.fontSize,
    fontWeight: typography.subhead.fontWeight,
    color: colors.textDark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  acceptedTypes: {
    fontSize: typography.caption.fontSize,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  button: {
    flex: 1,
  },
  documentButton: {
    marginTop: spacing.xs,
  },
  previewContainer: {
    position: 'relative',
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.round,
    padding: spacing.xs,
  },
  errorText: {
    fontSize: typography.caption.fontSize,
    color: colors.error,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});