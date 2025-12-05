import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import userProfile from '../utils/userProfile';
import * as Haptics from 'expo-haptics';

// Avatar options (using emoji or you can use image assets)
const AVATAR_OPTIONS = [
  { id: '1', emoji: '👤', label: 'Default' },
  { id: '2', emoji: '🧑', label: 'Person' },
  { id: '3', emoji: '👨', label: 'Man' },
  { id: '4', emoji: '👩', label: 'Woman' },
  { id: '5', emoji: '🧑‍🦱', label: 'Curly Hair' },
  { id: '6', emoji: '🧑‍🦰', label: 'Red Hair' },
];

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const OnboardingScreen = ({ navigation, route }) => {
  const editMode = route?.params?.editMode || false;
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(editMode);

  // Load existing profile if in edit mode
  React.useEffect(() => {
    if (editMode) {
      loadExistingProfile();
    }
  }, [editMode]);

  const loadExistingProfile = async () => {
    try {
      const profile = await userProfile.getProfile();
      if (profile) {
        setName(profile.name || '');
        setAge(profile.age?.toString() || '');
        setGender(profile.gender || '');
        setSelectedAvatar(profile.avatar || AVATAR_OPTIONS[0].id);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStep === 1) {
      if (name.trim().length >= 2) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const ageNum = parseInt(age);
      if (ageNum >= 13 && ageNum <= 120) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      if (gender) {
        setCurrentStep(4);
      }
    }
  };

  const handleFinish = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const profile = {
      name: name.trim(),
      age: parseInt(age),
      gender: gender,
      avatar: selectedAvatar,
    };

    await userProfile.saveProfile(profile);
    
    if (!editMode) {
      await userProfile.setOnboardingComplete();
      // Navigate to Start screen
      navigation.replace('Start');
    } else {
      // In edit mode, just go back to settings
      navigation.goBack();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return name.trim().length >= 2;
    if (currentStep === 2) {
      const ageNum = parseInt(age);
      return ageNum >= 13 && ageNum <= 120;
    }
    if (currentStep === 3) return gender !== '';
    return true;
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your name?</Text>
      <Text style={styles.stepDescription}>
        We'll use this to personalize your therapy sessions.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor={COLORS.text.muted}
        value={name}
        onChangeText={setName}
        autoFocus
        maxLength={50}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How old are you?</Text>
      <Text style={styles.stepDescription}>
        This helps us tailor the conversation to your needs.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        placeholderTextColor={COLORS.text.muted}
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
        maxLength={3}
        autoFocus
      />
      {age && (parseInt(age) < 13 || parseInt(age) > 120) && (
        <Text style={styles.errorText}>Please enter a valid age (13-120)</Text>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your gender?</Text>
      <Text style={styles.stepDescription}>
        This helps us personalize your experience.
      </Text>
      <View style={styles.optionsContainer}>
        {GENDER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              gender === option.id && styles.optionButtonSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setGender(option.id);
            }}
          >
            <Text
              style={[
                styles.optionText,
                gender === option.id && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose your avatar</Text>
      <Text style={styles.stepDescription}>
        Select an avatar to represent you in the conversation.
      </Text>
      <View style={styles.avatarGrid}>
        {AVATAR_OPTIONS.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            style={[
              styles.avatarOption,
              selectedAvatar === avatar.id && styles.avatarOptionSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedAvatar(avatar.id);
            }}
          >
            <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
            <Text
              style={[
                styles.avatarLabel,
                selectedAvatar === avatar.id && styles.avatarLabelSelected,
              ]}
            >
              {avatar.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <LinearGradient
          colors={[COLORS.backgroundGradient.start, COLORS.backgroundGradient.end]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[COLORS.backgroundGradient.start, COLORS.backgroundGradient.end]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Back button for edit mode */}
      {editMode && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(currentStep / 4) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {editMode ? 'Edit Profile' : `Step ${currentStep} of 4`}
          </Text>
        </View>

        {/* Step content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleBack}
            >
              <Text style={styles.buttonTextSecondary}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              !canProceed() && styles.buttonDisabled,
            ]}
            onPress={currentStep === 4 ? handleFinish : handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.buttonTextPrimary}>
              {currentStep === 4 ? (editMode ? 'Save Changes' : 'Start Therapy') : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  progressContainer: {
    marginBottom: SPACING.xxl,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent.cyan,
    borderRadius: 2,
  },
  progressText: {
    ...FONTS.small,
    color: COLORS.text.muted,
    textAlign: 'center',
    fontSize: 12,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 400,
  },
  stepTitle: {
    ...FONTS.heading,
    fontSize: 28,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  stepDescription: {
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 4,
    color: COLORS.text.primary,
    fontSize: 18,
    ...FONTS.body,
  },
  errorText: {
    ...FONTS.small,
    color: COLORS.accent.red,
    marginTop: SPACING.sm,
    fontSize: 12,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md + 4,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(74, 158, 158, 0.15)',
    borderColor: COLORS.accent.cyan,
  },
  optionText: {
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  optionTextSelected: {
    color: COLORS.accent.cyan,
    fontWeight: '600',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  avatarOption: {
    width: 100,
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.md,
  },
  avatarOptionSelected: {
    backgroundColor: 'rgba(74, 158, 158, 0.15)',
    borderColor: COLORS.accent.cyan,
  },
  avatarEmoji: {
    fontSize: 48,
    marginBottom: SPACING.xs,
  },
  avatarLabel: {
    ...FONTS.small,
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  avatarLabelSelected: {
    color: COLORS.accent.cyan,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md + 4,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.accent.cyan,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextPrimary: {
    ...FONTS.body,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  buttonTextSecondary: {
    ...FONTS.body,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.body,
    color: COLORS.text.secondary,
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: SPACING.lg + 8,
    left: SPACING.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonText: {
    ...FONTS.heading,
    color: COLORS.accent.cyan,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 28,
  },
});

export default OnboardingScreen;

