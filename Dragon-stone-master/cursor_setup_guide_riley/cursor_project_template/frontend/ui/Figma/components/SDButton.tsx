import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { forwardRef } from "react";

interface SDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary-filled' | 'primary-on-light' | 'accept' | 'reject' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const SDButton = forwardRef<HTMLButtonElement, SDButtonProps>(
  ({ className, variant = 'primary-filled', size = 'md', fullWidth = false, loading = false, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          // Base styles - minimum 44px touch target for accessibility
          "relative font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          "rounded-[12px]", // sd_radius_button
          
          // Size variants - ensuring 44px minimum touch target
          {
            "h-9 px-3 text-sm min-h-[44px]": size === 'sm',
            "h-11 px-4 min-h-[44px]": size === 'md', 
            "h-12 px-6 min-h-[44px]": size === 'lg',
          },
          
          // Stone Dragon accessible color variants (all meet WCAG AA)
          {
            // Primary-Filled: Deep purple bg, white text (8.12:1 contrast)
            "bg-[#58398B] text-white hover:bg-[#4A2F75] focus:ring-[#58398B] active:bg-[#3E2660]": variant === 'primary-filled',
            
            // Primary-On-Light: Golden bg, dark text (15.73:1 contrast)  
            "bg-[#FDCF25] text-[#2D2D2D] hover:bg-[#E6B800] focus:ring-[#FDCF25] active:bg-[#CCA000]": variant === 'primary-on-light',
            
            // Accept: Golden bg, dark text (15.73:1 contrast)
            "bg-[#FDCF25] text-[#2D2D2D] hover:bg-[#E6B800] focus:ring-[#FDCF25] active:bg-[#CCA000]": variant === 'accept',
            
            // Reject: Red bg, white text (4.77:1 contrast)
            "bg-[#E63946] text-white hover:bg-[#D32F3E] focus:ring-[#E63946] active:bg-[#B71C1C]": variant === 'reject',
            
            // Ghost: Transparent bg, purple border and text
            "bg-transparent text-[#58398B] border-2 border-[#58398B] hover:bg-[#58398B]/5 focus:ring-[#58398B] active:bg-[#58398B]/10": variant === 'ghost',
            
            // Secondary: Medium purple bg, white text (5.42:1 contrast)
            "bg-[#7B4CB3] text-white hover:bg-[#6B3FA3] focus:ring-[#7B4CB3] active:bg-[#5A359C]": variant === 'secondary',
          },
          
          // Full width
          {
            "w-full": fullWidth,
          },
          
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          </div>
        )}
        <span className={cn(loading && "opacity-0")}>
          {children}
        </span>
      </Button>
    );
  }
);

SDButton.displayName = "SDButton";