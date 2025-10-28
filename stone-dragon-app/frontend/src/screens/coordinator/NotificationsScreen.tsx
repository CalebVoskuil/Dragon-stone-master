import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Bell, Check, X, Clock, Award } from 'lucide-react-native';
import {
  GradientBackground,
  SDCard,
  GlassmorphicCard,
} from '../../components/ui';
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

/**
 * NotificationsScreen - Notifications center
 * View all system and volunteer-related notifications
 */
export default function NotificationsScreen() {
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

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

