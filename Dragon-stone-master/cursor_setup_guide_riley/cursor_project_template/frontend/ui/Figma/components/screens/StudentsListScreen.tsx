import { useState } from "react";
import { Search, Filter, Users, GraduationCap, Calendar, Award, Flame, Clock, Settings, Bell } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDCard } from "../SDCard";
import { SDInput } from "../SDInput";
import { SDStatChip } from "../SDStatusChip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuth } from "../../hooks/useAuth";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";

interface StudentsListScreenProps {
  isAdmin?: boolean;
  onAlertsPress?: () => void;
  onSettingsPress?: () => void;
}

interface Student {
  id: string;
  name: string;
  email: string;
  school: string;
  grade: number;
  age: number;
  totalHours: number;
  currentStreak: number;
  totalPoints: number;
  lastActivity: string;
}

export function StudentsListScreen({ isAdmin = false, onAlertsPress, onSettingsPress }: StudentsListScreenProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(user?.school || "Cape Town High School");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mock schools data
  const schools = [
    'Cape Town High School',
    'Wynberg Boys High School',
    'Wynberg Girls High School',
    'University of Cape Town',
    'Stellenbosch University',
    'Cape Peninsula University'
  ];

  // Mock students data
  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Alex Smith',
      email: 'alex.smith@student.uct.ac.za',
      school: 'Cape Town High School',
      grade: 11,
      age: 16,
      totalHours: 42,
      currentStreak: 5,
      totalPoints: 850,
      lastActivity: '2 days ago'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@cthi.ac.za',
      school: 'Cape Town High School',
      grade: 12,
      age: 17,
      totalHours: 65,
      currentStreak: 12,
      totalPoints: 1320,
      lastActivity: '1 day ago'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'mchen@wynberg.edu',
      school: 'Cape Town High School',
      grade: 10,
      age: 15,
      totalHours: 28,
      currentStreak: 3,
      totalPoints: 560,
      lastActivity: '3 hours ago'
    },
    {
      id: '4',
      name: 'Emma Williams',
      email: 'emma.w@student.ac.za',
      school: 'Cape Town High School',
      grade: 11,
      age: 16,
      totalHours: 51,
      currentStreak: 8,
      totalPoints: 1020,
      lastActivity: '5 days ago'
    },
    {
      id: '5',
      name: 'James Brown',
      email: 'james.b@cthi.ac.za',
      school: 'Cape Town High School',
      grade: 12,
      age: 18,
      totalHours: 73,
      currentStreak: 15,
      totalPoints: 1460,
      lastActivity: '1 hour ago'
    },
    {
      id: '6',
      name: 'Olivia Davis',
      email: 'olivia.d@student.ac.za',
      school: 'Cape Town High School',
      grade: 9,
      age: 14,
      totalHours: 19,
      currentStreak: 2,
      totalPoints: 380,
      lastActivity: '1 week ago'
    },
    {
      id: '7',
      name: 'Liam Martinez',
      email: 'liam.m@wynberg.edu',
      school: 'Cape Town High School',
      grade: 10,
      age: 15,
      totalHours: 35,
      currentStreak: 6,
      totalPoints: 700,
      lastActivity: '4 days ago'
    },
    {
      id: '8',
      name: 'Sophia Garcia',
      email: 'sophia.g@student.ac.za',
      school: 'Cape Town High School',
      grade: 11,
      age: 17,
      totalHours: 48,
      currentStreak: 9,
      totalPoints: 960,
      lastActivity: '2 days ago'
    }
  ];

  // Filter students
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSchool = student.school === selectedSchool;
    const matchesGrade = gradeFilter === 'all' || student.grade.toString() === gradeFilter;
    const matchesAge = ageFilter === 'all' || 
                      (ageFilter === '14-15' && student.age >= 14 && student.age <= 15) ||
                      (ageFilter === '16-17' && student.age >= 16 && student.age <= 17) ||
                      (ageFilter === '18+' && student.age >= 18);
    
    return matchesSearch && matchesSchool && matchesGrade && matchesAge;
  });

  // Calculate stats
  const totalHours = filteredStudents.reduce((sum, student) => sum + student.totalHours, 0);
  const averageHours = filteredStudents.length > 0 ? Math.round(totalHours / filteredStudents.length) : 0;
  const activeStudents = filteredStudents.filter(s => s.currentStreak > 0).length;

  const grades = Array.from(new Set(mockStudents.map(s => s.grade))).sort((a, b) => a - b);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Top Row with Buttons */}
          <div className="flex items-center justify-between mb-6">
            {/* Settings Button - Far Left */}
            <button
              onClick={onSettingsPress}
              className="p-2.5 rounded-full active:bg-[#58398B] transition-colors group"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-[#58398B] group-active:text-white transition-colors" />
            </button>
            
            {/* Alerts Button - Far Right */}
            <button
              onClick={onAlertsPress}
              className="p-2.5 rounded-full active:bg-[#58398B] transition-colors relative group"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-[#58398B] group-active:text-white transition-colors" />
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-[#58398B] mb-2">Students Directory</h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container with Glassmorphic Card */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[200px]">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 space-y-6 mb-6">
          {/* School Selector/Title */}
          {isAdmin ? (
            <SDCard padding="lg" variant="elevated">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <label className="block font-medium text-foreground mb-2">
                    Select School
                  </label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map(school => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SDCard>
          ) : (
            <SDCard padding="lg" variant="elevated" className="bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">School</p>
                  <h2 className="text-foreground font-medium">{selectedSchool}</h2>
                </div>
              </div>
            </SDCard>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <SDInput
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Grade Filter */}
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade.toString()}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Age Filter */}
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="14-15">14-15 years</SelectItem>
                <SelectItem value="16-17">16-17 years</SelectItem>
                <SelectItem value="18+">18+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-foreground">
                Students ({filteredStudents.length})
              </h2>
            </div>

            <div className="space-y-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <SDCard 
                    key={student.id} 
                    padding="lg" 
                    variant="elevated" 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Name and Email */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{student.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                      </div>
                    </div>
                  </SDCard>
                ))
              ) : (
                <SDCard padding="lg" className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-2">No students found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters to see more results.
                  </p>
                </SDCard>
              )}
            </div>
          </div>

          {/* Summary Card */}
          {filteredStudents.length > 0 && (
            <SDCard padding="lg" className="bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Hours per Student</p>
                  <p className="font-semibold text-foreground">{averageHours}h</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Combined Total</p>
                  <p className="font-semibold text-primary">{totalHours}h</p>
                </div>
              </div>
            </SDCard>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Dialog open={true} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle>{selectedStudent.name}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground mt-1">
                    {selectedStudent.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">School</span>
                    <span className="text-sm font-medium text-foreground">{selectedStudent.school}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Grade</span>
                    <span className="text-sm font-medium text-foreground">Grade {selectedStudent.grade}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Age</span>
                    <span className="text-sm font-medium text-foreground">{selectedStudent.age} years old</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted-foreground">Last Active</span>
                    <span className="text-sm font-medium text-foreground">{selectedStudent.lastActivity}</span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Volunteer Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-primary/5 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="font-semibold text-primary">{selectedStudent.totalHours}</div>
                    <div className="text-xs text-muted-foreground mt-1">Total Hours</div>
                  </div>
                  <div className="bg-accent/5 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Flame className="h-5 w-5 text-accent" />
                    </div>
                    <div className="font-semibold text-accent">{selectedStudent.currentStreak}</div>
                    <div className="text-xs text-muted-foreground mt-1">Day Streak</div>
                  </div>
                  <div className="bg-secondary/5 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="font-semibold text-secondary">{selectedStudent.totalPoints}</div>
                    <div className="text-xs text-muted-foreground mt-1">Points</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}