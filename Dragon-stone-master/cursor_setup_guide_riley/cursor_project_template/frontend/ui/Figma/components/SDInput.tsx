import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "./ui/utils";
import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface SDInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export const SDInput = forwardRef<HTMLInputElement, SDInputProps>(
  ({ className, label, error, hint, required, fullWidth = true, ...props }, ref) => {
    const hasError = !!error;
    
    return (
      <div className={cn("space-y-2", fullWidth && "w-full")}>
        {label && (
          <Label 
            htmlFor={props.id}
            className={cn(
              "block",
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "h-11 px-4 bg-input-background border-border focus:border-primary focus:ring-1 focus:ring-primary",
              hasError && "border-destructive focus:border-destructive focus:ring-destructive",
              className
            )}
            {...props}
          />
          
          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          )}
        </div>
        
        {(hint || error) && (
          <p className={cn(
            "text-sm",
            hasError ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

SDInput.displayName = "SDInput";