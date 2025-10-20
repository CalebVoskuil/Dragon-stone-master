# Stone Dragon Volunteer Hours - Frontend

React Native mobile application built with Expo for tracking volunteer hours.

## Features

- **Authentication**: Login/Register with session-based auth
- **Role-based Access**: Students, Volunteers, Coordinators, and Admins
- **Volunteer Logging**: Create and manage volunteer hour entries
- **Badge System**: Gamification with achievement badges
- **Coordinator Tools**: Review and approve volunteer logs
- **Cross-platform**: iOS and Android support

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **React Native Paper** for UI components
- **React Hook Form** for form handling
- **Axios** for API communication
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run ios      # iOS Simulator
   npm run android  # Android Emulator
   npm run web      # Web browser
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── main/          # Main app screens
│   └── coordinator/   # Coordinator-specific screens
├── navigation/         # Navigation configuration
├── services/          # API services
├── store/             # State management (Context)
├── types/             # TypeScript type definitions
├── theme/             # Theme and styling
└── utils/             # Helper functions
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
API_BASE_URL=http://localhost:3001/api
```

### Backend Connection

The app connects to the backend API running on `http://localhost:3001`. Make sure the backend server is running before starting the frontend.

## Development

### Adding New Screens

1. Create screen component in appropriate directory under `src/screens/`
2. Add route to navigation in `src/navigation/AppNavigator.tsx`
3. Update type definitions in `src/types/index.ts`

### Adding New API Endpoints

1. Add method to `src/services/api.ts`
2. Update type definitions if needed
3. Use in components with proper error handling

### Styling

- Use React Native Paper components for consistency
- Follow the theme defined in `src/theme/theme.ts`
- Use the spacing and typography constants

## Testing

Run tests with:
```bash
npm test
```

## Building for Production

### iOS
```bash
npm run build:ios
```

### Android
```bash
npm run build:android
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **iOS build issues**: Make sure Xcode is properly configured
3. **Android build issues**: Check Android Studio and SDK setup
4. **API connection issues**: Verify backend is running and accessible

### Getting Help

- Check Expo documentation: https://docs.expo.dev/
- React Native documentation: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
