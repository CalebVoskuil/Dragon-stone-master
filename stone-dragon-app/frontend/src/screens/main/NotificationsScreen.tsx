import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Bell, Check, X, Clock, Award, Calendar } from 'lucide-react-native';
import {
  GradientBackground,
  SDCard,
  GlassmorphicCard,
  GlassmorphicBanner,
} from '../../components/ui';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography } from '../../theme/theme';
import { useAuth } from '../../store/AuthContext';
import { apiService } from '../../services/api';

interface Notification {
  id: string;
  type: 'claim_approved' | 'claim_rejected' | 'event_registered' | 'badge_earned' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

/**
 * NotificationsScreen - Student notifications center
 * View all student-specific notifications based on their actual data
 */
export default function NotificationsScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Fetch user's volunteer logs and events to generate notifications
      const [logsResponse, eventsResponse] = await Promise.all([
        apiService.getVolunteerLogs({ limit: 50 }),
        apiService.getMyEvents(),
      ]);

      const notificationList: Notification[] = [];

      // Process volunteer logs for notifications
      if (logsResponse.success && logsResponse.data) {
        logsResponse.data.forEach((log: any) => {
          // Approved log notification
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
          
          // Rejected log notification
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

      // Process event registrations for notifications
      if (eventsResponse.success && eventsResponse.data) {
        eventsResponse.data.forEach((event: any) => {
          // Format upcoming event notification
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
      case 'event_registered':
        return <Calendar color={Colors.blue} size={20} />;
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
    <TouchableOpacity onPress={() => markAsRead(item.id)}>
      <SDCard
        variant="elevated"
        padding="md"
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
      </SDCard>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.deepPurple} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.bannerSpacer} />
        <GlassmorphicCard intensity={80} style={styles.mainCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Tabs */}
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

          {/* Notifications List */}
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
        </GlassmorphicCard>

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : (user?.school as any)?.name || 'Stone Dragon NPO'}
            welcomeMessage="Notifications"
            onLeaderboardPress={() => {/* Can add navigation if needed */}}
            onNotificationPress={() => {/* Can add navigation if needed */}}
            userRole={user?.role}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bannerSpacer: {
    height: 130, // Space for the banner
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
  mainCard: {
    flex: 1,
    margin: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: Colors.text,
  },
  markAllButton: {
    padding: spacing.sm,
  },
  markAllText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
  },
  filterTabActive: {
    backgroundColor: Colors.deepPurple,
  },
  filterText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.light,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  notificationCard: {
    marginBottom: spacing.sm,
    backgroundColor: Colors.card,
  },
  unreadCard: {
    backgroundColor: `${Colors.deepPurple}0D`,
    borderWidth: 1,
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
    backgroundColor: Colors.background,
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

