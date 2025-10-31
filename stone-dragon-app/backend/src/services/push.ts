import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotifications(messages: ExpoPushMessage[]) {
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: any[] = [];
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Push send error:', error);
    }
  }
  return tickets;
}

export function buildMessage(token: string, title: string, body: string, data?: Record<string, any>) {
  return {
    to: token,
    sound: 'default' as const,
    title,
    body,
    data,
  } as ExpoPushMessage;
}


