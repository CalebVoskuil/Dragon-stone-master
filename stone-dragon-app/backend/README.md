# Stone Dragon Backend API

Backend API for the Stone Dragon Volunteer Hours App built with Node.js, Express, TypeScript, and Prisma.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Management**: Support for Students, Volunteers, and Coordinators
- **Volunteer Logs**: Create, read, update volunteer hour logs with proof uploads
- **Coordinator Dashboard**: Review and approve/reject volunteer submissions
- **Gamification**: Badge system based on volunteer hours
- **File Uploads**: Secure file upload for proof documents
- **Data Validation**: Request validation using express-validator
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Helmet, CORS, rate limiting, and input sanitization

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcryptjs
- **Testing**: Jest, Supertest

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Volunteer Logs
- `POST /api/volunteer-logs` - Create volunteer log
- `GET /api/volunteer-logs` - Get volunteer logs (with pagination)
- `GET /api/volunteer-logs/:id` - Get volunteer log by ID
- `PUT /api/volunteer-logs/:id` - Update volunteer log
- `DELETE /api/volunteer-logs/:id` - Delete volunteer log

### Coordinator
- `GET /api/coordinator/dashboard` - Get coordinator dashboard
- `GET /api/coordinator/pending-logs` - Get pending logs for review
- `GET /api/coordinator/school-stats` - Get school statistics
- `PUT /api/coordinator/review/:logId` - Review volunteer log

### Badges
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/:userId` - Get user's badges
- `GET /api/badges/progress/:userId` - Get user's badge progress

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN="http://localhost:19006"
```

## Development

### Prerequisites
- Node.js 18+
- npm 8+

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The database uses Prisma ORM with SQLite. Key models include:

- **User**: Students, volunteers, and coordinators
- **School**: Affiliated schools
- **VolunteerLog**: Volunteer hour submissions
- **Badge**: Gamification badges
- **UserBadge**: User badge achievements

## Security Features

- JWT authentication with role-based access control
- Password hashing with bcrypt
- Request rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- File upload restrictions

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Documentation

Once the server is running, visit:
- Health check: `http://localhost:3001/health`
- API overview: `http://localhost:3001/api`
- Prisma Studio: `http://localhost:5555` (run `npm run db:studio`)
