/**
 * @fileoverview File and image upload component.
 * Supports document picking, gallery selection, and camera capture.
 * 
 * @module components/ui/SDFileUpload
 * @requires react
 * @requires react-native
 * @requires expo-document-picker
 * @requires expo-image-picker
 * @requires lucide-react-native
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Upload, Camera, X, FileText, Image as ImageIcon } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import SDButton from './SDButton';

/**
 * Props for SDFileUpload component.
 * 
 * @interface SDFileUploadProps
 * @property {function} onFileSelect - Callback when file is selected
 * @property {function} [onFileRemove] - Callback when file is removed
 * @property {string[]} [acceptedTypes] - Allowed MIME types
 * @property {number} [maxSizeMB=10] - Maximum file size in MB
 * @property {string} [preview] - Preview image/file URI
 * @property {string} [error] - Error message to display
 * @property {boolean} [loading=false] - Loading state
 * @property {string} [label='Upload File'] - Upload button label
 * @property {string} [description='Click to select a file'] - Help text
 */
interface SDFileUploadProps {
  onFileSelect: (file: DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  preview?: string;
  error?: string;
  loading?: boolean;
  label?: string;
  description?: string;
}

/**
 * File and image upload component.
 * Supports document picker, gallery selection, and camera capture with file validation.
 * 
 * @component
 * @param {SDFileUploadProps} props - Component properties
 * @returns {JSX.Element} File upload component
 * 
 * @example
 * <SDFileUpload
 *   onFileSelect={handleFileSelect}
 *   acceptedTypes={['image/*', 'application/pdf']}
 *   maxSizeMB={5}
 * />
 */
export default function SDFileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['application/pdf', 'image/*'],
  maxSizeMB = 10,
  preview,
  error,
  loading = false,
  label = 'Upload File',
  description = 'Click to select a file',
}: SDFileUploadProps) {
  const [localError, setLocalError] = useState<string>('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptedTypes,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const fileSizeMB = (file.size || 0) / 1024 / 1024;

        if (fileSizeMB > maxSizeMB) {
          setLocalError(`File size must be less than ${maxSizeMB}MB`);
          return;
        }

        setLocalError('');
        onFileSelect(file);
      }
    } catch (err) {
      setLocalError('Failed to pick document');
      console.error(err);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setLocalError('Permission to access photos is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setLocalError('');
        onFileSelect(result.assets[0]);
      }
    } catch (err) {
      setLocalError('Failed to pick image');
      console.error(err);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setLocalError('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setLocalError('');
        onFileSelect(result.assets[0]);
      }
    } catch (err) {
      setLocalError('Failed to take photo');
      console.error(err);
    }
  };

  const displayError = error || localError;

  return (
    <View style={styles.container}>
      {!preview ? (
        <View
          style={[
            styles.uploadArea,
            displayError && styles.uploadAreaError,
            loading && styles.uploadAreaDisabled,
          ]}
        >
          <Upload
            color={displayError ? Colors.red : Colors.textSecondary}
            size={48}
          />

          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.acceptedText}>
            Accepted: {acceptedTypes.join(', ')} • Max: {maxSizeMB}MB
          </Text>

          <View style={styles.buttonGroup}>
            <SDButton
              variant="ghost"
              size="sm"
              onPress={pickDocument}
              disabled={loading}
            >
              Choose File
            </SDButton>

            <SDButton
              variant="ghost"
              size="sm"
              onPress={pickImageFromGallery}
              disabled={loading}
            >
              Gallery
            </SDButton>

            <SDButton
              variant="ghost"
              size="sm"
              onPress={takePhoto}
              disabled={loading}
            >
              Camera
            </SDButton>
          </View>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.deepPurple} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.preview}>
          <View style={styles.previewCard}>
            {preview.startsWith('file://') || preview.startsWith('data:image') ? (
              <Image source={{ uri: preview }} style={styles.previewImage} />
            ) : (
              <View style={styles.fileIcon}>
                <FileText color={Colors.textSecondary} size={32} />
              </View>
            )}

            <View style={styles.previewInfo}>
              <Text style={styles.previewTitle}>File uploaded successfully</Text>
              <Text style={styles.previewSubtitle}>Ready to submit</Text>
            </View>

            {onFileRemove && (
              <TouchableOpacity onPress={onFileRemove} style={styles.removeButton}>
                <X color={Colors.textSecondary} size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {displayError && (
        <Text style={styles.errorText}>{displayError}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.md,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Sizes.radiusMd,
    padding: Sizes.lg,
    alignItems: 'center',
    backgroundColor: `${Colors.deepPurple}0D`,
  },
  uploadAreaError: {
    borderColor: Colors.red,
  },
  uploadAreaDisabled: {
    opacity: 0.5,
  },
  label: {
    marginTop: Sizes.md,
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
  },
  description: {
    marginTop: Sizes.xs,
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  acceptedText: {
    marginTop: Sizes.xs,
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Sizes.sm,
    marginTop: Sizes.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Sizes.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    marginVertical: Sizes.sm,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizes.md,
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: Sizes.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fileIcon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewInfo: {
    flex: 1,
    marginLeft: Sizes.md,
  },
  previewTitle: {
    fontSize: Sizes.fontSm,
    fontWeight: '500',
    color: Colors.text,
  },
  previewSubtitle: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    padding: Sizes.xs,
  },
  errorText: {
    color: Colors.red,
    fontSize: Sizes.fontSm,
    marginTop: Sizes.xs,
  },
});

/* End of file components/ui/SDFileUpload.tsx */