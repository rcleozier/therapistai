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
  if (!interactive) {
    console.log('[InteractiveElements] No interactive data provided');
    return;
  }

  console.log('[InteractiveElements] Processing interactive elements for node:', nodeId, interactive);

  try {
    // Ensure notification channel exists (Android)
    await ensureNotificationChannel();
    
    // Handle vibrations
    if (interactive.vibrate) {
      const { pattern, intensity = 'medium' } = interactive.vibrate;
      console.log('[InteractiveElements] Triggering vibration:', pattern);
      
      try {
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
        console.log('[InteractiveElements] Vibration completed');
      } catch (vibError) {
        console.error('[InteractiveElements] Vibration error:', vibError);
      }
    }

    // Handle local notifications only (no push/remote notifications)
    if (interactive.notification) {
      const { title, body, delay = 0, sound = true } = interactive.notification;
      console.log('[InteractiveElements] Scheduling notification:', title, 'delay:', delay);
      
      try {
        // Request permissions on iOS if needed
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.warn('[InteractiveElements] Notification permissions not granted');
          return;
        }
        
        // Local notification trigger - schedules notification locally on device
        const trigger = delay > 0 
          ? { seconds: delay }
          : null;

        // scheduleNotificationAsync creates local notifications only
        const notificationId = await Notifications.scheduleNotificationAsync({
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
        console.log('[InteractiveElements] Notification scheduled with ID:', notificationId);
      } catch (notifError) {
        console.error('[InteractiveElements] Notification error:', notifError);
      }
    }

    // Handle delays (for dramatic pauses)
    if (interactive.delay) {
      console.log('[InteractiveElements] Waiting delay:', interactive.delay);
      await new Promise(resolve => setTimeout(resolve, interactive.delay));
    }
    
    console.log('[InteractiveElements] All interactive elements processed');
  } catch (error) {
    console.error('[InteractiveElements] Error handling interactive elements:', error);
  }
};

// Process interactive elements when node is loaded
export const processNodeInteractiveElements = async (node, delay = 0) => {
  if (!node) {
    console.log('[InteractiveElements] No node provided');
    return;
  }
  
  if (!node.interactive) {
    console.log('[InteractiveElements] Node', node.nodeId, 'has no interactive elements');
    return;
  }

  console.log('[InteractiveElements] Processing node:', node.nodeId, 'with delay:', delay);

  // Wait for delay if specified
  if (delay > 0) {
    console.log('[InteractiveElements] Waiting', delay, 'ms before processing');
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  await handleInteractiveElements(node.interactive, node.nodeId);
};

