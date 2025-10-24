import { useState } from "react";
import { Filter, CheckSquare } from "lucide-react";
import { SDRaisedPage } from "./SDRaisedPage";
import { SDToggleFilter } from "./SDToggleFilter";
import { SDClaimCard } from "./SDClaimCard";
import { SDClaimModal } from "./SDClaimModal";
import { SDBulkActionBar } from "./SDBulkActionBar";
import { toast } from "sonner@2.0.3";

interface ClaimData {
  id: string;
  studentName: string;
  claimId: string;
  date: string;
  hours: number;
  description: string;
  studentEmail: string;
  school: string;
  submittedAt: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
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

export function SDClaimsMerged() {
  const [activeFilter, setActiveFilter] = useState<'pending' | 'settled'>('pending');
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set());
  const [modalClaim, setModalClaim] = useState<ClaimData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  // Mock data
  const mockClaims: ClaimData[] = [
    {
      id: '1',
      studentName: 'Alex Johnson',
      claimId: '#CLM-2024-001',
      date: 'Dec 15',
      hours: 3,
      description: 'Community kitchen volunteer',
      studentEmail: 'alex.johnson@uct.ac.za',
      school: 'University of Cape Town',
      submittedAt: '2 hours ago',
      category: 'Community Service',
      status: 'pending',
      proofFiles: [
        {
          id: '1',
          name: 'kitchen-photo.jpg',
          type: 'image',
          url: '/mock-proof-1.jpg',
          thumbnail: '/mock-proof-1.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-15 14:30',
          action: 'Submitted',
          details: 'Initial claim submission'
        }
      ]
    },
    {
      id: '2',
      studentName: 'Sarah Mitchell',
      claimId: '#CLM-2024-002',
      date: 'Dec 15',
      hours: 2.5,
      description: 'Beach cleanup activity',
      studentEmail: 'sarah.mitchell@cthi.ac.za',
      school: 'Cape Town High School',
      submittedAt: '4 hours ago',
      category: 'Environmental',
      status: 'pending',
      proofFiles: [
        {
          id: '2',
          name: 'cleanup-photo.jpg',
          type: 'image',
          url: '/mock-proof-2.jpg',
          thumbnail: '/mock-proof-2.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-15 12:15',
          action: 'Submitted',
          details: 'Beach cleanup documentation'
        }
      ]
    },
    {
      id: '3',
      studentName: 'Michael Chen',
      claimId: '#CLM-2024-003',
      date: 'Dec 14',
      hours: 4,
      description: 'Tutoring at local school',
      studentEmail: 'michael.chen@wynberg.edu',
      school: 'Wynberg Boys High School',
      submittedAt: '1 day ago',
      category: 'Education',
      status: 'approved',
      proofFiles: [
        {
          id: '3',
          name: 'tutoring-session.jpg',
          type: 'image',
          url: '/mock-proof-3.jpg',
          thumbnail: '/mock-proof-3.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-14 16:45',
          action: 'Submitted',
          details: 'Mathematics tutoring session'
        }
      ]
    },
    {
      id: '4',
      studentName: 'Emma Van Der Merwe',
      claimId: '#CLM-2024-004',
      date: 'Dec 14',
      hours: 2,
      description: 'Animal shelter assistance',
      studentEmail: 'emma.vandermerwe@bishops.edu.za',
      school: 'Bishops Diocesan College',
      submittedAt: '1 day ago',
      category: 'Animal Welfare',
      status: 'rejected',
      proofFiles: [
        {
          id: '4',
          name: 'shelter-work.jpg',
          type: 'image',
          url: '/mock-proof-4.jpg',
          thumbnail: '/mock-proof-4.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-14 11:20',
          action: 'Submitted',
          details: 'Animal care documentation'
        }
      ]
    },
    {
      id: '5',
      studentName: 'Liam O\'Connor',
      claimId: '#CLM-2024-005',
      date: 'Dec 13',
      hours: 5,
      description: 'Food drive organization',
      studentEmail: 'liam.oconnor@rondebosch.edu.za',
      school: 'Rondebosch Boys\' High School',
      submittedAt: '2 days ago',
      category: 'Community Service',
      status: 'approved',
      proofFiles: [
        {
          id: '5',
          name: 'food-drive.jpg',
          type: 'image',
          url: '/mock-proof-5.jpg',
          thumbnail: '/mock-proof-5.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-13 15:45',
          action: 'Submitted',
          details: 'Food drive coordination'
        }
      ]
    },
    {
      id: '6',
      studentName: 'Zara Patel',
      claimId: '#CLM-2024-006',
      date: 'Dec 13',
      hours: 3.5,
      description: 'Library reading program',
      studentEmail: 'zara.patel@stellenbosch.ac.za',
      school: 'Stellenbosch University',
      submittedAt: '2 days ago',
      category: 'Education',
      status: 'pending',
      proofFiles: [
        {
          id: '6',
          name: 'reading-session.pdf',
          type: 'pdf',
          url: '/mock-proof-6.pdf',
          thumbnail: '/mock-proof-6-thumb.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-13 13:30',
          action: 'Submitted',
          details: 'Children reading program'
        }
      ]
    },
    {
      id: '7',
      studentName: 'Kai Williams',
      claimId: '#CLM-2024-007',
      date: 'Dec 12',
      hours: 4.5,
      description: 'Community garden project',
      studentEmail: 'kai.williams@uct.ac.za',
      school: 'University of Cape Town',
      submittedAt: '3 days ago',
      category: 'Environmental',
      status: 'rejected',
      proofFiles: [
        {
          id: '7',
          name: 'garden-work.jpg',
          type: 'image',
          url: '/mock-proof-7.jpg',
          thumbnail: '/mock-proof-7.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-12 16:15',
          action: 'Submitted',
          details: 'Vegetable garden maintenance'
        }
      ]
    },
    {
      id: '8',
      studentName: 'Ava Ndovu',
      claimId: '#CLM-2024-008',
      date: 'Dec 12',
      hours: 2,
      description: 'Senior center visit',
      studentEmail: 'ava.ndovu@herschel.co.za',
      school: 'Herschel Girls\' School',
      submittedAt: '3 days ago',
      category: 'Community Service',
      status: 'approved',
      proofFiles: [
        {
          id: '8',
          name: 'senior-visit.jpg',
          type: 'image',
          url: '/mock-proof-8.jpg',
          thumbnail: '/mock-proof-8.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-12 14:00',
          action: 'Submitted',
          details: 'Elderly care assistance'
        }
      ]
    },
    {
      id: '9',
      studentName: 'Noah Adams',
      claimId: '#CLM-2024-009',
      date: 'Dec 11',
      hours: 6,
      description: 'Homeless shelter support',
      studentEmail: 'noah.adams@reddam.co.za',
      school: 'Reddam House School',
      submittedAt: '4 days ago',
      category: 'Community Service',
      status: 'pending',
      proofFiles: [
        {
          id: '9',
          name: 'shelter-help.jpg',
          type: 'image',
          url: '/mock-proof-9.jpg',
          thumbnail: '/mock-proof-9.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-11 18:30',
          action: 'Submitted',
          details: 'Meal preparation and service'
        }
      ]
    },
    {
      id: '10',
      studentName: 'Mia Robertson',
      claimId: '#CLM-2024-010',
      date: 'Dec 11',
      hours: 3,
      description: 'Youth sports coaching',
      studentEmail: 'mia.robertson@sacredheart.co.za',
      school: 'Sacred Heart College',
      submittedAt: '4 days ago',
      category: 'Sports & Recreation',
      status: 'rejected',
      proofFiles: [
        {
          id: '10',
          name: 'coaching.mp4',
          type: 'image',
          url: '/mock-proof-10.jpg',
          thumbnail: '/mock-proof-10.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-11 17:45',
          action: 'Submitted',
          details: 'Soccer coaching for kids'
        }
      ]
    },
    {
      id: '11',
      studentName: 'Ethan Botha',
      claimId: '#CLM-2024-011',
      date: 'Dec 10',
      hours: 2.5,
      description: 'Hospital volunteer work',
      studentEmail: 'ethan.botha@sacs.org.za',
      school: 'South African College Schools',
      submittedAt: '5 days ago',
      category: 'Healthcare',
      status: 'approved',
      proofFiles: [
        {
          id: '11',
          name: 'hospital-volunteer.pdf',
          type: 'pdf',
          url: '/mock-proof-11.pdf',
          thumbnail: '/mock-proof-11-thumb.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-10 15:20',
          action: 'Submitted',
          details: 'Patient support activities'
        }
      ]
    },
    {
      id: '12',
      studentName: 'Isabella Khumalo',
      claimId: '#CLM-2024-012',
      date: 'Dec 10',
      hours: 4,
      description: 'After-school program',
      studentEmail: 'isabella.khumalo@uws.ac.za',
      school: 'University of Western Cape',
      submittedAt: '5 days ago',
      category: 'Education',
      status: 'pending',
      proofFiles: [
        {
          id: '12',
          name: 'afterschool.jpg',
          type: 'image',
          url: '/mock-proof-12.jpg',
          thumbnail: '/mock-proof-12.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-10 16:30',
          action: 'Submitted',
          details: 'Homework assistance program'
        }
      ]
    },
    {
      id: '13',
      studentName: 'James Thompson',
      claimId: '#CLM-2024-013',
      date: 'Dec 9',
      hours: 3.5,
      description: 'River cleanup initiative',
      studentEmail: 'james.thompson@constantia.edu.za',
      school: 'Constantia Waldorf School',
      submittedAt: '6 days ago',
      category: 'Environmental',
      status: 'approved',
      proofFiles: [
        {
          id: '13',
          name: 'river-cleanup.jpg',
          type: 'image',
          url: '/mock-proof-13.jpg',
          thumbnail: '/mock-proof-13.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-09 14:15',
          action: 'Submitted',
          details: 'Liesbeek River restoration'
        }
      ]
    },
    {
      id: '14',
      studentName: 'Sophie Daniels',
      claimId: '#CLM-2024-014',
      date: 'Dec 9',
      hours: 5.5,
      description: 'Community art workshop',
      studentEmail: 'sophie.daniels@michaelis.uct.ac.za',
      school: 'University of Cape Town',
      submittedAt: '6 days ago',
      category: 'Arts & Culture',
      status: 'rejected',
      proofFiles: [
        {
          id: '14',
          name: 'art-workshop.jpg',
          type: 'image',
          url: '/mock-proof-14.jpg',
          thumbnail: '/mock-proof-14.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-09 12:45',
          action: 'Submitted',
          details: 'Children art therapy session'
        }
      ]
    },
    {
      id: '15',
      studentName: 'Ben Oosthuizen',
      claimId: '#CLM-2024-015',
      date: 'Dec 8',
      hours: 2,
      description: 'Technology skills training',
      studentEmail: 'ben.oosthuizen@stellenbosch.ac.za',
      school: 'Stellenbosch University',
      submittedAt: '1 week ago',
      category: 'Education',
      status: 'approved',
      proofFiles: [
        {
          id: '15',
          name: 'tech-training.pdf',
          type: 'pdf',
          url: '/mock-proof-15.pdf',
          thumbnail: '/mock-proof-15-thumb.jpg'
        }
      ],
      consentStatus: 'approved',
      submissionHistory: [
        {
          timestamp: '2024-12-08 13:30',
          action: 'Submitted',
          details: 'Digital literacy workshop'
        }
      ]
    }
  ];

  const filteredClaims = mockClaims.filter(claim => {
    if (activeFilter === 'pending') {
      return claim.status === 'pending';
    } else { // settled
      return claim.status === 'approved' || claim.status === 'rejected';
    }
  });

  const handleClaimSelect = (claimId: string, selected: boolean) => {
    const newSelected = new Set(selectedClaims);
    if (selected) {
      newSelected.add(claimId);
    } else {
      newSelected.delete(claimId);
    }
    setSelectedClaims(newSelected);
  };

  const handleClaimPress = (claimId: string) => {
    if (!selectionMode) {
      const claim = mockClaims.find(c => c.id === claimId);
      if (claim) {
        setModalClaim(claim);
        setShowModal(true);
      }
    }
  };

  const handleLongPress = (claimId: string) => {
    setSelectionMode(true);
    handleClaimSelect(claimId, true);
  };

  const handleSelectButtonPress = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      // Clear selections when exiting selection mode
      setSelectedClaims(new Set());
    }
  };

  const handleApprove = (claimId: string, comment?: string) => {
    console.log('Approve claim:', claimId, comment);
    toast.success('Claim approved — points awarded.');
    // Remove from selected if it was selected
    const newSelected = new Set(selectedClaims);
    newSelected.delete(claimId);
    setSelectedClaims(newSelected);
  };

  const handleReject = (claimId: string, comment?: string) => {
    console.log('Reject claim:', claimId, comment);
    toast.error('Claim rejected.');
    // Remove from selected if it was selected
    const newSelected = new Set(selectedClaims);
    newSelected.delete(claimId);
    setSelectedClaims(newSelected);
  };

  const handleBulkApprove = () => {
    Array.from(selectedClaims).forEach(claimId => {
      handleApprove(claimId, 'Bulk approval');
    });
    setSelectedClaims(new Set());
  };

  const handleBulkReject = () => {
    Array.from(selectedClaims).forEach(claimId => {
      handleReject(claimId, 'Bulk rejection');
    });
    setSelectedClaims(new Set());
  };

  return (
    <div className="relative">
      <SDRaisedPage>
        {/* Header */}
        <div className="p-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                <Filter className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-xl font-semibold text-white">Claims</h1>
            </div>
            
            <button 
              onClick={handleSelectButtonPress}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <CheckSquare className={`w-5 h-5 ${selectionMode ? 'text-[var(--sd-accent-accept)]' : 'text-white'}`} />
            </button>
          </div>

          {/* Toggle Filter */}
          <div className="flex justify-center">
            <SDToggleFilter 
              activeTab={activeFilter}
              onTabChange={setActiveFilter}
            />
          </div>
        </div>

        {/* Claims List */}
        <div className="flex-1 bg-white/5 rounded-t-[20px] p-6 pb-8 min-h-[600px]">
          <div className="space-y-3 mb-6">
            {filteredClaims.map((claim) => (
              <SDClaimCard
                key={claim.id}
                id={claim.id}
                studentName={claim.studentName}
                claimId={claim.claimId}
                date={claim.date}
                hours={claim.hours}
                description={claim.description}
                status={claim.status}
                isSelected={selectedClaims.has(claim.id)}
                onSelect={handleClaimSelect}
                onApprove={handleApprove}
                onReject={handleReject}
                onCardPress={handleClaimPress}
                onLongPress={handleLongPress}
                selectionMode={selectionMode}
              />
            ))}
          </div>

          {filteredClaims.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="text-white/70 mb-3 text-lg">No claims to review</div>
              <div className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                {activeFilter === 'pending' ? 'All claims have been processed!' : 'No settled claims yet.'}
              </div>
            </div>
          )}
          
          {/* Extra spacing at bottom for better scrolling experience */}
          <div className="h-12"></div>
        </div>
      </SDRaisedPage>

      {/* Bulk Action Bar */}
      <SDBulkActionBar
        selectedCount={selectedClaims.size}
        onApproveAll={handleBulkApprove}
        onRejectAll={handleBulkReject}
      />

      {/* Claim Modal */}
      <SDClaimModal
        open={showModal}
        onOpenChange={setShowModal}
        claim={modalClaim}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}