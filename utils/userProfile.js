import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = 'therapistai_user_profile';
const ONBOARDING_COMPLETE_KEY = 'therapistai_onboarding_complete';

/**
 * User Profile Manager
 * Handles storing and retrieving user profile data
 */
class UserProfileManager {
  /**
   * Get user profile
   */
  async getProfile() {
    try {
      const profileJson = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (profileJson) {
        return JSON.parse(profileJson);
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Save user profile
   */
  async saveProfile(profile) {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  /**
   * Check if onboarding is complete
   */
  async isOnboardingComplete() {
    try {
      const complete = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
      return complete === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Mark onboarding as complete
   */
  async setOnboardingComplete() {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      return true;
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
      return false;
    }
  }

  /**
   * Replace placeholders in text with user profile data
   */
  replacePlaceholders(text, profile) {
    if (!text || !profile) return text;
    
    let replaced = text;
    
    // Replace [Your Name] with user's name
    if (profile.name) {
      replaced = replaced.replace(/\[Your Name\]/g, profile.name);
      replaced = replaced.replace(/\[your name\]/g, profile.name);
    }
    
    // Replace [Your Age] with user's age
    if (profile.age) {
      replaced = replaced.replace(/\[Your Age\]/g, profile.age.toString());
      replaced = replaced.replace(/\[your age\]/g, profile.age.toString());
    }
    
    // Replace [Your Gender] with user's gender
    if (profile.gender) {
      replaced = replaced.replace(/\[Your Gender\]/g, profile.gender);
      replaced = replaced.replace(/\[your gender\]/g, profile.gender);
    }
    
    return replaced;
  }

  /**
   * Clear user profile (for testing/reset)
   */
  async clearProfile() {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing user profile:', error);
      return false;
    }
  }
}

export default new UserProfileManager();

