import { Platform } from 'react-native';

/**
 * DocNest Push Notifications Service
 * Integrates with Expo Notifications / Firebase Cloud Messaging (FCM)
 * Provides local alerts when patient's token is approaching in queue.
 */

export interface QueueNotificationPayload {
  doctorName: string;
  currentToken: number;
  userToken: number;
  estimatedWaitMins: number;
}

/**
 * Register push notifications token for logged in user.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    // In Expo / standalone build, Expo Notifications will return a device push token.
    console.log('Registering push notifications token...');
    const fakePushToken = 'ExponentPushToken[docnest_deoria_demo_token]';
    return fakePushToken;
  } catch (error) {
    console.warn('Failed to get push token:', error);
    return null;
  }
}

/**
 * Trigger local alert when patient's turn is coming up (e.g. 3 tokens away).
 */
export function checkQueueTokenAlert(payload: QueueNotificationPayload): {
  showAlert: boolean;
  message: string;
} {
  const tokensRemaining = payload.userToken - payload.currentToken;

  if (tokensRemaining === 3) {
    return {
      showAlert: true,
      message: `🚨 ध्यान दें! ${payload.doctorName} के क्लिनिक में आपकी बारी आने वाली है (केवल 3 मरीज आगे हैं)। कृपया क्लिनिक पहुंचे!`,
    };
  } else if (tokensRemaining === 1) {
    return {
      showAlert: true,
      message: `⚡ तुरंत पहुंचे! आपका टोकन #${payload.userToken} अगला है!`,
    };
  } else if (tokensRemaining === 0) {
    return {
      showAlert: true,
      message: `🩺 डॉक्टर साहब आपको बुला रहे हैं (टोकन #${payload.userToken})!`,
    };
  }

  return { showAlert: false, message: '' };
}
