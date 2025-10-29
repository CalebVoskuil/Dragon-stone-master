/**
 *
 */

/**
 *
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  TrendingUp,
  Clock,
  Check,
  Users,
  Calendar,
  LucideIcon,
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';

interface Stats {
  pending: number;
  today: number;
  approved: number;
  rejected?: number; // For calculating total reviewed (admin view)
  totalStudents: number;
  totalHours: number;
  avgResponseTime: string;
}

interface SDStatGridProps {
  stats: Stats;
  isAdmin?: boolean; // Show different labels for admin view
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, trend, subtitle }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: `${color}20` }]}>
      <View style={styles.statCardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}40` }]}>
          <Icon color={color} size={20} />
        </View>

        {trend && (
          <View style={styles.trendContainer}>
            <TrendingUp color={Colors.text} size={12} />
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </View>

      <View style={styles.statCardContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

/**
 * SDStatGrid - Statistics grid for coordinator/admin dashboard
 * Displays key metrics and statistics
 */
export default function SDStatGrid({ stats, isAdmin = false }: SDStatGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mainGrid}>
        <StatCard
          title={isAdmin ? "Reviewed" : "Pending Review"}
          value={isAdmin ? stats.approved + (stats.rejected || 0) : stats.pending}
          icon={Clock}
          color={Colors.orange}
          subtitle={isAdmin ? "total reviewed" : "requires attention"}
        />

        <StatCard
          title="Today's Claims"
          value={stats.today}
          icon={Calendar}
          color={Colors.golden}
          subtitle="submitted today"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={Check}
          color={Colors.green}
          subtitle="total approved"
        />

        <StatCard
          title="Active Students"
          value={stats.totalStudents}
          icon={Users}
          color={Colors.mediumPurple}
          subtitle="registered"
        />
      </View>

      {/* Quick Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{stats.totalHours}h</Text>
          <Text style={styles.metricLabel}>Total Verified</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{stats.avgResponseTime}</Text>
          <Text style={styles.metricLabel}>Approval Rate</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  mainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: Sizes.radiusLg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Sizes.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: Sizes.fontXs,
    color: Colors.text,
    fontWeight: '600',
  },
  statCardContent: {
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark,
  },
  statTitle: {
    fontSize: Sizes.fontSm,
    color: Colors.text,
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  metricValue: {
    fontSize: Sizes.fontXl,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: Sizes.fontXs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
});

