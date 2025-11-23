import { openDatabase } from 'expo-sqlite';

// Initialize database variable
let db = null;

// Initialize database tables
export const initDatabase = async () => {
  try {
    // Open the database
    db = openDatabase('friendconnect.db');
    console.log('Database opened successfully');
    
    // Wait a moment for database to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }

      db.transaction(tx => {
        // Create friends table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS friends (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            birthday TEXT,
            notes TEXT,
            relationshipType TEXT DEFAULT 'Friend',
            lastContact TEXT,
            favorite INTEGER DEFAULT 0,
            contactFrequency TEXT DEFAULT 'Weekly',
            reminderEnabled INTEGER DEFAULT 1,
            createdAt TEXT,
            updatedAt TEXT
          );`,
          [],
          () => {
            console.log('Friends table created successfully');
          },
          (_, error) => {
            console.error('Error creating friends table:', error);
            reject(error);
          }
        );

        // Create activities table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT,
            time TEXT,
            location TEXT,
            type TEXT DEFAULT 'Social',
            cost TEXT,
            notes TEXT,
            completed INTEGER DEFAULT 0,
            createdAt TEXT,
            updatedAt TEXT
          );`,
          [],
          () => {
            console.log('Activities table created successfully');
          },
          (_, error) => {
            console.error('Error creating activities table:', error);
            reject(error);
          }
        );

        // Create participants table for activities
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            activityId INTEGER,
            name TEXT NOT NULL,
            addedAt TEXT,
            FOREIGN KEY (activityId) REFERENCES activities (id) ON DELETE CASCADE
          );`,
          [],
          () => {
            console.log('Participants table created successfully');
          },
          (_, error) => {
            console.error('Error creating participants table:', error);
            reject(error);
          }
        );
      }, reject, resolve);
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Helper function to check if database is ready
const checkDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// Check if database is ready
export const isDatabaseReady = () => {
  return db !== null;
};

// Get database status
export const getDatabaseStatus = () => {
  return {
    initialized: db !== null,
    database: db
  };
};

// Reset database (useful for troubleshooting)
export const resetDatabase = () => {
  try {
    if (db) {
      db.close();
      console.log('Database connection closed');
    }
    db = null;
    console.log('Database reset completed');
    return true;
  } catch (error) {
    console.error('Error resetting database:', error);
    return false;
  }
};

// Force database reinitialization
export const reinitializeDatabase = async () => {
  try {
    resetDatabase();
    await initDatabase();
    console.log('Database reinitialized successfully');
    return true;
  } catch (error) {
    console.error('Error reinitializing database:', error);
    return false;
  }
};

// Friends operations
export const addFriend = (friend) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const lastContact = friend.lastContact || null; // Don't set default contact date
    
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO friends (
          name, phone, email, birthday, notes, relationshipType, 
          lastContact, favorite, contactFrequency, reminderEnabled, 
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          friend.name,
          friend.phone || null,
          friend.email || null,
          friend.birthday || null,
          friend.notes || null,
          friend.relationshipType || 'Friend',
          lastContact,
          friend.favorite ? 1 : 0,
          friend.contactFrequency || 'Weekly',
          friend.reminderEnabled ? 1 : 0,
          now,
          now
        ],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          console.error('Error adding friend:', error);
          reject(error);
        }
      );
    });
  });
};

export const updateFriend = (friend) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE friends SET 
          name = ?, phone = ?, email = ?, birthday = ?, notes = ?, 
          relationshipType = ?, lastContact = ?, favorite = ?, 
          contactFrequency = ?, reminderEnabled = ?, updatedAt = ?
        WHERE id = ?`,
        [
          friend.name,
          friend.phone || null,
          friend.email || null,
          friend.birthday || null,
          friend.notes || null,
          friend.relationshipType || 'Friend',
          friend.lastContact || null,
          friend.favorite ? 1 : 0,
          friend.contactFrequency || 'Weekly',
          friend.reminderEnabled ? 1 : 0,
          now,
          friend.id
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.error('Error updating friend:', error);
          reject(error);
        }
      );
    });
  });
};

export const deleteFriend = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM friends WHERE id = ?',
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.error('Error deleting friend:', error);
          reject(error);
        }
      );
    });
  });
};

export const getAllFriends = () => {
  return new Promise((resolve, reject) => {
    try {
      const database = checkDatabase();
      
      database.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM friends ORDER BY name ASC',
          [],
          (_, { rows: { _array } }) => {
            // Convert database format to app format
            const friends = _array.map(friend => ({
              ...friend,
              favorite: Boolean(friend.favorite),
              reminderEnabled: Boolean(friend.reminderEnabled),
              lastContact: friend.lastContact || null
            }));
            resolve(friends);
          },
          (_, error) => {
            console.error('Error getting friends:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateLastContact = (id) => {
  return new Promise((resolve, reject) => {
    try {
      const database = checkDatabase();
      const now = new Date().toISOString();
      
      database.transaction(tx => {
        tx.executeSql(
          'UPDATE friends SET lastContact = ?, updatedAt = ? WHERE id = ?',
          [now, now, id],
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            console.error('Error updating last contact:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Activities operations
export const addActivity = (activity) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO activities (
          title, description, date, time, location, type, 
          cost, notes, completed, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          activity.title,
          activity.description || null,
          activity.date || null,
          activity.time || null,
          activity.location || null,
          activity.type || 'Social',
          activity.cost || null,
          activity.notes || null,
          activity.completed ? 1 : 0,
          now,
          now
        ],
        (_, result) => {
          const activityId = result.insertId;
          
          // Add participants if any
          if (activity.participants && activity.participants.length > 0) {
            activity.participants.forEach(participant => {
              tx.executeSql(
                'INSERT INTO participants (activityId, name, addedAt) VALUES (?, ?, ?)',
                [activityId, participant.name, participant.addedAt || now]
              );
            });
          }
          
          resolve(activityId);
        },
        (_, error) => {
          console.error('Error adding activity:', error);
          reject(error);
        }
      );
    });
  });
};

export const updateActivity = (activity) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE activities SET 
          title = ?, description = ?, date = ?, time = ?, location = ?, 
          type = ?, cost = ?, notes = ?, completed = ?, updatedAt = ?
        WHERE id = ?`,
        [
          activity.title,
          activity.description || null,
          activity.date || null,
          activity.time || null,
          activity.location || null,
          activity.type || 'Social',
          activity.cost || null,
          activity.notes || null,
          activity.completed ? 1 : 0,
          now,
          activity.id
        ],
        (_, result) => {
          // Update participants
          if (activity.participants) {
            // Remove existing participants
            tx.executeSql('DELETE FROM participants WHERE activityId = ?', [activity.id]);
            
            // Add new participants
            activity.participants.forEach(participant => {
              tx.executeSql(
                'INSERT INTO participants (activityId, name, addedAt) VALUES (?, ?, ?)',
                [activity.id, participant.name, participant.addedAt || now]
              );
            });
          }
          
          resolve(result);
        },
        (_, error) => {
          console.error('Error updating activity:', error);
          reject(error);
        }
      );
    });
  });
};

export const deleteActivity = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Delete participants first
      tx.executeSql('DELETE FROM participants WHERE activityId = ?', [id]);
      
      // Delete activity
      tx.executeSql(
        'DELETE FROM activities WHERE id = ?',
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.error('Error deleting activity:', error);
          reject(error);
        }
      );
    });
  });
};

export const getAllActivities = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM activities ORDER BY date DESC, time DESC',
        [],
        async (_, { rows: { _array } }) => {
          const activities = [];
          
          // Get participants for each activity
          for (const activity of _array) {
            const participants = await getActivityParticipants(activity.id);
            activities.push({
              ...activity,
              completed: Boolean(activity.completed),
              participants
            });
          }
          
          resolve(activities);
        },
        (_, error) => {
          console.error('Error getting activities:', error);
          reject(error);
        }
      );
    });
  });
};

export const getActivityParticipants = (activityId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM participants WHERE activityId = ? ORDER BY addedAt ASC',
        [activityId],
        (_, { rows: { _array } }) => {
          resolve(_array);
        },
        (_, error) => {
          console.error('Error getting participants:', error);
          reject(error);
        }
      );
    });
  });
};

export const toggleActivityCompleted = (id, completed) => {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE activities SET completed = ?, updatedAt = ? WHERE id = ?',
        [completed ? 1 : 0, now, id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.error('Error toggling activity completed:', error);
          reject(error);
        }
      );
    });
  });
};

// Migration from AsyncStorage (if needed)
export const migrateFromAsyncStorage = async () => {
  try {
    const AsyncStorage = await import('@react-native-async-storage/async-storage');
    
    // Check if migration is needed
    const migrationDone = await AsyncStorage.default.getItem('migration_done');
    if (migrationDone) {
      console.log('Migration already completed');
      return;
    }
    
    // Migrate friends
    const storedFriends = await AsyncStorage.default.getItem('friends');
    if (storedFriends) {
      const friends = JSON.parse(storedFriends);
      for (const friend of friends) {
        await addFriend(friend);
      }
      console.log(`Migrated ${friends.length} friends`);
    }
    
    // Migrate activities
    const storedActivities = await AsyncStorage.default.getItem('activities');
    if (storedActivities) {
      const activities = JSON.parse(storedActivities);
      for (const activity of activities) {
        await addActivity(activity);
      }
      console.log(`Migrated ${activities.length} activities`);
    }
    
    // Mark migration as done
    await AsyncStorage.default.setItem('migration_done', 'true');
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Database utility functions
export const clearDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM participants', []);
      tx.executeSql('DELETE FROM activities', []);
      tx.executeSql('DELETE FROM friends', []);
    }, reject, resolve);
  });
};

export const getDatabaseStats = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      let stats = {};
      
      tx.executeSql(
        'SELECT COUNT(*) as count FROM friends',
        [],
        (_, { rows: { _array } }) => {
          stats.friendsCount = _array[0].count;
        }
      );
      
      tx.executeSql(
        'SELECT COUNT(*) as count FROM activities',
        [],
        (_, { rows: { _array } }) => {
          stats.activitiesCount = _array[0].count;
        }
      );
      
      tx.executeSql(
        'SELECT COUNT(*) as count FROM participants',
        [],
        (_, { rows: { _array } }) => {
          stats.participantsCount = _array[0].count;
        }
      );
      
      resolve(stats);
    }, reject);
  });
}; 