import { Check, X } from "lucide-react";
import { cn } from "../ui/utils";

interface SDBulkActionBarProps {
  selectedCount: number;
  onApproveAll?: () => void;
  onRejectAll?: () => void;
  className?: string;
}

export function SDBulkActionBar({
  selectedCount,
  onApproveAll,
  onRejectAll,
  className
}: SDBulkActionBarProps) {
  if (selectedCount < 2) return null;

  return (
    <div className={cn(
      "absolute bottom-[86px] left-4 right-4 h-16 bg-white rounded-[16px] flex border border-gray-200",
      "shadow-[0_6px_18px_-6px_rgba(0,0,0,0.12)]",
      className
    )}>
      {/* Selection Count */}
      <div className="flex items-center px-4">
        <span className="text-sm font-medium text-[#2D2D2D]">
          {selectedCount} selected
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex-1 flex">
        <button
          onClick={onRejectAll}
          className="flex-1 flex items-center justify-center space-x-2 text-white bg-[#E63946] hover:bg-[#E63946]/90 transition-colors border-r border-[#E63946]/20"
        >
          <X className="w-5 h-5" />
          <span className="font-medium">Reject All</span>
        </button>
        
        <button
          onClick={onApproveAll}
          className="flex-1 flex items-center justify-center space-x-2 text-[#2D2D2D] bg-[#FFD60A] hover:bg-[#FFD60A]/90 transition-colors"
        >
          <Check className="w-5 h-5" />
          <span className="font-medium">Approve All</span>
        </button>
      </div>
    </div>
  );
}