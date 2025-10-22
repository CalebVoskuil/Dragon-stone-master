import { useState } from "react";
import { Plus, Clock, Award, TrendingUp, Users, Calendar, Eye } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDCard, SDLogCard } from "../SDCard";
import { SDStatChip, SDStatusChip } from "../SDStatusChip";
import { useAuth } from "../../hooks/useAuth";

interface DashboardScreenProps {
  onLogHours: () => void;
  onViewBadges: () => void;
  onViewHistory: () => void;
  onViewSchools: () => void;
}

export function DashboardScreen({ onLogHours, onViewBadges, onViewHistory, onViewSchools }: DashboardScreenProps) {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock data for recent logs
  const recentLogs = [
    {
      id: '1',
      studentName: user?.name || 'Alex Smith',
      school: user?.school || 'Cape Town High School',
      hours: 3,
      status: 'approved' as const,
      submittedAt: '2 days ago',
      notes: 'Helped serve meals at community kitchen'
    },
    {
      id: '2', 
      studentName: user?.name || 'Alex Smith',
      school: user?.school || 'Cape Town High School',
      hours: 2.5,
      status: 'pending' as const,
      submittedAt: '5 hours ago',
      notes: 'Beach cleanup at Camps Bay'
    },
    {
      id: '3',
      studentName: user?.name || 'Alex Smith', 
      school: user?.school || 'Cape Town High School',
      hours: 4,
      status: 'approved' as const,
      submittedAt: '1 week ago',
      notes: 'Reading program at local library'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const nextBadgeProgress = 75; // Mock progress to next badge

  const canLogHours = !user?.isMinor || user?.consentStatus === 'approved';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8">
        <div className="max-w-md mx-auto">
          <h1 className="mb-1">{getGreeting()}, {user?.name?.split(' ')[0]}</h1>
          <p className="text-primary-foreground/80">Ready to make a difference today?</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6 -mt-4">
        {/* Stats Overview */}
        <SDCard variant="elevated" padding="lg" className="bg-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-primary">{user?.totalHours || 0}</div>
              <div className="text-xs text-muted-foreground">Total Hours</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-accent">{user?.currentStreak || 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-secondary">{user?.totalPoints || 0}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
          </div>
        </SDCard>

        {/* Next Badge Progress */}
        <SDCard padding="md" className="bg-gradient-to-r from-accent/10 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-full">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Community Champion</p>  
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${nextBadgeProgress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{nextBadgeProgress}%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">5 more hours to unlock</p>
            </div>
          </div>
        </SDCard>

        {/* Consent Status for Minors */}
        {user?.isMinor && user?.consentStatus !== 'approved' && (
          <SDCard padding="md" className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-yellow-900">Consent Status:</p>
                  <SDStatusChip status={user.consentStatus || 'pending'} size="sm" />
                </div>
                <p className="text-sm text-yellow-800">
                  {user.consentStatus === 'pending' 
                    ? "Your guardian consent is being reviewed. You'll be able to log hours once approved."
                    : "Please upload a signed guardian consent form to start logging hours."
                  }
                </p>
              </div>
            </div>
          </SDCard>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <SDButton
            onClick={onLogHours}
            variant="primary"
            fullWidth
            disabled={!canLogHours}
            className="h-16 flex-col gap-1"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">Log Hours</span>
          </SDButton>
          
          <SDButton
            onClick={onViewBadges}
            variant="tertiary"
            fullWidth
            className="h-16 flex-col gap-1"
          >
            <Award className="h-5 w-5" />
            <span className="text-sm">My Badges</span>
          </SDButton>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              This {period}
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-foreground">Recent Activity</h2>
            <button
              onClick={onViewHistory}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <SDLogCard
                  key={log.id}
                  studentName={log.studentName}
                  school={log.school}
                  hours={log.hours}
                  status={log.status}
                  submittedAt={log.submittedAt}
                  notes={log.notes}
                />
              ))
            ) : (
              <SDCard padding="lg" className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-2">No activity yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start logging your volunteer hours to see your impact!
                </p>
                <SDButton
                  onClick={onLogHours}
                  disabled={!canLogHours}
                >
                  Log Your First Hours
                </SDButton>
              </SDCard>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <SDStatChip
            label="This Month"
            value="12h"
            icon={TrendingUp}
            variant="primary"
          />
          <SDStatChip
            label="Volunteers"
            value="1,247"
            icon={Users}
            variant="default"
          />
        </div>
      </div>


    </div>
  );
}