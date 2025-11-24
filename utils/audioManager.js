import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUDIO_ENABLED_KEY = 'audio_enabled';
const START_SCREEN_MUSIC = require('../assets/music/scary-horror-creepy-music-359998.mp3');
const GAME_MUSIC = require('../assets/music/scary-creepy-horror-music-430823.mp3');

let startScreenSound = null;
let gameSound = null;
let isAudioEnabled = true;
let isInitialized = false;

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

// Set audio enabled state
export const setAudioEnabled = async (enabled) => {
  try {
    isAudioEnabled = enabled;
    await AsyncStorage.setItem(AUDIO_ENABLED_KEY, JSON.stringify(enabled));

    // If disabling, stop all current playback
    if (!enabled) {
      await stopBackgroundMusic();
      await stopGameMusic();
    }

    return true;
  } catch (error) {
    console.error('Error setting audio preference:', error);
    return false;
  }
};

// Stop all music - helper function
const stopAllMusic = async () => {
  const promises = [];
  
  if (startScreenSound) {
    promises.push(
      startScreenSound.stopAsync()
        .then(() => startScreenSound.unloadAsync())
        .catch(err => console.error('Error stopping start screen sound:', err))
        .finally(() => { startScreenSound = null; })
    );
  }
  
  if (gameSound) {
    promises.push(
      gameSound.stopAsync()
        .then(() => gameSound.unloadAsync())
        .catch(err => console.error('Error stopping game sound:', err))
        .finally(() => { gameSound = null; })
    );
  }
  
  await Promise.all(promises);
  // Wait for audio system to fully release resources
  await new Promise(resolve => setTimeout(resolve, 200));
};

// Play background music (for start screen)
export const playBackgroundMusic = async () => {
  try {
    // Always check current setting before playing
    const enabled = await getAudioEnabled();
    if (!enabled) {
      return;
    }

    // Stop ALL music first (both game and start screen) to ensure only one plays
    await stopAllMusic();

    // Create and load sound
    const { sound } = await Audio.Sound.createAsync(
      START_SCREEN_MUSIC,
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
  }
};

// Stop background music (start screen)
export const stopBackgroundMusic = async () => {
  try {
    if (startScreenSound) {
      await startScreenSound.stopAsync();
      await startScreenSound.unloadAsync();
      startScreenSound = null;
      console.log('Start screen music stopped');
    }
  } catch (error) {
    console.error('Error stopping background music:', error);
    startScreenSound = null;
  }
};

// Play game music
export const playGameMusic = async () => {
  try {
    // Always check current setting before playing
    const enabled = await getAudioEnabled();
    if (!enabled) {
      return;
    }

    // Stop ALL music first (both start screen and game)
    await stopAllMusic();

    // Create and load sound
    const { sound } = await Audio.Sound.createAsync(
      GAME_MUSIC,
      {
        isLooping: true,
        volume: 0.4, // Set to 40% volume for game ambient effect
        shouldPlay: true,
      }
    );

    gameSound = sound;
    console.log('Game music started');
  } catch (error) {
    console.error('Error playing game music:', error);
  }
};

// Stop game music
export const stopGameMusic = async () => {
  try {
    if (gameSound) {
      await gameSound.stopAsync();
      await gameSound.unloadAsync();
      gameSound = null;
      console.log('Game music stopped');
    }
  } catch (error) {
    console.error('Error stopping game music:', error);
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
  await stopBackgroundMusic();
  await stopGameMusic();
};

