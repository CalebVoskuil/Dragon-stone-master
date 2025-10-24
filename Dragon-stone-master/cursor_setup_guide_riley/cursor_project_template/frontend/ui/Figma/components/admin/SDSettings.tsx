import { useState } from "react";
import { ChevronRight, Shield, Bell, FileText, HelpCircle, LogOut, User, Settings } from "lucide-react";
import { Switch } from "../ui/switch";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../ui/utils";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";
import { SDCard } from "../SDCard";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  danger?: boolean;
  interactive?: boolean;
}

function SettingsItem({ 
  icon: Icon, 
  title, 
  subtitle, 
  onPress, 
  rightElement, 
  showChevron = false,
  danger = false,
  interactive = true
}: SettingsItemProps) {
  const content = (
    <>
      <div className={cn(
        "p-2 rounded-full flex-shrink-0",
        danger ? "bg-[#E63946]/10" : "bg-primary/10"
      )}>
        <Icon className={cn(
          "w-5 h-5",
          danger ? "text-[#E63946]" : "text-primary"
        )} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium",
          danger ? "text-[#E63946]" : "text-foreground"
        )}>
          {title}
        </div>
        {subtitle && (
          <div className="text-sm text-muted-foreground mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      
      {rightElement && (
        <div className="ml-3 flex-shrink-0">
          {rightElement}
        </div>
      )}
      
      {showChevron && (
        <ChevronRight className="w-5 h-5 text-muted-foreground ml-2 flex-shrink-0" />
      )}
    </>
  );

  // If there's a rightElement (like Switch) and no onPress, use a div to avoid nesting buttons
  if (rightElement && !onPress) {
    return (
      <SDCard padding="md" className="!p-4">
        <div className="w-full flex items-center gap-3">
          {content}
        </div>
      </SDCard>
    );
  }

  // If there's an onPress handler, use a button
  if (onPress && interactive) {
    return (
      <SDCard padding="md" className="!p-0">
        <button
          onClick={onPress}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors rounded-2xl"
        >
          {content}
        </button>
      </SDCard>
    );
  }

  // Default case - non-interactive div
  return (
    <SDCard padding="md" className="!p-4">
      <div className="w-full flex items-center gap-3">
        {content}
      </div>
    </SDCard>
  );
}

interface SDSettingsProps {
  onAlertsPress?: () => void;
  onSettingsPress?: () => void;
}

export function SDSettings({ onAlertsPress, onSettingsPress }: SDSettingsProps = {}) {
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
                <div className="w-16 h-16 rounded-full bg-[#58398B] text-white flex items-center justify-center shadow-lg">
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
                  <span className="text-xs text-[#58398B] capitalize font-medium">{user?.role?.replace('-', ' ') || 'Coordinator'}</span>
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
          <div className="grid grid-cols-3 gap-3 mb-6">
            <SDCard padding="md" className="text-center">
              <div className="text-2xl font-semibold text-primary mb-1">24</div>
              <div className="text-muted-foreground text-xs">Hours Logged</div>
            </SDCard>
            <SDCard padding="md" className="text-center">
              <div className="text-2xl font-semibold text-primary mb-1">8</div>
              <div className="text-muted-foreground text-xs">Badges</div>
            </SDCard>
            <SDCard padding="md" className="text-center">
              <div className="text-2xl font-semibold text-primary mb-1">156</div>
              <div className="text-muted-foreground text-xs">Claims</div>
            </SDCard>
          </div>

          {/* Claims Settings */}
          <SettingsSection title="CLAIMS MANAGEMENT">
            <SettingsItem
              icon={Shield}
              title="Auto-approve small claims"
              subtitle="Automatically approve claims under 2 hours"
              rightElement={
                <Switch 
                  defaultChecked={false}
                  className="data-[state=checked]:bg-primary"
                />
              }
              interactive={false}
            />
            <SettingsItem
              icon={FileText}
              title="Require proof for all claims"
              subtitle="Always require photo/document proof"
              rightElement={
                <Switch 
                  defaultChecked={true}
                  className="data-[state=checked]:bg-primary"
                />
              }
              interactive={false}
            />
          </SettingsSection>

          {/* Notifications */}
          <SettingsSection title="NOTIFICATIONS">
            <SettingsItem
              icon={Bell}
              title="New claim notifications"
              subtitle="Get notified when claims are submitted"
              rightElement={
                <Switch 
                  defaultChecked={true}
                  className="data-[state=checked]:bg-primary"
                />
              }
              interactive={false}
            />
            <SettingsItem
              icon={Bell}
              title="Daily summary"
              subtitle="Receive daily activity reports"
              rightElement={
                <Switch 
                  defaultChecked={false}
                  className="data-[state=checked]:bg-primary"
                />
              }
              interactive={false}
            />
          </SettingsSection>

          {/* Account */}
          <SettingsSection title="ACCOUNT">
            <SettingsItem
              icon={User}
              title="Edit Profile"
              subtitle="Update your account information"
              onPress={() => console.log('Edit profile pressed')}
              showChevron
            />
            <SettingsItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help or contact support"
              onPress={() => console.log('Help pressed')}
              showChevron
            />
            <SettingsItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="Review our privacy policy"
              onPress={() => console.log('Privacy pressed')}
              showChevron
            />
            <SettingsItem
              icon={LogOut}
              title="Sign Out"
              subtitle="Sign out of your coordinator account"
              onPress={logout}
              danger
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}