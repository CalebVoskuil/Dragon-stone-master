import { useAuth } from "../../hooks/useAuth";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";
import { SDCard } from "../SDCard";
import { LogOut, Settings, Bell } from "lucide-react";

interface StudentProfileScreenProps {
  onAlertsPress?: () => void;
  onSettingsPress?: () => void;
}

export function StudentProfileScreen({ onAlertsPress, onSettingsPress }: StudentProfileScreenProps = {}) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header - Matching Coordinator Style */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-4 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Top Row with Buttons */}
          <div className="flex items-center justify-between mb-3">
            {/* Settings Button - Far Left */}
            <button
              onClick={onSettingsPress}
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
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-[#58398B] mb-4">Profile</h1>
            
            {/* Profile Info in Header */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full bg-[#7B4CB3] text-white flex items-center justify-center shadow-lg">
                  <span className="text-xl font-semibold">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-sm"></div>
              </div>
              
              <div className="text-center">
                <h2 className="text-[#58398B] font-semibold">{user?.name || 'User Profile'}</h2>
                <p className="text-[#58398B]/70 text-sm">{user?.email}</p>
                <div className="inline-flex items-center mt-1.5 px-3 py-1 rounded-full bg-[#58398B]/10 border border-[#58398B]/20">
                  <span className="text-xs text-[#58398B] capitalize font-medium">
                    {user?.role?.replace('-', ' ') || 'Student'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container with Glassmorphic Card */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[260px] pb-24">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-6 mb-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <SDCard padding="md" className="text-center bg-white/90">
              <div className="text-2xl font-semibold text-primary">24</div>
              <div className="text-muted-foreground text-xs">Hours Logged</div>
            </SDCard>
            <SDCard padding="md" className="text-center bg-white/90">
              <div className="text-2xl font-semibold text-primary">8</div>
              <div className="text-muted-foreground text-xs">Badges Earned</div>
            </SDCard>
          </div>

          {/* Settings Cards */}
          <div className="space-y-3 mb-6">
            <button className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm text-left hover:bg-white transition-all duration-200 active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#58398B] font-medium">Account Settings</div>
                  <div className="text-[#58398B]/70 text-sm">Manage your profile information</div>
                </div>
                <div className="text-[#58398B]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm text-left hover:bg-white transition-all duration-200 active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#58398B] font-medium">Notifications</div>
                  <div className="text-[#58398B]/70 text-sm">Manage notification preferences</div>
                </div>
                <div className="text-[#58398B]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm text-left hover:bg-white transition-all duration-200 active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#58398B] font-medium">Privacy & Security</div>
                  <div className="text-[#58398B]/70 text-sm">Data and privacy controls</div>
                </div>
                <div className="text-[#58398B]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-sm text-left hover:bg-white transition-all duration-200 active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#58398B] font-medium">Help & Support</div>
                  <div className="text-[#58398B]/70 text-sm">Get help and contact us</div>
                </div>
                <div className="text-[#58398B]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="w-full bg-red-500/10 backdrop-blur-sm rounded-2xl p-4 border border-red-300/30 shadow-sm text-center hover:bg-red-500/20 transition-all duration-200 active:scale-[0.98]"
          >
            <div className="flex items-center justify-center space-x-2">
              <LogOut className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
