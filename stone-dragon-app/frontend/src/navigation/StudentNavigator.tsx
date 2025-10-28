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
 * StudentNavigator - Student-specific bottom tab navigation
 * Includes Dashboard, LogHours, Badges, Events, Profile
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

