import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { SDActionAccept, SDActionReject } from "./SDActionButton";
import { cn } from "../ui/utils";

interface SDClaimCardProps {
  id: string;
  studentName: string;
  claimId: string;
  date: string;
  hours: number;
  description: string;
  status?: 'pending' | 'approved' | 'rejected';
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCardPress?: (id: string) => void;
  onLongPress?: (id: string) => void;
  selectionMode?: boolean;
  className?: string;
}

export function SDClaimCard({
  id,
  studentName,
  claimId,
  date,
  hours,
  description,
  status = 'pending',
  isSelected = false,
  onSelect,
  onApprove,
  onReject,
  onCardPress,
  onLongPress,
  selectionMode = false,
  className
}: SDClaimCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePointerDown = () => {
    setIsPressed(true);
    if (!selectionMode) {
      const timer = setTimeout(() => {
        onLongPress?.(id);
      }, 500); // 500ms long press
      setLongPressTimer(timer);
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    if (!selectionMode) {
      onCardPress?.(id);
    }
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-[16px] p-2 mb-2 transition-all duration-200", // sd_radius_card, reduced padding and margin
      "shadow-[0_6px_18px_-6px_rgba(0,0,0,0.12)]", // sd_shadow
      isPressed && "scale-98",
      className
    )}>
      <div className="flex items-center space-x-3">
        {/* Checkbox - only show in selection mode */}
        {selectionMode && (
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect?.(id, checked as boolean)}
              className="w-4 h-4"
            />
          </div>
        )}

        {/* Avatar - smaller size */}
        <div className="w-8 h-8 bg-[#7B4CB3] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-medium text-xs">
            {getInitials(studentName)}
          </span>
        </div>

        {/* Content - more compact */}
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="flex-1 text-left min-w-0 py-1"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[#2D2D2D] truncate">
              {studentName}
            </h3>
            <div className="flex items-center space-x-2">
              {status === 'approved' && (
                <span className="text-xs px-2 py-0.5 bg-[#3BB273] text-white rounded-full">
                  Approved
                </span>
              )}
              {status === 'rejected' && (
                <span className="text-xs px-2 py-0.5 bg-[#E63946] text-white rounded-full">
                  Rejected
                </span>
              )}
              <span className="text-sm text-[#2D2D2D] font-medium">
                {hours}h
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-[#6B7280]">
            <span>{date}</span>
          </div>
        </button>

        {/* Action Buttons - only show when not in selection mode and status is pending */}
        {!selectionMode && status === 'pending' && (
          <div className="flex items-center space-x-1 flex-shrink-0">
            <SDActionAccept onPress={() => onApprove?.(id)} />
            <SDActionReject onPress={() => onReject?.(id)} />
          </div>
        )}
      </div>
    </div>
  );
}