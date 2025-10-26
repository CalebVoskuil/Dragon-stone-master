import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get events where user is student coordinator
export const getAssignedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const eventCoordinations = await prisma.eventCoordinator.findMany({
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
                volunteerLogs: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          date: 'desc',
        },
      },
    });

    const events = eventCoordinations.map((coordination) => coordination.event);

    res.json({
      success: true,
      message: 'Assigned events retrieved successfully',
      data: events,
    });
  } catch (error) {
    console.error('Get assigned events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve assigned events',
    });
  }
};

// Get pending event claims for assigned events
export const getPendingEventClaims = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { status } = req.query;

    // Get events where user is student coordinator
    const eventCoordinations = await prisma.eventCoordinator.findMany({
      where: { userId },
      select: { eventId: true },
    });

    const assignedEventIds = eventCoordinations.map((coord) => coord.eventId);

    if (assignedEventIds.length === 0) {
      res.json({
        success: true,
        message: 'No claims found',
        data: [],
      });
      return;
    }

    // Build where clause
    const whereClause: any = {
      eventId: { in: assignedEventIds },
      claimType: 'event',
      // EXCLUDE claims submitted by the current user (self-participation)
      userId: { not: userId },
    };

    // Filter by status if provided
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Get volunteer logs for these events
    const claims = await prisma.volunteerLog.findMany({
      where: whereClause,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      message: 'Event claims retrieved successfully',
      data: claims,
    });
  } catch (error) {
    console.error('Get pending event claims error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve event claims',
    });
  }
};

// Review event claim (approve/reject)
export const reviewEventClaim = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, coordinatorComment } = req.body;
    const userId = (req as any).user.id;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Claim ID is required',
      });
      return;
    }

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved or rejected',
      });
      return;
    }

    // Get the claim
    const claim = await prisma.volunteerLog.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });

    if (!claim) {
      res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
      return;
    }

    // Check if claim is for an event
    if (claim.claimType !== 'event' || !claim.eventId) {
      res.status(400).json({
        success: false,
        message: 'This claim is not an event claim',
      });
      return;
    }

    // Check if user is student coordinator for this event
    const isStudentCoordinator = await prisma.eventCoordinator.findUnique({
      where: {
        eventId_userId: {
          eventId: claim.eventId,
          userId,
        },
      },
    });

    if (!isStudentCoordinator) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to review this claim',
      });
      return;
    }

    // Check if claim is still pending
    if (claim.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Claim has already been reviewed',
      });
      return;
    }

    // Update the claim
    const updatedClaim = await prisma.volunteerLog.update({
      where: { id },
      data: {
        status,
        coordinatorComment,
        reviewedBy: userId,
        reviewedAt: new Date(),
      },
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

    res.json({
      success: true,
      message: `Claim ${status} successfully`,
      data: updatedClaim,
    });
  } catch (error) {
    console.error('Review event claim error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review claim',
    });
  }
};

