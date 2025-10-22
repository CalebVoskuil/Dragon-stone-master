import { useState } from "react";
import { X, Eye, FileText, Image as ImageIcon, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { SDActionAccept, SDActionReject } from "./SDActionButton";
import { cn } from "../ui/utils";

interface ClaimData {
  id: string;
  studentName: string;
  studentEmail: string;
  school: string;
  submittedAt: string;
  hours: number;
  category: string;
  description: string;
  proofFiles: Array<{
    id: string;
    name: string;
    type: 'image' | 'pdf';
    url: string;
    thumbnail?: string;
  }>;
  consentStatus: 'approved' | 'pending' | 'rejected';
  submissionHistory: Array<{
    timestamp: string;
    action: string;
    details: string;
  }>;
}

interface SDClaimModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim?: ClaimData;
  onApprove?: (claimId: string, comment: string) => void;
  onReject?: (claimId: string, comment: string) => void;
  className?: string;
}

export function SDClaimModal({
  open,
  onOpenChange,
  claim,
  onApprove,
  onReject,
  className
}: SDClaimModalProps) {
  const [comment, setComment] = useState("");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  if (!claim) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleApprove = () => {
    onApprove?.(claim.id, comment);
    onOpenChange(false);
    setComment("");
  };

  const handleReject = () => {
    if (!comment.trim()) {
      // Require comment for rejection
      return;
    }
    onReject?.(claim.id, comment);
    onOpenChange(false);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "w-[92%] max-w-md max-h-[85vh] bg-white rounded-[16px] p-0 overflow-hidden",
        "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]",
        className
      )}>
        {/* Accessibility titles */}
        <DialogTitle className="sr-only">
          Review volunteer claim from {claim.studentName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Review and approve or reject a volunteer hours claim. View proof files, submission details, and add comments before making a decision.
        </DialogDescription>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="mb-3">
            <h2 className="text-xl font-semibold text-[#2D2D2D]" aria-hidden="true">Claim Review</h2>
          </div>

          {/* Student Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#7B4CB3] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {getInitials(claim.studentName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-[#2D2D2D]">
                {claim.studentName}
              </h3>
              <p className="text-sm text-gray-600">{claim.studentEmail}</p>
              <p className="text-sm text-gray-600">{claim.school}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{claim.submittedAt}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Claim Details */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-medium text-[#2D2D2D] mb-2">Claim Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hours:</span>
                <span className="text-sm font-medium text-[#2D2D2D]">
                  {claim.hours} hour{claim.hours !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm font-medium text-[#2D2D2D]">{claim.category}</span>
              </div>
              {claim.description && (
                <div className="mt-3">
                  <span className="text-sm text-gray-600 block mb-1">Description:</span>
                  <p className="text-sm text-[#2D2D2D] bg-gray-50 p-3 rounded-lg">
                    "{claim.description}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Proof Gallery */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-medium text-[#2D2D2D] mb-3">Proof Files</h4>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {claim.proofFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedProof(file.url)}
                  className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border hover:border-[#7B4CB3] transition-colors"
                >
                  {file.type === 'image' ? (
                    file.thumbnail ? (
                      <img 
                        src={file.thumbnail} 
                        alt="Proof" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )
                  ) : (
                    <FileText className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="history" className="border-none">
                <AccordionTrigger className="text-sm font-medium text-[#2D2D2D] hover:no-underline py-2">
                  Submission History
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-2">
                    {claim.submissionHistory.map((entry, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        <span className="font-medium">{entry.action}</span>
                        <span className="mx-2">•</span>
                        <span>{entry.timestamp}</span>
                        {entry.details && (
                          <p className="mt-1 text-gray-500">{entry.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Comment Area */}
        <div className="p-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
            Comment
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment..."
            className="min-h-[80px] resize-none bg-white border-gray-200 focus:border-[#7B4CB3] focus:ring-[#7B4CB3]"
          />
        </div>

        {/* Action Bar */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={handleReject}
            disabled={!comment.trim()}
            className="flex-1 h-14 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ 
              backgroundColor: 'var(--sd-accent-reject)',
              color: 'var(--sd-text-light)'
            }}
            onMouseOver={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'rgba(230, 57, 70, 0.9)';
              }
            }}
            onMouseOut={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = 'var(--sd-accent-reject)';
              }
            }}
            aria-label="Reject claim - comment required"
          >
            <X className="w-5 h-5" />
            <span>Reject</span>
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 h-14 font-medium flex items-center justify-center space-x-2 transition-colors"
            style={{ 
              backgroundColor: 'var(--sd-accent-accept)',
              color: 'var(--sd-text-dark)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(253, 207, 37, 0.9)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sd-accent-accept)';
            }}
            aria-label="Approve claim"
          >
            <Check className="w-5 h-5" />
            <span>Approve</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}