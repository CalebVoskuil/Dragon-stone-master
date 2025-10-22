import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "./ui/utils";

interface SDCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

export function SDCard({ children, className, padding = 'md', variant = 'default', onClick }: SDCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        {
          "shadow-none border-0 bg-card": variant === 'default',
          "shadow-lg border-0": variant === 'elevated',
          "shadow-none border border-border": variant === 'outlined',
        },
        className
      )}
      onClick={onClick}
    >
      <CardContent className={cn(
        "p-0",
        {
          "p-3": padding === 'sm',
          "p-4": padding === 'md',
          "p-6": padding === 'lg',
        }
      )}>
        {children}
      </CardContent>
    </Card>
  );
}

interface SDLogCardProps {
  studentName: string;
  school: string;
  hours: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onViewProof?: () => void;
  showActions?: boolean;
}

export function SDLogCard({ 
  studentName, 
  school, 
  hours, 
  status, 
  submittedAt, 
  notes,
  onApprove,
  onReject,
  onViewProof,
  showActions = false
}: SDLogCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <SDCard variant="elevated" className="mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-foreground">{studentName}</h3>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              statusColors[status]
            )}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{school}</p>
            <p>{hours} hour{hours !== 1 ? 's' : ''}</p>
            <p>{submittedAt}</p>
            {notes && <p className="text-foreground italic">"{notes}"</p>}
          </div>
        </div>
        
        {showActions && status === 'pending' && (
          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={onViewProof}
              className="text-xs text-primary hover:underline"
            >
              View Proof
            </button>
            <div className="flex gap-2">
              <button
                onClick={onApprove}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </SDCard>
  );
}