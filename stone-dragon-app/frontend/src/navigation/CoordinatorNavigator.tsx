import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, Users, Calendar, User } from 'lucide-react-native';

// Import coordinator screens
import CoordinatorDashboardScreen from '../screens/coordinator/CoordinatorDashboardScreen';
import ClaimsScreen from '../screens/coordinator/ClaimsScreen';
import StudentsListScreen from '../screens/coordinator/StudentsListScreen';
import EventsScreen from '../screens/coordinator/EventsScreen';
import ProfileScreen from '../screens/coordinator/ProfileScreen';

// Import custom tab bar
import CustomTabBar from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();

/**
 * CoordinatorNavigator - Coordinator-specific bottom tab navigation
 * Includes Dashboard, Claims, Students, Leaderboard, Settings
 */
export default function CoordinatorNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        unmountOnBlur: false,
      }}
    >
      <Tab.Screen
        name="CoordinatorDashboard"
        component={CoordinatorDashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Claims"
        component={ClaimsScreen}
        options={{
          title: 'Claims',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsListScreen}
        options={{
          title: 'Students',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CoordinatorEvents"
        component={EventsScreen}
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CoordinatorProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

