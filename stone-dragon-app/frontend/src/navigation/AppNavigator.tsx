import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../store/AuthContext';
import { RootStackParamList, MainTabParamList } from '../types';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import LogHoursScreen from '../screens/main/LogHoursScreen';
import MyLogsScreen from '../screens/main/MyLogsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CoordinatorDashboardScreen from '../screens/coordinator/CoordinatorDashboardScreen';
import SchoolsScreen from '../screens/main/SchoolsScreen';
import BadgesScreen from '../screens/main/BadgesScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator
const MainTabNavigator: React.FC = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LogHours') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'MyLogs') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'CoordinatorDashboard') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="LogHours" 
        component={LogHoursScreen}
        options={{ title: 'Log Hours' }}
      />
      <Tab.Screen 
        name="MyLogs" 
        component={MyLogsScreen}
        options={{ title: 'My Logs' }}
      />
      {(user?.role === 'COORDINATOR' || user?.role === 'ADMIN') && (
        <Tab.Screen 
          name="CoordinatorDashboard" 
          component={CoordinatorDashboardScreen}
          options={{ title: 'Coordinator' }}
        />
      )}
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Stack Navigator
const MainStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
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
        name="Badges" 
        component={BadgesScreen}
        options={{ 
          headerShown: true, 
          title: 'Badges',
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
