import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { MemoryStore } from 'express-session';
import dotenv from 'dotenv';
import path from 'path';

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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Logging
if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Session configuration
const sessionStore = new MemoryStore();
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

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'],
    version: process.env['APP_VERSION'] || '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/volunteer-logs', volunteerLogRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/student-coordinator', studentCoordinatorRoutes);

// API documentation endpoint
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

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env['NODE_ENV']}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API docs: http://localhost:${PORT}/api`);
});

export default app;
