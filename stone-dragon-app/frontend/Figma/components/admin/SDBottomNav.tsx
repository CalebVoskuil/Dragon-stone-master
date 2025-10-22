import { Home, ClipboardList, Bell, User } from "lucide-react";
import { cn } from "../ui/utils";
import { motion } from "framer-motion";

interface SDBottomNavProps {
  activeTab: 'home' | 'claims' | 'notifications' | 'profile';
  onTabChange: (tab: 'home' | 'claims' | 'notifications' | 'profile') => void;
  className?: string;
}

export function SDBottomNav({ activeTab, onTabChange, className }: SDBottomNavProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'claims' as const, label: 'Claims', icon: ClipboardList },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className={cn(
      "h-[70px] backdrop-blur-md rounded-t-[16px] flex items-center justify-around px-4 pb-2",
      "shadow-[0_-6px_18px_-6px_rgba(0,0,0,0.12)]",
      className
    )}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onPointerDown={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors min-w-0 relative min-h-[44px] min-w-[44px]"
            )}
            aria-label={tab.label}
          >
            {isActive && (
              <motion.div
                layoutId="admin-nav-highlight"
                className="absolute inset-0 bg-[#58398B] rounded-xl"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Icon className={cn(
              "w-6 h-6 relative z-10",
              isActive ? "text-white" : "text-[#58398B]"
            )} />
            
            <span className={cn(
              "text-xs font-medium truncate relative z-10",
              isActive ? "text-white" : "text-[#58398B]"
            )}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}