import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVolunteerLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hours, description, date, schoolId } = req.body;
    const userId = (req as any).user.id;
    const proofFile = req.file;

    const volunteerLog = await prisma.volunteerLog.create({
      data: {
        hours: parseFloat(hours),
        description: description as string,
        date: new Date(date),
        schoolId: schoolId as string,
        userId: userId as string,
        proofFileName: proofFile?.filename ?? null,
        proofFilePath: proofFile?.path ?? null,
        status: 'pending' as const,
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

    const where: any = {};

    // Students and volunteers can only see their own logs
    if (userRole === 'STUDENT' || userRole === 'VOLUNTEER') {
      where.userId = userId;
    }

    // Coordinators can filter by school
    if (schoolId && (userRole === 'COORDINATOR' || userRole === 'ADMIN')) {
      where.schoolId = schoolId as string;
    }

    // Filter by status
    if (status) {
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

    // Students and volunteers can only see their own logs
    if (userRole === 'STUDENT' || userRole === 'VOLUNTEER') {
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

    // Students and volunteers can only update their own pending logs
    if (userRole === 'STUDENT' || userRole === 'VOLUNTEER') {
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

    // Students and volunteers can only delete their own pending logs
    if (userRole === 'STUDENT' || userRole === 'VOLUNTEER') {
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