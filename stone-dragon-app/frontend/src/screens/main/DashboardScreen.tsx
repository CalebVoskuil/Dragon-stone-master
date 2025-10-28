import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Plus,
  Clock,
  Award,
  Eye,
  Bell,
  Trophy,
  X,
  Calendar,
} from 'lucide-react-native';
import {
  GradientBackground,
  SDButton,
  SDCard,
  SDStatusChip,
  GlassmorphicCard,
  GlassmorphicBanner,
} from '../../components/ui';
import { LeaderboardModal, NotificationCenterModal } from '../../components/admin';
import { useAuth } from '../../store/AuthContext';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';
import { typography, shadows } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/api';

/**
 * DashboardScreen - Main student dashboard
 * Shows stats, recent activity, badges progress, and quick actions
 */
export default function DashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalHours: 0,
    totalLogs: 0,
    pendingLogs: 0,
    approvedLogs: 0,
    rejectedLogs: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logDetailVisible, setLogDetailVisible] = useState(false);

  const nextBadgeProgress = 75;
  const canLogHours = true; // Update based on user consent status

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user stats and recent logs in parallel
      const [statsResponse, logsResponse] = await Promise.all([
        apiService.getUserStats(),
        apiService.getVolunteerLogs({ limit: 5 }),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      if (logsResponse.success && logsResponse.data) {
        setRecentLogs(logsResponse.data);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const firstName = user?.firstName || 'Friend';

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          indicatorStyle="white"
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.bannerSpacer} />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.deepPurple} />
              <Text style={styles.loadingText}>Loading dashboard...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <SDButton variant="primary-filled" size="md" onPress={fetchDashboardData}>
                Retry
              </SDButton>
            </View>
          ) : (
            <GlassmorphicCard intensity={80} style={styles.mainCard}>
              {/* Stats Overview */}
              <SDCard variant="elevated" padding="lg" style={styles.statsCard}>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: Colors.deepPurple }]}>
                      {stats.totalHours}
                    </Text>
                    <Text style={styles.statLabel}>Total Hours</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: Colors.golden }]}>
                      {stats.pendingLogs}
                    </Text>
                    <Text style={styles.statLabel}>Pending</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: Colors.mediumPurple }]}>
                      {stats.approvedLogs}
                    </Text>
                    <Text style={styles.statLabel}>Approved</Text>
                  </View>
                </View>
              </SDCard>

            {/* Next Badge Progress */}
            <SDCard padding="md" style={styles.badgeCard}>
              <View style={styles.badgeContent}>
                <View style={styles.badgeIcon}>
                  <Award color={Colors.golden} size={20} />
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeTitle}>Community Champion</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${nextBadgeProgress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{nextBadgeProgress}%</Text>
                  </View>
                  <Text style={styles.badgeHint}>5 more hours to unlock</Text>
                </View>
              </View>
            </SDCard>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <SDButton
                variant="primary-filled"
                onPress={() => navigation.navigate('LogHours' as never)}
                disabled={!canLogHours}
                style={styles.actionButton}
              >
                <Plus color={Colors.light} size={20} />
                <Text style={styles.actionButtonText}>Log Hours</Text>
              </SDButton>

              <SDButton
                variant="ghost"
                onPress={() => navigation.navigate('Badges' as never)}
                style={styles.actionButton}
              >
                <Award color={Colors.deepPurple} size={20} />
                <Text style={[styles.actionButtonText, { color: Colors.deepPurple }]}>
                  My Badges
                </Text>
              </SDButton>
            </View>

            {/* Recent Activity */}
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
              </View>

              {recentLogs.length > 0 ? (
                <View style={styles.logsList}>
                  {recentLogs.map((log) => (
                    <TouchableOpacity
                      key={log.id}
                      onPress={() => {
                        setSelectedLog(log);
                        setLogDetailVisible(true);
                      }}
                    >
                      <SDCard variant="elevated" padding="md" style={styles.logCard}>
                        <View style={styles.logHeader}>
                          <Text style={styles.logHours}>{log.hours}h</Text>
                          <SDStatusChip status={log.status} size="sm" />
                        </View>
                        <Text style={styles.logNotes} numberOfLines={2}>
                          {log.description}
                        </Text>
                        <Text style={styles.logTime}>{formatDate(log.createdAt)}</Text>
                      </SDCard>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <SDCard padding="lg" style={styles.emptyState}>
                  <Clock color={Colors.textSecondary} size={48} />
                  <Text style={styles.emptyTitle}>No activity yet</Text>
                  <Text style={styles.emptyDescription}>
                    Start logging your volunteer hours to see your impact!
                  </Text>
                  <SDButton
                    variant="primary-filled"
                    onPress={() => navigation.navigate('LogHours' as never)}
                    disabled={!canLogHours}
                  >
                    Log Your First Hours
                  </SDButton>
                </SDCard>
              )}
            </View>
          </GlassmorphicCard>
          )}
        </ScrollView>

        {/* Glassmorphic Banner - Fixed at top */}
        <View style={styles.bannerWrapper}>
          <GlassmorphicBanner
            schoolName={typeof user?.school === 'string' ? user.school : (user?.school as any)?.name || 'Stone Dragon NPO'}
            welcomeMessage={`${getGreeting()}, ${firstName}`}
            notificationCount={stats.pendingLogs}
            onLeaderboardPress={() => setLeaderboardVisible(true)}
            onNotificationPress={() => setNotificationVisible(true)}
            userRole={user?.role}
          />
        </View>

        {/* Modals */}
        <LeaderboardModal
          visible={leaderboardVisible}
          onClose={() => setLeaderboardVisible(false)}
        />
        <NotificationCenterModal
          visible={notificationVisible}
          onClose={() => setNotificationVisible(false)}
        />

        {/* Log Detail Modal */}
        <Modal
          visible={logDetailVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setLogDetailVisible(false)}
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <ScrollView 
              style={styles.outerScrollView}
              contentContainerStyle={styles.outerScrollContent}
              indicatorStyle="white"
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {/* Header */}
                  <View style={styles.header}>
                    <View style={styles.headerLeft}>
                      <View style={styles.headerIcon}>
                        <Clock color={Colors.deepPurple} size={20} />
                      </View>
                      <Text style={styles.headerTitle}>Log Details</Text>
                    </View>
                    <TouchableOpacity onPress={() => setLogDetailVisible(false)} style={styles.closeButton}>
                      <X color={Colors.textSecondary} size={24} />
                    </TouchableOpacity>
                  </View>

                  {selectedLog && (() => {
                    // Parse description to extract structured info
                    const desc = selectedLog.description || '';
                    let activityType = 'Other';
                    let eventName = '';
                    let donationItem = '';
                    let donationAmount = '';
                    let volunteerTitle = '';
                    let volunteerOrg = '';
                    let otherTitle = '';
                    let actualDescription = desc;

                    if (desc.startsWith('Event:')) {
                      activityType = 'Event';
                      const parts = desc.split('\n');
                      if (parts[0]) eventName = parts[0].replace('Event:', '').trim();
                      if (parts[1]) actualDescription = parts[1].replace('Description:', '').trim();
                    } else if (desc.startsWith('Donation -')) {
                      activityType = 'Donation';
                      const parts = desc.split('\n');
                      if (parts[0]) {
                        const detailsPart = parts[0].replace('Donation -', '').trim();
                        const itemMatch = detailsPart.match(/Item:\s*([^,]+)/);
                        const amountMatch = detailsPart.match(/Amount:\s*([^,\n]+)/);
                        donationItem = itemMatch ? itemMatch[1].trim() : '';
                        donationAmount = amountMatch ? amountMatch[1].trim() : '';
                      }
                      if (parts[1]) actualDescription = parts[1].replace('Description:', '').trim();
                      else actualDescription = '';
                    } else if (desc.startsWith('Volunteer Work -')) {
                      activityType = 'Volunteer';
                      const parts = desc.split('\n');
                      if (parts[0]) {
                        const detailsPart = parts[0].replace('Volunteer Work -', '').trim();
                        const titleMatch = detailsPart.match(/Title:\s*([^,]+)/);
                        const orgMatch = detailsPart.match(/Organization:\s*([^,\n]+)/);
                        volunteerTitle = titleMatch ? titleMatch[1].trim() : '';
                        volunteerOrg = orgMatch ? orgMatch[1].trim() : '';
                      }
                      if (parts[1]) actualDescription = parts[1].replace('Description:', '').trim();
                    } else if (desc.startsWith('Other Activity -')) {
                      activityType = 'Other';
                      const parts = desc.split('\n');
                      if (parts[0]) {
                        const titleMatch = parts[0].match(/Other Activity - Title:\s*([^\n]+)/);
                        otherTitle = titleMatch ? titleMatch[1].trim() : '';
                      }
                      if (parts[1]) actualDescription = parts[1].replace('Description:', '').trim();
                    }

                    return (
                    <>
                      {/* Activity Type */}
                      <View style={styles.section}>
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <Eye color={Colors.deepPurple} size={18} />
                          </View>
                          <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Activity Type</Text>
                            <Text style={styles.infoValue}>{activityType}</Text>
                          </View>
                        </View>
                      </View>

                      {/* Event Title */}
                      {activityType === 'Event' && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Calendar color={Colors.deepPurple} size={18} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Event Title</Text>
                              <Text style={styles.infoValue}>{eventName || 'Event Title Not Available'}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Donation Details */}
                      {activityType === 'Donation' && donationItem && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Award color={Colors.deepPurple} size={18} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Donated Item</Text>
                              <Text style={styles.infoValue}>{donationItem}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {activityType === 'Donation' && donationAmount && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Award color={Colors.deepPurple} size={18} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Amount/Quantity</Text>
                              <Text style={styles.infoValue}>{donationAmount}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Volunteer Work Details */}
                      {activityType === 'Volunteer' && volunteerTitle && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Award color={Colors.deepPurple} size={18} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Activity Title</Text>
                              <Text style={styles.infoValue}>{volunteerTitle}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {activityType === 'Volunteer' && volunteerOrg && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Award color={Colors.deepPurple} size={18} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Organization</Text>
                              <Text style={styles.infoValue}>{volunteerOrg}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Other Activity Title */}
                      {activityType === 'Other' && otherTitle && (
                        <View style={styles.section}>
                          <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                              <Award color={Colors.deepPurple} size={18} />
                            </View>
                            <View style={styles.infoContent}>
                              <Text style={styles.infoLabel}>Activity Title</Text>
                              <Text style={styles.infoValue}>{otherTitle}</Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Hours */}
                      {activityType !== 'Donation' && (
                      <View style={styles.section}>
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <Clock color={Colors.deepPurple} size={18} />
                          </View>
                          <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Hours Logged</Text>
                            <Text style={styles.infoValue}>{selectedLog.hours} hours</Text>
                          </View>
                        </View>
                      </View>
                      )}

                      {/* Status */}
                      <View style={styles.section}>
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <Award color={Colors.deepPurple} size={18} />
                          </View>
                          <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <SDStatusChip status={selectedLog.status} size="sm" />
                          </View>
                        </View>
                      </View>

                      {/* Date Submitted */}
                      <View style={styles.section}>
                        <View style={styles.infoRow}>
                          <View style={styles.infoIcon}>
                            <Eye color={Colors.deepPurple} size={18} />
                          </View>
                          <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Submitted</Text>
                            <Text style={styles.infoValue}>
                              {new Date(selectedLog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Description - only show if there's actual description */}
                      {actualDescription && (
                      <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionText}>{actualDescription}</Text>
                        </View>
                      </View>
                      )}

                      {/* Coordinator Comment */}
                      {selectedLog.coordinatorComment && (
                        <View style={styles.section}>
                          <Text style={styles.sectionTitle}>Coordinator Feedback</Text>
                          <View style={styles.existingCommentBox}>
                            <Text style={styles.existingCommentText}>{selectedLog.coordinatorComment}</Text>
                          </View>
                        </View>
                      )}
                    </>
                    );
                  })()}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
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
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
    backgroundColor: Colors.glassLight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  headerButton: {
    padding: spacing.sm,
    borderRadius: Sizes.radiusFull,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    ...typography.h2,
    color: Colors.deepPurple,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Space for nav bar
  },
  mainCard: {
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  badgeCard: {
    backgroundColor: `${Colors.golden}1A`,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  badgeIcon: {
    padding: spacing.sm,
    backgroundColor: `${Colors.golden}33`,
    borderRadius: Sizes.radiusFull,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Sizes.radiusFull,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.golden,
    borderRadius: Sizes.radiusFull,
  },
  progressText: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  badgeHint: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    marginTop: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  actionButtonText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: Sizes.radiusMd,
    backgroundColor: Colors.background,
  },
  periodButtonActive: {
    backgroundColor: Colors.deepPurple,
  },
  periodButtonText: {
    fontSize: Sizes.fontSm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  periodButtonTextActive: {
    color: Colors.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: Sizes.fontSm,
    color: Colors.deepPurple,
    textDecorationLine: 'underline',
  },
  logsList: {
    gap: spacing.md,
  },
  logCard: {
    backgroundColor: Colors.card,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logHours: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.deepPurple,
  },
  logNotes: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  logTime: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: Colors.textSecondary,
    marginTop: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  outerScrollView: {
    flex: 1,
  },
  outerScrollContent: {
    paddingTop: 140,
    paddingBottom: 100,
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
    elevation: 5,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoLabel: {
    fontSize: Sizes.fontSm,
    color: Colors.textSecondary,
    fontWeight: '600',
    minWidth: 90,
    paddingTop: 10, // Align with icon center
  },
  infoValue: {
    flex: 1,
    fontSize: Sizes.fontMd,
    color: Colors.text,
    fontWeight: '500',
    lineHeight: Sizes.fontMd * 1.4,
    flexWrap: 'wrap',
    paddingTop: 10, // Align with icon center
  },
  sectionTitle: {
    fontSize: Sizes.fontMd,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: spacing.sm,
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
});
