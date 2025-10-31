/**
 * Auth Controller
 * Handles user authentication operations including registration, login, logout, and profile retrieval.
 */



import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { RegisterRequest, LoginRequest, UserRole } from '../types';

const prisma = new PrismaClient();

export const register = async (req: RegisterRequest, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role, schoolId } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        ...(schoolId && { schoolId }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        schoolId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Store user in session
    req.session.userId = user.id;
    req.session.userRole = role;
    req.session.userSchoolId = user.schoolId;

    // Format user data with school name
    const { school, ...userData } = user;
    const formattedUser = {
      ...userData,
      school: school?.name ?? null,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: formattedUser },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------//
export const login = async (req: LoginRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with school
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Store user in session
    req.session.userId = user.id;
    req.session.userRole = user.role as UserRole;
    req.session.userSchoolId = user.schoolId;

    // Remove password from response and format user data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, school, ...userWithoutPassword } = user;
    const userData = {
      ...userWithoutPassword,
      school: school?.name ?? null,
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: userData },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------//
export const logout = async (req: Request, res: Response): Promise<void> => {
  // Destroy the session
  req.session.destroy((err?: Error) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Logout failed',
      });
      return;
    }
    res.json({
      success: true,
      message: 'Logout successful',
    });
  });
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------//
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        schoolId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Format user data with school name
    const { school, ...userData } = user;
    const formattedUser = {
      ...userData,
      school: school?.name ?? null,
    };

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: formattedUser,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
    });
  }
};
//----------------------------------------------------0_______________END OF FILE_______________0----------------------------------------------------//