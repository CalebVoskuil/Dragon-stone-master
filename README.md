# 🐉 Stone Dragon Volunteer Hours App

A comprehensive mobile application for tracking and managing volunteer hours with gamification features. Built with React Native (Expo) for the frontend and Node.js/Express for the backend.

## 📱 Overview

Stone Dragon is a volunteer hours tracking platform designed for students, volunteers, and coordinators. The app features:

- **User Authentication** - Secure login/registration with role-based access control
- **Volunteer Hour Logging** - Easy submission of volunteer activities with proof uploads
- **Coordinator Dashboard** - Review and approve/reject volunteer submissions
- **Gamification System** - Achievement badges based on volunteer hours
- **School Management** - Multi-school support with statistics tracking
- **Cross-Platform** - Works on iOS, Android, and Web

## 🎯 User Roles

- **Students/Volunteers** - Log volunteer hours, upload proof, earn badges
- **Coordinators** - Review submissions, approve/reject logs, view school statistics
- **Admins** - Full system access and user management

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **React Native Paper** for UI components
- **Axios** for API communication
- **Context API** for state management
- **NativeWind** for styling

### Backend
- **Node.js** with Express.js
- **TypeScript**
- **Prisma ORM** with SQLite database
- **Session-based Authentication**
- **Multer** for file uploads
- **Express Validator** for input validation
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
stone-dragon-app/
├── frontend/               # React Native mobile app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Screen components
│   │   ├── navigation/    # Navigation configuration
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript definitions
│   └── package.json
│
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript definitions
│   ├── prisma/           # Database schema & migrations
│   └── package.json
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Git**
- **Expo CLI** (install globally: `npm install -g @expo/cli`)
- **iOS Simulator** (macOS only, for iOS development)
- **Android Studio** (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stone-dragon-app
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment file
   cp env.example .env
   
   # Edit .env with your configuration
   
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed database with sample data (optional)
   npm run db:seed
   
   # Start backend server
   npm run dev
   ```
   
   Backend will run on `http://localhost:3001`

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start Expo development server
   npm start
   ```

4. **Run the App**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

## 🔧 Environment Configuration

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT (not currently used, session-based auth)
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

### Frontend

Update API base URL in `frontend/src/services/api.ts` if needed (default: `http://localhost:3001/api`)

## 📚 API Documentation

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile

**Volunteer Logs**
- `POST /api/volunteer-logs` - Create volunteer log
- `GET /api/volunteer-logs` - Get volunteer logs (paginated)
- `GET /api/volunteer-logs/:id` - Get specific log
- `PUT /api/volunteer-logs/:id` - Update volunteer log
- `DELETE /api/volunteer-logs/:id` - Delete volunteer log

**Coordinator**
- `GET /api/coordinator/dashboard` - Dashboard statistics
- `GET /api/coordinator/pending-logs` - Logs pending review
- `GET /api/coordinator/school-stats` - School statistics
- `PUT /api/coordinator/review/:logId` - Review a log

**Badges**
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/:userId` - Get user's earned badges
- `GET /api/badges/progress/:userId` - Get badge progress

For complete API documentation, see `backend/README.md`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch        # Watch mode
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build             # Build TypeScript to JavaScript
npm start                 # Start production server
```

### Frontend

**Android**
```bash
cd frontend
npm run build:android
```

**iOS**
```bash
cd frontend
npm run build:ios
```

## 🔐 Security Features

- Password hashing with bcryptjs
- Session-based authentication with secure cookies
- Role-based access control (RBAC)
- Request rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- File upload restrictions
- SQL injection prevention (Prisma ORM)

## 🎮 Gamification

The app includes a badge system to encourage volunteer participation:

- **Starter** - First volunteer log
- **Bronze** - 10+ hours
- **Silver** - 25+ hours
- **Gold** - 50+ hours
- **Platinum** - 100+ hours
- **Consistent Volunteer** - Log hours regularly

Badges are automatically awarded as users reach hour milestones.

## 🐛 Troubleshooting

### Backend Issues

**Database errors**
```bash
cd backend
npm run db:reset          # Reset database (WARNING: deletes all data)
npm run db:migrate        # Run migrations
```

**Port already in use**
- Change `PORT` in `.env` file
- Or kill the process using port 3001

### Frontend Issues

**Metro bundler cache issues**
```bash
npx expo start --clear    # Clear cache and restart
```

**iOS build issues**
- Ensure Xcode is installed and up to date
- Run `pod install` in the `ios/` folder if it exists

**Android build issues**
- Check Android Studio and SDK setup
- Ensure ANDROID_HOME environment variable is set

**API connection issues**
- Verify backend is running on `http://localhost:3001`
- Check CORS settings in backend `.env`
- For physical device testing, update API URL to your computer's local IP

## 📖 Development Scripts

### Backend
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Start production server
npm test                 # Run tests
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio (database GUI)
```

### Frontend
```bash
npm start                # Start Expo dev server
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
npm run web              # Run in web browser
npm test                 # Run tests
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Run TypeScript type checking
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Stone Dragon Student Work Integrated Learning program.

## 🆘 Support

For issues, questions, or contributions:
- Check existing documentation in `frontend/README.md` and `backend/README.md`
- Review the API documentation
- Check troubleshooting section above
- Create an issue in the repository

## 🎓 Learning Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Built with ❤️ by the Stone Dragon Team
