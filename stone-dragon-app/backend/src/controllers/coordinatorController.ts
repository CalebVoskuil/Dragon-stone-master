/**
 * Coordinator Controller
 * Handles coordinator-specific operations including managing volunteer logs, students, and school statistics.
 */



import { Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { buildMessage, sendPushNotifications } from '../services/push';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

export const getPendingLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userRole = req.user?.role;
    const userSchoolId = req.user?.schoolId;

    const where: Prisma.VolunteerLogWhereInput = {
      status: 'pending',
    };

    // COORDINATORS can only see logs from their school
    if (userRole === 'COORDINATOR') {
      if (!userSchoolId) {
        res.status(403).json({
          success: false,
          message: 'Coordinator must be associated with a school',
        });
        return;
      }
      where.schoolId = userSchoolId;
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

export const reviewVolunteerLog = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { logId } = req.params;
    const { status, coordinatorComment } = req.body;
    const coordinatorId = req.user?.id;
    const userRole = req.user?.role;
    const userSchoolId = req.user?.schoolId;

    if (!logId) {
      res.status(400).json({
        success: false,
        message: 'Log ID is required',
      });
      return;
    }

    // COORDINATORS can only review logs from their school
    if (userRole === 'COORDINATOR') {
      // First, check if the log belongs to the coordinator's school
      const existingLog = await prisma.volunteerLog.findUnique({
        where: { id: logId },
        select: { schoolId: true },
      });

      if (!existingLog) {
        res.status(404).json({
          success: false,
          message: 'Volunteer log not found',
        });
        return;
      }

      if (existingLog.schoolId !== userSchoolId) {
        res.status(403).json({
          success: false,
          message: 'You can only review logs from your school',
        });
        return;
      }
    }

    const volunteerLog = await prisma.volunteerLog.update({
      where: { id: logId },
      data: {
        status,
        coordinatorComment,
        reviewedAt: new Date(),
        reviewedBy: coordinatorId ?? null,
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

    // Notify student about decision
    try {
      const student = await prisma.user.findUnique({ where: { id: volunteerLog.userId }, select: { pushToken: true, firstName: true } });
      if (student && student.pushToken) {
        const title = status === 'approved' ? 'Claim approved' : 'Claim rejected';
        const body = status === 'approved' ? 'Your volunteer claim was approved.' : 'Your volunteer claim was rejected.';
        await sendPushNotifications([buildMessage(student.pushToken as string, title, body, { logId: volunteerLog.id, status })]);
      }
    } catch (e) {
      console.error('Push notify student error:', e);
    }

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

export const getCoordinatorDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userSchoolId = req.user?.schoolId;

    // Calculate date ranges for statistics
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Build where clause - coordinators only see their school
    const whereClause: Prisma.VolunteerLogWhereInput = {};
    if (userRole === 'COORDINATOR') {
      if (!userSchoolId) {
        res.status(403).json({
          success: false,
          message: 'Coordinator must be associated with a school',
        });
        return;
      }
      whereClause.schoolId = userSchoolId;
    }

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
      prisma.volunteerLog.count({ where: whereClause }),
      prisma.volunteerLog.count({ where: { ...whereClause, status: 'pending' } }),
      prisma.volunteerLog.count({ where: { ...whereClause, status: 'approved' } }),
      prisma.volunteerLog.count({ where: { ...whereClause, status: 'rejected' } }),
      prisma.volunteerLog.aggregate({
        where: { ...whereClause, status: 'approved' },
        _sum: { hours: true },
      }),
      prisma.volunteerLog.count({ 
        where: { 
          ...whereClause,
          createdAt: { gte: todayStart } 
        } 
      }),
      prisma.volunteerLog.count({ 
        where: { 
          ...whereClause,
          status: 'approved',
          createdAt: { gte: lastWeek }
        } 
      }),
      // Count unique students who have submitted at least one log (excluding event claims with student coordinators)
      prisma.volunteerLog.findMany({
        distinct: ['userId'],
        where: {
          ...whereClause,
          OR: [
            { claimType: { not: 'event' } },
            { claimType: 'event', eventId: null },
          ],
        },
        select: { userId: true },
      }).then(result => result.length),
      // Get recent logs based on user role
      // Admins see recently reviewed logs (approved/rejected)
      // Coordinators see pending logs
      prisma.volunteerLog.findMany({
        where: {
          ...whereClause,
          ...(userRole === 'ADMIN' 
            ? { status: { in: ['approved', 'rejected'] } }  // Admins see reviewed claims
            : { status: 'pending' }                          // Coordinators see pending claims
          ),
        },
        take: 5,
        orderBy: userRole === 'ADMIN' 
          ? { updatedAt: 'desc' }  // Sort by review time for admins
          : { createdAt: 'desc' }, // Sort by submission time for coordinators
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
      userRole, // Include user role so frontend can adjust UI
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

export const getSchoolStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
    const topVolunteerIds = topVolunteers.map((v) => v.userId);
    const topVolunteerDetails = await prisma.user.findMany({
      where: { id: { in: topVolunteerIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    const topVolunteersWithDetails = topVolunteers.map((volunteer) => {
      const userDetails = topVolunteerDetails.find((u) => u.id === volunteer.userId);
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

export const getStudentsList = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search, schoolId } = req.query;
    const userRole = req.user?.role;
    const userSchoolId = req.user?.schoolId;

    const skip = (Number(page) - 1) * Number(limit);
    
    // Build where clause - filter by coordinator's school and role
    const where: Prisma.UserWhereInput = {
      role: 'STUDENT',
    };

    // COORDINATORS can only see students from their school
    if (userRole === 'COORDINATOR') {
      if (!userSchoolId) {
        res.status(403).json({
          success: false,
          message: 'Coordinator must be associated with a school',
        });
        return;
      }
      where.schoolId = userSchoolId;
    }

    // ADMINS can see all students, but can optionally filter by school
    if (userRole === 'ADMIN' && schoolId) {
      where.schoolId = schoolId as string;
    }

    if (search) {
      if (userRole === 'COORDINATOR') {
        where.AND = [
          { schoolId: userSchoolId ?? null },
          {
            OR: [
              { firstName: { contains: search as string, mode: 'insensitive' } },
              { lastName: { contains: search as string, mode: 'insensitive' } },
              { email: { contains: search as string, mode: 'insensitive' } },
            ],
          },
        ];
      } else {
        where.AND = [
          {
            OR: [
              { firstName: { contains: search as string, mode: 'insensitive' } },
              { lastName: { contains: search as string, mode: 'insensitive' } },
              { email: { contains: search as string, mode: 'insensitive' } },
            ],
          },
        ];
      }
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

export const getLeaderboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { period = 'month' } = req.query;
    const userRole = req.user?.role;
    const userSchoolId = req.user?.schoolId;

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

    // Build where clause - coordinators only see their school
    const whereClause: Prisma.VolunteerLogWhereInput = {
      status: 'approved',
      date: {
        gte: startDate,
      },
    };

    if (userRole === 'COORDINATOR') {
      if (!userSchoolId) {
        res.status(403).json({
          success: false,
          message: 'Coordinator must be associated with a school',
        });
        return;
      }
      whereClause.schoolId = userSchoolId;
    }

    // Get top volunteers by approved hours in the period
    const topVolunteers = await prisma.volunteerLog.groupBy({
      by: ['userId'],
      where: whereClause,
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
//----------------------------------------------------0_______________END OF FILE_______________0----------------------------------------------------//