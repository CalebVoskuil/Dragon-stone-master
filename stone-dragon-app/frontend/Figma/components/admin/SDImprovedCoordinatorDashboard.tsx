import { useState, useEffect } from "react";
import { Search, Filter, Bell, Settings, Trophy, Eye, Check, X, ChevronDown, User, GraduationCap, Clock, MoreHorizontal, Plus, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "../ui/utils";
import { toast } from "sonner@2.0.3";

// Import improved components
import { SDRaisedPage } from "./SDRaisedPage";
import { SDImprovedStatGrid } from "./SDImprovedStatGrid";
import { SDImprovedSearchBar } from "./SDImprovedSearchBar";
import { SDImprovedClaimCard } from "./SDImprovedClaimCard";
import { SDImprovedClaimModal } from "./SDImprovedClaimModal";
import { SDImprovedBulkActions } from "./SDImprovedBulkActions";

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

export function SDImprovedCoordinatorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set());
  const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [unreadNotifications] = useState(3);

  // Mock data - enhanced with more realistic data
  const mockClaims: ClaimData[] = [
    {
      id: '1',
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@uct.ac.za',
      school: 'University of Cape Town',
      hours: 4,
      category: 'Community Kitchen',
      status: 'pending',
      submittedAt: '2024-03-15T09:30:00Z',
      submittedDate: 'March 15, 2024',
      notes: 'Helped prepare meals for 200+ families in Khayelitsha',
      proofUrl: 'https://example.com/proof1.jpg',
      consentStatus: 'approved',
      claimId: '#CLM-2024-001',
      description: 'Community kitchen volunteer work'
    },
    {
      id: '2',
      studentName: 'Michael Chen',
      studentEmail: 'michael.chen@sun.ac.za',
      school: 'Stellenbosch University',
      hours: 3,
      category: 'Beach Cleanup',
      status: 'pending',
      submittedAt: '2024-03-15T10:15:00Z',
      submittedDate: 'March 15, 2024',
      proofUrl: 'https://example.com/proof2.jpg',
      consentStatus: 'approved',
      claimId: '#CLM-2024-002',
      description: 'Environmental beach cleanup activity'
    },
    {
      id: '3',
      studentName: 'Emma Wilson',
      studentEmail: 'emma.wilson@wghs.edu',
      school: 'Wynberg Girls High',
      hours: 2,
      category: 'Tutoring',
      status: 'approved',
      submittedAt: '2024-03-14T14:20:00Z',
      submittedDate: 'March 14, 2024',
      approvedBy: 'Admin',
      approvedAt: '2024-03-14T16:30:00Z',
      proofUrl: 'https://example.com/proof3.jpg',
      consentStatus: 'approved',
      claimId: '#CLM-2024-003',
      description: 'Mathematics tutoring for grade 8 students'
    },
    {
      id: '4',
      studentName: 'David Miller',
      studentEmail: 'david.miller@rbhs.edu',
      school: 'Rondebosch Boys High',
      hours: 5,
      category: 'Garden Maintenance',
      status: 'pending',
      submittedAt: '2024-03-15T11:45:00Z',
      submittedDate: 'March 15, 2024',
      proofUrl: 'https://example.com/proof4.jpg',
      consentStatus: 'approved',
      claimId: '#CLM-2024-004',
      description: 'Community garden maintenance and planting'
    },
    {
      id: '5',
      studentName: 'Lisa Adams',
      studentEmail: 'lisa.adams@uct.ac.za',
      school: 'University of Cape Town',
      hours: 3,
      category: 'Animal Shelter',
      status: 'rejected',
      submittedAt: '2024-03-13T13:10:00Z',
      submittedDate: 'March 13, 2024',
      notes: 'Insufficient proof provided - photo unclear',
      approvedBy: 'Admin',
      approvedAt: '2024-03-13T15:20:00Z',
      proofUrl: 'https://example.com/proof5.jpg',
      consentStatus: 'approved',
      claimId: '#CLM-2024-005',
      description: 'Animal care assistance'
    }
  ];

  // Filter claims based on search and filters
  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = searchQuery === '' || 
      claim.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.school.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesSchool = schoolFilter === 'all' || claim.school === schoolFilter;
    
    return matchesSearch && matchesStatus && matchesSchool;
  });

  // Calculate stats
  const stats = {
    pending: mockClaims.filter(c => c.status === 'pending').length,
    today: mockClaims.filter(c => 
      new Date(c.submittedAt).toDateString() === new Date().toDateString()
    ).length,
    approved: mockClaims.filter(c => c.status === 'approved').length,
    totalStudents: new Set(mockClaims.map(c => c.studentEmail)).size,
    totalHours: mockClaims.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.hours, 0),
    avgResponseTime: '2.4'
  };

  // Get unique schools for filter
  const schools = [...new Set(mockClaims.map(c => c.school))];

  // Handle claim selection
  const handleClaimSelect = (claimId: string) => {
    const newSelected = new Set(selectedClaims);
    if (newSelected.has(claimId)) {
      newSelected.delete(claimId);
    } else {
      newSelected.add(claimId);
    }
    setSelectedClaims(newSelected);
    setSelectionMode(newSelected.size > 0);
  };

  // Handle view proof
  const handleViewProof = (claim: ClaimData) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  // Handle approve/reject
  const handleApprove = (claimId: string, comment?: string) => {
    toast.success('Claim approved successfully');
    console.log('Approve claim:', claimId, comment);
  };

  const handleReject = (claimId: string, reason?: string) => {
    if (!reason) {
      toast.error('Rejection reason is required');
      return;
    }
    toast.success('Claim rejected');
    console.log('Reject claim:', claimId, reason);
  };

  // Handle bulk actions
  const handleBulkApprove = () => {
    toast.success(`${selectedClaims.size} claims approved`);
    setSelectedClaims(new Set());
    setSelectionMode(false);
  };

  const handleBulkReject = () => {
    toast.success(`${selectedClaims.size} claims rejected`);
    setSelectedClaims(new Set());
    setSelectionMode(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sd-bg)' }}>
      <SDRaisedPage>
        {/* Enhanced Header */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-white text-2xl font-semibold mb-1">
                Coordinator Dashboard
              </h1>
              <p className="text-white/90 text-sm">
                Review and verify volunteer submissions
              </p>
            </div>
            
            {/* Actions Header */}
            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
              
              <div className="relative">
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Bell className="w-5 h-5 text-white" />
                </button>
                {unreadNotifications > 0 && (
                  <div 
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--sd-accent-reject)' }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Improved Stats Grid */}
          <SDImprovedStatGrid stats={stats} />

          {/* Enhanced Search and Filters */}
          <SDImprovedSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            schoolFilter={schoolFilter}
            onSchoolFilterChange={setSchoolFilter}
            schools={schools}
          />
        </div>

        {/* Claims List */}
        <div className="flex-1 bg-white/5 rounded-t-[20px] p-4 min-h-[400px]">
          {/* Claims Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium">
                {statusFilter === 'pending' ? 'Pending Claims' : 
                 statusFilter === 'all' ? 'All Claims' : 
                 `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Claims`}
              </h3>
              <p className="text-white/60 text-sm">
                {filteredClaims.length} {filteredClaims.length === 1 ? 'claim' : 'claims'}
              </p>
            </div>
            
            {/* Selection Mode Toggle */}
            {filteredClaims.length > 0 && (
              <button
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  if (selectionMode) setSelectedClaims(new Set());
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  selectionMode 
                    ? "bg-white text-gray-900" 
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {selectionMode ? 'Cancel' : 'Select'}
              </button>
            )}
          </div>

          {filteredClaims.length > 0 ? (
            <div className="space-y-3">
              {filteredClaims.map((claim) => (
                <SDImprovedClaimCard
                  key={claim.id}
                  claim={claim}
                  isSelected={selectedClaims.has(claim.id)}
                  selectionMode={selectionMode}
                  onSelect={() => handleClaimSelect(claim.id)}
                  onViewProof={() => handleViewProof(claim)}
                  onApprove={() => handleApprove(claim.id)}
                  onReject={(reason) => handleReject(claim.id, reason)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white/40" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No submissions found
              </h3>
              <p className="text-white/60">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </SDRaisedPage>

      {/* Bulk Action Bar */}
      {selectionMode && selectedClaims.size > 0 && (
        <SDImprovedBulkActions
          selectedCount={selectedClaims.size}
          onApprove={handleBulkApprove}
          onReject={handleBulkReject}
          onCancel={() => {
            setSelectedClaims(new Set());
            setSelectionMode(false);
          }}
        />
      )}

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <SDImprovedClaimModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClaim(null);
          }}
          claim={selectedClaim}
          onApprove={(comment) => {
            handleApprove(selectedClaim.id, comment);
            setIsModalOpen(false);
            setSelectedClaim(null);
          }}
          onReject={(reason) => {
            handleReject(selectedClaim.id, reason);
            setIsModalOpen(false);
            setSelectedClaim(null);
          }}
        />
      )}
    </div>
  );
}