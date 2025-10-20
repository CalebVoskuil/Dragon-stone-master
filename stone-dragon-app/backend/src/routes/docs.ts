import { Router } from 'express';

const router = Router();

// API Documentation endpoint
router.get('/', (_req, res) => {
  res.json({
    title: 'Stone Dragon Volunteer Hours API',
    version: '1.0.0',
    description: 'API for managing volunteer hours tracking system',
    authentication: 'Session-based authentication',
    baseUrl: '/api',
    endpoints: {
      authentication: {
        'POST /auth/register': 'Register a new user',
        'POST /auth/login': 'Login user',
        'POST /auth/logout': 'Logout user',
        'GET /auth/profile': 'Get user profile (requires auth)',
      },
      users: {
        'GET /users': 'Get all users (requires auth)',
        'GET /users/:id': 'Get user by ID (requires auth)',
        'PUT /users/:id': 'Update user (requires auth)',
        'DELETE /users/:id': 'Delete user (requires auth)',
      },
      volunteerLogs: {
        'POST /volunteer-logs': 'Create volunteer log (requires auth)',
        'GET /volunteer-logs': 'Get volunteer logs (role-based: students see own, coordinators see all)',
        'GET /volunteer-logs/:id': 'Get volunteer log by ID (requires auth)',
        'PUT /volunteer-logs/:id': 'Update volunteer log (requires auth)',
        'DELETE /volunteer-logs/:id': 'Delete volunteer log (requires auth)',
      },
      coordinator: {
        'GET /coordinator/dashboard': 'Get coordinator dashboard (requires coordinator role)',
        'GET /coordinator/pending-logs': 'Get pending volunteer logs (requires coordinator role)',
        'PUT /coordinator/review/:logId': 'Review volunteer log (requires coordinator role)',
        'GET /coordinator/school-stats/:schoolId': 'Get school statistics (requires coordinator role)',
      },
      badges: {
        'GET /badges': 'Get all badges (requires auth)',
        'GET /badges/user/:userId': 'Get user badges (requires auth)',
        'GET /badges/progress/:userId': 'Get badge progress (requires auth)',
      },
      schools: {
        'GET /schools': 'Get all schools (public)',
        'GET /schools/:id': 'Get school by ID (public)',
        'POST /schools': 'Create school (requires admin role) - fields: name, address, contactPhone, contactEmail',
        'PUT /schools/:id': 'Update school (requires admin role) - fields: name, address, contactPhone, contactEmail',
        'DELETE /schools/:id': 'Delete school (requires admin role)',
      },
    },
    requestFormat: {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'session cookie (for authenticated requests)',
      },
      responseFormat: {
        success: {
          success: true,
          message: 'Success message',
          data: 'Response data',
        },
        error: {
          success: false,
          message: 'Error message',
          error: 'Detailed error (development only)',
        },
      },
    },
    userRoles: {
      STUDENT: 'Can create and view their own volunteer logs',
      VOLUNTEER: 'Can create and view their own volunteer logs',
      COORDINATOR: 'Can review and approve volunteer logs',
      ADMIN: 'Full system access including user and school management',
    },
  });
});

export default router;
