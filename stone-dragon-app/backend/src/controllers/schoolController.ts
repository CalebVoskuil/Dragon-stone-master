/**
 *
 */

/**
 *
 */
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSchools = async (_req: Request, res: Response): Promise<void> => {
  try {
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        contactPhone: true,
        contactEmail: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: schools,
    });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schools',
    });
  }
};

export const getSchoolById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'School ID is required',
      });
      return;
    }

    const school = await prisma.school.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        name: true,
        address: true,
        contactPhone: true,
        contactEmail: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            users: true,
            volunteerLogs: true,
          },
        },
      },
    });

    if (!school) {
      res.status(404).json({
        success: false,
        message: 'School not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'School retrieved successfully',
      data: school,
    });
  } catch (error) {
    console.error('Get school by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve school',
    });
  }
};

export const createSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, contactPhone, contactEmail } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'School name is required',
      });
      return;
    }

    const school = await prisma.school.create({
      data: {
        name: name as string,
        address: address as string,
        contactPhone: contactPhone as string,
        contactEmail: contactEmail as string,
      },
      select: {
        id: true,
        name: true,
        address: true,
        contactPhone: true,
        contactEmail: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school,
    });
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create school',
    });
  }
};

export const updateSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, contactPhone, contactEmail } = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'School ID is required',
      });
      return;
    }

    const school = await prisma.school.update({
      where: { id: id as string },
      data: {
        name: name as string,
        address: address as string,
        contactPhone: contactPhone as string,
        contactEmail: contactEmail as string,
      },
      select: {
        id: true,
        name: true,
        address: true,
        contactPhone: true,
        contactEmail: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: school,
    });
  } catch (error) {
    console.error('Update school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update school',
    });
  }
};

export const deleteSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'School ID is required',
      });
      return;
    }

    await prisma.school.delete({
      where: { id: id as string },
    });

    res.status(200).json({
      success: true,
      message: 'School deleted successfully',
    });
  } catch (error) {
    console.error('Delete school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete school',
    });
  }
};
//----------------------------------------------------0_______________END OF FILE_______________0----------------------------------------------------//