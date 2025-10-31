/**
 * @fileoverview Root application navigator for Stone Dragon app.
 * Handles authentication flow and role-based navigation routing.
 * 
 * @module navigation/AppNavigator
 * @requires react
 * @requires @react-navigation/stack
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { useAuth } from '../store/AuthContext';
import { RootStackParamList } from '../types';

// Import auth screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Import navigators
import StudentNavigator from './StudentNavigator';
import CoordinatorNavigator from './CoordinatorNavigator';

// Import additional screens
import SchoolsScreen from '../screens/main/SchoolsScreen';
import MyLogsScreen from '../screens/main/MyLogsScreen';
import LeaderboardScreen from '../screens/coordinator/LeaderboardScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import CoordinatorNotificationsScreen from '../screens/coordinator/NotificationsScreen';
import StudentCoordinatorClaimsScreen from '../screens/studentCoordinator/StudentCoordinatorClaimsScreen';
import ProofPreviewScreen from '../screens/common/ProofPreviewScreen';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Authentication stack navigator.
 * Contains screens for unauthenticated users: Welcome, Login, Register.
 * 
 * @component
 * @returns {JSX.Element} Authentication stack with Welcome, Login, and Register screens
 */
const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main stack navigator for authenticated users.
 * Routes to appropriate tab navigator based on user role and includes shared screens.
 * 
 * @component
 * @returns {JSX.Element} Main stack with role-based navigation and shared screens
 * 
 * @description
 * Determines which navigator to use based on user role:
 * - COORDINATOR and ADMIN → CoordinatorNavigator
 * - STUDENT and STUDENT_COORDINATOR → StudentNavigator
 * 
 * Also includes shared screens accessible from both roles:
 * - Schools, MyLogs, Leaderboard, Notifications, StudentCoordinatorClaims
 */
const MainStackNavigator: React.FC = () => {
  const { user } = useAuth();
  
  // Determine which navigator to use based on user role
  // COORDINATOR and ADMIN get the coordinator view
  // STUDENT and STUDENT_COORDINATOR get the student view
  const isCoordinator = user?.role === 'COORDINATOR' || user?.role === 'ADMIN';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main tab navigation based on role */}
      <Stack.Screen 
        name="Main" 
        component={isCoordinator ? CoordinatorNavigator : StudentNavigator}
      />
      
      {/* Shared screens */}
      <Stack.Screen 
        name="Schools" 
        component={SchoolsScreen}
        options={{ 
          headerShown: true, 
          title: 'Schools',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="MyLogs" 
        component={MyLogsScreen}
        options={{ 
          headerShown: true, 
          title: 'My Logs',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ 
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={isCoordinator ? CoordinatorNotificationsScreen : NotificationsScreen}
        options={{ 
          headerShown: true, 
          title: 'Notifications',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="StudentCoordinatorClaims" 
        component={StudentCoordinatorClaimsScreen}
        options={{ 
          headerShown: true, 
          title: 'Event Claims',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="ProofPreview" 
        component={ProofPreviewScreen}
        options={{ 
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Root application navigator.
 * Handles top-level routing between authentication and main app flows.
 * 
 * @component
 * @returns {JSX.Element | null} Root navigator or null during loading
 * 
 * @description
 * Checks authentication status and routes accordingly:
 * - If authenticated → MainStackNavigator
 * - If not authenticated → AuthStackNavigator
 * - During auth check → Returns null (loading state)
 */
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('AppNavigator - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);

  if (isLoading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainStackNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

/* End of file navigation/AppNavigator.tsx */
