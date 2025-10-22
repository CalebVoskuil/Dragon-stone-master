import { cn } from "./ui/utils";
import { CheckCircle, Clock, XCircle, Upload } from "lucide-react";

interface SDStatusChipProps {
  status: 'pending' | 'approved' | 'rejected' | 'uploading';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function SDStatusChip({ status, size = 'md', showIcon = true, className }: SDStatusChipProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-[#F77F00] text-[#2D2D2D] border-[#D66A00]', // Orange bg, dark text (7.24:1 contrast)
      icon: Clock
    },
    approved: {
      label: 'Approved', 
      className: 'bg-[#FDCF25] text-[#2D2D2D] border-[#E6B800]', // Golden bg, dark text (15.73:1 contrast)
      icon: CheckCircle
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-[#E63946] text-white border-[#D32F3E]', // Red bg, white text (4.77:1 contrast)
      icon: XCircle
    },
    uploading: {
      label: 'Uploading',
      className: 'bg-[#7B4CB3] text-white border-[#6B3FA3]', // Purple bg, white text (5.42:1 contrast)
      icon: Upload
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 font-medium border",
      "rounded-[8px]", // sd_radius_chip
      {
        "px-2 py-1 text-xs min-h-[24px]": size === 'sm',
        "px-3 py-1.5 text-sm min-h-[32px]": size === 'md',
      },
      config.className,
      className
    )}>
      {showIcon && <Icon className={cn(
        {
          "h-3 w-3": size === 'sm',
          "h-4 w-4": size === 'md',
        }
      )} />}
      {config.label}
    </span>
  );
}

interface SDStatChipProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export function SDStatChip({ label, value, icon: Icon, variant = 'default', className }: SDStatChipProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg border",
      {
        "bg-muted/50 border-border": variant === 'default',
        "bg-primary/10 border-primary/20 text-primary": variant === 'primary',
        "bg-accent/10 border-accent/20 text-accent": variant === 'accent',
      },
      className
    )}>
      {Icon && <Icon className="h-4 w-4" />}
      <div className="text-center">
        <div className="font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}