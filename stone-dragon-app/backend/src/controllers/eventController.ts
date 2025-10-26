import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new event with optional student coordinator assignments
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      duration,
      maxVolunteers,
      studentCoordinatorIds = [],
    } = req.body;
    const coordinatorId = (req as any).user.id;

    // Create the event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location,
        duration: duration ? parseFloat(duration) : null,
        maxVolunteers: parseInt(maxVolunteers),
        coordinatorId,
      },
      include: {
        coordinator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Assign student coordinators if provided
    if (studentCoordinatorIds.length > 0) {
      // Promote students to STUDENT_COORDINATOR role if they're still STUDENT
      await prisma.user.updateMany({
        where: {
          id: { in: studentCoordinatorIds },
          role: 'STUDENT',
        },
        data: {
          role: 'STUDENT_COORDINATOR',
        },
      });

      // Create event coordinator assignments
      await prisma.eventCoordinator.createMany({
        data: studentCoordinatorIds.map((userId: string) => ({
          eventId: event.id,
          userId,
        })),
      });
    }

    // Fetch the complete event with coordinators
    const completeEvent = await prisma.event.findUnique({
      where: { id: event.id },
      include: {
        coordinator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        eventCoordinators: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: completeEvent,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
    });
  }
};

// Get all events (filtered by role/user)
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { upcoming } = req.query;

    let whereClause: any = {};

    // Filter for upcoming events if requested
    if (upcoming === 'true') {
      whereClause.date = {
        gte: new Date(),
      };
    }

    // Students and Student Coordinators see all events
    // Coordinators see only their created events
    // Admins see all events
    if (user.role === 'COORDINATOR') {
      whereClause.coordinatorId = user.id;
    }
    // ADMIN sees all events - no filter applied

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        coordinator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        eventCoordinators: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            eventRegistrations: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
    });
  }
};

// Get single event by ID with registrations and coordinators
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        coordinator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        eventCoordinators: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            eventRegistrations: true,
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Event retrieved successfully',
      data: event,
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event',
    });
  }
};

// Update event details and student coordinator assignments
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
      return;
    }
    const {
      title,
      description,
      date,
      time,
      location,
      duration,
      maxVolunteers,
      studentCoordinatorIds,
    } = req.body;
    const userId = (req as any).user.id;

    // Check if user owns the event
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    if (existingEvent.coordinatorId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
      return;
    }

    // Update the event
    await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(time !== undefined && { time }),
        ...(location !== undefined && { location }),
        ...(duration !== undefined && { duration: duration ? parseFloat(duration) : null }),
        ...(maxVolunteers && { maxVolunteers: parseInt(maxVolunteers) }),
      },
    });

    // Update student coordinators if provided
    if (studentCoordinatorIds) {
      // Remove existing coordinators
      await prisma.eventCoordinator.deleteMany({
        where: { eventId: id },
      });

      if (studentCoordinatorIds.length > 0) {
        // Promote students to STUDENT_COORDINATOR role if they're still STUDENT
        await prisma.user.updateMany({
          where: {
            id: { in: studentCoordinatorIds },
            role: 'STUDENT',
          },
          data: {
            role: 'STUDENT_COORDINATOR',
          },
        });

        // Create new coordinator assignments
        await prisma.eventCoordinator.createMany({
          data: studentCoordinatorIds.map((coordId: string) => ({
            eventId: id,
            userId: coordId,
          })),
        });
      }
    }

    // Fetch complete updated event
    const completeEvent = await prisma.event.findUnique({
      where: { id },
      include: {
        coordinator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        eventCoordinators: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        eventRegistrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: completeEvent,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
    });
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
      return;
    }

    // Check if user owns the event
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    if (event.coordinatorId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
      return;
    }

    await prisma.event.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
    });
  }
};

// Student registers for an event
export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
      return;
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            eventRegistrations: true,
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found',
      });
      return;
    }

    // Check if event is full
    if (event._count.eventRegistrations >= event.maxVolunteers) {
      res.status(400).json({
        success: false,
        message: 'Event is full',
      });
      return;
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    });

    if (existingRegistration) {
      res.status(400).json({
        success: false,
        message: 'Already registered for this event',
      });
      return;
    }

    // Create registration
    await prisma.eventRegistration.create({
      data: {
        eventId: id,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
    });
  }
};

// Student unregisters from an event
export const unregisterFromEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
      return;
    }

    // Check if registered
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    });

    if (!registration) {
      res.status(404).json({
        success: false,
        message: 'Not registered for this event',
      });
      return;
    }

    // Delete registration
    await prisma.eventRegistration.delete({
      where: {
        eventId_userId: {
          eventId: id,
          userId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Successfully unregistered from event',
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from event',
    });
  }
};

// Get events user is registered for or coordinating
export const getMyEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = (req as any).user;

    let events: any[] = [];

    // Get registered events for students/student coordinators
    if (user.role === 'STUDENT' || user.role === 'STUDENT_COORDINATOR') {
      const registrations = await prisma.eventRegistration.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              coordinator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              eventCoordinators: {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      role: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  eventRegistrations: true,
                },
              },
            },
          },
        },
      });

      events = registrations.map((reg) => reg.event);
    }

    // Get coordinating events for student coordinators
    if (user.role === 'STUDENT_COORDINATOR') {
      const coordinations = await prisma.eventCoordinator.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              coordinator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              eventCoordinators: {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                      role: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  eventRegistrations: true,
                },
              },
            },
          },
        },
      });

      // Merge and deduplicate
      const coordinatingEvents = coordinations.map((coord) => coord.event);
      const eventIds = new Set(events.map((e) => e.id));
      coordinatingEvents.forEach((event) => {
        if (!eventIds.has(event.id)) {
          events.push(event);
        }
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve events',
    });
  }
};

