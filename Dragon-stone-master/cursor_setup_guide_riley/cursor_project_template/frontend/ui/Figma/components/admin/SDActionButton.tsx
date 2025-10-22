import { Check, X } from "lucide-react";
import { cn } from "../ui/utils";

interface SDActionAcceptProps {
  onPress?: () => void;
  className?: string;
}

export function SDActionAccept({ onPress, className }: SDActionAcceptProps) {
  return (
    <button
      onPointerDown={onPress}
      className={cn(
        "w-10 h-10 bg-[#FDCF25] rounded-full flex items-center justify-center min-h-[44px] min-w-[44px]", // Updated to new golden color and accessibility
        "hover:scale-98 active:scale-95 transition-transform",
        "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]", // sd_shadow_sm
        className
      )}
      aria-label="Approve"
    >
      <Check className="w-5 h-5 text-[#2D2D2D]" />
    </button>
  );
}

interface SDActionRejectProps {
  onPress?: () => void;
  className?: string;
}

export function SDActionReject({ onPress, className }: SDActionRejectProps) {
  return (
    <button
      onPointerDown={onPress}
      className={cn(
        "w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center min-h-[44px] min-w-[44px]", // Accessibility touch target
        "hover:scale-98 active:scale-95 transition-transform",
        "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)]", // sd_shadow_sm
        className
      )}
      aria-label="Reject"
    >
      <X className="w-5 h-5 text-white" />
    </button>
  );
}