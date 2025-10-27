import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPendingLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, schoolId } = req.query;

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

    if (!logId) {
      res.status(400).json({
        success: false,
        message: 'Log ID is required',
      });
      return;
    }

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

export const getCoordinatorDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Calculate date ranges for statistics
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get statistics
    const [
      totalLogs,
      pendingLogs,
      approvedLogs,
      rejectedLogs,
      totalHours,
      todayLogs,
      lastWeekApproved,
      activeStudents,
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
      prisma.volunteerLog.count({ 
        where: { 
          createdAt: { gte: todayStart } 
        } 
      }),
      prisma.volunteerLog.count({ 
        where: { 
          status: 'approved',
          createdAt: { gte: lastWeek }
        } 
      }),
      // Count unique students who have submitted at least one log (excluding event claims with student coordinators)
      prisma.volunteerLog.findMany({
        distinct: ['userId'],
        where: {
          OR: [
            { claimType: { not: 'event' } },
            { claimType: 'event', eventId: null },
          ],
        },
        select: { userId: true },
      }).then(result => result.length),
      // Get ALL pending logs - coordinators review all non-event claims and event claims without student coordinators
      prisma.volunteerLog.findMany({
        where: {
          status: 'pending',
        },
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

    // Calculate approval rate
    const approvalRate = totalLogs > 0 
      ? Math.round((approvedLogs / totalLogs) * 100) 
      : 0;

    const dashboard = {
      statistics: {
        totalLogs,
        pendingLogs,
        approvedLogs,
        rejectedLogs,
        totalHours: totalHours._sum.hours || 0,
        todayLogs,
        lastWeekApproved,
        activeStudents,
        approvalRate,
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
    const topVolunteerIds = topVolunteers.map((v: any) => v.userId);
    const topVolunteerDetails = await prisma.user.findMany({
      where: { id: { in: topVolunteerIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    const topVolunteersWithDetails = topVolunteers.map((volunteer: any) => {
      const userDetails = topVolunteerDetails.find((u: any) => u.id === volunteer.userId);
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

export const getStudentsList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const coordinator = (req as any).user;

    if (!coordinator) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    // Build where clause - filter by coordinator's school and role
    const where: any = {
      role: { in: ['STUDENT', 'STUDENT_COORDINATOR'] },
      schoolId: coordinator.schoolId,
    };

    if (search) {
      where.AND = [
        { role: { in: ['STUDENT', 'STUDENT_COORDINATOR'] } },
        { schoolId: coordinator.schoolId },
        {
          OR: [
            { firstName: { contains: search as string, mode: 'insensitive' } },
            { lastName: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
          ],
        },
      ];
      delete where.role;
      delete where.schoolId;
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          schoolId: true,
          isActive: true,
          createdAt: true,
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Get volunteer log stats for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const [totalHours, pendingLogs, approvedLogs] = await Promise.all([
          prisma.volunteerLog.aggregate({
            where: { userId: student.id, status: 'approved' },
            _sum: { hours: true },
          }),
          prisma.volunteerLog.count({
            where: { userId: student.id, status: 'pending' },
          }),
          prisma.volunteerLog.count({
            where: { userId: student.id, status: 'approved' },
          }),
        ]);

        return {
          ...student,
          totalHours: totalHours._sum.hours || 0,
          pendingLogs,
          approvedLogs,
        };
      })
    );

    res.json({
      success: true,
      message: 'Students list retrieved successfully',
      data: studentsWithStats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get students list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students list',
    });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Get top volunteers by approved hours in the period
    const topVolunteers = await prisma.volunteerLog.groupBy({
      by: ['userId'],
      where: {
        status: 'approved',
        date: {
          gte: startDate,
        },
      },
      _sum: {
        hours: true,
      },
      orderBy: {
        _sum: {
          hours: 'desc',
        },
      },
      take: 20,
    });

    // Get user details and badge counts for top volunteers
    const userIds = topVolunteers.map((v) => v.userId);
    
    const [users, badgeCounts] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          schoolId: true,
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      Promise.all(
        userIds.map((userId) =>
          prisma.userBadge.count({
            where: { userId },
          })
        )
      ),
    ]);

    // Combine data
    const leaderboard = topVolunteers.map((volunteer, index) => {
      const user = users.find((u) => u.id === volunteer.userId);
      const badgesEarned = badgeCounts[index] || 0;

      return {
        rank: index + 1,
        id: volunteer.userId,
        name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        email: user?.email || '',
        school: user?.school?.name || 'Unknown School',
        hours: volunteer._sum.hours || 0,
        badgesEarned,
      };
    });

    res.json({
      success: true,
      message: 'Leaderboard retrieved successfully',
      data: leaderboard,
      meta: {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard',
    });
  }
};