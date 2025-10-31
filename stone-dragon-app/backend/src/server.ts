/**
 * @fileoverview Main server file for Stone Dragon Volunteer Hours API.
 * Configures Express application with middleware, security, and routes.
 * 
 * @module server
 * @requires express
 * @requires cors
 * @requires helmet
 * @requires compression
 * @requires morgan
 * @requires express-rate-limit
 * @requires express-session
 * @requires dotenv
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { MemoryStore } from 'express-session';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import volunteerLogRoutes from './routes/volunteerLogs';
import coordinatorRoutes from './routes/coordinator';
import badgeRoutes from './routes/badges';
import schoolRoutes from './routes/schools';
import docsRoutes from './routes/docs';
import eventRoutes from './routes/events';
import studentCoordinatorRoutes from './routes/studentCoordinator';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Express application instance
 */
const app = express();

/**
 * Server port from environment variable or default 3001
 * @constant
 * @type {number}
 */
const PORT = process.env['PORT'] || 3001;

/**
 * Security middleware
 * - Helmet: Sets various HTTP headers for security
 * - Compression: Compresses response bodies
 */
app.use(helmet());
app.use(compression());

/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * Allows frontend to communicate with the API from different origins
 */
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Rate limiting configuration
 * Prevents abuse by limiting requests per IP address
 * 
 * @constant
 * @type {RateLimitRequestHandler}
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

/**
 * HTTP request logging with Morgan
 * Uses 'dev' format in development, 'combined' in production
 */
if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * Session store using in-memory storage
 * @constant
 * @type {MemoryStore}
 * @note In production, use a persistent store like Redis
 */
const sessionStore = new MemoryStore();

/**
 * Session configuration for user authentication
 * Uses cookies to maintain user sessions
 */
app.use(session({
  store: sessionStore,
  secret: process.env['SESSION_SECRET'] || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for development (HTTP)
    httpOnly: true, // Prevent JavaScript access
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
}));

/**
 * Body parsing middleware
 * Parses JSON and URL-encoded request bodies
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Static file serving for uploaded proof documents
 * Makes files in the uploads directory publicly accessible
 */
// S3 will serve proofs via signed URLs; local static uploads no longer used

/**
 * Health check endpoint
 * Returns server status, uptime, and environment information
 * 
 * @route GET /health
 * @returns {Object} Health status information
 */
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'],
    version: process.env['APP_VERSION'] || '1.0.0',
  });
});

/**
 * API route registration
 * All application routes are mounted under /api
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/volunteer-logs', volunteerLogRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/student-coordinator', studentCoordinatorRoutes);

/**
 * API documentation endpoint
 * Returns list of available API endpoints
 * 
 * @route GET /api
 * @returns {Object} API information and endpoint list
 */
app.get('/api', (_req, res) => {
  res.json({
    message: 'Stone Dragon Volunteer Hours API',
    version: process.env['APP_VERSION'] || '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      volunteerLogs: '/api/volunteer-logs',
      coordinator: '/api/coordinator',
      studentCoordinator: '/api/student-coordinator',
      events: '/api/events',
      badges: '/api/badges',
      schools: '/api/schools',
      docs: '/api/docs',
    },
    documentation: '/api/docs',
  });
});

/**
 * Error handling middleware
 * Must be registered last to catch all errors
 * - notFoundHandler: Handles 404 errors for undefined routes
 * - errorHandler: Global error handler for all other errors
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start the Express server
 * Listens on the configured PORT and logs startup information
 */
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env['NODE_ENV']}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API docs: http://localhost:${PORT}/api`);
});

/**
 * Export the Express app for testing purposes
 */
export default app;

/* End of file server.ts */
