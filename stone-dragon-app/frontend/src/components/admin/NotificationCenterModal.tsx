/**
 *
 */

/**
 *
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { X, Bell, Check, Clock, Award, Calendar } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';

interface Notification {
  id: string;
  type: 'claim_submitted' | 'claim_approved' | 'claim_rejected' | 'badge_earned' | 'system' | 'event_registered';
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
 * Shows all system and volunteer-related notifications based on user role
 */
export default function NotificationCenterModal({
  visible,
  onClose,
}: NotificationCenterModalProps) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notificationList: Notification[] = [];

      // Fetch notifications based on user role
      if (user?.role === 'COORDINATOR' || user?.role === 'ADMIN') {
        // For coordinators/admins: show pending claims and recent activities
        const pendingLogsResponse = await apiService.getPendingLogs();
        
        if (pendingLogsResponse.success && pendingLogsResponse.data) {
          pendingLogsResponse.data.forEach((log: any) => {
            notificationList.push({
              id: `pending-${log.id}`,
              type: 'claim_submitted',
              title: 'New Claim Submitted',
              message: `${log.user?.firstName || ''} ${log.user?.lastName || ''} submitted ${log.hours} hours for verification`,
              timestamp: formatTimeAgo(log.createdAt),
              isRead: false,
            });
          });
        }

        // Also fetch recently approved/rejected claims
        const logsResponse = await apiService.getVolunteerLogs({ limit: 10, status: 'all' });
        
        if (logsResponse.success && logsResponse.data) {
          logsResponse.data.forEach((log: any) => {
            if (log.status === 'approved' && log.reviewedAt) {
              notificationList.push({
                id: `approved-${log.id}`,
                type: 'claim_approved',
                title: 'Claim Approved',
                message: `Approved ${log.user?.firstName || ''} ${log.user?.lastName || ''}'s claim`,
                timestamp: formatTimeAgo(log.reviewedAt),
                isRead: true,
              });
            } else if (log.status === 'rejected' && log.reviewedAt) {
              notificationList.push({
                id: `rejected-${log.id}`,
                type: 'claim_rejected',
                title: 'Claim Rejected',
                message: `Rejected ${log.user?.firstName || ''} ${log.user?.lastName || ''}'s claim`,
                timestamp: formatTimeAgo(log.reviewedAt),
                isRead: true,
              });
            }
          });
        }
      } else if (user?.role === 'STUDENT' || user?.role === 'STUDENT_COORDINATOR') {
        // For students: show their log statuses and upcoming events
        const [logsResponse, eventsResponse] = await Promise.all([
          apiService.getVolunteerLogs({ limit: 20 }),
          apiService.getMyEvents(),
        ]);

        // Process volunteer logs
        if (logsResponse.success && logsResponse.data) {
          logsResponse.data.forEach((log: any) => {
            if (log.status === 'approved') {
              notificationList.push({
                id: `approved-${log.id}`,
                type: 'claim_approved',
                title: 'Hours Approved',
                message: `Your ${log.hours} hours for "${log.description}" have been approved`,
                timestamp: formatTimeAgo(log.reviewedAt || log.updatedAt),
                isRead: true,
              });
            }
            
            if (log.status === 'rejected') {
              notificationList.push({
                id: `rejected-${log.id}`,
                type: 'claim_rejected',
                title: 'Hours Rejected',
                message: log.coordinatorComment || 'Your hours submission was rejected',
                timestamp: formatTimeAgo(log.reviewedAt || log.updatedAt),
                isRead: false,
              });
            }
          });
        }

        // Process event registrations
        if (eventsResponse.success && eventsResponse.data) {
          eventsResponse.data.forEach((event: any) => {
            const eventDate = new Date(event.date);
            const now = new Date();
            const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntil >= 0 && daysUntil <= 7) {
              notificationList.push({
                id: `event-${event.id}`,
                type: 'event_registered',
                title: 'Upcoming Event',
                message: `${event.title} is in ${daysUntil === 0 ? 'today' : `${daysUntil} days`}`,
                timestamp: formatTimeAgo(event.date),
                isRead: false,
              });
            }
          });
        }
      }

      // Sort by timestamp (newest first)
      notificationList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setNotifications(notificationList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString();
  };

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
      case 'event_registered':
        return <Calendar color={Colors.blue} size={20} />;
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
      statusBarTranslucent
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
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.deepPurple} />
                <Text style={styles.loadingText}>Loading notifications...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredNotifications}
                renderItem={renderNotification}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                indicatorStyle="white"
                showsVerticalScrollIndicator={true}
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
            )}
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
    zIndex: 5, // Behind banner (zIndex: 10) and nav bar
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    paddingTop: spacing.xxl,
    zIndex: 5,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: Colors.textSecondary,
    marginTop: spacing.sm,
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

