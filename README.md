# Stone Dragon Volunteerism App
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Navigation](https://img.shields.io/badge/React_Navigation-6B3FA0?logo=react&logoColor=white)](https://reactnavigation.org/)
[![React Native Paper](https://img.shields.io/badge/React_Native_Paper-6200EE?logo=material-design&logoColor=white)](https://reactnativepaper.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)
[![Context API](https://img.shields.io/badge/Context_API-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![NativeWind](https://img.shields.io/badge/NativeWind-38BDF8?logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Multer](https://img.shields.io/badge/Multer-FF6600?logo=files&logoColor=white)](https://github.com/expressjs/multer)
[![Express Validator](https://img.shields.io/badge/Express_Validator-000000?logo=express&logoColor=white)](https://express-validator.github.io/)
[![Helmet](https://img.shields.io/badge/Helmet-00599C?logo=helmet&logoColor=white)](https://helmetjs.github.io/)
[![CORS](https://img.shields.io/badge/CORS-E34F26?logo=html5&logoColor=white)](https://github.com/expressjs/cors)

<div align ="center">
<img width="320" height="157" alt="images" src="https://github.com/user-attachments/assets/02aa689a-9f9b-40cd-bbe9-76b2be0ba761" />

A comprehensive mobile application for tracking and managing volunteer hours.
</div>

---

## Overview

Stone Dragon is a volunteer hours tracking platform designed for schools to get involved in volunteerism. The app features:

- **User Authentication** - Secure login/registration with role-based access control
- **Volunteer Hour Logging** - Easy submission of volunteer activities with proof uploads
- **Coordinator Dashboard** - Review and approve/reject volunteer submissions
- **Gamification System** - Achievement badges based on volunteer hours, and live leaderboards
- **School Management** - Multi-school support with statistics tracking
- **Cross-Platform** - Works on iOS and Android

---

## User Roles

- **Students** - Log volunteer hours, upload proof, earn badges
- **Student Coordinators** - Log volunteer hours, upload proof, earn badges, review submissions, approve/reject logd
- **Coordinators** - Review submissions, approve/reject logs, view school statistics
- **Admins** - Full system access and user management

---

## Tech Stack

### Frontend
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![React Navigation](https://img.shields.io/badge/React_Navigation-6B3FA0?style=for-the-badge&logo=react&logoColor=white)](https://reactnavigation.org/)

[![React Native Paper](https://img.shields.io/badge/React_Native_Paper-6200EE?style=for-the-badge&logo=material-design&logoColor=white)](https://reactnativepaper.com/)

[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

[![Context API](https://img.shields.io/badge/Context_API-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

[![NativeWind](https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

[![Multer](https://img.shields.io/badge/Multer-FF6600?style=for-the-badge&logo=files&logoColor=white)](https://github.com/expressjs/multer)

[![Express Validator](https://img.shields.io/badge/Express_Validator-000000?style=for-the-badge&logo=express&logoColor=white)](https://express-validator.github.io/)

[![Helmet](https://img.shields.io/badge/Helmet-00599C?style=for-the-badge&logo=helmet&logoColor=white)](https://helmetjs.github.io/)

[![CORS](https://img.shields.io/badge/CORS-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://github.com/expressjs/cors)

---

## Project Structure

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

---

## Setup

### Prerequisites

- **Git**
- **Expo Go on android or iPhone device**

   **Or**
- **Android Studio** (for Emulator)

### Installation

1. **Clone the repository and setup**
   ```bash
   git clone https://github.com/CalebVoskuil/Dragon-stone-master.git
   cd stone-dragon-app
   ```
   ```bash
   npm install
   ```
   ```bash
   ipconfig
   ```
   #### Copy the IPv4 Address
   IPv4 Address. . . . . . . . . . . : {Address here}

   #### Paste here
   frontend -> src -> components -> admin -> ClaimDetailsModal.tsx
   
   const proofUrl = `http://{Paste here}:3001/uploads/${claim.proofFileName}`;

   frontend -> src -> services -> api.ts: baseURl
   
   baseURL: 'http://{Paste here}:3001/api'

3. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```
   
   ```bash
   node setup.js
   ```
   
   ```bash
   npm run dev
   ```
   
   Backend will run on `http://localhost:3001`

4. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   
   ```bash
   npx expo start
   ```

5. **Run the App**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   
      **Or**
   - Scan QR code with Expo Go app on your phone
   
---

## Testing

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

---

## Building for Production

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
---

## Security Features

- Password hashing with bcryptjs
- Session-based authentication with secure cookies
- Role-based access control (RBAC)
- Request rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- File upload restrictions
- SQL injection prevention (Prisma ORM)

---

## Gamification

The app includes a badge and leaderboard system to encourage volunteer participation:

- **Starter** - First volunteer log
- **Bronze** - 10+ hours
- **Silver** - 25+ hours
- **Gold** - 50+ hours
- **Platinum** - 100+ hours
- **Consistent Volunteer** - Log hours regularly

Badges are automatically awarded as users reach hour milestones.

---

## Troubleshooting

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

---

## Contribution

<a href="https://github.com/CalebVoskuil/Dragon-stone-master/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=CalebVoskuil/Dragon-stone-master" />
</a>

---

## License

This project is part of the Stone Dragon Student Work Integrated Learning program.

---

## References

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---
