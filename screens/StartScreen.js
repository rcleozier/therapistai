import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/colors';
import storyEngine from '../utils/storyEngine';
import { initializeAudio, playBackgroundMusic, stopBackgroundMusic, getAudioEnabled } from '../utils/audioManager';
import SettingsButton from '../components/SettingsButton';

// Local theme tokens specific to the start screen.
// We keep them close to the design spec without impacting the rest of the app.
const START_THEME = {
  background: '#050608',
  headerGradientStart: '#0A1114',
  headerGradientEnd: '#050608',
  accent: '#F45C4E', // Desaturated red–orange for clinical-but-unsettling CTA
  accentBorder40: 'rgba(244, 92, 78, 0.4)',
  primaryText: '#F5F3EE',
  secondaryText: 'rgba(154, 158, 164, 0.6)',
  footerText: 'rgba(245, 243, 238, 0.45)',
};

const StartScreen = ({ navigation }) => {
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Subtle screen fade-in to keep the entrance calm and premium.
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const primaryButtonScale = useRef(new Animated.Value(1)).current;
  const secondaryButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const setupAudio = async () => {
      await initializeAudio();
      await playBackgroundMusic();
    };
    setupAudio();

    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    return () => {
      stopBackgroundMusic();
    };
  }, [screenOpacity]);

  // Check for saved game and gently resume music when returning to this screen.
  useFocusEffect(
    React.useCallback(() => {
      const checkForSavedGame = async () => {
        try {
          const hasSaved = await storyEngine.hasSavedGameState();
          setHasSavedGame(hasSaved);
        } catch (error) {
          console.error('Error checking for saved game:', error);
          setHasSavedGame(false);
        }
      };

      const resumeMusic = async () => {
        const enabled = await getAudioEnabled();
        if (enabled) {
          await playBackgroundMusic();
        }
      };

      checkForSavedGame();
      const timer = setTimeout(resumeMusic, 120);
      return () => clearTimeout(timer);
    }, [])
  );

  const handleStartNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: true });
  };

  const handleContinue = () => {
    if (!hasSavedGame) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Game', { startNew: false });
  };

  const handlePressIn = (target) => {
    const scaleAnim = target === 'primary' ? primaryButtonScale : secondaryButtonScale;
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 280,
      friction: 12,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = (target) => {
    const scaleAnim = target === 'primary' ? primaryButtonScale : secondaryButtonScale;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 280,
      friction: 12,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Clinical, near-black background with a soft header gradient to feel premium and subdued */}
      <LinearGradient
        colors={[START_THEME.headerGradientStart, START_THEME.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={styles.headerGradient}
        pointerEvents="none"
      />

      <Animated.View style={[styles.content, { opacity: screenOpacity }]}>
        {/* Top header: subtle, with a single settings gear as the only chrome */}
        <View style={styles.topRow}>
          <View style={styles.topRowSpacer} />
          <SettingsButton style={styles.settingsButton} />
        </View>

        {/* Logo row: small, official-looking identity instead of a giant mascot */}
        <View style={styles.logoRow}>
          <View style={styles.logoIconWrapper}>
            <Image
              source={require('../assets/character-removebg.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            {/* Minimal clinical glow behind the robot – 10–15% opacity so it feels digital, not playful */}
            <View style={styles.logoGlow} />
          </View>
          <View style={styles.logoTextWrapper}>
            <Text style={styles.logoTitle}>Therapy AI</Text>
            <Text style={styles.logoSubtitle}>Clinical conversational support</Text>
          </View>
        </View>

        {/* Tagline: sounds like a real mental health product, but hints at data persistence */}
        <Text style={styles.taglineText}>Personalized therapy. Persistent data.</Text>

        {/* Flexible spacer keeps the CTA block anchored in the lower half on tall and short devices */}
        <View style={styles.flexSpacer} />

        {/* Primary & secondary actions – vertically stacked, with generous margins */}
        <View style={styles.buttonStack}>
          <Animated.View style={{ transform: [{ scale: primaryButtonScale }] }}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartNew}
              onPressIn={() => handlePressIn('primary')}
              onPressOut={() => handlePressOut('primary')}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonLabel}>Start New Session</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.buttonSpacer} />

          <Animated.View style={{ transform: [{ scale: secondaryButtonScale }] }}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                !hasSavedGame && styles.secondaryButtonDisabled,
              ]}
              onPress={handleContinue}
              onPressIn={() => handlePressIn('secondary')}
              onPressOut={() => handlePressOut('secondary')}
              activeOpacity={0.9}
              disabled={!hasSavedGame}
            >
              <Text
                style={[
                  styles.secondaryButtonLabel,
                  !hasSavedGame && styles.secondaryButtonLabelDisabled,
                ]}
              >
                Continue Session
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer consent text feels like a normal terms line, but the content is quietly alarming */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sessions may be stored and reviewed to improve your emotional model.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: START_THEME.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  topRowSpacer: {
    width: 32, // balances the settings icon on the right so the logo feels centered
  },
  settingsButton: {
    opacity: 0.6, // slightly muted to feel like secondary chrome
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    position: 'relative',
    overflow: 'visible',
  },
  logoIcon: {
    width: 32,
    height: 32,
    opacity: 0.9,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent.cyan,
    opacity: 0.15, // 10–15% opacity glow: barely there, more clinical than playful
    zIndex: 1,
  },
  logoTextWrapper: {
    flex: 1,
  },
  logoTitle: {
    ...FONTS.titleScreen.title,
    color: START_THEME.primaryText,
    fontSize: 24,
    letterSpacing: 0.7,
  },
  logoSubtitle: {
    ...FONTS.titleScreen.tagline,
    color: START_THEME.secondaryText,
    marginTop: 4,
  },
  taglineText: {
    ...FONTS.titleScreen.tagline,
    color: START_THEME.secondaryText,
    marginTop: SPACING.sm,
  },
  flexSpacer: {
    flex: 1,
  },
  buttonStack: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  primaryButton: {
    backgroundColor: START_THEME.accent,
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 56, // 54–58pt range
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    shadowColor: START_THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonLabel: {
    ...FONTS.bodyBold,
    color: '#FEF7F4',
    fontSize: 16,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  buttonSpacer: {
    height: 28, // 24–32pt vertical spacing between primary and secondary
  },
  secondaryButton: {
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.xl,
    borderWidth: 1,
    borderColor: START_THEME.accentBorder40,
    backgroundColor: 'transparent',
  },
  secondaryButtonDisabled: {
    borderColor: 'rgba(154, 158, 164, 0.3)',
    opacity: 0.5,
  },
  secondaryButtonLabel: {
    ...FONTS.bodyBold,
    color: START_THEME.primaryText,
    opacity: 0.8,
    fontSize: 15,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  secondaryButtonLabelDisabled: {
    opacity: 0.5,
  },
  footer: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...FONTS.titleScreen.disclaimer,
    color: START_THEME.footerText,
    textAlign: 'center',
  },
});

export default StartScreen;
