import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUDIO_ENABLED_KEY = 'audio_enabled';
const BACKGROUND_MUSIC = require('../assets/music/scary-horror-creepy-music-359998.mp3');

let soundObject = null;
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

// Get audio enabled state
export const getAudioEnabled = async () => {
  if (!isInitialized) {
    await initializeAudio();
  }
  return isAudioEnabled;
};

// Set audio enabled state
export const setAudioEnabled = async (enabled) => {
  try {
    isAudioEnabled = enabled;
    await AsyncStorage.setItem(AUDIO_ENABLED_KEY, JSON.stringify(enabled));

    // If disabling, stop current playback
    if (!enabled && soundObject) {
      await stopBackgroundMusic();
    }

    return true;
  } catch (error) {
    console.error('Error setting audio preference:', error);
    return false;
  }
};

// Play background music
export const playBackgroundMusic = async () => {
  try {
    // Check if audio is enabled
    if (!isAudioEnabled) {
      return;
    }

    // If already playing, don't restart
    if (soundObject) {
      const status = await soundObject.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        return;
      }
    }

    // Create and load sound
    const { sound } = await Audio.Sound.createAsync(
      BACKGROUND_MUSIC,
      {
        isLooping: true,
        volume: 0.5, // Set to 50% volume for ambient effect
        shouldPlay: true,
      }
    );

    soundObject = sound;
    console.log('Background music started');
  } catch (error) {
    console.error('Error playing background music:', error);
  }
};

// Stop background music
export const stopBackgroundMusic = async () => {
  try {
    if (soundObject) {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
      soundObject = null;
      console.log('Background music stopped');
    }
  } catch (error) {
    console.error('Error stopping background music:', error);
  }
};

// Pause background music
export const pauseBackgroundMusic = async () => {
  try {
    if (soundObject) {
      await soundObject.pauseAsync();
      console.log('Background music paused');
    }
  } catch (error) {
    console.error('Error pausing background music:', error);
  }
};

// Resume background music
export const resumeBackgroundMusic = async () => {
  try {
    if (soundObject && isAudioEnabled) {
      await soundObject.playAsync();
      console.log('Background music resumed');
    }
  } catch (error) {
    console.error('Error resuming background music:', error);
  }
};

// Cleanup on app close
export const cleanupAudio = async () => {
  await stopBackgroundMusic();
};

