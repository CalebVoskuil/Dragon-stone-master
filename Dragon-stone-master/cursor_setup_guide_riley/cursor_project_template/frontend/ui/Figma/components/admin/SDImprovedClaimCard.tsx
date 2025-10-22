import { useState } from "react";
import { Eye, Check, X, Quote, Clock, User, GraduationCap, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "../ui/utils";

interface ClaimData {
  id: string;
  studentName: string;
  studentEmail: string;
  school: string;
  hours: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  submittedDate: string;
  notes?: string;
  proofUrl?: string;
  consentStatus?: 'approved' | 'pending' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  claimId: string;
  description: string;
}

interface SDImprovedClaimCardProps {
  claim: ClaimData;
  isSelected: boolean;
  selectionMode: boolean;
  onSelect: () => void;
  onViewProof: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export function SDImprovedClaimCard({
  claim,
  isSelected,
  selectionMode,
  onSelect,
  onViewProof,
  onApprove,
  onReject
}: SDImprovedClaimCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'var(--sd-accent-pending)';
      case 'approved': return 'var(--sd-accent-green)';
      case 'rejected': return 'var(--sd-accent-reject)';
      default: return '#6B7280';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const submitted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleRejectClick = () => {
    if (showRejectInput && rejectReason.trim()) {
      onReject(rejectReason);
      setShowRejectInput(false);
      setRejectReason("");
    } else {
      setShowRejectInput(true);
    }
  };

  const isPending = claim.status === 'pending';
  const isApproved = claim.status === 'approved';
  const isRejected = claim.status === 'rejected';

  return (
    <div 
      className={cn(
        "bg-white rounded-2xl p-4 transition-all duration-200 border",
        "hover:shadow-lg hover:scale-[1.01]",
        isSelected && "ring-2 ring-blue-500 ring-opacity-50 shadow-lg",
        !isPending && "opacity-95",
        isPending ? "border-gray-100" : "border-gray-200"
      )}
      style={{ 
        boxShadow: isSelected 
          ? '0 8px 25px -5px rgba(0, 0, 0, 0.1)' 
          : '0 4px 15px -3px rgba(0, 0, 0, 0.08)' 
      }}
    >
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox & Avatar */}
        <div className="flex flex-col items-center space-y-3">
          {selectionMode && (
            <button
              onClick={onSelect}
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                isSelected 
                  ? "bg-blue-500 border-blue-500 scale-110" 
                  : "border-gray-300 hover:border-gray-400 hover:scale-105"
              )}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </button>
          )}
          
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm"
            style={{ backgroundColor: 'var(--sd-surface-secondary)' }}
          >
            {getInitials(claim.studentName)}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {claim.studentName}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <Mail className="w-4 h-4" />
                <span className="truncate">{claim.studentEmail}</span>
              </div>
            </div>
            
            {/* Status Badge */}
            <div 
              className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center space-x-1.5"
              style={{
                backgroundColor: getStatusColor(claim.status) + '15',
                color: getStatusColor(claim.status)
              }}
            >
              {isApproved && <CheckCircle className="w-4 h-4" />}
              {isRejected && <AlertCircle className="w-4 h-4" />}
              {isPending && <Clock className="w-4 h-4" />}
              <span className="capitalize">{claim.status}</span>
            </div>
          </div>

          {/* School and Category */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4" />
              <span className="truncate">{claim.school}</span>
            </div>
            <div className="text-gray-400">•</div>
            <span className="font-medium text-gray-700">{claim.category}</span>
          </div>

          {/* Details Row */}
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">{claim.hours}h</span>
              </div>
              <div className="text-gray-500">
                {getTimeAgo(claim.submittedAt)}
              </div>
            </div>
            
            {claim.claimId && (
              <span className="text-xs text-gray-400 font-mono">
                {claim.claimId}
              </span>
            )}
          </div>

          {/* Description */}
          {claim.description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {claim.description}
            </p>
          )}

          {/* Notes (if exist) */}
          {claim.notes && (
            <div className="mb-3">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center space-x-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Quote className="w-4 h-4" />
                <span>Additional notes</span>
              </button>
              {showNotes && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-700">{claim.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Approval/Rejection Status */}
          {(isApproved || isRejected) && claim.approvedBy && (
            <div 
              className="text-sm px-3 py-2 rounded-lg mb-3 border"
              style={{
                backgroundColor: isApproved ? 'var(--sd-accent-green)' + '10' : 'var(--sd-accent-reject)' + '10',
                borderColor: isApproved ? 'var(--sd-accent-green)' + '30' : 'var(--sd-accent-reject)' + '30',
                color: isApproved ? 'var(--sd-accent-green)' : 'var(--sd-accent-reject)'
              }}
            >
              <div className="flex items-center space-x-1.5">
                {isApproved ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span className="font-medium">
                  {isApproved ? 'Approved' : 'Rejected'} by {claim.approvedBy}
                </span>
              </div>
              <div className="text-xs mt-1 opacity-75">
                {new Date(claim.approvedAt!).toLocaleDateString()} at {new Date(claim.approvedAt!).toLocaleTimeString()}
              </div>
            </div>
          )}

          {/* Reject Input (when rejecting) */}
          {showRejectInput && (
            <div className="mb-3">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full p-3 text-sm border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isPending && !selectionMode && (
          <div className="flex flex-col space-y-2">
            <button
              onClick={onViewProof}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
              title="View Proof"
            >
              <Eye className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={onApprove}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
              style={{ 
                backgroundColor: 'var(--sd-accent-accept)',
                color: 'var(--sd-text-dark)'
              }}
              title="Approve"
            >
              <Check className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleRejectClick}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm"
              style={{ 
                backgroundColor: 'var(--sd-accent-reject)',
                color: 'white'
              }}
              title="Reject"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}