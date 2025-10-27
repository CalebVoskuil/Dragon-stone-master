import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, Bell, Check, Clock, Award } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';

interface Notification {
  id: string;
  type: 'claim_submitted' | 'claim_approved' | 'claim_rejected' | 'badge_earned' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationCenterModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * NotificationCenterModal - Modal displaying notifications
 * Shows all system and volunteer-related notifications
 */
export default function NotificationCenterModal({
  visible,
  onClose,
}: NotificationCenterModalProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'claim_submitted',
      title: 'New Claim Submitted',
      message: 'Alex Smith submitted 3 hours for verification',
      timestamp: '5 minutes ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'claim_submitted',
      title: 'New Claim Submitted',
      message: 'Sarah Johnson submitted 2.5 hours for verification',
      timestamp: '1 hour ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'badge_earned',
      title: 'Badge Milestone',
      message: 'Michael Chen earned the "Community Champion" badge',
      timestamp: '2 hours ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'system',
      title: 'Weekly Report Ready',
      message: 'Your weekly volunteer hours report is ready to view',
      timestamp: '1 day ago',
      isRead: true,
    },
  ]);

  const filteredNotifications = notifications.filter((n) =>
    filter === 'all' ? true : !n.isRead
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'claim_submitted':
        return <Clock color={Colors.orange} size={20} />;
      case 'claim_approved':
        return <Check color={Colors.green} size={20} />;
      case 'claim_rejected':
        return <X color={Colors.red} size={20} />;
      case 'badge_earned':
        return <Award color={Colors.golden} size={20} />;
      default:
        return <Bell color={Colors.deepPurple} size={20} />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      onPress={() => markAsRead(item.id)}
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>{getIcon(item.type)}</View>
        <View style={styles.textContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <Bell color={Colors.deepPurple} size={24} />
                </View>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color={Colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            {/* Filter Tabs and Mark All Read */}
            <View style={styles.controlsContainer}>
              <View style={styles.filterTabs}>
                <TouchableOpacity
                  onPress={() => setFilter('all')}
                  style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                >
                  <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilter('unread')}
                  style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
                >
                  <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                  </Text>
                </TouchableOpacity>
              </View>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                  <Text style={styles.markAllText}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Notifications List */}
            <FlatList
              data={filteredNotifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Bell color={Colors.textSecondary} size={48} />
                  <Text style={styles.emptyTitle}>No notifications</Text>
                  <Text style={styles.emptyDescription}>
                    {filter === 'unread' ? 'All caught up!' : "You don't have any notifications yet"}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent', // No overlay effect above white panel
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    paddingTop: spacing.xxl,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Colors.card,
    borderTopLeftRadius: Sizes.radiusXl,
    borderTopRightRadius: Sizes.radiusXl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    backgroundColor: `${Colors.deepPurple}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.orange,
    borderRadius: Sizes.radiusFull,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: Sizes.fontXs,
    fontWeight: '700',
    color: Colors.light,
  },
  closeButton: {
    padding: spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusFull,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: Colors.background,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.deepPurple,
    borderColor: Colors.deepPurple,
  },
  filterText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.light,
  },
  markAllButton: {
    padding: spacing.sm,
  },
  markAllText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  notificationCard: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.radiusLg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unreadCard: {
    backgroundColor: `${Colors.deepPurple}0D`,
    borderColor: `${Colors.deepPurple}33`,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  notificationTimestamp: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    marginTop: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyDescription: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

