/**
 * @fileoverview Student-specific bottom tab navigator.
 * Provides navigation for student users.
 * 
 * @module navigation/StudentNavigator
 * @requires react
 * @requires @react-navigation/bottom-tabs
 * @requires lucide-react-native
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Clock, Award, Calendar, User } from 'lucide-react-native';

// Import screens
import DashboardScreen from '../screens/main/DashboardScreen';
import LogHoursScreen from '../screens/main/LogHoursScreen';
import BadgesScreen from '../screens/main/BadgesScreen';
import EventsScreen from '../screens/main/EventsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Import custom tab bar
import CustomTabBar from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();

/**
 * Student-specific bottom tab navigation component.
 * Provides navigation for student users.
 * 
 * @component
 * @returns {JSX.Element} Bottom tab navigator with student screens
 * 
 * @description
 * Tab structure:
 * - Home (Dashboard): Overview of hours, badges, and activity
 * - Log: Log volunteer hours with proof upload
 * - Badges: View earned and available badges
 * - Events: Browse and join volunteer events
 * - Profile: User profile and settings
 */
export default function StudentNavigator() {
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
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="LogHours"
        component={LogHoursScreen}
        options={{
          title: 'Log',
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Badges"
        component={BadgesScreen}
        options={{
          title: 'Badges',
          tabBarIcon: ({ color, size }) => <Award color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="StudentEvents"
        component={EventsScreen}
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="StudentProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

/* End of file navigation/StudentNavigator.tsx */
