import { Bell, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "../ui/utils";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";

interface NotificationItem {
  id: string;
  type: 'claim_submitted' | 'claim_approved' | 'claim_rejected' | 'system_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  studentName?: string;
  claimId?: string;
}

interface SDNotificationCardProps {
  notification: NotificationItem;
  onPress?: (id: string) => void;
}

function SDNotificationCard({ notification, onPress }: SDNotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'claim_submitted':
        return <Clock className="w-5 h-5 text-[#F77F00]" />;
      case 'claim_approved':
        return <CheckCircle className="w-5 h-5 text-[#3BB273]" />;
      case 'claim_rejected':
        return <XCircle className="w-5 h-5 text-[#E63946]" />;
      case 'system_alert':
        return <AlertTriangle className="w-5 h-5 text-[#F77F00]" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'claim_submitted':
        return 'border-l-[#F77F00]';
      case 'claim_approved':
        return 'border-l-[#3BB273]';
      case 'claim_rejected':
        return 'border-l-[#E63946]';
      case 'system_alert':
        return 'border-l-[#F77F00]';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <button
      onClick={() => onPress?.(notification.id)}
      className={cn(
        "w-full rounded-[12px] p-4 mb-3 text-left border-l-4 shadow-sm hover:shadow-md transition-all",
        getBorderColor(),
        !notification.read ? "bg-white/90 backdrop-blur-sm" : "bg-white/60 backdrop-blur-sm"
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn(
              "font-medium text-sm truncate",
              !notification.read ? "text-[#2D2D2D]" : "text-gray-500"
            )}>
              {notification.title}
            </h4>
            
            {!notification.read && (
              <div className="w-2 h-2 bg-[#7B4CB3] rounded-full flex-shrink-0 ml-2" />
            )}
          </div>
          
          <p className={cn(
            "text-sm mb-2 line-clamp-2",
            !notification.read ? "text-gray-600" : "text-gray-400"
          )}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-xs",
              !notification.read ? "text-gray-500" : "text-gray-400"
            )}>
              {notification.timestamp}
            </span>
            
            {notification.claimId && (
              <span className={cn(
                "text-xs font-medium",
                !notification.read ? "text-[#7B4CB3]" : "text-gray-400"
              )}>
                {notification.claimId}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export function SDNotifications() {
  const mockNotifications: NotificationItem[] = [
    {
      id: '1',
      type: 'claim_submitted',
      title: 'New claim submitted',
      message: 'Alex Johnson submitted a new volunteer claim for 3 hours of community kitchen work.',
      timestamp: '2 hours ago',
      read: false,
      studentName: 'Alex Johnson',
      claimId: '#CLM-2024-001'
    },
    {
      id: '2',
      type: 'claim_submitted',
      title: 'New claim submitted',
      message: 'Sarah Mitchell submitted a claim for 2.5 hours of beach cleanup activity.',
      timestamp: '4 hours ago',
      read: false,
      studentName: 'Sarah Mitchell',  
      claimId: '#CLM-2024-002'
    },
    {
      id: '3',
      type: 'claim_approved',
      title: 'Claim approved',
      message: 'You approved Michael Chen\'s claim for 4 hours of tutoring work. Points have been awarded.',
      timestamp: '1 day ago',
      read: true,
      studentName: 'Michael Chen',
      claimId: '#CLM-2024-003'
    },
    {
      id: '4',
      type: 'system_alert',
      title: 'System maintenance scheduled',
      message: 'The volunteer portal will be under maintenance tomorrow from 2-4 AM.',
      timestamp: '2 days ago',
      read: true
    },
    {
      id: '5',
      type: 'claim_rejected',
      title: 'Claim rejected',
      message: 'You rejected a claim due to insufficient proof documentation.',
      timestamp: '3 days ago',
      read: true,
      claimId: '#CLM-2024-000'
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleNotificationPress = (id: string) => {
    console.log('Notification pressed:', id);
    // In real app, mark as read and potentially navigate
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-[#58398B]">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-[#58398B]/70 text-sm mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {unreadCount > 0 && (
              <div className="w-6 h-6 bg-[#FDCF25] rounded-full flex items-center justify-center">
                <span className="text-[#2D2D2D] text-xs font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Container with Glassmorphic Card */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[120px] pb-24">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-3 mb-6">
          {mockNotifications.length > 0 ? (
            <>
              {mockNotifications.map((notification) => (
                <SDNotificationCard
                  key={notification.id}
                  notification={notification}
                  onPress={handleNotificationPress}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-[#58398B]/30 mx-auto mb-3" />
              <div className="text-[#58398B]/70 mb-2">No notifications</div>
              <div className="text-[#58398B]/50 text-sm">
                You're all caught up!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
