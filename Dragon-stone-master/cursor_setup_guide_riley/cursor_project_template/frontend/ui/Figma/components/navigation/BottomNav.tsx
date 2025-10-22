import { Home, Clock, Award, User, ClipboardList, Bell, Trophy, Users, Calendar } from "lucide-react";
import { cn } from "../ui/utils";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: 'dashboard' | 'history' | 'badges' | 'profile' | 'coordinator' | 'claims' | 'notifications' | 'leaderboard' | 'students' | 'events';
  onTabChange: (tab: 'dashboard' | 'history' | 'badges' | 'profile' | 'coordinator' | 'claims' | 'notifications' | 'leaderboard' | 'students' | 'events') => void;
  userRole: 'student' | 'coordinator' | 'admin-student' | 'admin-coordinator';
}

export function BottomNav({ activeTab, onTabChange, userRole }: BottomNavProps) {
  const studentTabs = [
    { id: 'dashboard' as const, label: 'Home', icon: Home },
    { id: 'history' as const, label: 'History', icon: Clock },
    { id: 'badges' as const, label: 'Badges', icon: Award },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const coordinatorTabs = [
    { id: 'dashboard' as const, label: 'Home', icon: Home },
    { id: 'claims' as const, label: 'Claims', icon: ClipboardList },
    { id: 'students' as const, label: 'Students', icon: Users },
    { id: 'events' as const, label: 'Events', icon: Calendar },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const tabs = (userRole === 'coordinator' || userRole === 'admin-coordinator') ? coordinatorTabs : studentTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md z-50 shadow-[0_-6px_18px_-6px_rgba(0,0,0,0.12)]">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-colors min-w-0 min-h-[44px] min-w-[44px] relative",
                  isActive 
                    ? "text-white" 
                    : "text-[#58398B]"
                )}
                aria-label={tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-highlight"
                    className="absolute inset-0 bg-[#58398B] rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 flex-shrink-0 relative z-10" />
                <span className="text-xs font-medium truncate relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}