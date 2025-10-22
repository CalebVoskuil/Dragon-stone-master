import { ChevronRight, Shield, Bell, FileText, HelpCircle, LogOut } from "lucide-react";
import { Switch } from "../ui/switch";
import { SDRaisedPage } from "./SDRaisedPage";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../ui/utils";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-white/70 mb-3 px-4">
        {title}
      </h3>
      <div className="bg-white rounded-[16px] overflow-hidden">
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
      <Icon className={cn(
        "w-5 h-5 mr-3 flex-shrink-0",
        danger ? "text-[#E63946]" : "text-gray-600"
      )} />
      
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium text-sm",
          danger ? "text-[#E63946]" : "text-[#2D2D2D]"
        )}>
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-0.5">
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
        <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
      )}
    </>
  );

  // If there's a rightElement (like Switch) and no onPress, use a div to avoid nesting buttons
  if (rightElement && !onPress) {
    return (
      <div className={cn(
        "w-full flex items-center p-4",
        "border-b border-gray-100 last:border-b-0"
      )}>
        {content}
      </div>
    );
  }

  // If there's an onPress handler, use a button
  if (onPress && interactive) {
    return (
      <button
        onClick={onPress}
        className={cn(
          "w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors",
          "border-b border-gray-100 last:border-b-0"
        )}
      >
        {content}
      </button>
    );
  }

  // Default case - non-interactive div
  return (
    <div className={cn(
      "w-full flex items-center p-4",
      "border-b border-gray-100 last:border-b-0"
    )}>
      {content}
    </div>
  );
}

export function SDSettings() {
  const { logout } = useAuth();

  return (
    <SDRaisedPage>
      {/* Header */}
      <div className="p-4 pb-6">
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <p className="text-white/70 text-sm mt-1">Manage your coordinator preferences</p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 bg-white/5 rounded-t-[20px] p-4">
        {/* Claims Settings */}
        <SettingsSection title="CLAIMS MANAGEMENT">
          <SettingsItem
            icon={Shield}
            title="Auto-approve small claims"
            subtitle="Automatically approve claims under 2 hours"
            rightElement={
              <Switch 
                defaultChecked={false}
                className="data-[state=checked]:bg-[#E63946]"
              />
            }
            interactive={false}
          />
          <SettingsItem
            icon={FileText}
            title="Require proof for all claims"
            subtitle="Always require photo/document proof"
            rightElement={<Switch defaultChecked={true} />}
            interactive={false}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="NOTIFICATIONS">
          <SettingsItem
            icon={Bell}
            title="New claim notifications"
            subtitle="Get notified when claims are submitted"
            rightElement={<Switch defaultChecked={true} />}
            interactive={false}
          />
          <SettingsItem
            icon={Bell}
            title="Daily summary"
            subtitle="Receive daily activity reports"
            rightElement={<Switch defaultChecked={false} />}
            interactive={false}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="ACCOUNT">
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
    </SDRaisedPage>
  );
}