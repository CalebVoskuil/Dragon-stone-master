import { useState } from "react";
import { Bell, Settings } from "lucide-react";
import { SDRaisedPage } from "./SDRaisedPage";
import { SDStatCircle } from "./SDStatCircle";
import { SDImprovedStatGrid } from "./SDImprovedStatGrid";
import { SDImprovedSearchBar } from "./SDImprovedSearchBar";

export function SDAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [unreadNotifications] = useState(3);

  // Mock stats data
  const stats = {
    pending: 24,
    today: 12,
    approved: 156,
    totalStudents: 89,
    totalHours: 1200,
    avgResponseTime: '2.4'
  };

  // Mock schools data
  const schools = ['University of Cape Town', 'Stellenbosch University', 'Wynberg Girls High'];

  return (
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

      {/* Stats Row */}

    </SDRaisedPage>
  );
}