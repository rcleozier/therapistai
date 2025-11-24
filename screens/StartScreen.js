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
// Consolidated design values for consistency and easy maintenance.
const START_THEME = {
  // Colors
  background: '#050608',
  headerGradientStart: '#0A1114',
  headerGradientEnd: '#050608',
  accent: '#F45C4E', // Desaturated red–orange for clinical-but-unsettling CTA
  accentBorderSoft: 'rgba(244, 92, 78, 0.4)',
  primaryText: '#F5F3EE',
  secondaryText: 'rgba(154, 158, 164, 0.6)',
  footerText: 'rgba(245, 243, 238, 0.54)', // Increased from 0.42 for better readability
  focalTeal: '#0D1A1C', // Deep slate/teal for background focal point
  
  // Opacities
  dataLineOpacity: 0.52, // 45-55% range for microcopy readability
  dividerOpacity: 0.14, // 12-16% for intentional divider line
  focalGradientOpacity: 0.65, // Slightly strengthened for presence
  
  // Spacing
  headerBlockOffset: 14, // 12-16px shift down for better balance
  taglineTighten: 5, // 4-6px closer to line above
  buttonPaddingHorizontal: SPACING.xl + SPACING.md, // Increased for premium feel
  
  // Typography
  logoTitleLetterSpacing: 1.0, // Increased for more clinical feel
  footerLineHeight: 14, // Tightened for stronger legibility
};

const StartScreen = ({ navigation }) => {
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Subtle screen fade-in to keep the entrance calm and premium.
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const primaryButtonScale = useRef(new Animated.Value(1)).current;
  const secondaryButtonScale = useRef(new Animated.Value(1)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;

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

    // Very subtle breathing animation on the logo block to keep the screen alive.
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.02,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      stopBackgroundMusic();
    };
  }, [screenOpacity, logoPulse]);

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

        <LogoHeader logoPulse={logoPulse} />

        {/* Flexible spacer keeps the CTA block anchored in the lower half on tall and short devices */}
        <View style={styles.flexSpacer} />

        {/* Divider to visually tie the content block to the CTAs */}
        <View style={styles.buttonDivider} />

        {/* Primary & secondary actions – vertically stacked, with generous margins */}
        <View style={styles.buttonStack}>
          <PrimaryButton
            label="Start New Session"
            onPress={handleStartNew}
            onPressIn={() => handlePressIn('primary')}
            onPressOut={() => handlePressOut('primary')}
            scale={primaryButtonScale}
          />

          <View style={styles.buttonSpacer} />

          <SecondaryButton
            label="Continue Session"
            disabled={!hasSavedGame}
            onPress={handleContinue}
            onPressIn={() => handlePressIn('secondary')}
            onPressOut={() => handlePressOut('secondary')}
            scale={secondaryButtonScale}
          />
        </View>

        <FooterLegal />
      </Animated.View>
    </SafeAreaView>
  );
};

const LogoHeader = ({ logoPulse }) => {
  return (
    <View style={styles.logoHeaderWrapper}>
      {/* Soft focal glow behind the logo block to anchor the composition */}
      <View style={styles.logoFocal}>
        <LinearGradient
          colors={[START_THEME.focalTeal, 'transparent']}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.logoFocalGradient}
        />
      </View>

      <Animated.View style={[styles.logoRow, { transform: [{ scale: logoPulse }] }]}>
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
          <Text style={styles.dataLine}>Monitoring baseline response time…</Text>
        </View>
      </Animated.View>

      {/* Tagline: sounds like a real mental health product, but hints at data persistence */}
      <Text style={styles.taglineText}>Personalized therapy. Persistent data.</Text>
    </View>
  );
};

const PrimaryButton = ({ label, onPress, onPressIn, onPressOut, scale }) => (
  <Animated.View style={{ transform: [{ scale }] }}>
    <TouchableOpacity
      style={styles.primaryButton}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.9}
    >
      <Text style={styles.primaryButtonLabel}>{label}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const SecondaryButton = ({ label, disabled, onPress, onPressIn, onPressOut, scale }) => (
  <Animated.View style={{ transform: [{ scale }] }}>
    <TouchableOpacity
      style={[
        styles.secondaryButton,
        disabled && styles.secondaryButtonDisabled,
      ]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <Text
        style={[
          styles.secondaryButtonLabel,
          disabled && styles.secondaryButtonLabelDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  </Animated.View>
);

const FooterLegal = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Sessions may be stored and reviewed to improve your emotional model.
    </Text>
  </View>
);

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
  logoHeaderWrapper: {
    marginTop: SPACING.sm + START_THEME.headerBlockOffset, // Shifted down 12-16px
    marginBottom: SPACING.lg,
  },
  logoFocal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -SPACING.md + START_THEME.headerBlockOffset,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  logoFocalGradient: {
    width: 260,
    height: 140,
    borderRadius: 130,
    opacity: START_THEME.focalGradientOpacity, // Strengthened for presence
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    position: 'relative',
    overflow: 'visible',
  },
  logoIcon: {
    width: 36,
    height: 36,
    opacity: 0.9,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 26,
    letterSpacing: START_THEME.logoTitleLetterSpacing, // Increased for clinical feel
  },
  logoSubtitle: {
    ...FONTS.titleScreen.tagline,
    color: START_THEME.secondaryText,
    marginTop: 2,
  },
  dataLine: {
    ...FONTS.small,
    color: START_THEME.secondaryText,
    opacity: START_THEME.dataLineOpacity, // Increased to 45-55% for readability
    marginTop: 6,
  },
  taglineText: {
    ...FONTS.titleScreen.tagline,
    color: START_THEME.secondaryText,
    marginTop: SPACING.md - START_THEME.taglineTighten, // 4-6px closer to line above
  },
  flexSpacer: {
    flex: 1,
    maxHeight: SPACING.xxl, // Prevents the mid-screen from feeling too empty on tall devices
  },
  buttonStack: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: SPACING.lg,
  },
  buttonDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: `rgba(255, 255, 255, ${START_THEME.dividerOpacity})`, // 12-16% for intentional divider
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  primaryButton: {
    backgroundColor: START_THEME.accent,
    borderRadius: BORDER_RADIUS.lg,
    minHeight: 56, // 54–58pt range
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: START_THEME.buttonPaddingHorizontal, // Increased for premium feel
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
    paddingHorizontal: START_THEME.buttonPaddingHorizontal, // Matched with primary for consistency
    borderWidth: 1,
    borderColor: START_THEME.accentBorderSoft,
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
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...FONTS.titleScreen.disclaimer,
    color: START_THEME.footerText, // Increased opacity by 10-12% (0.42 → 0.54)
    textAlign: 'center',
    letterSpacing: 0.4,
    lineHeight: START_THEME.footerLineHeight, // Tightened for stronger legibility
  },
});

export default StartScreen;
