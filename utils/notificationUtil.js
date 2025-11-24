import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Handle both local and remote notifications
    const { data, title, body } = notification.request.content;
    
    // Log notification for debugging
    console.log('Notification received:', { title, body, data });
    
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

// Create Android notification channels
const createNotificationChannels = async () => {
  if (Device.isDevice && Platform.OS === 'android') {
    try {
      // Default channel for general notifications
      await Notifications.setNotificationChannelAsync('friendconnect-default', {
        name: 'FriendConnect Notifications',
        description: 'Stay connected with your friends',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A90E2',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: false,
        enableVibrate: true,
        enableLights: true,
        showBadge: true,
      });

      // High priority channel for urgent reminders
      await Notifications.setNotificationChannelAsync('friendconnect-urgent', {
        name: 'Urgent Reminders',
        description: 'Important friend contact reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#E74C3C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
        enableVibrate: true,
        enableLights: true,
        showBadge: true,
      });

      // Low priority channel for general updates
      await Notifications.setNotificationChannelAsync('friendconnect-general', {
        name: 'General Updates',
        description: 'General app updates and information',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250],
        lightColor: '#4A90E2',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
        bypassDnd: false,
        enableVibrate: true,
        enableLights: false,
        showBadge: false,
      });

      console.log('Android notification channels created successfully');
    } catch (error) {
      console.error('Error creating notification channels:', error);
    }
  }
};

// Get FCM token for remote notifications
export const getFCMToken = async () => {
  try {
    if (!Device.isDevice) {
      console.log('FCM token not available on simulator');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: '0fbca0e2-8d39-48e9-9559-0ab96b190b1d', // Your EAS project ID
    });

    console.log('FCM token:', token.data);
    
    // Store token for later use
    await AsyncStorage.setItem('fcm_token', token.data);
    
    return token.data;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Schedule contact reminder notifications with enhanced Android support
export const scheduleContactReminders = async () => {
  try {
    // Cancel existing contact reminders
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const friends = await AsyncStorage.getItem('friends');
    if (!friends) return;
    
    const friendsList = JSON.parse(friends);
    const now = moment();
    
    friendsList.forEach(async (friend) => {
      if (!friend.reminderEnabled) return;
      
      const daysSinceContact = now.diff(moment(friend.lastContact), 'days');
      const frequencyDays = getFrequencyDays(friend.contactFrequency);
      
      // If overdue or due soon, schedule a reminder for tomorrow morning
      if (daysSinceContact >= frequencyDays) {
        const reminderTime = moment().add(1, 'day').hour(10).minute(0); // Tomorrow at 10 AM
        
        // Choose channel based on urgency
        const channelId = daysSinceContact > frequencyDays * 1.5 ? 
          'friendconnect-urgent' : 'friendconnect-default';
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Stay in Touch! 💬",
            body: `You haven't contacted ${friend.name} in ${daysSinceContact} days. Time to reach out?`,
            data: { 
              friendId: friend.id, 
              friendName: friend.name,
              type: 'contact_reminder',
              urgency: daysSinceContact > frequencyDays * 1.5 ? 'high' : 'medium'
            },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 250, 250, 250],
            autoDismiss: false,
            sticky: false,
          },
          trigger: {
            date: reminderTime.toDate(),
          },
          android: {
            channelId: channelId,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 250, 250, 250],
            sound: true,
            icon: './assets/icons/icon.png',
            color: '#4A90E2',
            largeIcon: './assets/icons/icon.png',
            showTimestamp: true,
            categoryId: 'reminder',
          },
        });
      }
    });
    
    console.log('Contact reminders scheduled successfully');
  } catch (error) {
    console.error('Error scheduling contact reminders:', error);
  }
};

// Get frequency in days
const getFrequencyDays = (frequency) => {
  const frequencyMap = {
    'Daily': 1,
    'Weekly': 7,
    'Bi-weekly': 14,
    'Monthly': 30,
    'Quarterly': 90,
    'Yearly': 365
  };
  return frequencyMap[frequency] || 7;
};

// Schedule daily reminder to check contacts
export const scheduleDailyContactCheck = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Friendship Check-in 🌟",
        body: "Take a moment to check which friends you haven't contacted recently.",
        data: { type: 'daily_check' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: {
        hour: 10, // 10 AM
        minute: 0,
        repeats: true,
      },
      android: {
        channelId: 'friendconnect-general',
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        vibrate: [0, 250],
        sound: true,
        icon: './assets/icons/icon.png',
        color: '#4A90E2',
        categoryId: 'reminder',
      },
    });
    
    console.log('Daily contact check scheduled');
  } catch (error) {
    console.error('Error scheduling daily contact check:', error);
  }
};

// Schedule weekly friendship summary
export const scheduleWeeklyFriendshipSummary = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weekly Friendship Summary 📊",
        body: "See how you're doing with staying in touch this week!",
        data: { type: 'weekly_summary' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: {
        weekday: 1, // Monday
        hour: 9, // 9 AM
        minute: 0,
        repeats: true,
      },
      android: {
        channelId: 'friendconnect-general',
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        vibrate: [0, 250],
        sound: true,
        icon: './assets/icons/icon.png',
        color: '#4A90E2',
        categoryId: 'summary',
      },
    });
    
    console.log('Weekly friendship summary scheduled');
  } catch (error) {
    console.error('Error scheduling weekly summary:', error);
  }
};

// Schedule birthday reminders
export const scheduleBirthdayReminders = async () => {
  try {
    const friends = await AsyncStorage.getItem('friends');
    if (!friends) return;
    
    const friendsList = JSON.parse(friends);
    const now = moment();
    
    friendsList.forEach(async (friend) => {
      if (!friend.birthday) return;
      
      try {
        const birthday = moment(friend.birthday, 'MM/DD');
        const nextBirthday = moment().month(birthday.month()).date(birthday.date());
        
        // If birthday has passed this year, schedule for next year
        if (nextBirthday.isBefore(now)) {
          nextBirthday.add(1, 'year');
        }
        
        // Schedule reminder 1 day before
        const reminderDate = nextBirthday.subtract(1, 'day');
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Birthday Tomorrow! 🎉",
            body: `${friend.name}'s birthday is tomorrow. Don't forget to send your wishes!`,
            data: { 
              friendId: friend.id, 
              friendName: friend.name,
              type: 'birthday_reminder'
            },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 500, 250, 500],
          },
          trigger: {
            date: reminderDate.toDate(),
          },
          android: {
            channelId: 'friendconnect-urgent',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 500, 250, 500],
            sound: true,
            icon: './assets/icons/icon.png',
            color: '#F39C12',
            categoryId: 'birthday',
          },
        });
        
        // Schedule birthday notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Happy Birthday! 🎂",
            body: `Today is ${friend.name}'s birthday! Time to celebrate!`,
            data: { 
              friendId: friend.id, 
              friendName: friend.name,
              type: 'birthday'
            },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 500, 250, 500],
          },
          trigger: {
            date: nextBirthday.add(1, 'day').toDate(),
          },
          android: {
            channelId: 'friendconnect-urgent',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 500, 250, 500],
            sound: true,
            icon: './assets/icons/icon.png',
            color: '#F39C12',
            categoryId: 'birthday',
          },
        });
        
      } catch (error) {
        console.error(`Error scheduling birthday reminder for ${friend.name}:`, error);
      }
    });
    
    console.log('Birthday reminders scheduled successfully');
  } catch (error) {
    console.error('Error scheduling birthday reminders:', error);
  }
};

// Initialize all notifications
export const initializeNotifications = async () => {
  try {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    // Create Android notification channels
    await createNotificationChannels();
    
    // Get FCM token for remote notifications
    await getFCMToken();
    
    // Schedule all notification types (but delay by 2 hours to avoid immediate popups)
    // These will be scheduled for their proper times (daily/weekly checks, etc.)
    await scheduleContactReminders();
    
    // Only schedule repeating notifications (not immediate ones)
    // These are already scheduled for their proper times
    console.log('All notifications initialized successfully');
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

// Update notifications when friends are modified
export const updateContactReminders = async () => {
  await scheduleContactReminders();
  await scheduleBirthdayReminders();
};

// Get notification statistics
export const getNotificationStats = async () => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    const stats = {
      total: scheduledNotifications.length,
      contactReminders: scheduledNotifications.filter(n => n.content.data?.type === 'contact_reminder').length,
      dailyChecks: scheduledNotifications.filter(n => n.content.data?.type === 'daily_check').length,
      weeklySummaries: scheduledNotifications.filter(n => n.content.data?.type === 'weekly_summary').length,
      birthdayReminders: scheduledNotifications.filter(n => n.content.data?.type === 'birthday_reminder').length,
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting notification stats:', error);
    return null;
  }
};

// Clear all notifications
export const clearAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cleared');
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
};

// Test notification (for development)
export const sendTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🧪",
        body: "This is a test notification from FriendConnect!",
        data: { type: 'test' },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
      },
      trigger: {
        seconds: 5, // Send in 5 seconds
      },
      android: {
        channelId: 'friendconnect-general',
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        vibrate: [0, 250],
        sound: true,
        icon: './assets/icons/icon.png',
        color: '#4A90E2',
        categoryId: 'test',
      },
    });
    
    console.log('Test notification scheduled');
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

// Handle notification response (when user taps notification)
export const handleNotificationResponse = (response) => {
  const { data } = response.notification.request.content;
  
  console.log('Notification tapped:', data);
  
  // Handle different notification types
  switch (data?.type) {
    case 'contact_reminder':
      // Navigate to friend details or contact screen
      console.log('Contact reminder tapped for friend:', data.friendName);
      break;
    case 'birthday_reminder':
      // Navigate to friend details or birthday screen
      console.log('Birthday reminder tapped for friend:', data.friendName);
      break;
    case 'daily_check':
      // Navigate to home screen
      console.log('Daily check notification tapped');
      break;
    default:
      console.log('Unknown notification type:', data?.type);
  }
}; 