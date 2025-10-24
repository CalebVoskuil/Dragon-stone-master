import { Check, X } from "lucide-react";
import { cn } from "../ui/utils";

interface SDImprovedBulkActionsProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}

export function SDImprovedBulkActions({
  selectedCount,
  onApprove,
  onReject,
  onCancel
}: SDImprovedBulkActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div 
        className="bg-white rounded-2xl p-4 mx-auto max-w-md border border-gray-200"
        style={{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-semibold text-gray-900">
              {selectedCount} claim{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <p className="text-sm text-gray-500">
              Choose an action for all selected claims
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onReject}
            className="flex-1 h-12 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
            style={{ 
              backgroundColor: 'var(--sd-accent-reject)',
              color: 'white'
            }}
          >
            <X className="w-5 h-5" />
            <span>Reject All</span>
          </button>
          
          <button
            onClick={onApprove}
            className="flex-1 h-12 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
            style={{ 
              backgroundColor: 'var(--sd-accent-green)',
              color: 'white'
            }}
          >
            <Check className="w-5 h-5" />
            <span>Approve All</span>
          </button>
        </div>
      </div>
    </div>
  );
}