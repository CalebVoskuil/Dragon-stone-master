import { useState } from "react";
import { Calendar, Users, Clock, CheckCircle, TrendingUp, AlertCircle, Award, GraduationCap, Bell, Settings } from "lucide-react";
import { SDCard } from "../SDCard";
import { SDStatChip } from "../SDStatusChip";
import { useAuth } from "../../hooks/useAuth";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";

interface RecentActivity {
  id: string;
  type: 'approved' | 'rejected' | 'submitted';
  studentName: string;
  hours: number;
  timestamp: string;
  category: string;
}

interface CoordinatorHomeScreenProps {
  onAlertsPress?: () => void;
  onProfilePress?: () => void;
}

export function CoordinatorHomeScreen({ onAlertsPress, onProfilePress }: CoordinatorHomeScreenProps = {}) {
  const { user } = useAuth();

  // Mock data for recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'submitted',
      studentName: 'Sarah Johnson',
      hours: 4,
      timestamp: '2 hours ago',
      category: 'Community Kitchen'
    },
    {
      id: '2',
      type: 'approved',
      studentName: 'Michael Chen',
      hours: 3,
      timestamp: '5 hours ago',
      category: 'Beach Cleanup'
    },
    {
      id: '3',
      type: 'submitted',
      studentName: 'David Miller',
      hours: 5,
      timestamp: '1 day ago',
      category: 'Garden Maintenance'
    },
    {
      id: '4',
      type: 'approved',
      studentName: 'Emma Wilson',
      hours: 2,
      timestamp: '1 day ago',
      category: 'Tutoring'
    }
  ];

  // Mock stats
  const stats = {
    pendingClaims: 4,
    todaySubmissions: 2,
    totalStudents: 247,
    approvedThisWeek: 18,
    totalHoursThisMonth: 342,
    averageResponseTime: 2.4
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'submitted':
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      case 'submitted':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Top Row with Buttons */}
          <div className="flex items-center justify-between mb-6">
            {/* Settings Button - Far Left */}
            <button
              onClick={onProfilePress}
              className="p-2.5 rounded-full active:bg-[#58398B] transition-colors group"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-[#58398B] group-active:text-white transition-colors" />
            </button>
            
            {/* Alerts Button - Far Right */}
            <button
              onClick={onAlertsPress}
              className="p-2.5 rounded-full active:bg-[#58398B] transition-colors relative group"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-[#58398B] group-active:text-white transition-colors" />
              {stats.pendingClaims > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#F77F00] rounded-full flex items-center justify-center text-xs font-semibold text-white">
                  {stats.pendingClaims}
                </span>
              )}
            </button>
          </div>

          {/* Welcome Section */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-3 rounded-full bg-white/10 backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 mr-2 text-[#58398B]" />
              <span className="text-sm font-medium text-[#58398B]">{user?.school || 'Cape Town High School'}</span>
            </div>
            <h1 className="mb-2 text-[#58398B]">Welcome back, {user?.name?.split(' ')[0] || 'Coordinator'}</h1>
            <p className="text-[#58398B]/70">
              {stats.pendingClaims > 0 
                ? `You have ${stats.pendingClaims} ${stats.pendingClaims === 1 ? 'claim' : 'claims'} pending review`
                : 'All caught up! No pending claims'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container with Glassmorphic Card - Add top padding to account for fixed header */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[250px]">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-6 mb-6">
          {/* Quick Stats */}
          <div>
            <h2 className="font-medium text-foreground mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SDStatChip
                label="Pending Claims"
                value={stats.pendingClaims.toString()}
                icon={Clock}
                variant="primary"
              />
              <SDStatChip
                label="Today's Submissions"
                value={stats.todaySubmissions.toString()}
                icon={Calendar}
                variant="accent"
              />
              <SDStatChip
                label="Total Students"
                value={stats.totalStudents.toString()}
                icon={Users}
                variant="default"
              />
            </div>
          </div>

          {/* This Week Stats */}
          <SDCard padding="lg" className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-medium text-foreground">This Week</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-primary">{stats.approvedThisWeek}</span>
                  <span className="text-sm text-muted-foreground">claims</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Approved</p>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-accent">{stats.totalHoursThisMonth}h</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Total Hours (Month)</p>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-secondary">{stats.averageResponseTime}h</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Avg Response Time</p>
              </div>
            </div>
          </SDCard>

          {/* Action Needed */}
          {stats.pendingClaims > 0 && (
            <SDCard padding="lg" className="border-orange-200 bg-orange-50/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">Action Needed</h3>
                  <p className="text-sm text-muted-foreground">
                    You have <span className="font-medium text-orange-600">{stats.pendingClaims} pending claims</span> waiting for review.
                  </p>
                </div>
              </div>
            </SDCard>
          )}

          {/* Recent Activity */}
          <div>
            <h2 className="font-medium text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <SDCard 
                  key={activity.id} 
                  padding="md" 
                  variant="elevated"
                  className={`${getActivityColor(activity.type)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground truncate">
                          {activity.studentName}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 text-muted-foreground font-medium">
                          {activity.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{activity.type}</span>
                        <span>•</span>
                        <span>{activity.hours} hours</span>
                        <span>•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </SDCard>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="font-medium text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SDCard padding="lg" variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Review Claims</h3>
                    <p className="text-sm text-muted-foreground">Approve or reject submissions</p>
                  </div>
                </div>
              </SDCard>

              <SDCard padding="lg" variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">View Students</h3>
                    <p className="text-sm text-muted-foreground">See student directory</p>
                  </div>
                </div>
              </SDCard>

              <SDCard padding="lg" variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Leaderboard</h3>
                    <p className="text-sm text-muted-foreground">View top volunteers</p>
                  </div>
                </div>
              </SDCard>

              <SDCard padding="lg" variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Reports</h3>
                    <p className="text-sm text-muted-foreground">Generate activity reports</p>
                  </div>
                </div>
              </SDCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}