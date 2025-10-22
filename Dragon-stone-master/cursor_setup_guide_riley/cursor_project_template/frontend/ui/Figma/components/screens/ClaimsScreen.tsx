import { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Calendar, Timer, FileText, Eye, Check, X, MessageSquare, ChevronDown, MapPin } from 'lucide-react';
import { SDButton } from '../SDButton';
import { SDStatusChip } from '../SDStatusChip';
import { SDCard } from '../SDCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../hooks/useAuth';
import IPhone16Pro2 from '../../imports/IPhone16Pro2';

interface Claim {
  id: string;
  hours: number;
  category: string;
  description: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewComment?: string;
  proof?: {
    type: 'image' | 'document';
    name: string;
  }[];
  studentName?: string; // For admin view
  studentEmail?: string; // For admin view
  studentSchool?: string; // For admin view
  eventId?: string; // For filtering by event
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  totalClaims: number;
  pendingClaims: number;
}

interface ClaimsScreenProps {
  onBack: () => void;
}

export function ClaimsScreen({ onBack }: ClaimsScreenProps) {
  const { user } = useAuth();
  const isAdminStudent = user?.role === 'admin-student';
  
  const [viewMode, setViewMode] = useState<'my-claims' | 'manage-claims'>('my-claims');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('event-1');

  // Mock events data
  const events: Event[] = [
    {
      id: 'event-1',
      name: 'Beach Cleanup Drive 2024',
      date: 'March 15, 2024',
      location: 'Camps Bay Beach',
      totalClaims: 24,
      pendingClaims: 2
    },
    {
      id: 'event-2',
      name: 'Community Kitchen Volunteer',
      date: 'March 10, 2024',
      location: 'Khayelitsha Community Center',
      totalClaims: 18,
      pendingClaims: 1
    },
    {
      id: 'event-3',
      name: 'Reading Program - Libraries',
      date: 'March 8, 2024',
      location: 'Cape Town Central Library',
      totalClaims: 12,
      pendingClaims: 1
    },
    {
      id: 'event-4',
      name: 'Tree Planting Initiative',
      date: 'March 5, 2024',
      location: 'Table Mountain National Park',
      totalClaims: 32,
      pendingClaims: 0
    }
  ];

  // Mock data - in real app this would come from API
  const claims: Claim[] = [
    {
      id: '1',
      hours: 4,
      category: 'Community Service',
      description: 'Helped organize books at the local library and assisted visitors with finding resources.',
      submittedAt: '2024-01-15',
      status: 'approved',
      reviewedAt: '2024-01-16',
      reviewComment: 'Great work! Well documented.',
      proof: [{ type: 'image', name: 'library_photo.jpg' }]
    },
    {
      id: '2',
      hours: 3,
      category: 'Environmental',
      description: 'Beach cleanup with local environmental group.',
      submittedAt: '2024-01-20',
      status: 'pending',
      proof: [
        { type: 'image', name: 'beach_before.jpg' },
        { type: 'image', name: 'beach_after.jpg' }
      ]
    },
    {
      id: '3',
      hours: 2,
      category: 'Education',
      description: 'Tutored younger students in mathematics.',
      submittedAt: '2024-01-18',
      status: 'rejected',
      reviewedAt: '2024-01-19',
      reviewComment: 'Please provide more detailed proof of tutoring session.',
      proof: [{ type: 'document', name: 'tutoring_log.pdf' }]
    },
    {
      id: '4',
      hours: 6,
      category: 'Community Service',
      description: 'Volunteered at local food bank sorting donations and helping with distribution.',
      submittedAt: '2024-01-22',
      status: 'approved',
      reviewedAt: '2024-01-23',
      proof: [
        { type: 'image', name: 'food_bank1.jpg' },
        { type: 'image', name: 'food_bank2.jpg' }
      ]
    }
  ];

  // Mock data for admin student view - other students' claims to manage
  const studentClaims: Claim[] = [
    {
      id: 'sc1',
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.j@school.com',
      studentSchool: 'Cape Town High School',
      hours: 5,
      category: 'Environmental',
      description: 'Organized a tree planting event at Table Mountain with 20 volunteers.',
      submittedAt: '2024-01-25',
      status: 'pending',
      proof: [
        { type: 'image', name: 'tree_planting1.jpg' },
        { type: 'image', name: 'tree_planting2.jpg' }
      ]
    },
    {
      id: 'sc2',
      studentName: 'Michael Chen',
      studentEmail: 'michael.c@school.com',
      studentSchool: 'Rondebosch Boys High',
      hours: 3,
      category: 'Community Service',
      description: 'Assisted elderly residents at retirement home with technology.',
      submittedAt: '2024-01-24',
      status: 'pending',
      proof: [{ type: 'image', name: 'retirement_home.jpg' }]
    },
    {
      id: 'sc3',
      studentName: 'Emma Wilson',
      studentEmail: 'emma.w@school.com',
      studentSchool: 'Wynberg Girls High',
      hours: 4,
      category: 'Education',
      description: 'Conducted coding workshop for underprivileged students.',
      submittedAt: '2024-01-23',
      status: 'pending',
      proof: [
        { type: 'image', name: 'workshop1.jpg' },
        { type: 'document', name: 'attendance_sheet.pdf' }
      ]
    },
    {
      id: 'sc4',
      studentName: 'David Miller',
      studentEmail: 'david.m@school.com',
      studentSchool: 'Cape Town High School',
      hours: 2,
      category: 'Environmental',
      description: 'Beach cleanup at Camps Bay.',
      submittedAt: '2024-01-26',
      status: 'pending',
      proof: [{ type: 'image', name: 'beach_cleanup.jpg' }]
    }
  ];

  const displayClaims = viewMode === 'my-claims' ? claims : studentClaims;

  const filteredClaims = displayClaims.filter(claim => 
    activeTab === 'all' || claim.status === activeTab
  );

  const getStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const tabCounts = {
    all: displayClaims.length,
    pending: displayClaims.filter(c => c.status === 'pending').length,
    approved: displayClaims.filter(c => c.status === 'approved').length,
    rejected: displayClaims.filter(c => c.status === 'rejected').length,
  };

  const handleAction = (claim: Claim, action: 'approve' | 'reject') => {
    setSelectedClaim(claim);
    setActionModal(action);
    setComment("");
  };

  const confirmAction = () => {
    if (actionModal === 'reject' && !comment.trim()) {
      return;
    }
    
    console.log(`${actionModal} claim:`, selectedClaim?.id, comment);
    setActionModal(null);
    setSelectedClaim(null);
    setComment("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="p-2.5 rounded-full active:bg-[#58398B] transition-colors group"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-[#58398B] group-active:text-white transition-colors" />
            </button>
            <div>
              <h1 className="text-[#58398B]">{viewMode === 'my-claims' ? 'My Claims' : 'Review Claims'}</h1>
              <p className="text-[#58398B]/70">
                {viewMode === 'my-claims' 
                  ? 'Track your volunteer hour submissions' 
                  : 'Manage student volunteer claims'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-xl p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-[#58398B] text-white shadow-sm'
                    : 'text-[#58398B] hover:bg-white/10'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-white/30 text-[#58398B]'
                }`}>
                  {tabCounts[tab.key as keyof typeof tabCounts]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content Container with Glassmorphic Card */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[240px]">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-6 mb-6">
          {/* Mode Switcher for Admin Students */}
          {isAdminStudent && (
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setViewMode('my-claims')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'my-claims'
                    ? 'bg-[#58398B] text-white shadow-sm'
                    : 'text-[#58398B] hover:bg-white/50'
                }`}
              >
                My Submissions
              </button>
              <button
                onClick={() => setViewMode('manage-claims')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'manage-claims'
                    ? 'bg-[#58398B] text-white shadow-sm'
                    : 'text-[#58398B] hover:bg-white/50'
                }`}
              >
                Review Claims
                {studentClaims.filter(c => c.status === 'pending').length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#F77F00] text-white">
                    {studentClaims.filter(c => c.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Event Switcher (only shown in manage-claims mode for admin students) */}
          {isAdminStudent && viewMode === 'manage-claims' && (
            <SDCard padding="lg" variant="elevated">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      <div className="py-1">
                        <div className="font-medium text-foreground">{event.name}</div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          {event.date} • {event.location}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SDCard>
          )}
          
          {filteredClaims.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No claims found</h3>
              <p className="text-muted-foreground">
                {activeTab === 'all' 
                  ? "You haven't submitted any volunteer claims yet."
                  : `No ${activeTab} claims found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <SDCard
                  key={claim.id}
                  padding="none"
                  variant="elevated"
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Claim Header */}
                  <div className="p-4 border-b border-gray-100">
                    {/* Student Info (only in manage mode) */}
                    {viewMode === 'manage-claims' && claim.studentName && (
                      <div className="mb-3 pb-3 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{claim.studentName}</p>
                            <p className="text-sm text-muted-foreground">{claim.studentEmail}</p>
                            <p className="text-sm text-muted-foreground">{claim.studentSchool}</p>
                          </div>
                          {/* Action buttons for pending claims */}
                          {claim.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAction(claim, 'approve')}
                                className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleAction(claim, 'reject')}
                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                                title="Reject"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(claim.status)}
                        <span className={`px-2 py-1 rounded-md font-medium border ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {claim.hours} {claim.hours === 1 ? 'hour' : 'hours'}
                        </div>
                        <div className="text-sm text-muted-foreground">{claim.category}</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground line-clamp-2 mb-3">
                      {claim.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted {formatDate(claim.submittedAt)}</span>
                      </div>
                      {claim.reviewedAt && (
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          <span>Reviewed {formatDate(claim.reviewedAt)}</span>
                        </div>
                      )}
                      {claim.proof && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{claim.proof.length} file{claim.proof.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Comment */}
                  {claim.reviewComment && (
                    <div className={`p-4 ${claim.status === 'rejected' ? 'bg-red-50' : 'bg-green-50'}`}>
                      <div className="font-medium text-muted-foreground mb-1">Coordinator Note:</div>
                      <p className="text-foreground">{claim.reviewComment}</p>
                    </div>
                  )}

                  {/* Proof Files */}
                  {claim.proof && claim.proof.length > 0 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <div className="font-medium text-muted-foreground mb-2">Proof Files:</div>
                      <div className="flex flex-wrap gap-2">
                        {claim.proof.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border border-gray-200"
                          >
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground truncate max-w-[120px]">
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </SDCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && selectedClaim && (
        <Dialog open={true} onOpenChange={() => setActionModal(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {actionModal === 'approve' ? 'Approve Claim' : 'Reject Claim'}
              </DialogTitle>
              <DialogDescription>
                {actionModal === 'approve' ? 'Are you sure you want to approve this claim?' : 'Please provide a reason for rejecting this claim.'}
              </DialogDescription>
            </DialogHeader>
            {actionModal === 'reject' && (
              <Textarea
                className="h-20"
                placeholder="Enter your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            )}
            <DialogFooter>
              <SDButton
                type="button"
                onClick={() => setActionModal(null)}
                variant="outline"
              >
                Cancel
              </SDButton>
              <SDButton
                type="button"
                onClick={confirmAction}
                className={actionModal === 'approve' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}
              >
                {actionModal === 'approve' ? 'Approve' : 'Reject'}
              </SDButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}