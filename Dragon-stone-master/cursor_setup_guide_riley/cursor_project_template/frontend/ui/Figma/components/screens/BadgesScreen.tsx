import { useState } from "react";
import { ArrowLeft, Award, Lock, Star, Users, Clock, Heart, TreePine, GraduationCap } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDCard } from "../SDCard";
import { SDStatChip } from "../SDStatusChip";
import { useAuth } from "../../hooks/useAuth";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";

interface BadgesScreenProps {
  onBack: () => void;
}

export function BadgesScreen({ onBack }: BadgesScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'earned' | 'available'>('earned');
  const { user } = useAuth();

  // Mock badge data
  const badges = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Log your very first volunteer hour',
      icon: Star,
      category: 'milestone',
      hoursRequired: 1,
      pointsAwarded: 50,
      earned: true,
      earnedDate: '2024-12-10'
    },
    {
      id: 'dedicated-helper',
      name: 'Dedicated Helper', 
      description: 'Complete 10 hours of volunteer work',
      icon: Heart,
      category: 'milestone',
      hoursRequired: 10,
      pointsAwarded: 100,
      earned: true,
      earnedDate: '2024-12-14'
    },
    {
      id: 'education-champion',
      name: 'Education Champion',
      description: 'Volunteer 20 hours in education & tutoring',
      icon: GraduationCap,
      category: 'specialty',
      hoursRequired: 20,
      pointsAwarded: 200,
      earned: true,
      earnedDate: '2024-12-15'
    },
    {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Reach 25 total volunteer hours',
      icon: Users,
      category: 'milestone',
      hoursRequired: 25,
      pointsAwarded: 150,
      earned: false,
      progress: 18 // out of 25
    },
    {
      id: 'eco-warrior',
      name: 'Eco Warrior',
      description: 'Complete 15 hours of environmental work',
      icon: TreePine,
      category: 'specialty',
      hoursRequired: 15,
      pointsAwarded: 175,
      earned: false,
      progress: 5 // out of 15
    },
    {
      id: 'time-master',
      name: 'Time Master',
      description: 'Maintain a 7-day volunteer streak',
      icon: Clock,
      category: 'streak',
      streakRequired: 7,
      pointsAwarded: 250,
      earned: false,
      progress: 3 // out of 7
    },
    {
      id: 'community-champion',
      name: 'Community Champion',
      description: 'Reach 50 total volunteer hours',
      icon: Award,
      category: 'milestone',
      hoursRequired: 50,
      pointsAwarded: 300,
      earned: false,
      progress: 18 // out of 50
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  const getCategoryColor = (category: string) => {
    const colors = {
      milestone: 'text-primary',
      specialty: 'text-accent',
      streak: 'text-secondary'
    };
    return colors[category as keyof typeof colors] || 'text-muted-foreground';
  };

  const getCategoryBg = (category: string) => {
    const colors = {
      milestone: 'bg-primary/10',
      specialty: 'bg-accent/10', 
      streak: 'bg-secondary/10'
    };
    return colors[category as keyof typeof colors] || 'bg-muted/10';
  };

  const formatProgress = (badge: any) => {
    if (badge.hoursRequired) {
      return `${badge.progress || 0} / ${badge.hoursRequired} hours`;
    }
    if (badge.streakRequired) {
      return `${badge.progress || 0} / ${badge.streakRequired} days`;
    }
    return '';
  };

  const getProgressPercentage = (badge: any) => {
    if (badge.hoursRequired) {
      return Math.min(((badge.progress || 0) / badge.hoursRequired) * 100, 100);
    }
    if (badge.streakRequired) {
      return Math.min(((badge.progress || 0) / badge.streakRequired) * 100, 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-full active:bg-[#58398B] transition-colors group"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-[#58398B] group-active:text-white transition-colors" />
            </button>
            <div className="flex-1 text-center -ml-12">
              <h1 className="text-[#58398B]">My Badges</h1>
              <p className="text-[#58398B]/70 text-sm">
                {earnedBadges.length} of {badges.length} badges earned
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container with Glassmorphic Card */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[120px] pb-24">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-6 mb-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <SDStatChip
              label="Earned"
              value={earnedBadges.length.toString()}
              icon={Award}
              variant="primary"
            />
            <SDStatChip
              label="Points"
              value={earnedBadges.reduce((sum, badge) => sum + badge.pointsAwarded, 0).toString()}
              variant="accent"
            />
            <SDStatChip
              label="Progress"
              value={`${Math.round((earnedBadges.length / badges.length) * 100)}%`}
              variant="default"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setSelectedTab('earned')}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                selectedTab === 'earned'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Earned ({earnedBadges.length})
            </button>
            <button
              onClick={() => setSelectedTab('available')}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                selectedTab === 'available'
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Available ({availableBadges.length})
            </button>
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-1 gap-4">
            {(selectedTab === 'earned' ? earnedBadges : availableBadges).map((badge) => {
              const Icon = badge.icon;
              const isEarned = badge.earned;
              
              return (
                <SDCard key={badge.id} padding="lg" variant="elevated">
                  <div className="flex items-start gap-4">
                    {/* Badge Icon */}
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                      ${isEarned 
                        ? getCategoryBg(badge.category)
                        : 'bg-muted/50'
                      }
                    `}>
                      <Icon className={`
                        h-6 w-6 
                        ${isEarned 
                          ? getCategoryColor(badge.category)
                          : 'text-muted-foreground'
                        }
                      `} />
                    </div>

                    {/* Badge Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${
                            isEarned ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {badge.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {badge.description}
                          </p>
                        </div>
                        
                        {!isEarned && (
                          <Lock className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                        )}
                      </div>

                      {/* Progress or Earned Date */}
                      {isEarned ? (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600 font-medium">
                            Earned {new Date(badge.earnedDate!).toLocaleDateString()}
                          </span>
                          <span className="text-muted-foreground">
                            +{badge.pointsAwarded} points
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {formatProgress(badge)}
                            </span>
                            <span className="text-muted-foreground">
                              +{badge.pointsAwarded} points
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(badge)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SDCard>
              );
            })}
          </div>

          {/* Empty State */}
          {selectedTab === 'earned' && earnedBadges.length === 0 && (
            <SDCard padding="lg" className="text-center">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-2">No badges yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start volunteering to earn your first badge!
              </p>
              <SDButton onClick={onBack}>
                Start Volunteering
              </SDButton>
            </SDCard>
          )}
        </div>
      </div>
    </div>
  );
}
