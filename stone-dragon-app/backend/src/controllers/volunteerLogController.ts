import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVolunteerLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hours, description, date, schoolId, claimType, eventId, donationItems } = req.body;
    const userId = (req as any).user.id;
    const proofFile = req.file;

    // Validate claim type
    const validClaimTypes = ['event', 'donation', 'volunteer', 'other'];
    if (claimType && !validClaimTypes.includes(claimType)) {
      res.status(400).json({
        success: false,
        message: 'Invalid claim type',
      });
      return;
    }

    // Build data object based on claim type
    const data: any = {
      description: description as string,
      date: new Date(date),
      schoolId: schoolId as string,
      userId: userId as string,
      proofFileName: proofFile?.filename ?? null,
      proofFilePath: proofFile?.path ?? null,
      status: 'pending' as const,
      claimType: claimType || 'volunteer',
    };

    // Handle hours based on claim type
    if (claimType === 'other') {
      // For 'other' type, hours will be set by coordinator, default to 0
      data.hours = 0;
    } else {
      data.hours = hours ? parseFloat(hours) : 0;
    }

    // Add event-specific fields
    if (claimType === 'event' && eventId) {
      data.eventId = eventId;
      
      // If hours not provided for event, try to get from event duration
      if (!hours) {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          select: { duration: true },
        });
        
        if (event?.duration) {
          data.hours = event.duration;
        }
      }
    }

    // Add donation-specific fields
    if (claimType === 'donation' && donationItems) {
      data.donationItems = parseFloat(donationItems);
    }

    const volunteerLog = await prisma.volunteerLog.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            location: true,
            duration: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer log created successfully',
      data: volunteerLog,
    });
  } catch (error) {
    console.error('Create volunteer log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create volunteer log',
    });
  }
};

export const getVolunteerLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, schoolId } = req.query;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const userSchoolId = (req as any).user.schoolId;

    const where: any = {};

    // Students and student coordinators can only see their own logs
    if (userRole === 'STUDENT' || userRole === 'STUDENT_COORDINATOR') {
      where.userId = userId;
    }

    // Coordinators see logs from their school, with specific event claim rules
    if (userRole === 'COORDINATOR') {
      // Filter by coordinator's school
      if (!userSchoolId) {
        res.status(403).json({
          success: false,
          message: 'Coordinator must be associated with a school',
        });
        return;
      }
      where.schoolId = userSchoolId;

      // Get all event IDs that have student coordinators, with the student coordinator user IDs
      const eventsWithCoordinators = await prisma.eventCoordinator.findMany({
        select: { 
          eventId: true,
          userId: true,
        },
      });
      
      // Create a map of eventId -> array of student coordinator user IDs
      const eventCoordinatorMap = new Map<string, string[]>();
      eventsWithCoordinators.forEach((ec) => {
        if (!eventCoordinatorMap.has(ec.eventId)) {
          eventCoordinatorMap.set(ec.eventId, []);
        }
        eventCoordinatorMap.get(ec.eventId)!.push(ec.userId);
      });

      const eventIdsWithCoordinators = Array.from(eventCoordinatorMap.keys());

      // Build complex OR condition
      where.OR = [
        { claimType: { not: 'event' } }, // Non-event claims - coordinators always see
        { claimType: 'event', eventId: { notIn: eventIdsWithCoordinators } }, // Events without student coordinators
        { claimType: 'event', eventId: null }, // Event claims without eventId
      ];

      // For each event with student coordinators, add condition to include logs 
      // submitted BY the student coordinator for that event
      eventIdsWithCoordinators.forEach((eventId) => {
        const coordinatorIds = eventCoordinatorMap.get(eventId) || [];
        where.OR.push({
          claimType: 'event',
          eventId: eventId,
          userId: { in: coordinatorIds }, // Include if submitted by student coordinator for this event
        });
      });
    }

    // Admins can only see approved/rejected claims, and can filter by school
    if (userRole === 'ADMIN') {
      // Admins can optionally filter by school
      if (schoolId) {
        where.schoolId = schoolId as string;
      }

      // Admins can filter by status, but can only see approved/rejected (not pending)
      if (status) {
        // Only allow approved or rejected status
        if (status === 'approved' || status === 'rejected') {
          where.status = status;
        } else {
          // If 'all' or invalid status, show both approved and rejected
          where.status = { in: ['approved', 'rejected'] };
        }
      } else {
        // Default: show both approved and rejected
        where.status = { in: ['approved', 'rejected'] };
      }
    }

    // Filter by status (for non-admin roles)
    if (status && userRole !== 'ADMIN') {
      where.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.volunteerLog.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
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
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              description: true,
              date: true,
              time: true,
              location: true,
              duration: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.volunteerLog.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Volunteer logs retrieved successfully',
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get volunteer logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve volunteer logs',
    });
  }
};

export const getVolunteerLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const where: any = { id };

    // Students and student coordinators can only see their own logs
    if (userRole === 'STUDENT' || userRole === 'STUDENT_COORDINATOR') {
      where.userId = userId;
    }

    const volunteerLog = await prisma.volunteerLog.findFirst({
      where,
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
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            time: true,
            location: true,
            duration: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!volunteerLog) {
      res.status(404).json({
        success: false,
        message: 'Volunteer log not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Volunteer log retrieved successfully',
      data: volunteerLog,
    });
  } catch (error) {
    console.error('Get volunteer log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve volunteer log',
    });
  }
};

export const updateVolunteerLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { hours, description, date } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Volunteer log ID is required',
      });
      return;
    }

    const where: any = { id };

    // Students, volunteers, and student coordinators can only update their own pending logs
    if (userRole === 'STUDENT' || userRole === 'VOLUNTEER' || userRole === 'STUDENT_COORDINATOR') {
      where.userId = userId;
      where.status = 'pending';
    }

    const existingLog = await prisma.volunteerLog.findFirst({ where });

    if (!existingLog) {
      res.status(404).json({
        success: false,
        message: 'Volunteer log not found or cannot be updated',
      });
      return;
    }

    const updateData: any = {};
    if (hours !== undefined) updateData.hours = parseFloat(hours);
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);

    const volunteerLog = await prisma.volunteerLog.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Volunteer log updated successfully',
      data: volunteerLog,
    });
  } catch (error) {
    console.error('Update volunteer log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer log',
    });
  }
};

export const deleteVolunteerLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Volunteer log ID is required',
      });
      return;
    }

    const where: any = { id };

    // Students, volunteers, and student coordinators can only delete their own pending logs
    if (userRole === 'STUDENT' || userRole === 'VOLUNTEER' || userRole === 'STUDENT_COORDINATOR') {
      where.userId = userId;
      where.status = 'pending';
    }

    const existingLog = await prisma.volunteerLog.findFirst({ where });

    if (!existingLog) {
      res.status(404).json({
        success: false,
        message: 'Volunteer log not found or cannot be deleted',
      });
      return;
    }

    await prisma.volunteerLog.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Volunteer log deleted successfully',
    });
  } catch (error) {
    console.error('Delete volunteer log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete volunteer log',
    });
  }
};