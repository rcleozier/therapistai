import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUDIO_ENABLED_KEY = 'audio_enabled';
const HOME_MUSIC = require('../assets/music/home.mp3');

// Story line audio mapping
const STORY_LINE_MUSIC = {
  'therapy_ai_session_1': require('../assets/music/therapy_ai_session_1.mp3'),
  'therapy_ai_session_2': require('../assets/music/therapy_ai_session_2.mp3'),
  'therapy_ai_session_3': require('../assets/music/therapy_ai_session_3.mp3'),
};

// Default to first story line if not specified
const DEFAULT_STORY_LINE_ID = 'therapy_ai_session_1';

let startScreenSound = null;
let gameSound = null;
let isAudioEnabled = true;
let isInitialized = false;
let isStartingMusic = false; // Flag to prevent concurrent music starts

// Initialize audio settings
export const initializeAudio = async () => {
  try {
    // Set audio mode for background music
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Load audio preference
    const savedPreference = await AsyncStorage.getItem(AUDIO_ENABLED_KEY);
    if (savedPreference !== null) {
      isAudioEnabled = JSON.parse(savedPreference);
    }

    isInitialized = true;
    return isAudioEnabled;
  } catch (error) {
    console.error('Error initializing audio:', error);
    return true; // Default to enabled
  }
};

// Get audio enabled state (always check from storage to ensure latest value)
export const getAudioEnabled = async () => {
  try {
    const savedPreference = await AsyncStorage.getItem(AUDIO_ENABLED_KEY);
    if (savedPreference !== null) {
      isAudioEnabled = JSON.parse(savedPreference);
    }
    return isAudioEnabled;
  } catch (error) {
    console.error('Error getting audio enabled state:', error);
    return isAudioEnabled;
  }
};

// Stop all music - helper function that forcefully stops everything
const stopAllMusic = async () => {
  console.log('Stopping all music...');
  const promises = [];
  
  // Stop start screen music
  if (startScreenSound) {
    promises.push(
      (async () => {
        try {
          const status = await startScreenSound.getStatusAsync();
          if (status.isLoaded) {
            if (status.isPlaying) {
              await startScreenSound.stopAsync();
            }
            await startScreenSound.unloadAsync();
          }
        } catch (err) {
          console.error('Error stopping start screen sound:', err);
        } finally {
          startScreenSound = null;
        }
      })()
    );
  }
  
  // Stop game music
  if (gameSound) {
    promises.push(
      (async () => {
        try {
          const status = await gameSound.getStatusAsync();
          if (status.isLoaded) {
            if (status.isPlaying) {
              await gameSound.stopAsync();
            }
            await gameSound.unloadAsync();
          }
        } catch (err) {
          console.error('Error stopping game sound:', err);
        } finally {
          gameSound = null;
        }
      })()
    );
  }
  
  await Promise.all(promises);
  
  // Force cleanup any remaining references
  startScreenSound = null;
  gameSound = null;
  
  // Wait for audio system to fully release resources
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('All music stopped');
};

// Set audio enabled state
export const setAudioEnabled = async (enabled) => {
  try {
    console.log(`Setting audio enabled to: ${enabled}`);
    isAudioEnabled = enabled;
    await AsyncStorage.setItem(AUDIO_ENABLED_KEY, JSON.stringify(enabled));

    // If disabling, IMMEDIATELY stop all current playback
    if (!enabled) {
      console.log('Audio disabled - stopping all music immediately');
      await stopAllMusic();
    }

    return true;
  } catch (error) {
    console.error('Error setting audio preference:', error);
    return false;
  }
};

// Play background music (for start screen)
export const playBackgroundMusic = async () => {
  // Prevent concurrent calls
  if (isStartingMusic) {
    console.log('Music is already starting, skipping duplicate call');
    return;
  }

  try {
    isStartingMusic = true;

    // Always check current setting before playing
    const enabled = await getAudioEnabled();
    if (!enabled) {
      console.log('Audio is disabled, not playing start screen music');
      return;
    }

    // If start screen music is already playing, don't restart
    if (startScreenSound) {
      try {
        const status = await startScreenSound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          console.log('Start screen music already playing, skipping');
          return;
        }
      } catch (error) {
        // If there's an error checking status, clean up and continue
        startScreenSound = null;
      }
    }

    // Stop ALL music first (both game and start screen) to ensure only one plays
    await stopAllMusic();

    // Create and load sound
    const { sound } = await Audio.Sound.createAsync(
      HOME_MUSIC,
      {
        isLooping: true,
        volume: 0.5, // Set to 50% volume for ambient effect
        shouldPlay: true,
      }
    );

    startScreenSound = sound;
    console.log('Start screen music started');
  } catch (error) {
    console.error('Error playing background music:', error);
  } finally {
    isStartingMusic = false;
  }
};

// Stop background music (start screen)
export const stopBackgroundMusic = async () => {
  try {
    if (startScreenSound) {
      try {
        const status = await startScreenSound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await startScreenSound.stopAsync();
          }
          await startScreenSound.unloadAsync();
        }
      } catch (error) {
        console.error('Error stopping start screen sound:', error);
      }
      startScreenSound = null;
      console.log('Start screen music stopped');
    }
  } catch (error) {
    console.error('Error stopping background music:', error);
    startScreenSound = null;
  }
};

// Play game music for a specific story line
export const playGameMusic = async (storyLineId = DEFAULT_STORY_LINE_ID) => {
  // Prevent concurrent calls
  if (isStartingMusic) {
    console.log('Music is already starting, skipping duplicate call');
    return;
  }

  try {
    isStartingMusic = true;

    // Always check current setting before playing
    const enabled = await getAudioEnabled();
    if (!enabled) {
      console.log('Audio is disabled, not playing game music');
      // Still stop all music even if disabled
      await stopAllMusic();
      return;
    }

    // Get the appropriate music file for this story line
    const storyLineMusic = STORY_LINE_MUSIC[storyLineId] || STORY_LINE_MUSIC[DEFAULT_STORY_LINE_ID];
    if (!storyLineMusic) {
      console.error(`No music file found for story line: ${storyLineId}`);
      isStartingMusic = false;
      return;
    }

    // Stop ALL music first (both start screen and game) and wait for it to fully stop
    await stopAllMusic();

    // Create and load sound
    const { sound } = await Audio.Sound.createAsync(
      storyLineMusic,
      {
        isLooping: true,
        volume: 0.4, // Set to 40% volume for game ambient effect
        shouldPlay: true,
      }
    );

    gameSound = sound;
    console.log(`Game music started for story line: ${storyLineId}`);
  } catch (error) {
    console.error('Error playing game music:', error);
  } finally {
    isStartingMusic = false;
  }
};

// Stop game music
export const stopGameMusic = async () => {
  try {
    if (gameSound) {
      try {
        const status = await gameSound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await gameSound.stopAsync();
          }
          await gameSound.unloadAsync();
        }
      } catch (error) {
        console.error('Error stopping game sound:', error);
      }
      gameSound = null;
      console.log('Game music stopped');
    }
  } catch (error) {
    console.error('Error stopping game music:', error);
    gameSound = null;
  }
};

// Pause background music
export const pauseBackgroundMusic = async () => {
  try {
    if (startScreenSound) {
      await startScreenSound.pauseAsync();
      console.log('Start screen music paused');
    }
  } catch (error) {
    console.error('Error pausing background music:', error);
  }
};

// Resume background music
export const resumeBackgroundMusic = async () => {
  try {
    const enabled = await getAudioEnabled();
    if (startScreenSound && enabled) {
      await startScreenSound.playAsync();
      console.log('Start screen music resumed');
    }
  } catch (error) {
    console.error('Error resuming background music:', error);
  }
};

// Cleanup on app close
export const cleanupAudio = async () => {
  await stopAllMusic();
};
