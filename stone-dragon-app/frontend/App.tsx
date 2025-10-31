import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './src/store/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme/theme';
import { registerForPushNotificationsAsync } from './src/services/notifications';

export default function App() {
  useEffect(() => {
    // Request push permissions on app start (even before login)
    console.log('App: Requesting push notification permissions on startup...');
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          console.log('App: Push notification token received on startup');
        } else {
          console.log('App: No push notification token (permission denied or not available)');
        }
      })
      .catch((error) => {
        console.error('App: Error requesting push notifications:', error);
      });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <NavigationContainer>
              <AppNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
