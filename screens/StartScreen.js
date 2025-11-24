import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import storyEngine from '../utils/storyEngine';
import { initializeAudio, playBackgroundMusic, stopBackgroundMusic, getAudioEnabled } from '../utils/audioManager';
import SettingsButton from '../components/SettingsButton';

const { width, height } = Dimensions.get('window');

const StartScreen = ({ navigation }) => {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  
  // Animation refs
  const iconFadeAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonsSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonsOpacityAnim = useRef(new Animated.Value(0)).current;
  const iconGlowAnim = useRef(new Animated.Value(0.3)).current;
  const primaryButtonScale = useRef(new Animated.Value(1)).current;
  const secondaryButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initialize audio and start background music
    const setupAudio = async () => {
      await initializeAudio();
      await playBackgroundMusic();
    };
    setupAudio();

    // Staggered fade-in animations
    Animated.sequence([
      // Icon fades in first
      Animated.timing(iconFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Title fades in
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Buttons slide up and fade in
      Animated.parallel([
        Animated.timing(buttonsSlideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsOpacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Subtle pulsing glow on icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconGlowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(iconGlowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cleanup on unmount
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  // Check for saved game when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkForSavedGame();
      // Only resume music if we're returning from another screen (not on initial mount)
      // The useEffect already handles initial music start, so we check if music is playing
      const resumeMusic = async () => {
        // Check if music is already playing before trying to start it
        const enabled = await getAudioEnabled();
        if (enabled) {
          // playBackgroundMusic will check if already playing, so it's safe to call
          await playBackgroundMusic();
        }
      };
      // Small delay to avoid race condition with useEffect
      const timer = setTimeout(resumeMusic, 100);
      return () => clearTimeout(timer);
    }, [])
  );

  const checkForSavedGame = async () => {
    try {
      const hasSaved = await storyEngine.hasSavedGameState();
      setHasSavedGame(hasSaved);
    } catch (error) {
      console.error('Error checking for saved game:', error);
      setHasSavedGame(false);
    }
  };

  const handleStartNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: true });
  };

  const handleContinue = () => {
    if (!hasSavedGame) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: false });
  };

  const handlePressIn = (button) => {
    const scaleAnim = button === 'primary' ? primaryButtonScale : secondaryButtonScale;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = (button) => {
    const scaleAnim = button === 'primary' ? primaryButtonScale : secondaryButtonScale;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Subtle vignette overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(5, 5, 8, 0.4)', 'rgba(5, 5, 8, 0.8)']}
        locations={[0, 0.5, 1]}
        style={styles.vignette}
        pointerEvents="none"
      />

      <View style={styles.content}>
        {/* Icon and Title Section */}
        <View style={styles.brandSection}>
          <Animated.View
            style={[
              styles.characterContainer,
              {
                opacity: iconFadeAnim,
                transform: [{ scale: iconFadeAnim }],
              },
            ]}
          >
            <Image
              source={require('../assets/character-removebg.png')}
              style={styles.character}
              resizeMode="contain"
            />
            {/* Subtle glow effect on character */}
            <Animated.View
              style={[
                styles.characterGlow,
                {
                  opacity: iconGlowAnim,
                },
              ]}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.titleContainer,
              { opacity: titleFadeAnim },
            ]}
          >
            <Text style={styles.title}>Therapy AI</Text>
            <Text style={styles.tagline}>
              Your final session begins now.
            </Text>
          </Animated.View>
        </View>

        {/* Buttons Section */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonsOpacityAnim,
              transform: [{ translateY: buttonsSlideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              { transform: [{ scale: primaryButtonScale }] },
            ]}
          >
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleStartNew}
              onPressIn={() => handlePressIn('primary')}
              onPressOut={() => handlePressOut('primary')}
              activeOpacity={1}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Start New Session
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              { transform: [{ scale: secondaryButtonScale }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                !hasSavedGame && styles.secondaryButtonDisabled,
              ]}
              onPress={handleContinue}
              onPressIn={() => handlePressIn('secondary')}
              onPressOut={() => handlePressOut('secondary')}
              activeOpacity={1}
              disabled={!hasSavedGame}
            >
              <Text
                style={[
                  styles.buttonText,
                  styles.secondaryButtonText,
                  !hasSavedGame && styles.secondaryButtonTextDisabled,
                ]}
              >
                Continue Session
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          The AI retains previous conversations.
        </Text>

        {/* Settings Button */}
        <SettingsButton style={styles.settingsButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundStart,
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl * 1.5,
    zIndex: 1,
  },
  characterContainer: {
    width: 200,
    height: 200,
    marginBottom: SPACING.lg,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    width: 200,
    height: 200,
    opacity: 0.95,
  },
  characterGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.accent.teal,
    // Blur effect simulation with shadow
    shadowColor: COLORS.accent.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    ...FONTS.titleScreen.title,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  tagline: {
    ...FONTS.titleScreen.tagline,
    color: COLORS.text.tagline,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: COLORS.accent.red,
    shadowColor: COLORS.accent.redGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    ...FONTS.bodyBold,
    color: COLORS.text.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: `${COLORS.accent.red}80`, // 50% opacity
  },
  secondaryButtonDisabled: {
    borderColor: `${COLORS.text.muted}40`, // Lower opacity when disabled
    opacity: 0.5,
  },
  secondaryButtonText: {
    ...FONTS.bodyBold,
    color: COLORS.text.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 15,
    opacity: 0.8,
  },
  secondaryButtonTextDisabled: {
    opacity: 0.4,
  },
  disclaimer: {
    ...FONTS.titleScreen.disclaimer,
    color: COLORS.text.disclaimer,
    textAlign: 'center',
    position: 'absolute',
    bottom: SPACING.xl + 50,
    left: SPACING.xl,
    right: SPACING.xl,
  },
  settingsButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    zIndex: 10,
  },
});

export default StartScreen;
