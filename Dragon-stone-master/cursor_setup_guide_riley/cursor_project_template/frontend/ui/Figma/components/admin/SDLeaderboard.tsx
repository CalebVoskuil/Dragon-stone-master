import { Trophy, Medal, Award, Users, GraduationCap, ArrowLeft } from "lucide-react";
import { cn } from "../ui/utils";
import { useState } from "react";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  school: string;
  hours: number;
  points: number;
  badges: number;
}

interface SchoolLeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  studentCount: number;
  totalHours: number;
  averageHours: number;
  totalBadges: number;
}

interface PodiumItemProps {
  entry: LeaderboardEntry | SchoolLeaderboardEntry;
  position: 1 | 2 | 3;
  isSchoolMode: boolean;
}

function PodiumItem({ entry, position, isSchoolMode }: PodiumItemProps) {
  const heights = {
    1: 'h-20',
    2: 'h-16', 
    3: 'h-12'
  };

  const colors = {
    1: 'bg-[#FFD60A]', // Gold
    2: 'bg-gray-300',  // Silver  
    3: 'bg-orange-400' // Bronze
  };

  const iconColors = {
    1: 'text-[#2D2D2D]',
    2: 'text-gray-600',
    3: 'text-orange-700'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayValue = () => {
    if (isSchoolMode) {
      const schoolEntry = entry as SchoolLeaderboardEntry;
      return `${schoolEntry.totalHours}h`;
    } else {
      const studentEntry = entry as LeaderboardEntry;
      return `${studentEntry.hours}h`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className="w-12 h-12 bg-[#7B4CB3] rounded-full flex items-center justify-center mb-2">
        {isSchoolMode ? (
          <GraduationCap className="w-6 h-6 text-white" />
        ) : (
          <span className="text-white font-medium text-sm">
            {getInitials(entry.name)}
          </span>
        )}
      </div>
      
      {/* Name */}
      <div className="text-center mb-2">
        <div className="font-medium text-[#58398B] text-sm">{entry.name}</div>
        <div className="text-[#58398B]/70 text-xs">{getDisplayValue()}</div>
      </div>
      
      {/* Podium */}
      <div className={cn(
        "w-16 flex flex-col items-center justify-end rounded-t-lg relative",
        heights[position],
        colors[position]
      )}>
        <div className={cn(
          "absolute -top-6 w-8 h-8 rounded-full flex items-center justify-center",
          colors[position]
        )}>
          <Trophy className={cn("w-5 h-5", iconColors[position])} />
        </div>
        
        <div className={cn(
          "font-bold text-lg mb-1",
          iconColors[position]
        )}>
          {position}
        </div>
      </div>
    </div>
  );
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry | SchoolLeaderboardEntry;
  isSchoolMode: boolean;
}

function LeaderboardRow({ entry, isSchoolMode }: LeaderboardRowProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStudentRow = (entry: LeaderboardEntry) => (
    <>
      {/* Rank */}
      <div className="w-8 text-center">
        <span className="font-semibold text-[#2D2D2D]">
          {entry.rank}
        </span>
      </div>
      
      {/* Avatar */}
      <div className="w-10 h-10 bg-[#7B4CB3] rounded-full flex items-center justify-center mx-3">
        <span className="text-white font-medium text-sm">
          {getInitials(entry.name)}
        </span>
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[#2D2D2D] truncate">
          {entry.name}
        </div>
        <div className="text-sm text-gray-600 truncate">
          {entry.school}
        </div>
      </div>
      
      {/* Stats */}
      <div className="text-right">
        <div className="font-semibold text-[#2D2D2D]">
          {entry.hours}h
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <Award className="w-3 h-3 mr-1" />
          {entry.badges}
        </div>
      </div>
    </>
  );

  const renderSchoolRow = (entry: SchoolLeaderboardEntry) => (
    <>
      {/* Rank */}
      <div className="w-8 text-center">
        <span className="font-semibold text-[#2D2D2D]">
          {entry.rank}
        </span>
      </div>
      
      {/* Avatar */}
      <div className="w-10 h-10 bg-[#7B4CB3] rounded-full flex items-center justify-center mx-3">
        <GraduationCap className="w-5 h-5 text-white" />
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[#2D2D2D] truncate">
          {entry.name}
        </div>
        <div className="text-sm text-gray-600 truncate">
          {entry.studentCount} students
        </div>
      </div>
      
      {/* Stats */}
      <div className="text-right">
        <div className="font-semibold text-[#2D2D2D]">
          {entry.totalHours}h
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <Users className="w-3 h-3 mr-1" />
          {entry.averageHours}h avg
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-[12px] p-4 mb-3 flex items-center">
      {isSchoolMode 
        ? renderSchoolRow(entry as SchoolLeaderboardEntry)
        : renderStudentRow(entry as LeaderboardEntry)
      }
    </div>
  );
}

export function SDLeaderboard() {
  const [isSchoolMode, setIsSchoolMode] = useState(false);

  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      rank: 1,
      name: 'Sarah Johnson',
      school: 'University of Cape Town',
      hours: 127,
      points: 2540,
      badges: 12
    },
    {
      id: '2', 
      rank: 2,
      name: 'Michael Chen',
      school: 'Stellenbosch University',
      hours: 98,
      points: 1960,
      badges: 9
    },
    {
      id: '3',
      rank: 3,
      name: 'Alex Johnson',
      school: 'Cape Town High School',
      hours: 85,
      points: 1700,
      badges: 8
    },
    {
      id: '4',
      rank: 4,
      name: 'Emma Wilson',
      school: 'Wynberg Girls High',
      hours: 72,
      points: 1440,
      badges: 7
    },
    {
      id: '5',
      rank: 5,
      name: 'James Mitchell',
      school: 'Rondebosch Boys High',
      hours: 68,
      points: 1360,
      badges: 6
    },
    {
      id: '6',
      rank: 6,
      name: 'Lisa Adams',
      school: 'University of Cape Town',
      hours: 61,
      points: 1220,
      badges: 5
    }
  ];

  const mockSchoolLeaderboard: SchoolLeaderboardEntry[] = [
    {
      id: '1',
      rank: 1,
      name: 'University of Cape Town',
      studentCount: 48,
      totalHours: 1247,
      averageHours: 26,
      totalBadges: 92
    },
    {
      id: '2',
      rank: 2,
      name: 'Stellenbosch University',
      studentCount: 35,
      totalHours: 892,
      averageHours: 25,
      totalBadges: 67
    },
    {
      id: '3',
      rank: 3,
      name: 'Cape Town High School',
      studentCount: 42,
      totalHours: 756,
      averageHours: 18,
      totalBadges: 58
    },
    {
      id: '4',
      rank: 4,
      name: 'Wynberg Girls High',
      studentCount: 38,
      totalHours: 684,
      averageHours: 18,
      totalBadges: 51
    },
    {
      id: '5',
      rank: 5,
      name: 'Rondebosch Boys High',
      studentCount: 31,
      totalHours: 523,
      averageHours: 17,
      totalBadges: 39
    },
    {
      id: '6',
      rank: 6,
      name: 'Bishops College',
      studentCount: 29,
      totalHours: 445,
      averageHours: 15,
      totalBadges: 34
    }
  ];

  const currentData = isSchoolMode ? mockSchoolLeaderboard : mockLeaderboard;
  const topThree = currentData.slice(0, 3);
  const remaining = currentData.slice(3);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-[#58398B]">Leaderboard</h1>
            <p className="text-[#58398B]/70 text-sm mt-1">
              Top {isSchoolMode ? 'schools' : 'volunteers'} this month
            </p>
          </div>

          {/* Toggle Slider */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1 flex relative">
            {/* Sliding background indicator */}
            <div 
              className={cn(
                "absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out",
                isSchoolMode ? "left-1/2 right-1" : "left-1 right-1/2"
              )}
            />
            
            <button
              onClick={() => setIsSchoolMode(false)}
              className={cn(
                "relative z-10 flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center",
                !isSchoolMode 
                  ? "text-[#58398B]" 
                  : "text-[#58398B]/70 hover:text-[#58398B]/90"
              )}
            >
              <Users className="w-4 h-4 mr-1.5" />
              Students
            </button>
            <button
              onClick={() => setIsSchoolMode(true)}
              className={cn(
                "relative z-10 flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center justify-center",
                isSchoolMode 
                  ? "text-[#58398B]" 
                  : "text-[#58398B]/70 hover:text-[#58398B]/90"
              )}
            >
              <GraduationCap className="w-4 h-4 mr-1.5" />
              Schools
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container with Glassmorphic Card */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[160px] pb-24">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-6 mb-6">
          {/* Podium */}
          <div className="mb-6 pt-4">
            <div className="flex justify-center items-end space-x-6">
              {/* Second Place */}
              <PodiumItem entry={topThree[1]} position={2} isSchoolMode={isSchoolMode} />
              
              {/* First Place */}
              <PodiumItem entry={topThree[0]} position={1} isSchoolMode={isSchoolMode} />
              
              {/* Third Place */}
              <PodiumItem entry={topThree[2]} position={3} isSchoolMode={isSchoolMode} />
            </div>
          </div>

          {/* Remaining Rankings */}
          <div>
            {remaining.map((entry) => (
              <LeaderboardRow key={entry.id} entry={entry} isSchoolMode={isSchoolMode} />
            ))}
          </div>

          {/* Footer Stats */}
          <div className="bg-white/90 backdrop-blur-sm rounded-[12px] p-4 mt-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Total Community Impact</div>
              <div className="grid grid-cols-3 gap-4">
                {isSchoolMode ? (
                  <>
                    <div>
                      <div className="font-semibold text-[#2D2D2D]">4,547</div>
                      <div className="text-xs text-gray-500">Total Hours</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2D2D2D]">12</div>
                      <div className="text-xs text-gray-500">Participating Schools</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2D2D2D]">341</div>
                      <div className="text-xs text-gray-500">Total Badges</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="font-semibold text-[#2D2D2D]">2,847</div>
                      <div className="text-xs text-gray-500">Total Hours</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2D2D2D]">156</div>
                      <div className="text-xs text-gray-500">Active Volunteers</div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#2D2D2D]">47</div>
                      <div className="text-xs text-gray-500">Badges Earned</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}