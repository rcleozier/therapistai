import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

// Ensure notification channel exists
const ensureNotificationChannel = async () => {
  try {
    const channel = await Notifications.getNotificationChannelAsync('therapistai-default');
    if (!channel) {
      await Notifications.setNotificationChannelAsync('therapistai-default', {
        name: 'TherapistAI Notifications',
        description: 'Your therapy session awaits',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
        enableLights: true,
        enableSound: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  } catch (error) {
    console.error('Error setting up notification channel:', error);
  }
};

// Handle interactive elements from story nodes
export const handleInteractiveElements = async (interactive, nodeId = null) => {
  if (!interactive) return;

  try {
    // Ensure notification channel exists (Android)
    await ensureNotificationChannel();
    // Handle vibrations
    if (interactive.vibrate) {
      const { pattern, intensity = 'medium' } = interactive.vibrate;
      
      if (pattern === 'short') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (pattern === 'medium') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (pattern === 'long') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (pattern === 'pattern') {
        // Custom pattern - vibrate multiple times
        const times = interactive.vibrate.times || 3;
        for (let i = 0; i < times; i++) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (i < times - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      } else if (pattern === 'error') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (pattern === 'warning') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else if (pattern === 'success') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }

    // Handle notifications
    if (interactive.notification) {
      const { title, body, delay = 0, sound = true } = interactive.notification;
      
      const trigger = delay > 0 
        ? { seconds: delay }
        : null;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title || 'TherapistAI',
          body: body || '',
          data: { type: 'story_interactive', nodeId: nodeId },
          sound: sound,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger,
        android: {
          channelId: 'therapistai-default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
          sound: sound,
          icon: './assets/icons/icon.png',
          color: '#c44d4d',
        },
      });
    }

    // Handle delays (for dramatic pauses)
    if (interactive.delay) {
      await new Promise(resolve => setTimeout(resolve, interactive.delay));
    }
  } catch (error) {
    console.error('Error handling interactive elements:', error);
  }
};

// Process interactive elements when node is loaded
export const processNodeInteractiveElements = async (node, delay = 0) => {
  if (!node || !node.interactive) return;

  // Wait for delay if specified
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  await handleInteractiveElements(node.interactive, node.nodeId);
};

