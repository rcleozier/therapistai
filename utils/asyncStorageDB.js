import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  FRIENDS: 'friends',
  ACTIVITIES: 'activities',
  PARTICIPANTS: 'participants',
  SETTINGS: 'settings',
  CONTACT_LOGS: 'contact_logs'
};

// Initialize database (AsyncStorage is always ready)
export const initDatabase = async () => {
  try {
    // Check if database has been initialized before
    const isInitialized = await AsyncStorage.getItem('database_initialized');
    
    if (!isInitialized) {
      console.log('First time app launch - initializing database');
      
      // Initialize empty arrays for all data types
      await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify([]));
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([]));
      await AsyncStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify([]));
      await AsyncStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify([]));
      
      // Mark database as initialized
      await AsyncStorage.setItem('database_initialized', 'true');
      console.log('Database initialized with empty data');
    } else {
      console.log('Database already initialized, skipping sample data creation');
    }

  } catch (error) {
    console.error('Error initializing AsyncStorage database:', error);
    throw error;
  }
};

// Check if database is ready
export const isDatabaseReady = () => {
  return true; // AsyncStorage is always ready
};

// Get database status
export const getDatabaseStatus = () => {
  return {
    initialized: true,
    database: 'AsyncStorage'
  };
};

// Reset database (useful for troubleshooting)
export const resetDatabase = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.FRIENDS,
      STORAGE_KEYS.ACTIVITIES,
      STORAGE_KEYS.PARTICIPANTS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.CONTACT_LOGS,
      'database_initialized'
    ]);
    console.log('AsyncStorage database reset completed');
    return true;
  } catch (error) {
    console.error('Error resetting AsyncStorage database:', error);
    return false;
  }
};

// Force database reinitialization
export const reinitializeDatabase = async () => {
  try {
    await resetDatabase();
    await initDatabase();
    return true;
  } catch (error) {
    console.error('Error reinitializing AsyncStorage database:', error);
    return false;
  }
};

// Clear sample data (for users who already have sample friends)
export const clearSampleData = async () => {
  try {
    const friends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    
    // Check if we have sample friends (by checking for specific names)
    const sampleNames = ['Sarah Johnson', 'Mike Chen', 'Emma Davis', 'Alex Rodriguez'];
    const hasSampleData = friends.some(friend => sampleNames.includes(friend.name));
    
    if (hasSampleData) {
      // Remove sample friends
      const filteredFriends = friends.filter(friend => !sampleNames.includes(friend.name));
      await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(filteredFriends));
      console.log('Sample friends removed');
    }
    
    // Also clear sample contact logs
    const contactLogs = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CONTACT_LOGS) || '[]');
    const sampleFriendIds = ['1', '2', '3', '4'];
    const filteredLogs = contactLogs.filter(log => !sampleFriendIds.includes(log.friendId));
    await AsyncStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify(filteredLogs));
    
    return true;
  } catch (error) {
    console.error('Error clearing sample data:', error);
    return false;
  }
};

// Friends operations
export const addFriend = async (friend) => {
  try {
    const now = new Date().toISOString();
    const newFriend = {
      id: Date.now().toString(), // Simple ID generation
      ...friend,
      lastContact: friend.lastContact || null,
      favorite: friend.favorite || false,
      contactFrequency: friend.contactFrequency || 'Weekly',
      reminderEnabled: friend.reminderEnabled !== false,
      createdAt: now,
      updatedAt: now
    };

    const existingFriends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    existingFriends.push(newFriend);
    
    await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(existingFriends));
    
    return newFriend.id;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

export const updateFriend = async (friend) => {
  try {
    const now = new Date().toISOString();
    const existingFriends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    
    const friendIndex = existingFriends.findIndex(f => f.id === friend.id);
    if (friendIndex === -1) {
      throw new Error('Friend not found');
    }

    existingFriends[friendIndex] = {
      ...existingFriends[friendIndex],
      ...friend,
      updatedAt: now
    };

    await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(existingFriends));
    
    return true;
  } catch (error) {
    console.error('Error updating friend:', error);
    throw error;
  }
};

export const deleteFriend = async (id) => {
  try {
    const existingFriends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    const filteredFriends = existingFriends.filter(friend => friend.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(filteredFriends));
    
    return true;
  } catch (error) {
    console.error('Error deleting friend:', error);
    throw error;
  }
};

export const getAllFriends = async () => {
  try {
    const friends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    
    // Convert to match SQLite format
    return friends.map(friend => ({
      ...friend,
      favorite: Boolean(friend.favorite),
      reminderEnabled: Boolean(friend.reminderEnabled),
      lastContact: friend.lastContact || null
    }));
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
};

export const updateLastContact = async (id) => {
  try {
    const now = new Date().toISOString();
    const existingFriends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    
    const friendIndex = existingFriends.findIndex(f => f.id === id);
    if (friendIndex === -1) {
      throw new Error('Friend not found');
    }

    existingFriends[friendIndex].lastContact = now;
    existingFriends[friendIndex].updatedAt = now;

    await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(existingFriends));
    
    return true;
  } catch (error) {
    console.error('Error updating last contact:', error);
    throw error;
  }
};

export const toggleFriendFavorite = async (id) => {
  try {
    const existingFriends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    
    const friendIndex = existingFriends.findIndex(f => f.id === id);
    if (friendIndex === -1) {
      throw new Error('Friend not found');
    }

    existingFriends[friendIndex].favorite = !existingFriends[friendIndex].favorite;
    existingFriends[friendIndex].updatedAt = new Date().toISOString();

    await AsyncStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(existingFriends));
    
    return existingFriends[friendIndex].favorite;
  } catch (error) {
    console.error('Error toggling friend favorite:', error);
    throw error;
  }
};

// Activities operations
export const addActivity = async (activity) => {
  try {
    const now = new Date().toISOString();
    const newActivity = {
      id: Date.now().toString(),
      ...activity,
      completed: activity.completed || false,
      createdAt: now,
      updatedAt: now
    };

    const existingActivities = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
    existingActivities.push(newActivity);
    
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(existingActivities));
    console.log('Activity added successfully:', newActivity.title);
    
    return newActivity.id;
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  }
};

export const updateActivity = async (activity) => {
  try {
    const now = new Date().toISOString();
    const existingActivities = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
    
    const activityIndex = existingActivities.findIndex(a => a.id === activity.id);
    if (activityIndex === -1) {
      throw new Error('Activity not found');
    }

    existingActivities[activityIndex] = {
      ...existingActivities[activityIndex],
      ...activity,
      updatedAt: now
    };

    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(existingActivities));
    console.log('Activity updated successfully:', activity.title);
    
    return true;
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
};

export const deleteActivity = async (id) => {
  try {
    const existingActivities = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
    const filteredActivities = existingActivities.filter(activity => activity.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filteredActivities));
    console.log('Activity deleted successfully');
    
    return true;
  } catch (error) {
    console.error('Error deleting activity:', error);
    throw error;
  }
};

export const getAllActivities = async () => {
  try {
    const activities = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
    
    // Convert to match SQLite format
    return activities.map(activity => ({
      ...activity,
      completed: Boolean(activity.completed),
      participants: [] // AsyncStorage doesn't support complex relationships easily
    }));
  } catch (error) {
    console.error('Error getting activities:', error);
    throw error;
  }
};

export const toggleActivityCompleted = async (id, completed) => {
  try {
    const now = new Date().toISOString();
    const existingActivities = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
    
    const activityIndex = existingActivities.findIndex(a => a.id === id);
    if (activityIndex === -1) {
      throw new Error('Activity not found');
    }

    existingActivities[activityIndex].completed = completed;
    existingActivities[activityIndex].updatedAt = now;

    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(existingActivities));
    console.log('Activity completed status updated successfully');
    
    return true;
  } catch (error) {
    console.error('Error toggling activity completed:', error);
    throw error;
  }
};

// Utility functions
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.FRIENDS,
      STORAGE_KEYS.ACTIVITIES,
      STORAGE_KEYS.PARTICIPANTS,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.CONTACT_LOGS,
      'database_initialized'
    ]);
    console.log('All data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

export const getStorageStats = async () => {
  try {
    const friends = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.FRIENDS) || '[]');
    const activities = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES) || '[]');
    
    return {
      friendsCount: friends.length,
      activitiesCount: activities.length,
      storageSize: 'AsyncStorage (no size limit)'
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};

// Contact Log operations
export const addContactLog = async (contactLog) => {
  try {
    const now = new Date().toISOString();
    const newContactLog = {
      id: Date.now().toString(),
      ...contactLog,
      contactDate: contactLog.contactDate || now,
      createdAt: now
    };

    const existingLogs = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CONTACT_LOGS) || '[]');
    existingLogs.push(newContactLog);
    
    await AsyncStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify(existingLogs));
    
    // Update friend's lastContact
    if (contactLog.friendId) {
      await updateLastContact(contactLog.friendId);
    }
    
    return newContactLog.id;
  } catch (error) {
    console.error('Error adding contact log:', error);
    throw error;
  }
};

export const getContactLogsForFriend = async (friendId) => {
  try {
    const allLogs = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CONTACT_LOGS) || '[]');
    const friendLogs = allLogs.filter(log => log.friendId === friendId);
    
    // Sort by date (newest first)
    return friendLogs.sort((a, b) => new Date(b.contactDate) - new Date(a.contactDate));
  } catch (error) {
    console.error('Error getting contact logs for friend:', error);
    throw error;
  }
};

export const getAllContactLogs = async () => {
  try {
    const allLogs = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CONTACT_LOGS) || '[]');
    
    // Sort by date (newest first)
    return allLogs.sort((a, b) => new Date(b.contactDate) - new Date(a.contactDate));
  } catch (error) {
    console.error('Error getting all contact logs:', error);
    throw error;
  }
};

export const deleteContactLog = async (logId) => {
  try {
    const existingLogs = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CONTACT_LOGS) || '[]');
    const filteredLogs = existingLogs.filter(log => log.id !== logId);
    
    await AsyncStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify(filteredLogs));
    console.log('Contact log deleted successfully');
    
    return true;
  } catch (error) {
    console.error('Error deleting contact log:', error);
    throw error;
  }
};

export const updateContactLog = async (contactLog) => {
  try {
    const now = new Date().toISOString();
    const existingLogs = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CONTACT_LOGS) || '[]');
    
    const logIndex = existingLogs.findIndex(log => log.id === contactLog.id);
    if (logIndex === -1) {
      throw new Error('Contact log not found');
    }

    existingLogs[logIndex] = {
      ...existingLogs[logIndex],
      ...contactLog,
      updatedAt: now
    };

    await AsyncStorage.setItem(STORAGE_KEYS.CONTACT_LOGS, JSON.stringify(existingLogs));
    console.log('Contact log updated successfully');
    
    return true;
  } catch (error) {
    console.error('Error updating contact log:', error);
    throw error;
  }
}; 