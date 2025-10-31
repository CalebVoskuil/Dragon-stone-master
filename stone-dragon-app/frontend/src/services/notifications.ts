import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    const isDevice = Constants.isDevice;
    if (!isDevice) {
      console.warn('Push notifications: Running on simulator/emulator. Permission dialog may not appear.');
    }

    // Configure notification behavior
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Check current permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Push notifications: Current permission status:', existingStatus);
    
    let finalStatus = existingStatus;
    
    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      console.log('Push notifications: Requesting permissions...');
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });
      finalStatus = status;
      console.log('Push notifications: Permission request result:', status);
    } else {
      console.log('Push notifications: Permissions already granted');
    }

    if (finalStatus !== 'granted') {
      if (!isDevice) {
        console.warn('Push notifications: Permission denied. Note: Simulators/emulators may not show permission dialogs. Test on a physical device for full functionality.');
      } else {
        console.warn('Push notifications: Permission denied by user');
      }
      return null;
    }

    // Get push token (may fail on simulator)
    try {
      console.log('Push notifications: Getting Expo push token...');
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      console.log('Push notifications: Token received:', tokenData.data?.substring(0, 20) + '...');
      return tokenData.data;
    } catch (tokenError) {
      if (!isDevice) {
        console.warn('Push notifications: Cannot get push token on simulator/emulator. Use a physical device to test push notifications.');
      } else {
        console.error('Push notifications: Failed to get push token:', tokenError);
      }
      return null;
    }
  } catch (error) {
    console.error('Push notifications: Registration error:', error);
    return null;
  }
}


