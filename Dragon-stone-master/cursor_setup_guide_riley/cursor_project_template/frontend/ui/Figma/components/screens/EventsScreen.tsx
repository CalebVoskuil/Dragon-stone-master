import { useState } from "react";
import { Calendar, MapPin, Clock, Users, Plus, X, Search, Filter, ArrowUpDown, CheckCircle } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDInput } from "../SDInput";
import { SDCard } from "../SDCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SDStatusChip } from "../SDStatusChip";
import { useAuth } from "../../hooks/useAuth";

interface Student {
  id: string;
  name: string;
  email: string;
  school: string;
  grade: string;
  totalHours: number;
}

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  duration: number;
  maxVolunteers: number;
  category: string;
  studentCoordinators: Student[];
  registered: number;
  status: 'upcoming' | 'past';
}

type ViewMode = 'create' | 'events';

interface EventsScreenProps {
  onBack?: () => void;
}

export function EventsScreen({ onBack }: EventsScreenProps = {}) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('create');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSchool, setFilterSchool] = useState("all");
  const [sortBy, setSortBy] = useState<'name' | 'hours' | 'grade'>('name');

  // Mock student data
  const allStudents: Student[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.j@cthi.ac.za', school: 'Cape Town High School', grade: 'Grade 11', totalHours: 24 },
    { id: '2', name: 'Michael Chen', email: 'mchen@wynberg.edu', school: 'Wynberg Boys High School', grade: 'Grade 12', totalHours: 32 },
    { id: '3', name: 'Emma Wilson', email: 'emma.w@cthi.ac.za', school: 'Cape Town High School', grade: 'Grade 10', totalHours: 18 },
    { id: '4', name: 'David Miller', email: 'david.m@wynberg.edu', school: 'Wynberg Boys High School', grade: 'Grade 11', totalHours: 28 },
    { id: '5', name: 'Olivia Brown', email: 'olivia.b@uct.ac.za', school: 'University of Cape Town', grade: 'Year 2', totalHours: 45 },
    { id: '6', name: 'James Taylor', email: 'james.t@cthi.ac.za', school: 'Cape Town High School', grade: 'Grade 12', totalHours: 36 },
    { id: '7', name: 'Sophia Anderson', email: 'sophia.a@stellenbosch.ac.za', school: 'Stellenbosch University', grade: 'Year 1', totalHours: 22 },
    { id: '8', name: 'Liam Martinez', email: 'liam.m@wynberg.edu', school: 'Wynberg Boys High School', grade: 'Grade 10', totalHours: 15 },
  ];

  // Mock events data
  const mockEvents: Event[] = [
    {
      id: '1',
      name: 'Beach Cleanup Drive',
      description: 'Join us for a community beach cleanup event at Camps Bay. We will collect trash, plastic waste, and other debris to help preserve our beautiful coastline.',
      date: '2025-11-15',
      time: '09:00',
      location: 'Camps Bay Beach, Cape Town',
      duration: 3,
      maxVolunteers: 30,
      category: 'Environmental Conservation',
      studentCoordinators: [allStudents[0], allStudents[2]],
      registered: 24,
      status: 'upcoming'
    },
    {
      id: '2',
      name: 'Food Bank Distribution',
      description: 'Volunteer to help distribute food packages to families in need. We will be sorting donations and packing food parcels for the community.',
      date: '2025-11-20',
      time: '10:00',
      location: 'Community Center, Khayelitsha',
      duration: 4,
      maxVolunteers: 25,
      category: 'Community Development',
      studentCoordinators: [allStudents[1]],
      registered: 18,
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Youth Mentorship Program',
      description: 'Mentor high school students in STEM subjects. Help students with homework, projects, and career guidance.',
      date: '2025-11-25',
      time: '14:00',
      location: 'Wynberg Boys High School',
      duration: 2,
      maxVolunteers: 15,
      category: 'Education & Tutoring',
      studentCoordinators: [allStudents[3], allStudents[5]],
      registered: 12,
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'Animal Shelter Support',
      description: 'Help care for rescued animals at the local shelter. Activities include feeding, cleaning, and socializing with the animals.',
      date: '2025-10-05',
      time: '11:00',
      location: 'Cape Town Animal Shelter',
      duration: 3.5,
      maxVolunteers: 20,
      category: 'Animal Welfare',
      studentCoordinators: [allStudents[4]],
      registered: 20,
      status: 'past'
    },
    {
      id: '5',
      name: 'School Garden Project',
      description: 'Help establish and maintain a vegetable garden at a local primary school. Teach students about sustainable farming.',
      date: '2025-09-18',
      time: '08:00',
      location: 'Langa Primary School',
      duration: 5,
      maxVolunteers: 35,
      category: 'Environmental Conservation',
      studentCoordinators: [allStudents[6], allStudents[7]],
      registered: 32,
      status: 'past'
    },
    {
      id: '6',
      name: 'Hospital Visit Program',
      description: 'Visit pediatric patients at the hospital to provide companionship and bring joy to children during their recovery.',
      date: '2025-09-30',
      time: '15:00',
      location: 'Red Cross War Memorial Children\'s Hospital',
      duration: 2.5,
      maxVolunteers: 12,
      category: 'Health & Wellness',
      studentCoordinators: [allStudents[0]],
      registered: 10,
      status: 'past'
    },
  ];

  // Filter events based on status
  const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming');
  const pastEvents = mockEvents.filter(e => e.status === 'past');

  // Filter students based on coordinator role
  const availableStudents = user?.role === 'admin-coordinator' 
    ? allStudents 
    : allStudents.filter(student => student.school === (user?.school || 'Cape Town High School'));

  // Get unique schools
  const schools = Array.from(new Set(availableStudents.map(s => s.school)));

  // Filter and sort students
  const filteredStudents = availableStudents
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSchool = filterSchool === 'all' || student.school === filterSchool;
      return matchesSearch && matchesSchool;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'hours':
          return b.totalHours - a.totalHours;
        case 'grade':
          return a.grade.localeCompare(b.grade);
        default:
          return 0;
      }
    });

  const toggleStudentSelection = (student: Student) => {
    setSelectedStudents(prev => {
      const isSelected = prev.some(s => s.id === student.id);
      if (isSelected) {
        return prev.filter(s => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const isStudentSelected = (studentId: string) => {
    return selectedStudents.some(s => s.id === studentId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Selected student admins:', selectedStudents);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetailModal(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-4">Events</h1>
          
          {/* Glide Segmented Control - Centered */}
          <div className="flex justify-center">
            <div className="relative inline-flex bg-primary-foreground/10 rounded-lg p-1 backdrop-blur-sm">
              {/* Sliding background indicator */}
              <div 
                className="absolute top-1 bottom-1 left-1 rounded-md bg-primary-foreground shadow-md transition-transform duration-300 ease-out"
                style={{
                  width: 'calc(50% - 4px)',
                  transform: viewMode === 'events' ? 'translateX(calc(100% + 8px))' : 'translateX(0)'
                }}
              />
              
              {/* Buttons */}
              <button
                onClick={() => setViewMode('create')}
                className={`relative z-10 px-6 py-2 rounded-md transition-colors duration-300 ${
                  viewMode === 'create'
                    ? 'text-primary'
                    : 'text-primary-foreground/70 hover:text-primary-foreground'
                }`}
              >
                Create
              </button>
              <button
                onClick={() => setViewMode('events')}
                className={`relative z-10 px-6 py-2 rounded-md transition-colors duration-300 ${
                  viewMode === 'events'
                    ? 'text-primary'
                    : 'text-primary-foreground/70 hover:text-primary-foreground'
                }`}
              >
                Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Create Event Form */}
        {viewMode === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details Card */}
            <SDCard padding="lg">
              <h2 className="font-medium text-foreground mb-4">Event Details</h2>
              
              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-foreground mb-2">
                    Event Name
                  </label>
                  <SDInput
                    id="eventName"
                    placeholder="e.g., Beach Cleanup Drive"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe the volunteer event and its objectives..."
                    className="min-h-[100px] resize-none"
                    required
                  />
                </div>

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-foreground mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date
                    </label>
                    <SDInput
                      id="eventDate"
                      type="date"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="eventTime" className="block text-sm font-medium text-foreground mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Start Time
                    </label>
                    <SDInput
                      id="eventTime"
                      type="time"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </label>
                  <SDInput
                    id="location"
                    placeholder="e.g., Camps Bay Beach, Cape Town"
                    required
                  />
                </div>

                {/* Duration and Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-2">
                      Duration (hours)
                    </label>
                    <SDInput
                      id="duration"
                      type="number"
                      step="0.5"
                      min="0.5"
                      placeholder="e.g., 3"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-foreground mb-2">
                      <Users className="inline h-4 w-4 mr-1" />
                      Max Volunteers
                    </label>
                    <SDInput
                      id="capacity"
                      type="number"
                      min="1"
                      placeholder="e.g., 30"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="environmental">Environmental Conservation</SelectItem>
                      <SelectItem value="education">Education & Tutoring</SelectItem>
                      <SelectItem value="community">Community Development</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="animal">Animal Welfare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SDCard>

            {/* Student Co-ordinators Card */}
            <SDCard padding="lg">
              <h2 className="font-medium text-foreground mb-4">Student Co-ordinators</h2>

              {/* Student Avatars - Horizontal Layout */}
              <div className="flex flex-wrap gap-4">
                {/* Selected Students */}
                {selectedStudents.map(student => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudentSelection(student)}
                    className="flex flex-col items-center group"
                    aria-label={`Remove ${student.name}`}
                  >
                    <div className="relative mb-2">
                      <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium shadow-md group-hover:shadow-lg transition-all">
                        {getInitials(student.name)}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <X className="h-3 w-3" />
                      </div>
                    </div>
                    <p className="text-xs text-foreground text-center max-w-[64px] truncate">
                      {student.name.split(' ')[0]}
                    </p>
                  </button>
                ))}

                {/* Add Students Button */}
                <button
                  type="button"
                  onClick={() => setShowStudentModal(true)}
                  className="flex flex-col items-center group"
                  aria-label="Add students"
                >
                  <div className="w-14 h-14 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Add
                  </p>
                </button>
              </div>
            </SDCard>

            {/* Submit Button */}
            <div className="flex gap-3">
              <SDButton
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Create Event
              </SDButton>
            </div>
          </form>
        )}

        {/* Events List */}
        {viewMode === 'events' && (
          <div className="space-y-4">
            {mockEvents.length > 0 ? (
              mockEvents.map(event => (
                <SDCard 
                  key={event.id} 
                  padding="lg"
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground">{event.name}</h3>
                        {event.status === 'past' && (
                          <CheckCircle className="h-4 w-4 text-[#FDCF25] flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(event.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {event.registered}/{event.maxVolunteers}
                        </span>
                      </div>
                    </div>
                  </div>
                </SDCard>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground">No events</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Student Selection Modal */}
      <Dialog open={showStudentModal} onOpenChange={setShowStudentModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Select Student Co-ordinators</DialogTitle>
            <DialogDescription>
              Choose students to grant co-ordinator privileges for this event
            </DialogDescription>
          </DialogHeader>

          {/* Selected Students Avatars */}
          {selectedStudents.length > 0 && (
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-3">
                {selectedStudents.map(student => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudentSelection(student)}
                    className="relative group"
                    aria-label={`Remove ${student.name}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium shadow-md group-hover:shadow-lg transition-shadow">
                      {getInitials(student.name)}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {selectedStudents.length} {selectedStudents.length === 1 ? 'student' : 'students'} selected
              </p>
            </div>
          )}

          {/* Search and Filters */}
          <div className="px-6 pb-4 space-y-3 border-b">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <SDInput
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex gap-3">
              {/* School Filter (only for admin coordinators) */}
              {user?.role === 'admin-coordinator' && (
                <Select value={filterSchool} onValueChange={setFilterSchool}>
                  <SelectTrigger className="flex-1">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schools</SelectItem>
                    {schools.map(school => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="flex-1">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="hours">Sort by Hours</SelectItem>
                  <SelectItem value="grade">Sort by Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Student List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              {filteredStudents.map(student => {
                const isSelected = isStudentSelected(student.id);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudentSelection(student)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                      }`}>
                        {getInitials(student.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{student.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate">{student.school}</span>
                          <span>•</span>
                          <span>{student.grade}</span>
                          <span>•</span>
                          <span>{student.totalHours}h</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>No students found</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="border-t p-6 flex gap-3">
            <SDButton
              type="button"
              variant="secondary"
              onClick={() => setShowStudentModal(false)}
              className="flex-1"
            >
              Cancel
            </SDButton>
            <SDButton
              type="button"
              variant="primary"
              onClick={() => setShowStudentModal(false)}
              className="flex-1"
            >
              Confirm ({selectedStudents.length})
            </SDButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Detail Modal */}
      <Dialog open={showEventDetailModal} onOpenChange={setShowEventDetailModal}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">{selectedEvent.name}</DialogTitle>
                    <DialogDescription>
                      View complete event details, registration status, and student co-ordinators
                    </DialogDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {selectedEvent.category}
                      </span>
                      {selectedEvent.status === 'past' && (
                        <span className="flex items-center gap-1 text-sm text-[#FDCF25]">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Description */}
                <div>
                  <h3 className="font-medium text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedEvent.description}</p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                    <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Time & Duration</span>
                    </div>
                    <p className="font-medium">{selectedEvent.time} ({selectedEvent.duration} hours)</p>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Users className="h-4 w-4" />
                      <span>{selectedEvent.status === 'past' ? 'Attendance' : 'Registration'}</span>
                    </div>
                    <p className="font-medium">
                      {selectedEvent.registered} / {selectedEvent.maxVolunteers} volunteers
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${(selectedEvent.registered / selectedEvent.maxVolunteers) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Student Co-ordinators */}
                {selectedEvent.studentCoordinators.length > 0 && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Student Co-ordinators</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedEvent.studentCoordinators.map(student => (
                        <div key={student.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.school}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <SDButton
                  type="button"
                  variant="secondary"
                  onClick={() => setShowEventDetailModal(false)}
                  className="flex-1"
                >
                  Close
                </SDButton>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}