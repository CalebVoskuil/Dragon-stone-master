import { Settings, Trophy } from "lucide-react";
import { cn } from "../ui/utils";

interface SDTopPillProps {
  onSettingsPress?: () => void;
  onLeaderboardPress?: () => void;
  className?: string;
}

export function SDTopPill({ onSettingsPress, onLeaderboardPress, className }: SDTopPillProps) {
  return (
    <div className={cn(
      "w-60 h-14 bg-white border border-[#58398B] rounded-[28px] flex items-center justify-between px-3", // Updated primary color
      "shadow-[0_6px_18px_-6px_rgba(0,0,0,0.12)]", // sd_shadow
      className
    )}>
      {/* Settings Button */}
      <button
        onPointerDown={onSettingsPress}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
        aria-label="Settings"
      >
        <Settings className="w-6 h-6 text-[#58398B]" />
      </button>

      {/* Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 bg-[#58398B] rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">SD</span>
        </div>
        <span className="ml-2 text-[#58398B] font-semibold text-base">Stone Dragon</span>
      </div>

      {/* Leaderboard Button */}
      <button
        onPointerDown={onLeaderboardPress}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors min-h-[44px] min-w-[44px]"
        aria-label="Leaderboard"
      >
        <Trophy className="w-6 h-6 text-[#58398B]" />
      </button>
    </div>
  );
}