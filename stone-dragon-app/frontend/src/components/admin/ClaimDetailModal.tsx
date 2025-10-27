import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, Check, Clock, Calendar, User, FileText, MessageSquare, Eye } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { SDButton } from '../ui';
import { apiService } from '../../services/api';

interface ClaimDetailModalProps {
  visible: boolean;
  onClose: () => void;
  claim: {
    id: string;
    studentName: string;
    hours: number;
    description: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    coordinatorComment?: string;
    proofFileName?: string;
    proofFilePath?: string;
  } | null;
  onApprove: (id: string, message: string) => Promise<void>;
  onReject: (id: string, message: string) => Promise<void>;
}

/**
 * ClaimDetailModal - Modal for viewing and reviewing volunteer log claims
 * Shows full claim details with approve/reject actions and optional message
 */
export default function ClaimDetailModal({
  visible,
  onClose,
  claim,
  onApprove,
  onReject,
}: ClaimDetailModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!claim) return null;

  const handleApprove = async () => {
    try {
      setLoading(true);
      await onApprove(claim.id, message);
      setMessage(''); // Clear message after success
      onClose();
    } catch (error) {
      console.error('Error approving claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await onReject(claim.id, message);
      setMessage(''); // Clear message after success
      onClose();
    } catch (error) {
      console.error('Error rejecting claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProof = () => {
    if (claim?.proofFileName) {
      // Construct the full URL to the proof file
      // The backend serves files at /uploads/ route
      const proofUrl = `http://192.168.0.115:3001/uploads/${claim.proofFileName}`;
      
      console.log('Opening proof file:', proofUrl);
      
      // In a real implementation, you might want to use:
      // - Linking.openURL(proofUrl) for external apps
      // - A custom image viewer modal for images
      // - A PDF viewer component for PDFs
      
      // For now, we'll just show the URL
      alert(`Proof file: ${proofUrl}`);
    }
  };

  const handleClose = () => {
    setMessage(''); // Clear message when closing
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <ScrollView 
          style={styles.outerScrollView}
          contentContainerStyle={styles.outerScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIcon}>
                    <FileText color={Colors.deepPurple} size={20} />
                  </View>
                  <Text style={styles.headerTitle}>Claim Details</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X color={Colors.textSecondary} size={24} />
                </TouchableOpacity>
              </View>

              {/* Status Badge */}
              {claim.status !== 'pending' && (
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusBadge,
                      claim.status === 'approved'
                        ? styles.statusApproved
                        : styles.statusRejected,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {claim.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Student Info */}
                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <User color={Colors.deepPurple} size={18} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Student</Text>
                      <Text style={styles.infoValue}>{claim.studentName}</Text>
                    </View>
                  </View>
                </View>

                {/* Hours */}
                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Clock color={Colors.deepPurple} size={18} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Hours Logged</Text>
                      <Text style={styles.infoValue}>{claim.hours} hours</Text>
                    </View>
                  </View>
                </View>

                {/* Date */}
                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Calendar color={Colors.deepPurple} size={18} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Activity Date</Text>
                      <Text style={styles.infoValue}>{formatDate(claim.date)}</Text>
                    </View>
                  </View>
                </View>

                {/* Submitted Date */}
                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Calendar color={Colors.deepPurple} size={18} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>Submitted</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(claim.createdAt)} at {formatTime(claim.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionText}>{claim.description}</Text>
                  </View>
                </View>

                {/* Proof File */}
                {claim.proofFileName && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Proof Document</Text>
                    <TouchableOpacity style={styles.proofButton} onPress={handleViewProof}>
                      <Eye color={Colors.deepPurple} size={18} />
                      <Text style={styles.proofButtonText}>View Proof Document</Text>
                    </TouchableOpacity>
                    <Text style={styles.proofHint}>
                      Tap to view the uploaded proof document
                    </Text>
                  </View>
                )}

                {/* Existing Coordinator Comment (if any) */}
                {claim.coordinatorComment && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Coordinator Feedback</Text>
                    <View style={styles.existingCommentBox}>
                      <MessageSquare color={Colors.deepPurple} size={16} />
                      <Text style={styles.existingCommentText}>
                        {claim.coordinatorComment}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Message Input (only for pending claims) */}
                {claim.status === 'pending' && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      Add Message <Text style={styles.optional}>(Optional)</Text>
                    </Text>
                    <TextInput
                      style={styles.messageInput}
                      placeholder="Add a message for the student..."
                      placeholderTextColor={Colors.textSecondary}
                      value={message}
                      onChangeText={setMessage}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    <Text style={styles.messageHint}>
                      This message will be visible to the student
                    </Text>
                  </View>
                )}

              {/* Action Buttons (only for pending claims) */}
              {claim.status === 'pending' && (
                <View style={styles.actions}>
                  <SDButton
                    variant="reject"
                    size="lg"
                    onPress={handleReject}
                    disabled={loading}
                    style={styles.actionButton}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.light} size="small" />
                    ) : (
                      <>
                        <X color={Colors.light} size={20} />
                        <Text style={styles.actionButtonText}>Reject</Text>
                      </>
                    )}
                  </SDButton>
                  <SDButton
                    variant="accept"
                    size="lg"
                    onPress={handleApprove}
                    disabled={loading}
                    style={styles.actionButton}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.dark} size="small" />
                    ) : (
                      <>
                        <Check color={Colors.dark} size={20} />
                        <Text style={styles.actionButtonTextDark}>Approve</Text>
                      </>
                    )}
                  </SDButton>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // No overlay effect above white panel
  },
  outerScrollView: {
    flex: 1,
  },
  outerScrollContent: {
    paddingTop: 140, // Space for banner
    paddingBottom: 100, // Space for nav bar
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: Sizes.radiusXl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5, // Lower elevation to stay behind banner and nav
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: Colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  statusContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: Sizes.radiusFull,
  },
  statusApproved: {
    backgroundColor: Colors.green,
  },
  statusRejected: {
    backgroundColor: Colors.red,
  },
  statusBadgeText: {
    fontSize: Sizes.fontSm,
    fontWeight: '700',
    color: Colors.light,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(200, 200, 220, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: Sizes.fontMd,
    color: Colors.text,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.sm,
  },
  optional: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  descriptionBox: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descriptionText: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    lineHeight: 20,
  },
  proofButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: `${Colors.deepPurple}0D`,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.deepPurple}33`,
  },
  proofButtonText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  proofHint: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  existingCommentBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: `${Colors.deepPurple}0D`,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.deepPurple}33`,
  },
  existingCommentText: {
    flex: 1,
    fontSize: Sizes.fontSm,
    color: Colors.text,
    lineHeight: 20,
  },
  messageInput: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    fontSize: Sizes.fontSm,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
  },
  messageHint: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButtonText: {
    color: Colors.light,
    fontSize: Sizes.fontMd,
    fontWeight: '600',
  },
  actionButtonTextDark: {
    color: Colors.dark,
    fontSize: Sizes.fontMd,
    fontWeight: '600',
  },
});

