import { SDAdminDashboard } from "./SDAdminDashboard";
import { SDClaimsMerged } from "./SDClaimsMerged";
import { SDNotifications } from "./SDNotifications";
import { SDSettings } from "./SDSettings";
import { SDLeaderboard } from "./SDLeaderboard";

interface SDAdminLayoutProps {
  activeTab: 'dashboard' | 'claims' | 'notifications' | 'leaderboard' | 'profile';
  onSettingsPress?: () => void;
  onLeaderboardPress?: () => void;
  onAlertsPress?: () => void;
}

export function SDAdminLayout({ activeTab, onSettingsPress, onLeaderboardPress, onAlertsPress }: SDAdminLayoutProps) {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SDAdminDashboard />;
      case 'claims':
        return <SDClaimsMerged />;
      case 'notifications':
        return <SDNotifications />;
      case 'leaderboard':
        return <SDLeaderboard />;
      case 'profile':
        return <SDSettings onSettingsPress={onSettingsPress} onAlertsPress={onAlertsPress} />;
      default:
        return <SDClaimsMerged />;
    }
  };

  return (
    <div className="h-screen bg-[var(--sd-bg)] flex flex-col">
      {/* Header */}
      <div className="flex justify-center pt-4 pb-2 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--sd-surface-primary)] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">SD</span>
          </div>
          <span className="text-[var(--sd-surface-primary)] font-semibold text-lg">Stone Dragon</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
}