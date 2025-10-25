/**
 * EventsService - Shared service for managing events data across screens
 * This ensures EventsScreen and LogHoursScreen use the same data source
 */

export interface Event {
  id: string;
  title: string;
  organization: string;
  date: string;
  time?: string;
  location?: string;
  spotsAvailable: number;
  totalSpots: number;
  description?: string;
  hoursAwarded: number;
  isRegistered: boolean;
}

class EventsService {
  private static instance: EventsService;
  private events: Event[] = [
    {
      id: '1',
      title: 'Beach Cleanup Drive',
      organization: 'Cape Town Environmental Group',
      date: 'Nov 15, 2025',
      time: '09:00 AM - 12:00 PM',
      location: 'Camps Bay Beach',
      spotsAvailable: 15,
      totalSpots: 30,
      description: 'Join us for a morning beach cleanup to keep our shores beautiful.',
      hoursAwarded: 3,
      isRegistered: true,
    },
    {
      id: '2',
      title: 'Food Bank Distribution',
      organization: 'Community Outreach Foundation',
      date: 'Nov 20, 2025',
      time: '10:00 AM - 02:00 PM',
      location: 'District Six Community Center',
      spotsAvailable: 8,
      totalSpots: 20,
      description: 'Help distribute food parcels to families in need.',
      hoursAwarded: 4,
      isRegistered: false,
    },
    {
      id: '3',
      title: 'Youth Mentorship Program',
      organization: 'Stone Dragon NPO',
      date: 'Nov 25, 2025',
      time: '03:00 PM - 05:00 PM',
      location: 'Langa Youth Center',
      spotsAvailable: 5,
      totalSpots: 15,
      description: 'Mentor young students with homework and life skills.',
      hoursAwarded: 2,
      isRegistered: false,
    },
    {
      id: '4',
      title: 'Animal Shelter Support',
      organization: 'Cape Animal Welfare',
      date: 'Dec 1, 2025',
      time: '11:00 AM - 03:00 PM',
      location: 'Animal Shelter, Plumstead',
      spotsAvailable: 12,
      totalSpots: 12,
      description: 'Help care for rescued animals and maintain shelter facilities.',
      hoursAwarded: 4,
      isRegistered: false,
    },
  ];

  private constructor() {
    // Private constructor to prevent direct instantiation
    console.log('🏗️ EventsService: Creating new instance');
  }

  // Get singleton instance
  static getInstance(): EventsService {
    if (!EventsService.instance) {
      console.log('🆕 EventsService: Creating singleton instance');
      EventsService.instance = new EventsService();
    } else {
      console.log('♻️ EventsService: Returning existing singleton instance');
    }
    return EventsService.instance;
  }

  // Get all events
  getAllEvents(): Event[] {
    return [...this.events];
  }

  // Get only registered events
  getRegisteredEvents(): Event[] {
    const registered = this.events.filter(event => event.isRegistered);
    console.log('📅 EventsService: All events:', this.events);
    console.log('✅ EventsService: Registered events:', registered);
    return registered;
  }

  // Register for an event
  registerForEvent(eventId: string): boolean {
    console.log('🎯 EventsService: Attempting to register for event:', eventId);
    const event = this.events.find(e => e.id === eventId);
    console.log('🔍 EventsService: Found event:', event);
    if (event && event.spotsAvailable > 0 && !event.isRegistered) {
      event.isRegistered = true;
      event.spotsAvailable -= 1;
      console.log('✅ EventsService: Registration successful, updated event:', event);
      return true;
    }
    console.log('❌ EventsService: Registration failed');
    return false;
  }

  // Unregister from an event
  unregisterFromEvent(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event && event.isRegistered) {
      event.isRegistered = false;
      event.spotsAvailable += 1;
      return true;
    }
    return false;
  }

  // Get event by ID
  getEventById(eventId: string): Event | undefined {
    return this.events.find(e => e.id === eventId);
  }

  // Reset events to initial state (for testing)
  resetToInitialState(): void {
    console.log('🔄 EventsService: Resetting to initial state');
    this.events = [
      {
        id: '1',
        title: 'Beach Cleanup Drive',
        organization: 'Cape Town Environmental Group',
        date: 'Nov 15, 2025',
        time: '09:00 AM - 12:00 PM',
        location: 'Camps Bay Beach',
        spotsAvailable: 15,
        totalSpots: 30,
        description: 'Join us for a morning beach cleanup to keep our shores beautiful.',
        hoursAwarded: 3,
        isRegistered: true,
      },
      {
        id: '2',
        title: 'Food Bank Distribution',
        organization: 'Community Outreach Foundation',
        date: 'Nov 20, 2025',
        time: '10:00 AM - 02:00 PM',
        location: 'District Six Community Center',
        spotsAvailable: 8,
        totalSpots: 20,
        description: 'Help distribute food parcels to families in need.',
        hoursAwarded: 4,
        isRegistered: false,
      },
      {
        id: '3',
        title: 'Youth Mentorship Program',
        organization: 'Stone Dragon NPO',
        date: 'Nov 25, 2025',
        time: '03:00 PM - 05:00 PM',
        location: 'Langa Youth Center',
        spotsAvailable: 5,
        totalSpots: 15,
        description: 'Mentor young students with homework and life skills.',
        hoursAwarded: 2,
        isRegistered: false,
      },
      {
        id: '4',
        title: 'Animal Shelter Support',
        organization: 'Cape Animal Welfare',
        date: 'Dec 1, 2025',
        time: '11:00 AM - 03:00 PM',
        location: 'Animal Shelter, Plumstead',
        spotsAvailable: 12,
        totalSpots: 12,
        description: 'Help care for rescued animals and maintain shelter facilities.',
        hoursAwarded: 4,
        isRegistered: false,
      },
    ];
  }
}

// Export singleton instance
export const eventsService = EventsService.getInstance();
