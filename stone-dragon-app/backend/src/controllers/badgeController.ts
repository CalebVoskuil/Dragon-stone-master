import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBadges = async (_req: Request, res: Response): Promise<void> => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { requiredHours: 'asc' },
    });

    res.json({
      success: true,
      message: 'Badges retrieved successfully',
      data: badges,
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve badges',
    });
  }
};

export const getUserBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    // Get user's total approved hours
    const totalHours = await prisma.volunteerLog.aggregate({
      where: {
        userId: userId as string,
        status: 'approved',
      },
      _sum: { hours: true },
    });

    const userTotalHours = totalHours._sum.hours || 0;

    // Get all badges
    const badges = await prisma.badge.findMany({
      orderBy: { requiredHours: 'asc' },
    });

    // Calculate which badges the user has earned
    const userBadges = badges.map((badge: any) => ({
      ...badge,
      isEarned: userTotalHours >= badge.requiredHours,
      earnedAt: userTotalHours >= badge.requiredHours ? new Date() : null,
    }));

    res.json({
      success: true,
      message: 'User badges retrieved successfully',
      data: {
        badges: userBadges,
        totalHours: userTotalHours,
      },
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user badges',
    });
  }
};

export const getBadgeProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    // Get user's total approved hours
    const totalHours = await prisma.volunteerLog.aggregate({
      where: {
        userId: userId as string,
        status: 'approved',
      },
      _sum: { hours: true },
    });

    const userTotalHours = totalHours._sum.hours || 0;

    // Get all badges
    const badges = await prisma.badge.findMany({
      orderBy: { requiredHours: 'asc' },
    });

    // Calculate progress for each badge
    const badgeProgress = badges.map((badge: any) => {
      const isEarned = userTotalHours >= badge.requiredHours;
      const progress = Math.min((userTotalHours / badge.requiredHours) * 100, 100);
      
      return {
        badgeId: badge.id,
        badgeName: badge.name,
        badgeDescription: badge.description,
        requiredHours: badge.requiredHours,
        currentHours: userTotalHours,
        progress: Math.round(progress),
        isEarned,
        hoursRemaining: isEarned ? 0 : badge.requiredHours - userTotalHours,
      };
    });

    res.json({
      success: true,
      message: 'Badge progress retrieved successfully',
      data: {
        totalHours: userTotalHours,
        badgeProgress,
      },
    });
  } catch (error) {
    console.error('Get badge progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve badge progress',
    });
  }
};
