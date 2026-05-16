import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { usersApi } from '../api/users.api';
import { useAuthStore } from '../store/auth.store';

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Requests notification permissions and registers the Expo push token with the
 * server. Safe to call multiple times — skips registration if the token has
 * already been sent this session.
 */
export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const registered = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || registered.current) return;

    async function register() {
      try {
        // Android requires a notification channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#3a6e57',
          });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          // User denied — nothing to register
          return;
        }

        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId as string | undefined;

        if (!projectId) {
          console.warn('[PushNotifications] No EAS projectId found in app config');
          return;
        }

        const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({ projectId });

        await usersApi.registerPushToken(expoPushToken);
        registered.current = true;
      } catch (error) {
        console.warn('[PushNotifications] Registration failed:', error);
      }
    }

    void register();
  }, [isAuthenticated]);
}
