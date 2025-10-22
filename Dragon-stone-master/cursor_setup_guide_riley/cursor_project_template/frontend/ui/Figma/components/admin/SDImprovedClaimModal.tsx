import { useState } from "react";
import { X, Eye, User, GraduationCap, Clock, FileText, Check, AlertTriangle, Calendar, Hash, Mail } from "lucide-react";
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

interface SDImprovedClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimData;
  onApprove: (comment?: string) => void;
  onReject: (reason: string) => void;
}

export function SDImprovedClaimModal({
  isOpen,
  onClose,
  claim,
  onApprove,
  onReject
}: SDImprovedClaimModalProps) {
  const [comment, setComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);

  if (!isOpen) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleApprove = () => {
    onApprove(comment);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return;
    }
    onReject(rejectReason);
  };

  const isPending = claim.status === 'pending';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 bottom-4 top-16 z-50 flex items-end">
        <div 
          className="w-full bg-white rounded-2xl max-h-full overflow-hidden"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Claim Details</h2>
              <p className="text-sm text-gray-600 mt-1">{claim.claimId}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 max-h-[calc(100vh-200px)]">
            <div className="p-6 space-y-8">
              {/* Student Header */}
              <div className="flex items-start space-x-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shadow-lg"
                  style={{ backgroundColor: 'var(--sd-surface-secondary)' }}
                >
                  {getInitials(claim.studentName)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900">{claim.studentName}</h3>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{claim.studentEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{claim.school}</span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div 
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: claim.status === 'pending' ? 'var(--sd-accent-pending)' + '20' : 
                                   claim.status === 'approved' ? 'var(--sd-accent-green)' + '20' : 
                                   'var(--sd-accent-reject)' + '20',
                    color: claim.status === 'pending' ? 'var(--sd-accent-pending)' : 
                           claim.status === 'approved' ? 'var(--sd-accent-green)' : 
                           'var(--sd-accent-reject)'
                  }}
                >
                  {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                </div>
              </div>

              {/* Claim Details Grid */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Claim Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>Hours Claimed</span>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900">{claim.hours} hours</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <FileText className="w-4 h-4" />
                        <span>Category</span>
                      </div>
                      <p className="font-semibold text-gray-900">{claim.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted</span>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {new Date(claim.submittedAt).toLocaleDateString()} at {new Date(claim.submittedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Hash className="w-4 h-4" />
                        <span>Claim ID</span>
                      </div>
                      <p className="font-mono text-sm text-gray-900">{claim.claimId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {claim.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">{claim.description}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {claim.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Notes</h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">{claim.notes}</p>
                  </div>
                </div>
              )}

              {/* Proof Attachment */}
              {claim.proofUrl && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Proof of Service</h4>
                  <div className="bg-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'var(--sd-surface-secondary)' + '20' }}
                        >
                          <Eye className="w-6 h-6" style={{ color: 'var(--sd-surface-secondary)' }} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Proof Image</p>
                          <p className="text-sm text-gray-600">Click to view full size</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsImageViewOpen(true)}
                        className="px-4 py-2 rounded-lg font-medium transition-colors hover:scale-105"
                        style={{ 
                          backgroundColor: 'var(--sd-surface-secondary)',
                          color: 'white'
                        }}
                      >
                        View Proof
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Comment Section */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Admin Comment (Optional)</h4>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment for the student..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Rejection Form */}
              {showRejectForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Rejection Reason Required</h4>
                  </div>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejecting this claim..."
                    className="w-full p-4 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none bg-white"
                    rows={3}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isPending && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {showRejectForm ? (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="flex-1 h-12 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className={cn(
                      "flex-1 h-12 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200",
                      rejectReason.trim()
                        ? "text-white hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                    style={{ 
                      backgroundColor: rejectReason.trim() ? 'var(--sd-accent-reject)' : undefined
                    }}
                  >
                    <X className="w-5 h-5" />
                    <span>Reject Claim</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 h-12 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95 text-white"
                    style={{ 
                      backgroundColor: 'var(--sd-accent-reject)'
                    }}
                  >
                    <X className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 h-12 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ 
                      backgroundColor: 'var(--sd-accent-accept)',
                      color: 'var(--sd-text-dark)'
                    }}
                  >
                    <Check className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer */}
      {isImageViewOpen && (
        <>
          <div 
            className="fixed inset-0 z-60 bg-black/80"
            onClick={() => setIsImageViewOpen(false)}
          />
          <div className="fixed inset-4 z-60 flex items-center justify-center">
            <div className="relative bg-white rounded-2xl overflow-hidden max-w-full max-h-full">
              <button
                onClick={() => setIsImageViewOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={claim.proofUrl}
                alt="Proof of service"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}