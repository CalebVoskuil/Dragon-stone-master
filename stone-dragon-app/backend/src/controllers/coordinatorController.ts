import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPendingLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, schoolId } = req.query;
    const coordinatorId = (req as any).user.id;

    const where: any = {
      status: 'pending',
    };

    // Filter by school if specified
    if (schoolId) {
      where.schoolId = schoolId as string;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.volunteerLog.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'asc' },
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
      }),
      prisma.volunteerLog.count({ where }),
    ]);

    res.json({
      success: true,
      message: 'Pending logs retrieved successfully',
      data: logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get pending logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pending logs',
    });
  }
};

export const reviewVolunteerLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { logId } = req.params;
    const { status, coordinatorComment } = req.body;
    const coordinatorId = (req as any).user.id;

    const volunteerLog = await prisma.volunteerLog.update({
      where: { id: logId },
      data: {
        status,
        coordinatorComment,
        reviewedAt: new Date(),
        reviewedBy: coordinatorId,
      },
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
      message: `Volunteer log ${status} successfully`,
      data: volunteerLog,
    });
  } catch (error) {
    console.error('Review volunteer log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review volunteer log',
    });
  }
};

export const getCoordinatorDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const coordinatorId = (req as any).user.id;

    // Get statistics
    const [
      totalLogs,
      pendingLogs,
      approvedLogs,
      rejectedLogs,
      totalHours,
      recentLogs,
    ] = await Promise.all([
      prisma.volunteerLog.count(),
      prisma.volunteerLog.count({ where: { status: 'pending' } }),
      prisma.volunteerLog.count({ where: { status: 'approved' } }),
      prisma.volunteerLog.count({ where: { status: 'rejected' } }),
      prisma.volunteerLog.aggregate({
        where: { status: 'approved' },
        _sum: { hours: true },
      }),
      prisma.volunteerLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const dashboard = {
      statistics: {
        totalLogs,
        pendingLogs,
        approvedLogs,
        rejectedLogs,
        totalHours: totalHours._sum.hours || 0,
      },
      recentLogs,
    };

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboard,
    });
  } catch (error) {
    console.error('Get coordinator dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data',
    });
  }
};

export const getSchoolStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.query;

    if (!schoolId) {
      res.status(400).json({
        success: false,
        message: 'School ID is required',
      });
      return;
    }

    const [
      totalLogs,
      pendingLogs,
      approvedLogs,
      rejectedLogs,
      totalHours,
      topVolunteers,
    ] = await Promise.all([
      prisma.volunteerLog.count({ where: { schoolId: schoolId as string } }),
      prisma.volunteerLog.count({ 
        where: { schoolId: schoolId as string, status: 'pending' } 
      }),
      prisma.volunteerLog.count({ 
        where: { schoolId: schoolId as string, status: 'approved' } 
      }),
      prisma.volunteerLog.count({ 
        where: { schoolId: schoolId as string, status: 'rejected' } 
      }),
      prisma.volunteerLog.aggregate({
        where: { schoolId: schoolId as string, status: 'approved' },
        _sum: { hours: true },
      }),
      prisma.volunteerLog.groupBy({
        by: ['userId'],
        where: { 
          schoolId: schoolId as string, 
          status: 'approved' 
        },
        _sum: { hours: true },
        orderBy: { _sum: { hours: 'desc' } },
        take: 5,
      }),
    ]);

    // Get user details for top volunteers
    const topVolunteerIds = topVolunteers.map(v => v.userId);
    const topVolunteerDetails = await prisma.user.findMany({
      where: { id: { in: topVolunteerIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    const topVolunteersWithDetails = topVolunteers.map(volunteer => {
      const userDetails = topVolunteerDetails.find(u => u.id === volunteer.userId);
      return {
        ...userDetails,
        totalHours: volunteer._sum.hours || 0,
      };
    });

    const stats = {
      totalLogs,
      pendingLogs,
      approvedLogs,
      rejectedLogs,
      totalHours: totalHours._sum.hours || 0,
      topVolunteers: topVolunteersWithDetails,
    };

    res.json({
      success: true,
      message: 'School statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    console.error('Get school stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve school statistics',
    });
  }
};
