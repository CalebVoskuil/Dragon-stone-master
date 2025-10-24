import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  TrendingUp,
  Clock,
  Check,
  Users,
  Calendar,
} from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { Sizes, spacing } from '../../constants/Sizes';

interface Stats {
  pending: number;
  today: number;
  approved: number;
  totalStudents: number;
  totalHours: number;
  avgResponseTime: string;
}

interface SDStatGridProps {
  stats: Stats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  color: string;
  trend?: string;
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, trend, subtitle }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}33` }]}>
          <Icon color={color} size={20} />
        </View>

        {trend && (
          <View style={styles.trendContainer}>
            <TrendingUp color="rgba(255, 255, 255, 0.6)" size={12} />
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
 * SDStatGrid - Statistics grid for coordinator dashboard
 * Displays key metrics and statistics
 */
export default function SDStatGrid({ stats }: SDStatGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mainGrid}>
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color={Colors.orange}
          trend="+2"
          subtitle="requires attention"
        />

        <StatCard
          title="Today's Claims"
          value={stats.today}
          icon={Calendar}
          color={Colors.golden}
          trend="+5"
          subtitle="submitted today"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={Check}
          color={Colors.green}
          trend="+12"
          subtitle="this week"
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
          <Text style={styles.metricValue}>{stats.avgResponseTime}h</Text>
          <Text style={styles.metricLabel}>Avg Response</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>98%</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Sizes.radiusLg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statCardContent: {
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light,
  },
  statTitle: {
    fontSize: Sizes.fontSm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statSubtitle: {
    fontSize: Sizes.fontXs,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Sizes.radiusMd,
    padding: spacing.md,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: Sizes.fontLg,
    fontWeight: '600',
    color: Colors.light,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: Sizes.fontXs,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});

