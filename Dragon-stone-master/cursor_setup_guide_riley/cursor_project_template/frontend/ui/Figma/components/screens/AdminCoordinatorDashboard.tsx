import { useState } from "react";
import { Search, Filter, Eye, Check, X, MessageSquare, Calendar, Users, Clock } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDCard, SDLogCard } from "../SDCard";
import { SDInput } from "../SDInput";
import { SDStatChip, SDStatusChip } from "../SDStatusChip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useAuth } from "../../hooks/useAuth";

interface AdminCoordinatorDashboardProps {
  onViewDocument: (docId: string) => void;
}

export function AdminCoordinatorDashboard({ onViewDocument }: AdminCoordinatorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [actionModal, setActionModal] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState("");
  
  const { user } = useAuth();

  // Mock data for pending verifications
  const mockLogs = [
    {
      id: '1',
      studentName: 'Alex Smith',
      studentEmail: 'alex.smith@student.uct.ac.za', 
      school: 'University of Cape Town',
      hours: 3,
      category: 'Education & Tutoring',
      status: 'pending' as const,
      submittedAt: '2 hours ago',
      submittedDate: '2024-12-15T14:30:00Z',
      notes: 'Helped teach basic computer skills to elderly residents at Woodstock Community Center',
      proofUrl: '/mock-proof-1.jpg',
      consentStatus: 'approved'
    },
    {
      id: '2',
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.j@cthi.ac.za',
      school: 'Cape Town High School', 
      hours: 2.5,
      category: 'Environmental Conservation',
      status: 'pending' as const,
      submittedAt: '5 hours ago',
      submittedDate: '2024-12-15T11:00:00Z',
      notes: 'Beach cleanup at Camps Bay - collected plastic waste and cigarette butts',
      proofUrl: '/mock-proof-2.jpg',
      consentStatus: 'approved'
    },
    {
      id: '3',
      studentName: 'Michael Chen',
      studentEmail: 'mchen@wynberg.edu',
      school: 'Wynberg Boys High School',
      hours: 4,
      category: 'Community Development',
      status: 'approved' as const,
      submittedAt: '1 day ago',
      submittedDate: '2024-12-14T09:15:00Z',
      notes: 'Helped renovate playground equipment at local primary school',
      proofUrl: '/mock-proof-3.jpg',
      consentStatus: 'approved',
      approvedBy: 'Sarah Johnson',
      approvedAt: '2024-12-14T16:30:00Z'
    }
  ];

  const schools = [
    'Cape Town High School',
    'Wynberg Boys High School',
    'Wynberg Girls High School',
    'University of Cape Town',
    'Stellenbosch University'
  ];

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSchool = schoolFilter === 'all' || log.school === schoolFilter;
    
    return matchesSearch && matchesStatus && matchesSchool;
  });

  const handleApprove = (log: any) => {
    setSelectedLog(log);
    setActionModal('approve');
    setComment("Great work! Your volunteer contribution has been verified and approved.");
  };

  const handleReject = (log: any) => {
    setSelectedLog(log);
    setActionModal('reject');
    setComment("");
  };

  const confirmAction = async () => {
    if (!selectedLog || !actionModal) return;
    
    // Mock API call
    console.log(`${actionModal} log:`, {
      logId: selectedLog.id,
      comment,
      coordinatorId: user?.id
    });
    
    // In real app, this would update the backend and refresh data
    setActionModal(null);
    setSelectedLog(null);
    setComment("");
  };

  const pendingCount = mockLogs.filter(log => log.status === 'pending').length;
  const todayCount = mockLogs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.submittedDate).toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-2">Coordinator Dashboard</h1>
          <p className="text-primary-foreground/80">Review and verify volunteer hour submissions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SDStatChip
            label="Pending Review"
            value={pendingCount.toString()}
            icon={Clock}
            variant="primary"
          />
          <SDStatChip
            label="Today's Submissions"
            value={todayCount.toString()}
            icon={Calendar}
            variant="accent"
          />
          <SDStatChip
            label="Total Students"
            value="247"
            icon={Users}
            variant="default"
          />
        </div>

        {/* Filters */}
        <SDCard padding="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <SDInput
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by school" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {schools.map(school => (
                    <SelectItem key={school} value={school}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SDCard>

        {/* Submissions List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-foreground">
              Submissions ({filteredLogs.length})
            </h2>
          </div>

          <div className="space-y-4">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <SDCard key={log.id} padding="lg" variant="elevated">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-foreground">{log.studentName}</h3>
                          <SDStatusChip status={log.status} size="sm" />
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>{log.studentEmail}</p>
                          <p>{log.school}</p>
                          <p>{log.category} • {log.hours} hour{log.hours !== 1 ? 's' : ''}</p>
                          <p>Submitted {log.submittedAt}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onViewDocument(log.proofUrl)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Proof
                      </button>
                    </div>

                    {/* Notes */}
                    {log.notes && (
                      <div className="p-3 bg-muted/50 rounded-md">
                        <p className="text-sm text-foreground italic">"{log.notes}"</p>
                      </div>
                    )}

                    {/* Approval Info */}
                    {log.status === 'approved' && log.approvedBy && (
                      <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
                        <p>✓ Approved by {log.approvedBy} on {new Date(log.approvedAt!).toLocaleDateString()}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {log.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <SDButton
                          onClick={() => handleApprove(log)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </SDButton>
                        <SDButton
                          onClick={() => handleReject(log)}
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </SDButton>
                      </div>
                    )}
                  </div>
                </SDCard>
              ))
            ) : (
              <SDCard padding="lg" className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-2">No submissions found</h3>
                <p className="text-sm text-muted-foreground">
                  {statusFilter === 'pending' 
                    ? "All submissions have been reviewed!"
                    : "Try adjusting your filters to see more results."
                  }
                </p>
              </SDCard>
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <Dialog open={!!actionModal} onOpenChange={() => setActionModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionModal === 'approve' ? 'Approve Submission' : 'Reject Submission'}
            </DialogTitle>
            <DialogDescription>
              {actionModal === 'approve' ? 'Add a congratulatory message (optional)' : 'Please explain why this submission is being rejected'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="font-medium text-foreground">{selectedLog.studentName}</p>
                <p className="text-sm text-muted-foreground">{selectedLog.hours} hours • {selectedLog.category}</p>
              </div>
              
              <div>
                <label className="block font-medium text-foreground mb-2">
                  {actionModal === 'approve' ? 'Approval Message (Optional)' : 'Rejection Reason *'}
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    actionModal === 'approve' 
                      ? "Add a congratulatory message..."
                      : "Please explain why this submission is being rejected..."
                  }
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <SDButton variant="tertiary" onClick={() => setActionModal(null)}>
              Cancel
            </SDButton>
            <SDButton
              onClick={confirmAction}
              variant={actionModal === 'approve' ? 'primary' : 'destructive'}
              disabled={actionModal === 'reject' && !comment.trim()}
            >
              {actionModal === 'approve' ? 'Approve' : 'Reject'}
            </SDButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}