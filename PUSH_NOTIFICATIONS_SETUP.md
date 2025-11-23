# Android Push Notifications Setup Guide

This guide will help you set up Android Push Notifications (remote notifications) for your FriendConnect app.

## 🚀 What's Already Implemented

✅ **Local Notifications**: Contact reminders, daily checks, weekly summaries, birthday reminders  
✅ **Android Notification Channels**: Proper channel management with different priority levels  
✅ **FCM Token Generation**: Ready for remote notification integration  
✅ **Notification Response Handling**: App navigation when users tap notifications  

## 📱 Android Notification Channels

The app automatically creates three notification channels:

1. **FriendConnect Notifications** (`friendconnect-default`)
   - High importance, general friend reminders
   - Vibrates and shows badge

2. **Urgent Reminders** (`friendconnect-urgent`)
   - High importance, bypasses Do Not Disturb
   - Strong vibration pattern for overdue contacts and birthdays

3. **General Updates** (`friendconnect-general`)
   - Default importance, daily/weekly summaries
   - Light vibration, no badge

## 🔧 Setup Steps for Remote Push Notifications

### 1. Firebase Cloud Messaging (FCM) Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Enable Cloud Messaging

2. **Add Android App**:
   - Click "Add app" → Android
   - Package name: `com.friendconnect.app`
   - Download `google-services.json`
   - Place it in your project root

3. **Configure EAS Build**:
   ```bash
   eas build:configure
   ```
   - This will automatically detect your `google-services.json`

### 2. Server-Side Implementation

You'll need a server to send push notifications. Here's a basic Node.js example:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Send notification to specific user
async function sendContactReminder(userToken, friendName) {
  const message = {
    notification: {
      title: 'Stay in Touch! 💬',
      body: `Time to reach out to ${friendName}!`
    },
    data: {
      type: 'contact_reminder',
      friendName: friendName,
      timestamp: Date.now().toString()
    },
    token: userToken,
    android: {
      notification: {
        channelId: 'friendconnect-urgent',
        priority: 'high',
        sound: 'default'
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
}
```

### 3. Update Your Backend

Store FCM tokens when users log in:

```javascript
// When user logs in or app starts
const fcmToken = await getFCMToken();
await updateUserFCMToken(userId, fcmToken);

// Send notifications based on your business logic
// e.g., when a friend's birthday is approaching
```

## 🎯 Notification Types & Triggers

### Contact Reminders
- **Trigger**: Based on `contactFrequency` setting
- **Channel**: `friendconnect-urgent` for overdue, `friendconnect-default` for due soon
- **Data**: Friend ID, name, urgency level

### Birthday Reminders
- **Trigger**: 1 day before and on birthday
- **Channel**: `friendconnect-urgent`
- **Data**: Friend ID, name, birthday date

### Daily/Weekly Summaries
- **Trigger**: Scheduled at specific times
- **Channel**: `friendconnect-general`
- **Data**: Summary type, timestamp

## 🔍 Testing Notifications

### Local Testing
```javascript
import { sendTestNotification } from './utils/notificationUtil';

// Send test notification in 5 seconds
await sendTestNotification();
```

### Remote Testing
1. Get FCM token from app logs
2. Use Firebase Console to send test message
3. Or use your server to send test notification

## 📊 Monitoring & Analytics

The app logs all notification events:

```javascript
// Check notification stats
import { getNotificationStats } from './utils/notificationUtil';

const stats = await getNotificationStats();
console.log('Notification stats:', stats);
```

## 🚨 Troubleshooting

### Common Issues

1. **Notifications not showing**:
   - Check notification permissions
   - Verify Android notification channels are created
   - Check device Do Not Disturb settings

2. **FCM token not generated**:
   - Ensure `google-services.json` is properly configured
   - Check EAS project ID matches your project

3. **Notifications not responding to taps**:
   - Verify `handleNotificationResponse` is properly set up
   - Check navigation logic in response handler

### Debug Commands

```javascript
// Check all scheduled notifications
const scheduled = await Notifications.getAllScheduledNotificationsAsync();
console.log('Scheduled notifications:', scheduled);

// Check FCM token
const token = await AsyncStorage.getItem('fcm_token');
console.log('Stored FCM token:', token);
```

## 🔮 Future Enhancements

- **Rich Notifications**: Add images, actions, and custom layouts
- **Notification Groups**: Group related notifications together
- **Smart Scheduling**: AI-powered optimal notification timing
- **Cross-Platform Sync**: Sync notification preferences across devices
- **Analytics Integration**: Track notification engagement and effectiveness

## 📚 Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Android Notification Channels](https://developer.android.com/guide/topics/ui/notifiers/notifications#ManageChannels)
- [EAS Build Configuration](https://docs.expo.dev/build/setup/)

## 🆘 Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all configuration files are in place
3. Test with a clean build: `eas build --clear-cache`
4. Check Expo and Firebase documentation for updates

---

**Note**: This setup provides a solid foundation for push notifications. The app will work with local notifications immediately, and you can add remote notifications by implementing the server-side components when ready. 