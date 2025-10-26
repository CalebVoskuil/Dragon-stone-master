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
import NotificationsScreen from '../screens/coordinator/NotificationsScreen';
import StudentCoordinatorClaimsScreen from '../screens/studentCoordinator/StudentCoordinatorClaimsScreen';

const Stack = createStackNavigator<RootStackParamList>();

// Auth Stack Navigator
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

// Main Stack Navigator - routes to appropriate tab navigator based on user role
const MainStackNavigator: React.FC = () => {
  const { user } = useAuth();
  
  // Determine which navigator to use based on user role
  // COORDINATOR and ADMIN get the coordinator view
  // STUDENT, VOLUNTEER, and STUDENT_COORDINATOR get the student view
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
        component={NotificationsScreen}
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
    </Stack.Navigator>
  );
};

// Root App Navigator
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

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
